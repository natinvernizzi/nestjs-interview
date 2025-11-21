import { Module } from '@nestjs/common';
import { TodoItemsController } from './todo_items.controller';
import { TodoItemsService } from './todo_items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoItem } from './todo_item.entity';
import { TodoList } from 'src/todo_lists/todo_list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoItem, TodoList])],
  controllers: [TodoItemsController],
  providers: [TodoItemsService],
  exports: [TodoItemsService],
})
export class TodoListsModule {}
