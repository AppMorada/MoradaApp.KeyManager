import { Response } from "@google-cloud/functions-framework";
import { ResponseBodyModel } from "../utils/response";
import { ZodError } from "zod";
import { ErrorFilter } from "./contract";
import { LoggerAdapter } from "../config/logger/contract";

export class ZodErrorFilter implements ErrorFilter {
	constructor(private readonly res: Response, private readonly logger: LoggerAdapter) {}

	exec(err: ZodError, sessionId: string) {
		this.logger.error({
			sessionId,
			error: err
		})

		ResponseBodyModel.start(this.res).send({
			statusCode: 400,
			message: JSON.parse(err.message),
			name: 'Bad Request'
		})
	}
}
