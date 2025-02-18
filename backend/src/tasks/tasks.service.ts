import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async findAll(userId: number) {
    return this.tasksRepository.find({
      where: { user: { id: userId } },
    });
  }

  async create(createTaskDto: CreateTaskDto, userId: number) {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      user: { id: userId },
    });
    return this.tasksRepository.save(task);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    const task = await this.tasksRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.tasksRepository.save({ ...task, ...updateTaskDto });
  }

  async delete(id: number, userId: number) {
    const result = await this.tasksRepository.delete({
      id,
      user: { id: userId },
    });
    
    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }
}