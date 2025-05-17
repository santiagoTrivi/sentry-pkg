import { DataSourceOptions } from "typeorm";

export interface SentryOptions {
  dataSource?: Partial<DataSourceOptions>;
}
