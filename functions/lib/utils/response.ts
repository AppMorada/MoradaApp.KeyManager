import { Response } from '@google-cloud/functions-framework';

export interface IReponseBodyModelProps {
	name: string;
	statusCode: number;
	message?:
		| string
		| number
		| undefined
		| Record<string, any>
		| Array<string>
		| Array<Record<string, any>>;
}

export class ResponseBodyModel {
	static start(res: Response) {
		const send = (input: IReponseBodyModelProps) =>
			res
				.status(input.statusCode)
				.json({
					name: input.name,
					statusCode: input.statusCode,
					message: input.message,
				})
				.end();

		return { send };
	}
}
