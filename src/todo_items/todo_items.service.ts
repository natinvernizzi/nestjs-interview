import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoItemDto } from './dtos/create-todo_item';
import { UpdateTodoItemDto } from './dtos/update-todo_item';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoItem } from './todo_item.entity';
import { TodoList } from '../todo_lists/todo_list.entity';

@Injectable()
export class TodoItemsService {
  constructor(
    @InjectRepository(TodoItem)
    private readonly todoItemsRepository: Repository<TodoItem>,
    @InjectRepository(TodoList)
    private readonly todoListRepository: Repository<TodoList>,
  ) {}

  async all(todoListId: number): Promise<TodoItem[]> {
    return await this.todoItemsRepository.findBy({
      todoList: { id: todoListId },
    });
  }

  async get(todoListId: number, id: number): Promise<TodoItem> {
    const todoItem = await this.todoItemsRepository.findOneBy({
      id,
      todoList: { id: todoListId },
    });

    if (!todoItem) {
      throw new NotFoundException(
        `TodoItem id ${id} not found in list ${todoListId}`,
      );
    }

    return todoItem;
  }

  async create(dto: CreateTodoItemDto): Promise<TodoItem> {
    try {
      const todoItem = this.todoItemsRepository.create({
        name: dto.name,
        completed: dto.completed,
        todoList: dto.todoList,
      });
      return await this.todoItemsRepository.save(todoItem);
    } catch (error) {
      throw new NotFoundException(
        `TodoList with id ${dto.todoList.id} not found`,
      );
    }
  }

  async update(id: number, dto: UpdateTodoItemDto): Promise<TodoItem> {
    const existingItem = await this.todoItemsRepository.findOneBy({ id });

    if (!existingItem) {
      throw new NotFoundException(`TodoItem with id ${id} not found`);
    }

    return await this.todoItemsRepository.save({ id, ...dto } as TodoItem);
  }

  async delete(id: number): Promise<void> {
    const result = await this.todoItemsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`TodoItem with id ${id} not found`);
    }
  }

  async toggleComplete(todoListId: number, id: number): Promise<TodoItem> {
    // Verify the list exists
    const list = await this.todoListRepository.findOneBy({ id: todoListId });
    if (!list) {
      throw new NotFoundException(`TodoList with id ${todoListId} not found`);
    }

    // Verify that the item exists in that list
    const item = await this.get(todoListId, id);
    if (!item) {
      throw new NotFoundException(
        `TodoItem with id ${id} not found in list ${todoListId}`,
      );
    }

    // toggle the completed state
    item.completed = !item.completed;
    return await this.todoItemsRepository.save({ ...item } as TodoItem);
  }
}
