import { keyRepoId } from "@lib";
import { UpdateKeysService, updateKeysServiceId } from "./service";
import { FirestoreService, firestoreServiceId } from "@lib";
import { FirestoreKeyRepo } from "@lib";
import { Container } from "inversify";
import { Request, Response } from "@google-cloud/functions-framework";
import { HttpStatusHandler } from "@lib";
import { LoggerAdapter, loggerId } from "@lib";
import { FirebaseLoggerAdapter } from "@lib";

const container = new Container()

container.bind(firestoreServiceId).to(FirestoreService)
container.bind(keyRepoId).to(FirestoreKeyRepo)
container.bind(updateKeysServiceId).to(UpdateKeysService)
container.bind(loggerId).to(FirebaseLoggerAdapter)

export class UpdateKeyApp {
	readonly services = {
		updateKeys: container.get<UpdateKeysService>(updateKeysServiceId)
	}
	readonly deps = {
		logger: container.get<LoggerAdapter>(loggerId)
	}

	private httpStatusPackage: ReturnType<typeof HttpStatusHandler.start>

	constructor(private readonly req: Request, private readonly res: Response) {
		this.httpStatusPackage = HttpStatusHandler.start(this.res)
	}

	async exec() {
		if(this.req.method !== 'PATCH')
			return this.httpStatusPackage.methodNotAllowed('PATCH', this.deps.logger)

		await this.services.updateKeys.exec()
			.then(() => {
				this.httpStatusPackage.ok()
			})
	}
}
