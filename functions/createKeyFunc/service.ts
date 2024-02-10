import { Key } from '@lib';
import { KeyRepo, keyRepoId } from '@lib';
import { inject, injectable } from 'inversify'
import { randomBytes } from 'node:crypto';

interface IProps {
	name: string;
	ttl: number;
}

export const createKeyServiceId = Symbol.for('__create_key_service__')

@injectable()
export class CreateKeyService {
	constructor(@inject(keyRepoId) private readonly keyRepo: KeyRepo) {}

	async exec(input: IProps) {
		const values = randomBytes(100).toString('hex')
		
		const key = new Key({
			name: input.name,
			ttl: input.ttl,
			actual: {
				content: values,
				buildedAt: new Date()
			}
		})

		await this.keyRepo.create(key)
	}
}
