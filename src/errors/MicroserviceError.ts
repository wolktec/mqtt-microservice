export class MicroserviceError extends Error {
  constructor(message: string, name: string, stack?: string) {
    super(message);
    this.name = name;
    this.stack = stack;
  }
}