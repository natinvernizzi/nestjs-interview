import { TodoList } from 'src/todo_lists/todo_list.entity';

export interface TodoItem {
  id: number;
  name: string;
  completed: boolean;
  todoList: TodoList;
}
