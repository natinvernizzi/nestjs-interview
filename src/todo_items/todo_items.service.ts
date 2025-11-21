import { Injectable } from '@nestjs/common';
import { CreateTodoItemDto } from './dtos/create-todo_item';
import { UpdateTodoItemDto } from './dtos/update-todo_item';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoItem } from './todo_item.entity';

@Injectable()
export class TodoItemsService {
  constructor(
    @InjectRepository(TodoItem)
    private readonly todoItemsRepository: Repository<TodoItem>,
  ) {}

  async all(todoListId: number): Promise<TodoItem[]> {
    return await this.todoItemsRepository.findBy({
      todoList: { id: todoListId },
    });
  }

  async get(todoListId: number, id: number): Promise<TodoItem | null> {
    return await this.todoItemsRepository.findOneBy({
      id,
      todoList: { id: todoListId },
    });
  }

  async create(dto: CreateTodoItemDto): Promise<TodoItem> {
    // check if todo_list exists
    const todoItem = this.todoItemsRepository.create({
      name: dto.name,
      completed: dto.completed,
      todoList: dto.todoList,
    });
    return await this.todoItemsRepository.save(todoItem);
  }

  async update(id: number, dto: UpdateTodoItemDto): Promise<TodoItem> {
    // check if todo_list exists, if id exists
    return await this.todoItemsRepository.save({ id, ...dto } as TodoItem);
  }

  async delete(id: number): Promise<void> {
    await this.todoItemsRepository.delete(id);
  }

  async toggleComplete(
    todoListId: number,
    id: number,
  ): Promise<TodoItem | null> {
    // TODO: try/catch
    const item = await this.get(todoListId, id);
    if (item) {
      item.completed = !item.completed;
      return await this.todoItemsRepository.save({ ...item } as TodoItem);
    } else {
      return null;
    }
  }
}
