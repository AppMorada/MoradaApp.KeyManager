import { Timestamp } from 'firebase-admin/firestore';
import { IToFlatReturn } from '../mapper/key';
import { z } from 'zod';
import { FirestoreCustomError, FirestoreCustomErrorTag } from '@lib';

export class FirestoreKeyDTO {
	static exec(body: any): Omit<IToFlatReturn, 'name'> {
		const schema = z
			.object({
				prev_Content: z.string().length(200).or(z.undefined()),
				prev_BuildedAt: z.instanceof(Timestamp).or(z.undefined()),
				actual_Content: z.string().length(200),
				actual_BuildedAt: z.instanceof(Timestamp),
				ttl: z.number().min(1),
				renewTime: z.number().min(1),
			})
			.strict();

		try {
			const output = schema.parse(body);
			return output;
		} catch (err) {
			throw new FirestoreCustomError({
				message: 'Malformed internal entitiy',
				tag: FirestoreCustomErrorTag.malformedEntity,
				cause: err.message,
			});
		}
	}
}
