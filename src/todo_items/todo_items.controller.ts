import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTodoItemDto } from './dtos/create-todo_item';
import { UpdateTodoItemDto } from './dtos/update-todo_item';
import { TodoItem } from '../interfaces/todo_item.interface';
import { TodoItemsService } from './todo_items.service';

@Controller('api/todoitems')
export class TodoItemsController {
  constructor(private todoItemsService: TodoItemsService) {}

  @Get()
  index(): Promise<TodoItem[]> {
    return this.todoItemsService.all();
  }

  @Get('/list/:todoListId')
  getByList(@Param() param: { todoListId: number }): Promise<TodoItem[]> {
    return this.todoItemsService.all(param.todoListId);
  }

  @Get('/:id/:todoListId')
  show(@Param() param: { id: number; todoListId: number }): Promise<TodoItem> {
    return this.todoItemsService.get(param.todoListId, param.id);
  }

  @Post()
  create(@Body() dto: CreateTodoItemDto): Promise<TodoItem> {
    return this.todoItemsService.create(dto);
  }

  @Put('/:id')
  update(
    @Param() param: { id: number },
    @Body() dto: UpdateTodoItemDto,
  ): Promise<TodoItem> {
    return this.todoItemsService.update(param.id, dto);
  }

  @Delete('/:id')
  delete(@Param() param: { id: number }): Promise<void> {
    return this.todoItemsService.delete(param.id);
  }

  @Patch('/:id/:todoListId/toggle')
  toggleComplete(
    @Param() param: { id: number; todoListId: number },
  ): Promise<TodoItem> {
    return this.todoItemsService.toggleComplete(param.todoListId, param.id);
  }
}
