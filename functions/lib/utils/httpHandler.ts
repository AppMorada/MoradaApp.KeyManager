import { Response } from '@google-cloud/functions-framework';
import { ResponseBodyModel } from './response';
import { LoggerAdapter } from '@lib';

type TProps = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export class HttpStatusHandler {
	static start(res: Response) {
		const methodNotAllowed = (
			allowedMethod: TProps,
			logger: LoggerAdapter,
		) => {
			logger.error({
				name: 'Method Not Allowed',
				statusCode: 405,
				message: `Only ${allowedMethod} method are allowed`,
			});

			return ResponseBodyModel.start(res).send({
				name: 'Method Not Allowed',
				statusCode: 405,
				message: `Only ${allowedMethod} method are allowed`,
			});
		};

		const ok = () => {
			return res.status(200).end();
		};

		const noContent = () => {
			return res.status(204).end();
		};

		const created = () => {
			return res.status(201).end();
		};

		return { methodNotAllowed, ok, noContent, created };
	}
}
