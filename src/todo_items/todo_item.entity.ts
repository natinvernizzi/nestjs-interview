import { TodoList } from '../todo_lists/todo_list.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class TodoItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  completed: boolean;

  @ManyToOne(() => TodoList, (todoList) => todoList.items)
  todoList: TodoList;
}
