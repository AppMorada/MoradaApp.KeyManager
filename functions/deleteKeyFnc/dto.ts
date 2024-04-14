import { z } from 'zod';

interface IProps {
	params: any;
}

export class DeleteKeyFuncDTO {
	static exec(input: IProps): string {
		const schema = z
			.object({
				'0': z.string().min(2).max(255),
			})
			.strict();

		const result = schema.parse(input?.params);
		return decodeURIComponent(result['0']);
	}
}
