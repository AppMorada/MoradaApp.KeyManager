import { Key } from '@lib';
import { Timestamp } from 'firebase-admin/firestore';

export interface IToFlatReturn {
	name: string;
	prev_Content?: string;
	prev_BuildedAt?: Timestamp;
	actual_Content: string;
	actual_BuildedAt: Timestamp;
	ttl: number;
	renewTime: number;
}

export class FirestoreKeyMapper {
	static toFlat(input: Key): IToFlatReturn {
		return {
			name: input.name,
			ttl: input.ttl,
			actual_Content: input.actual.content,
			actual_BuildedAt: Timestamp.fromDate(input.actual.buildedAt),
			prev_Content: input.prev?.content,
			prev_BuildedAt: input.prev?.buildedAt
				? Timestamp.fromDate(input.prev.buildedAt)
				: undefined,
			renewTime: input.renewTime,
		};
	}

	static fromFlatToClass(input: IToFlatReturn) {
		return new Key({
			actual: {
				buildedAt: input.actual_BuildedAt.toDate(),
				content: input.actual_Content,
			},
			prev:
				input.prev_BuildedAt && input.prev_Content
					? {
						buildedAt: input.prev_BuildedAt.toDate(),
						content: input.prev_Content,
					}
					: undefined,
			name: input.name,
			id: input.name,
			renewTime: input.renewTime,
			ttl: input.ttl,
		});
	}
}
