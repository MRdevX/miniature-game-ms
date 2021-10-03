export interface IBaseQueryDto<T> {
  readonly selectFields: (keyof T)[];
}
