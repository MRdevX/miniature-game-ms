import { get, set, isArray, each, isString, isObject, filter, isNil, map, merge } from 'lodash';
import {
  Brackets,
  DeepPartial,
  DeleteResult,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository,
  SaveOptions,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ICrudService } from './crud.service.model';
import { BaseEntitySearchDto } from '@root/app/common/base/base-search.dto';
import { ErrorMessage } from '@root/app/common/enum/error-message.enum';
import { QueryNarrowingOperators } from '@root/app/common/enum/query-operators.enum';
import { IFilterField } from '@root/app/common/interface/filter-field.interface';
import { IRelation } from '@root/app/common/interface/relation.interface';
import { SearchConfig, VirtualRelationConfig } from '@root/app/common/interface/search.config.interface';

export abstract class CrudService<T> implements ICrudService<T> {
  private readonly entityName = this.repository.metadata.targetName;

  protected constructor(protected readonly repository: Repository<T>) {}

  public async search(options: BaseEntitySearchDto<T>, config: SearchConfig = {}) {
    const searchConfig: SearchConfig = merge(CrudService.defaultSearchConfig, config);
    const { limit, offset } = options;
    const alias = this.repository.metadata.targetName;
    let qb = this.repository.createQueryBuilder(alias);

    if (options.relations.length) {
      for (const relation of options.relations) {
        this.joinRelation(qb, alias, relation);
      }
    }

    if (searchConfig.virtualRelations.length) {
      for (const relation of searchConfig.virtualRelations) {
        this.joinVirtual(qb, alias, relation);
      }
    }

    for (const filter of options.filterFields) {
      const column = filter.relationTarget
        ? filter.relationTarget
        : alias.concat('.', (filter.target as string) || (filter.name as string));
      if (!isNil(options[filter.name])) {
        qb = qb.andWhere(`${column} ${this.getComparison(filter, options[filter.name])}`, {
          [filter.name]: options[filter.name],
        });
      }
    }

    if (options.searchInput && options.searchFields && options.searchFields.length) {
      const query = searchConfig.fullTextSearch ? options.fullTextSearchInput : options.searchInput;
      const operator = searchConfig.caseInsensitiveSearch ? 'ILIKE' : 'LIKE';

      const brackets = new Brackets((qb) => {
        for (const field of options.searchFields) {
          qb.orWhere(`${alias}.${field} ${operator} :query`, { query });
        }
      });
      qb = qb.andWhere(brackets);
    }

    if (searchConfig.andWhere) {
      qb = qb.andWhere(searchConfig.andWhere.condition, searchConfig.andWhere.parameters);
    }

    if (options.selectFields.length) {
      qb = qb.select(options.selectFields.map((col) => `${alias}.${col}`));
    }

    if (options.sortFields?.length) {
      for (let i = 0; i < options.sortFields.length; i++) {
        const column = options.sortFields[i];
        const path = this.repository.metadata.propertiesMap[column] ? `${alias}.${column}` : column;
        const direction = (options.sortDirections && CrudService.getSortVerb(options.sortDirections[i])) || 'ASC';
        qb = qb.addOrderBy(path, direction);
      }
    }

    // take/skip is generally recommended by typeorm, but behaves unexpected when adding virtualRelations
    const limitFn = searchConfig.virtualRelations.length ? 'limit' : 'take';
    const offsetFn = searchConfig.virtualRelations.length ? 'offset' : 'skip';

    const [items = [], total = 0] = await qb[limitFn](limit)[offsetFn](offset).getManyAndCount();
    return { items, total };
  }

  public archiveSearch(options: BaseEntitySearchDto<T>, config: SearchConfig = {}) {
    const alias = this.repository.metadata.targetName;

    if (!this.repository.metadata.deleteDateColumn) {
      throw new InternalServerErrorException(`Entity ${alias} is not soft-deletable.`);
    }

    const searchConfig: SearchConfig = merge(config, {
      withDeleted: true,
      andWhere: { condition: `${alias}.deleted_date IS NOT NULL` },
    });
    return this.search(options, searchConfig);
  }

  public count(filter?: FindManyOptions<T>): Promise<number> {
    return this.repository.count(filter);
  }

  public async findAll(filter?: FindManyOptions<T>): Promise<T[]> {
    const list: T[] = await this.repository.find(filter);
    if (!list) {
      return list;
    }
    const relations = this.getFindOptionsRelations('', filter);
    if (!isArray(relations)) {
      return list;
    }
    return map(list, (entity: T) => {
      return this.filterDeletedRecords(entity, relations);
    });
  }

  public async findOne(
    id: string | number | FindOneOptions<T> | FindConditions<T>,
    options?: FindOneOptions<T>,
  ): Promise<T> {
    const entity = await this.repository.findOne(id as any, options);
    if (!entity) {
      return entity;
    }
    const relations = this.getFindOptionsRelations(id, options);
    if (!isArray(relations)) {
      return entity;
    }
    return this.filterDeletedRecords(entity, relations);
  }

  public async findById(id: string | number, options?: FindOneOptions<T>): Promise<T> {
    if (id) {
      const entity: T = await this.findOne(id, options);
      if (entity) {
        return entity;
      }
    }
    throw new NotFoundException(ErrorMessage.Common.EntityNotFound(this.entityName));
  }

