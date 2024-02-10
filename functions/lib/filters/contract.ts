export abstract class ErrorFilter {
	abstract exec(err: unknown, sessionId: string): void;
}
