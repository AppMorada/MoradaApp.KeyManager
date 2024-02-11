export class RepositoryError extends Error {
	constructor(input: string) {
		super();

		this.name = 'Repository error';
		this.message = input;
	}
}
