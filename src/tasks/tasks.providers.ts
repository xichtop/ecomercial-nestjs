import { DataSource } from "typeorm";
import { Task } from "./dto/tasks.entity";

export const tasksProviders = [
  {
    provide: "TASK_REPOSITORY",
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Task),
    inject: ["DATA_SOURCE"],
  },
]