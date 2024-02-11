import { Response } from '@google-cloud/functions-framework';
import { ResponseBodyModel } from '../utils/response';
import { ErrorFilter } from './contract';
import { LoggerAdapter } from '../config/logger/contract';

export class UnknownErrorFilter implements ErrorFilter {
	constructor(
		private readonly res: Response,
		private readonly logger: LoggerAdapter,
	) {}

	exec(err: unknown) {
		this.logger.error(err);

		ResponseBodyModel.start(this.res).send({
			statusCode: 500,
			message: 'Somethig wrong happened',
			name: 'Internal Server Error',
		});
	}
}
