import 'reflect-metadata';

import { randomUUID } from 'node:crypto';
import { Request, Response } from '@google-cloud/functions-framework';
import { DeleteKeyApp } from './app';
import { Filters } from '@lib';

export const DeleteKeyFunc = async (req: Request, res: Response) => {
	const app = new DeleteKeyApp(req, res);

	const logger = app.deps.logger;
	const sessionId = randomUUID();

	logger.info({
		sessionId,
		description: 'Accessing create key function',
	});

	await app.exec().catch((err) => {
		const filters = new Filters(res, logger, sessionId);
		filters.exec(err);
	});

	logger.info({
		sessionId,
		description: `Returning with the following status code: ${res.statusCode}`,
	});
};
