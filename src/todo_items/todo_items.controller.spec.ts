import { Test, TestingModule } from '@nestjs/testing';
import { TodoItemsController } from './todo_items.controller';
import { TodoItemsService } from './todo_items.service';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoItem } from './todo_item.entity';
import { TodoList } from '../todo_lists/todo_list.entity';

describe('TodoItemsController', () => {
  let app: INestApplication;
  let todoItemsController: TodoItemsController;
  let todoItemRepositoryMock: jest.Mocked<Record<string, jest.Mock>>;
  let todoListRepositoryMock: jest.Mocked<Record<string, jest.Mock>>;

  beforeEach(async () => {
    todoItemRepositoryMock = {
      findBy: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    };

    todoListRepositoryMock = {
      findOneBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoItemsController],
      providers: [
        TodoItemsService,
        {
          provide: getRepositoryToken(TodoItem),
          useValue: todoItemRepositoryMock,
        },
        {
          provide: getRepositoryToken(TodoList),
          useValue: todoListRepositoryMock,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    todoItemsController = module.get<TodoItemsController>(TodoItemsController);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('index', () => {
    it('should return all todo items for a given list', async () => {
      const mockTodoItems = [
        { id: 1, name: 'Buy milk', completed: false },
        { id: 2, name: 'Buy cookies', completed: true },
      ];

      todoItemRepositoryMock.findBy.mockResolvedValue(mockTodoItems);

      const result = await todoItemsController.index({ todoListId: 1 });

      expect(result).toEqual(mockTodoItems);
    });
  });

  describe('show', () => {
    it('should return a single todo item by id', async () => {
      const mockTodoItem = { id: 1, name: 'Buy milk', completed: false };
      todoItemRepositoryMock.findOneBy.mockResolvedValue(mockTodoItem);
      const result = await todoItemsController.show({ id: 1, todoListId: 1 });
      expect(result).toEqual(mockTodoItem);
    });

    it('should throw NotFoundException when item does not exist', async () => {
      todoItemRepositoryMock.findOneBy.mockResolvedValue(null);
      await expect(
        todoItemsController.show({ id: 999, todoListId: 1 }),
      ).rejects.toThrow('TodoItem id 999 not found in list 1');
    });
  });

  describe('create', () => {
    it('should create a new todo item', async () => {
      const createDto = {
        name: 'Buy cookies',
        completed: false,
        todoList: { id: 1, name: 'Shopping List', items: [] },
      };
      const mockCreatedTodoItem = {
        id: 1,
        name: 'Buy cookies',
        completed: false,
      };

      todoItemRepositoryMock.create.mockReturnValue(mockCreatedTodoItem);
      todoItemRepositoryMock.save.mockResolvedValue(mockCreatedTodoItem);

      const result = await todoItemsController.create(createDto);

      expect(result).toEqual(mockCreatedTodoItem);
    });
  });

  describe('update', () => {
    it('should update an existing todo item', async () => {
      const updateDto = { name: 'Buy soy milk', completed: true };
      const existingTodoItem = { id: 1, name: 'Buy milk', completed: false };
      const updatedTodoItem = {
        id: 1,
        name: 'Buy soy milk',
        completed: true,
      };

      todoItemRepositoryMock.findOneBy.mockResolvedValue(existingTodoItem);
      todoItemRepositoryMock.save.mockResolvedValue(updatedTodoItem);

      const result = await todoItemsController.update({ id: 1 }, updateDto);

      expect(result).toEqual(updatedTodoItem);
    });

    it('should throw NotFoundException when item does not exist', async () => {
      const updateDto = { name: 'Updated item' };
      todoItemRepositoryMock.findOneBy.mockResolvedValue(null);

      await expect(
        todoItemsController.update({ id: 999 }, updateDto),
      ).rejects.toThrow('TodoItem with id 999 not found');
    });
  });

  describe('delete', () => {
    it('should delete a todo item', async () => {
      todoItemRepositoryMock.delete.mockResolvedValue({ affected: 1 });
      await todoItemsController.delete({ id: 1 });
      expect(todoItemRepositoryMock.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when item does not exist', async () => {
      todoItemRepositoryMock.delete.mockResolvedValue({ affected: 0 });

      await expect(todoItemsController.delete({ id: 999 })).rejects.toThrow(
        'TodoItem with id 999 not found',
      );
    });
  });

  describe('toggleComplete', () => {
    it('should toggle completed status from false to true', async () => {
      const mockTodoList = { id: 1, name: 'Shopping List' };
      const mockTodoItem = { id: 1, name: 'Buy milk', completed: false };
      const toggledTodoItem = { id: 1, name: 'Buy milk', completed: true };

      todoListRepositoryMock.findOneBy.mockResolvedValue(mockTodoList);
      todoItemRepositoryMock.findOneBy.mockResolvedValue(mockTodoItem);
      todoItemRepositoryMock.save.mockResolvedValue(toggledTodoItem);

      const result = await todoItemsController.toggleComplete({
        id: 1,
        todoListId: 1,
      });

      expect(result).toEqual(toggledTodoItem);
      expect(result?.completed).toBe(true);
    });

    it('should toggle completed status from true to false', async () => {
      const mockTodoList = { id: 1, name: 'Shopping List' };
      const mockTodoItem = { id: 1, name: 'Buy milk', completed: true };
      const toggledTodoItem = { id: 1, name: 'Buy milk', completed: false };

      todoListRepositoryMock.findOneBy.mockResolvedValue(mockTodoList);
      todoItemRepositoryMock.findOneBy.mockResolvedValue(mockTodoItem);
      todoItemRepositoryMock.save.mockResolvedValue(toggledTodoItem);

      const result = await todoItemsController.toggleComplete({
        id: 1,
        todoListId: 1,
      });

      expect(result).toEqual(toggledTodoItem);
      expect(result?.completed).toBe(false);
    });

    it('should throw NotFoundException if list does not exist', async () => {
      todoListRepositoryMock.findOneBy.mockResolvedValue(null);

      await expect(
        todoItemsController.toggleComplete({
          id: 1,
          todoListId: 999,
        }),
      ).rejects.toThrow('TodoList with id 999 not found');
    });

    it('should throw NotFoundException if item does not exist in the list', async () => {
      const mockTodoList = { id: 1, name: 'Shopping List' };

      todoListRepositoryMock.findOneBy.mockResolvedValue(mockTodoList);
      todoItemRepositoryMock.findOneBy.mockResolvedValue(null);

      await expect(
        todoItemsController.toggleComplete({
          id: 999,
          todoListId: 1,
        }),
      ).rejects.toThrow('TodoItem id 999 not found in list 1');
    });
  });
});
