import { Response } from '@google-cloud/functions-framework';
import {
	FirestoreCustomError,
	FirestoreCustomErrorTag,
} from '../errors/firestore';
import { ResponseBodyModel } from '../utils/response';
import { ErrorFilter } from './contract';
import { LoggerAdapter } from '../config/logger/contract';

export class FirestoreCustomErrorFilter implements ErrorFilter {
	constructor(
		private readonly res: Response,
		private readonly logger: LoggerAdapter,
	) {}

	private readonly filterMsg = [
		{
			match: 'ALREADY_EXISTS',
			httpCode: 409,
			message: 'Entity already exist',
			name: 'Bad Request',
		},
		{
			match: FirestoreCustomErrorTag.malformedEntity,
			httpCode: 500,
			message: 'Somethig wrong happened',
			name: 'Internal Server Error',
		},
	];

	exec(err: FirestoreCustomError, sessionId: string) {
		const possibleResponse = this.filterMsg.find(
			(item) => err.cause.includes(item.match) || err.tag === item.match,
		);

		this.logger.error({
			sessionId,
			error: err,
		});

		ResponseBodyModel.start(this.res).send({
			statusCode: possibleResponse?.httpCode ?? 500,
			message: possibleResponse?.message ?? 'Somethig wrong happened',
			name: possibleResponse?.name ?? 'Internal Server Error',
		});
	}
}
