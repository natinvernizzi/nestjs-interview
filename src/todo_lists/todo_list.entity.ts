import { TodoItem } from '../todo_items/todo_item.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class TodoList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => TodoItem, (item) => item.todoList)
  items: TodoItem[];
}
