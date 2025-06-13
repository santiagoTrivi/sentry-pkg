export class SentryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SentryError";
  }
}
