import { TodoList } from 'src/todo_lists/todo_list.entity';

export class CreateTodoItemDto {
  name: string;
  completed?: boolean = false;
  todoList: TodoList;
}
