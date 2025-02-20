import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '..//tasks/tasks.controller';
import { TasksService } from '..//tasks/tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const mockTasksService = {
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) // Mock the guard
      .compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll should call service.findAll', async () => {
    (service.findAll as jest.Mock).mockResolvedValue([]);
    const req = { user: { userId: 1, username: 'john' } };
    const result = await controller.findAll(req as any);
    expect(service.findAll).toHaveBeenCalledWith(1);
    expect(result).toEqual([]);
  });

});
