import { TodoItem } from 'src/todo_items/todo_item.entity';

export interface TodoList {
  id: number;
  name: string;
  items: TodoItem[];
}
