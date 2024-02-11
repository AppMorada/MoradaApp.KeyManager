import { Key } from '../entities/key';

export const keyRepoId = Symbol.for('__key_repo__');

export abstract class KeyRepo {
	abstract create(input: Key): Promise<void>;
	abstract remove(id: string): Promise<void>;
	abstract updateAllExpiredKeys(): Promise<void>;
}
