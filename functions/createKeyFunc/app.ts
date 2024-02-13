import { ErrorListener } from '@lib';
ErrorListener.exec();

import { keyRepoId } from '@lib';
import { FirestoreService, firestoreServiceId } from '@lib';
import { FirestoreKeyRepo } from '@lib';
import { Container } from 'inversify';
import { CreateKeyService, createKeyServiceId } from './service';
import { Request, Response } from '@google-cloud/functions-framework';
import { CreateKeyFuncDTO } from './dto';
import { HttpStatusHandler } from '@lib';
import { LoggerAdapter, loggerId } from '@lib';
import { FirebaseLoggerAdapter } from '@lib';

const container = new Container();

container.bind(firestoreServiceId).to(FirestoreService);
container.bind(keyRepoId).to(FirestoreKeyRepo);
container.bind(createKeyServiceId).to(CreateKeyService);
container.bind(loggerId).to(FirebaseLoggerAdapter);

export class CreateKeyApp {
	readonly services = {
		createKey: container.get<CreateKeyService>(createKeyServiceId),
	};
	readonly deps = {
		logger: container.get<LoggerAdapter>(loggerId),
	};

	private httpStatusPackage: ReturnType<typeof HttpStatusHandler.start>;

	constructor(
		private readonly req: Request,
		private readonly res: Response,
	) {
		this.httpStatusPackage = HttpStatusHandler.start(this.res);
	}

	async exec() {
		if (this.req.method !== 'POST')
			return this.httpStatusPackage.methodNotAllowed(
				'POST',
				this.deps.logger,
			);

		const { ttl, name } = CreateKeyFuncDTO.exec(this.req.body);

		await this.services.createKey
			.exec({ name, ttl })
			.then(() => this.httpStatusPackage.created());
	}
}
