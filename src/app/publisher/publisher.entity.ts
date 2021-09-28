import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from '@root/app/common/base';
import { IPublisher } from '@root/models/publisher/publisher.model';
import { Game } from '../game/game.entity';

@Entity('publishers')
export class Publisher extends Base implements IPublisher {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  siret: string;

  @Column({ nullable: true })
  phone: string;

  @OneToMany(() => Game, (game) => game.publisher, { cascade: true })
  games: Game[];
}