  public async create(entity: DeepPartial<T>, options?: SaveOptions): Promise<T> {
    try {
      const obj: any = this.repository.create(entity);
      return await this.repository.save(obj, options);
    } catch (e) {
      // UniqueViolation
      if (e.code === '23505') {
        throw new ConflictException(ErrorMessage.Common.EntityAlreadyExists(this.entityName));
      }
      throw e;
    }
  }

  /**
   * Note: This does not update Many to Many relations.
   * For updating Many To Many relations use save.
   */
  public async update(id: string | number | FindConditions<T>, partialEntity: QueryDeepPartialEntity<T>) {
    const result = await this.repository.update(id, partialEntity);
    if (!result.affected) {
      throw new NotFoundException(ErrorMessage.Common.EntityNotFound(this.entityName));
    }
    return result;
  }

  public save(entity: DeepPartial<T>): Promise<T> {
    return this.repository.save(entity);
  }

  public delete(criteria: string | number | FindConditions<T>): Promise<DeleteResult> {
    if (!criteria) {
      throw new BadRequestException(ErrorMessage.Common.NoDeleteCriteria);
    }
    if (this.repository?.metadata?.deleteDateColumn) {
      return this.repository.softDelete(criteria);
    }
    return this.repository.delete(criteria);
  }

  public async remove(records: T[] | DeepPartial<T>[]): Promise<DeleteResult> {
    let result: T[];
    if (this.repository?.metadata?.deleteDateColumn) {
      result = await this.repository.softRemove(records as DeepPartial<T>[]);
    } else {
      result = await this.repository.remove(records as T[]);
    }
    return {
      raw: [],
      affected: result.length,
    };
  }

  private joinRelation(qb: SelectQueryBuilder<T>, parentEntity: string, relation: string | IRelation<T>) {
    const config: IRelation<T> = typeof relation === 'string' ? { name: relation, innerJoin: false } : relation;
    const propertyPath = config.name.includes('.') ? config.name : `${parentEntity}.${config.name}`;
    const relationAlias = config.name.includes('.') ? config.name.split('.').pop() : config.name;
    if (config.innerJoin) {
      qb = qb.innerJoinAndSelect(propertyPath, relationAlias);
    } else {
      qb = qb.leftJoinAndSelect(propertyPath, relationAlias);
    }
    return qb;
  }

  private joinVirtual(qb: SelectQueryBuilder<T>, parentEntity: string, relation: VirtualRelationConfig) {
    const { entity, property, alias: relAlias, condition, plural = false, innerJoin = false } = relation;
    if (plural) {
      if (innerJoin) {
        qb = qb.innerJoinAndMapMany(`${parentEntity}.${property || relAlias}`, entity, relAlias, condition);
      } else {
        qb = qb.leftJoinAndMapMany(`${parentEntity}.${property || relAlias}`, entity, relAlias, condition);
      }
    } else {
      if (innerJoin) {
        qb = qb.innerJoinAndMapOne(`${parentEntity}.${property || relAlias}`, entity, relAlias, condition);
      } else {
        qb = qb.leftJoinAndMapOne(`${parentEntity}.${property || relAlias}`, entity, relAlias, condition);
      }
    }
    return qb;
  }

  private getFindOptionsRelations(
    id: string | number | FindOneOptions<T> | FindConditions<T>,
    options?: FindOneOptions<T>,
  ): string[] {
    return get(options || id, 'relations');
  }

  private filterDeletedRecords(entity: T, relations: string[]): T {
    each(relations, (relation: string) => {
      if (isString(relation)) {
        const relationEntity = get(entity, relation);
        if (isArray(relationEntity)) {
          const filtered = filter(relationEntity, (rel) => isNil(rel.deletedDate));
          set(entity, relation, filtered);
        } else if (isObject(relationEntity)) {
          const deletedDate = get(relationEntity, 'deletedDate');
          if (!isNil(deletedDate)) {
            set(entity, relation, null);
          }
        }
      }
    });
    return entity;
  }

  private getComparison(filter: IFilterField<T>, value: any): string {
    const { operation, name } = filter;
    switch (operation) {
      case QueryNarrowingOperators.EQ:
        return `= :${name}`;
      case QueryNarrowingOperators.NE:
        return `!= :${name}`;
      case QueryNarrowingOperators.GT:
        return `> :${name}`;
      case QueryNarrowingOperators.GTE:
        return `>= :${name}`;
      case QueryNarrowingOperators.LT:
        return `< :${name}`;
      case QueryNarrowingOperators.LTE:
        return `<= :${name}`;
      case QueryNarrowingOperators.LIKE:
        return `LIKE concat('%', :${name}::text, '%')`;
      case QueryNarrowingOperators.ILIKE:
        return `ILIKE concat('%', :${name}::text, '%')`;
      case QueryNarrowingOperators.IN:
        return `= ANY(:${name})`;
      case QueryNarrowingOperators.NIN:
        return `<> ALL(:${name})`;
      case QueryNarrowingOperators.CONTAINS:
        return `@> ARRAY[:...${name}]`;
      case QueryNarrowingOperators.ISNULL:
        return Boolean(value) === true ? 'IS NOT NULL' : 'IS NULL';
      default:
        throw new InternalServerErrorException(ErrorMessage.Common.BadSearchOperator(operation, name));
    }
  }

  private static get defaultSearchConfig(): SearchConfig {
    return {
      virtualRelations: [],
      caseInsensitiveSearch: true,
      fullTextSearch: true,
    };
  }

  private static getSortVerb(number: number) {
    if (Number(number) === -1) {
      return 'DESC';
    }
    if (Number(number) === 1) {
      return 'ASC';
    }
  }
}
