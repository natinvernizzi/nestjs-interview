import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsBoolean,
  IsOptional,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TodoList } from '../../todo_lists/todo_list.entity';

export class CreateTodoItemDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is mandatory' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(100, { message: 'Name must be less than 100 characters' })
  name: string;

  @IsBoolean({ message: 'Completed must be a boolean' })
  @IsOptional()
  completed?: boolean = false;

  @IsObject({ message: 'TodoList must be a valid object' })
  @ValidateNested()
  @Type(() => TodoList)
  todoList: TodoList;
}
