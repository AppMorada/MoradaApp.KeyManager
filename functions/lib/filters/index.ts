import { Response } from '@google-cloud/functions-framework';
import { FirestoreCustomErrorFilter } from './firestoreError';
import { ErrorFilter } from './contract';
import { FirestoreCustomError } from '../errors/firestore';
import { ZodErrorFilter } from './ZodError';
import { ZodError } from 'zod';
import { LoggerAdapter } from '../config/logger/contract';
import { UnknownErrorFilter } from './unknownErrors';

interface IErrorFilterProps {
	filter: ErrorFilter;
	validator: (err: unknown) => boolean;
}

export class Filters {
	private readonly errorFilters: IErrorFilterProps[];

	constructor(
		private readonly res: Response,
		private readonly logger: LoggerAdapter,
		private readonly sessionId: string,
	) {
		this.errorFilters = [
			{
				filter: new FirestoreCustomErrorFilter(this.res, this.logger),
				validator: (err: unknown) =>
					err instanceof FirestoreCustomError,
			},
			{
				filter: new ZodErrorFilter(this.res, this.logger),
				validator: (err: unknown) => err instanceof ZodError,
			},
			{
				filter: new UnknownErrorFilter(this.res, this.logger),
				validator: () => true,
			},
		];
	}

	exec(error: unknown) {
		for (const errorFilter of this.errorFilters) {
			if (errorFilter.validator(error)) {
				errorFilter.filter.exec(error, this.sessionId);
				break;
			}
		}
	}
}
