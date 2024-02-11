import { keyFactory } from '@lib/test';
import { InMemoryKey } from '.';
import { RepositoryError } from '@lib';

describe('InMemoryKey create method test', () => {
	let keyRepo: InMemoryKey;
	beforeEach(() => {
		keyRepo = new InMemoryKey();
	});

	it('should be able to update expired a keys', async () => {
		const key = keyFactory();
		await keyRepo.create(key);
	});

	it('should throw one error - entity already exist', async () => {
		const key = keyFactory();
		await keyRepo.create(key);
		await expect(keyRepo.create(key)).rejects.toThrow(RepositoryError);
	});
});
