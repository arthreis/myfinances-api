import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from '../../users/entities/User';

import Category from '../../categories/entities/Category';

export enum TransactionType {
  INCOME = 'income',
  OUTCOME = 'outcome',
}

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: 'income' | 'outcome';

  @Column({
    type: 'numeric',
    transformer: {
      from(value: string): number {
        return parseFloat(value);
      },
      to(value: number): number {
        return value;
      },
    },
  })
  value: number;

  @Column({ type: 'varchar' })
  category_id: string;

  @ManyToOne(() => Category, category => category.transactions)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'varchar' })
  user_id: string;

  @ManyToOne(() => User, user => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  transaction_date: Date;

  @Column({ type: 'varchar' })
  description: string;
}

export default Transaction;
