import { KeyRepo } from '@lib';
import { inject, injectable } from 'inversify';
import { FirestoreService, firestoreServiceId } from '../..';
import { Key } from '@lib';
import { FirestoreKeyMapper } from '../../mapper/key';
import { randomBytes } from 'node:crypto';
import { FirestoreKeyDTO } from '../../dto/key';
import { FirestoreCustomError, FirestoreCustomErrorTag } from '@lib';

@injectable()
export class FirestoreKeyRepo implements KeyRepo {
	constructor(
		@inject(firestoreServiceId)
		private readonly firestoreService: FirestoreService,
	) {}

	private readonly secretCollection =
		this.firestoreService.instance.collection('secrets');

	async create(input: Key): Promise<void> {
		const { name, ...rest } = FirestoreKeyMapper.toFlat(input);
		await this.secretCollection
			.doc(name)
			.create({ ...rest })
			.catch((err) => {
				throw new FirestoreCustomError({
					message: 'Could not create key entitie',
					tag: FirestoreCustomErrorTag.createEntity,
					cause: err.message,
				});
			});
	}

	async remove(id: string): Promise<void> {
		await this.secretCollection
			.doc(id)
			.delete()
			.catch((err) => {
				throw new FirestoreCustomError({
					message: 'Could not delete key entitie',
					tag: FirestoreCustomErrorTag.deleteEntity,
					cause: err.message,
				});
			});
	}

	async updateAllExpiredKeys(): Promise<void> {
		const database = this.firestoreService.instance;
		const batch = database.batch();
		const refs = await this.secretCollection
			.where('renewTime', '<=', Date.now())
			.get()
			.catch((err) => {
				throw new FirestoreCustomError({
					message: 'Could not get key entitie',
					tag: FirestoreCustomErrorTag.getEntity,
					cause: err.message,
				});
			});

		if (refs.empty) return;

		refs.forEach((item) => {
			if (!item.exists) return;

			const parsedKey = FirestoreKeyDTO.exec(item.data());
			const key = FirestoreKeyMapper.fromFlatToClass({
				name: item.id,
				...parsedKey,
			});

			key.renewTime = key.ttl + Date.now();
			key.prev = { ...key.actual };
			key.actual = {
				content: randomBytes(100).toString('hex'),
				buildedAt: new Date(),
			};

			/* eslint-disable @typescript-eslint/no-unused-vars */
			const { name: _, ...newKeyData } = FirestoreKeyMapper.toFlat(key);
			batch.update(this.secretCollection.doc(item.id), newKeyData);
		});

		await batch.commit().catch((err) => {
			throw new FirestoreCustomError({
				message: 'Could not update key entities',
				tag: FirestoreCustomErrorTag.updateEntity,
				cause: err.message,
			});
		});
	}
}
