import 'reflect-metadata';

import { randomUUID } from 'node:crypto';
import { Request, Response } from '@google-cloud/functions-framework';
import { UpdateKeyApp } from './app';
import { Filters } from '@lib';

export const updateKeyFnc = async (req: Request, res: Response) => {
	const app = new UpdateKeyApp(req, res);

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
