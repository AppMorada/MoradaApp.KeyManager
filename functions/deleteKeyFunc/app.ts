import { keyRepoId } from "@lib";
import { FirestoreService, firestoreServiceId } from "@lib";
import { FirestoreKeyRepo } from "@lib";
import { Container } from "inversify";
import { DeleteKeyFuncService, deleteKeyServiceId } from "./service";
import { Request, Response } from "@google-cloud/functions-framework";
import { DeleteKeyFuncDTO } from "./dto";
import { HttpStatusHandler } from "@lib";
import { LoggerAdapter, loggerId } from "@lib";
import { FirebaseLoggerAdapter } from "@lib";

const container = new Container()

container.bind(firestoreServiceId).to(FirestoreService)
container.bind(keyRepoId).to(FirestoreKeyRepo)
container.bind(deleteKeyServiceId).to(DeleteKeyFuncService)
container.bind(loggerId).to(FirebaseLoggerAdapter)

export class DeleteKeyApp {
  readonly services = {
    deleteKey: container.get<DeleteKeyFuncService>(deleteKeyServiceId)
  }
  readonly deps = {
    logger: container.get<LoggerAdapter>(loggerId)
  }

  private httpStatusPackage: ReturnType<typeof HttpStatusHandler.start>

  constructor(private readonly req: Request, private readonly res: Response) {
    this.httpStatusPackage = HttpStatusHandler.start(this.res)
  }

  async exec() {
    if(this.req.method !== 'DELETE')
      return this.httpStatusPackage.methodNotAllowed('DELETE', this.deps.logger)

    const id = DeleteKeyFuncDTO.exec({ params: this.req?.params })

    await this.services.deleteKey.exec({ id })
      .then(() => this.httpStatusPackage.noContent())
  }
}

