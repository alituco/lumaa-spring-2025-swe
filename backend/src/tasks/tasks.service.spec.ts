import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../tasks/tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let repo: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repo = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should call repository.find with the correct userId', async () => {
      (repo.find as jest.Mock).mockResolvedValue([]);
      const result = await service.findAll(1);
      expect(repo.find).toHaveBeenCalledWith({ where: { user: { id: 1 } } });
      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if task not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(
        service.update(123, { title: 'test' }, 1),
      ).rejects.toThrow(NotFoundException);
    });
  });

});
