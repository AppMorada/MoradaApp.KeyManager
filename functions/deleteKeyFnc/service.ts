import { KeyRepo, keyRepoId } from '@lib';
import { inject, injectable } from 'inversify';

interface IProps {
	id: string;
}

export const deleteKeyServiceId = Symbol.for('__delete_key_service__');

@injectable()
export class DeleteKeyFuncService {
	constructor(@inject(keyRepoId) private readonly keyRepo: KeyRepo) {}

	async exec(input: IProps) {
		await this.keyRepo.remove(input.id);
	}
}
