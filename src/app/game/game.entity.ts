import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from '@root/app/common/base';
import { IGame } from '@root/models/game/game.model';
import { Publisher } from '@root/app/publisher/publisher.entity';

@Entity('games')
export class Game extends Base implements IGame {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  price: number;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column({ type: 'timestamptz' })
  releaseDate: Date;

  @ManyToOne(() => Publisher, (publisher: Publisher) => publisher.games, { eager: true })
  publisher: Publisher;
}
