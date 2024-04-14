import { KeyRepo, keyRepoId } from '@lib';
import { inject, injectable } from 'inversify';

export const updateKeysServiceId = Symbol.for('__update_keys_service__');

@injectable()
export class UpdateKeysService {
	constructor(@inject(keyRepoId) private readonly keyRepo: KeyRepo) {}

	async exec() {
		await this.keyRepo.updateAllExpiredKeys();
	}
}
