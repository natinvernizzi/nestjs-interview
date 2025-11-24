import { Test, TestingModule } from '@nestjs/testing';
import { TodoItemsController } from './todo_items.controller';
import { TodoItemsService } from './todo_items.service';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoItem } from './todo_item.entity';

describe('TodoItemsController', () => {
  let app: INestApplication;
  let todoItemsController: TodoItemsController;
  let todoItemRepositoryMock: jest.Mocked<Record<string, jest.Mock>>;

  beforeEach(async () => {
    todoItemRepositoryMock = {
      findBy: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoItemsController],
      providers: [
        TodoItemsService,
        {
          provide: getRepositoryToken(TodoItem),
          useValue: todoItemRepositoryMock,
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
  });

  describe('delete', () => {
    it('should delete a todo item', async () => {
      todoItemRepositoryMock.delete.mockResolvedValue({ affected: 1 });
      await todoItemsController.delete({ id: 1 });
      expect(todoItemRepositoryMock.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('toggleComplete', () => {
    it('should toggle completed status from false to true', async () => {
      const mockTodoItem = { id: 1, name: 'Buy milk', completed: false };
      const toggledTodoItem = { id: 1, name: 'Buy milk', completed: true };

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
      const mockTodoItem = { id: 1, name: 'Buy milk', completed: true };
      const toggledTodoItem = { id: 1, name: 'Buy milk', completed: false };

      todoItemRepositoryMock.findOneBy.mockResolvedValue(mockTodoItem);
      todoItemRepositoryMock.save.mockResolvedValue(toggledTodoItem);

      const result = await todoItemsController.toggleComplete({
        id: 1,
        todoListId: 1,
      });

      expect(result).toEqual(toggledTodoItem);
      expect(result?.completed).toBe(false);
    });

    it('should return null if item does not exist', async () => {
      todoItemRepositoryMock.findOneBy.mockResolvedValue(null);

      const result = await todoItemsController.toggleComplete({
        id: 999,
        todoListId: 1,
      });

      expect(result).toBeNull();
    });
  });
});
