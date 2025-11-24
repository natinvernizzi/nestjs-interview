import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoList } from './todo_list.entity';

@Injectable()
export class TodoListsService {
  constructor(
    @InjectRepository(TodoList)
    private readonly todoListRepository: Repository<TodoList>,
  ) {}

  async all(): Promise<TodoList[]> {
    return await this.todoListRepository.find();
  }

  async get(id: number): Promise<TodoList> {
    const todoList = await this.todoListRepository.findOneBy({ id });

    if (!todoList) {
      throw new NotFoundException(`TodoList with id ${id} not found`);
    }

    return todoList;
  }

  async create(dto: CreateTodoListDto): Promise<TodoList> {
    const todoList = this.todoListRepository.create({ name: dto.name });
    return await this.todoListRepository.save(todoList);
  }

  async update(id: number, dto: UpdateTodoListDto): Promise<TodoList> {
    const existingList = await this.todoListRepository.findOneBy({ id });

    if (!existingList) {
      throw new NotFoundException(`TodoList with id ${id} not found`);
    }

    return await this.todoListRepository.save({ id, ...dto } as TodoList);
  }

  async delete(id: number): Promise<void> {
    const result = await this.todoListRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`TodoList with id ${id} not found`);
    }
  }
}
