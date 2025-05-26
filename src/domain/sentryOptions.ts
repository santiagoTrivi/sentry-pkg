export interface DatabaseOptions {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}

export interface SentryOptions {
  expiresIn?: string | number;
  databaseOptions?: DatabaseOptions;
}
