import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { createTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  constructor(
    @Inject('TASK_REPOSITORY')
    private  taskRepository: Repository<Task>
  ) {}

  getTasks(): Task[] {
    return this.tasks;
  }

  getTasksByFilter(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }

    return tasks;
  }

  async createTask(createTaskDto: createTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN
    })

    await this.taskRepository.save(task);

    return task;
  }

  async getTaskById(id: string): Promise<Task> {
    const foundedTask = await this.taskRepository.findOne({ where: { id } });
    if (!foundedTask) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return foundedTask;
  }

  // deleteTaskById(id: string): void {
  //   const found = this.getTaskById(id);
  //   this.tasks = this.tasks.filter((task) => task.id !== found.id);
  // }
}
