import { LoggerAdapter } from '../contract';
import { injectable } from 'inversify';
import winston from 'winston';

@injectable()
export class FirebaseLoggerAdapter implements LoggerAdapter {
	private readonly logger: winston.Logger;

	constructor() {
		this.logger = winston.createLogger({
			levels: {
				error: 0,
				warn: 1,
				info: 2,
				debug: 3,
			},
			format: winston.format.printf((info) => {
				return `${JSON.stringify({
					timestamp: info.timestamp,
					severity: info.level.toUpperCase(),
					data: info.message,
				})}`;
			}),
			transports: [new winston.transports.Console()],
		});
	}

	info(input: any) {
		this.logger.info(input);
	}

	warn(input: any) {
		this.logger.warn(input);
	}

	debug(input: any) {
		this.logger.debug(input);
	}

	error(input: any) {
		this.logger.error(input);
	}
}
