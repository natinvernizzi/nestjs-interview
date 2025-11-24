import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoListDto } from './create-todo_list';

export class UpdateTodoListDto extends PartialType(CreateTodoListDto) {}
