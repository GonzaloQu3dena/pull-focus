export abstract class ErrorHandlingEnabledBaseType {
  /**
   * Handles errors by logging them to the console with context.
   * @param operation - The name of the operation that failed.
   * @param error - The error object or message.
   * @protected
   */
  protected handleError(operation: string, error: unknown): void {
    let message = 'An unexpected error occurred';

    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    console.error(`[${this.constructor.name}] ${operation} failed: ${message}`, error);
  }
}
