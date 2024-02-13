import { keyFactory } from '@lib/test';
import { InMemoryKey } from '.';

describe('InMemoryKey updateAllExpiredKeys method test', () => {
	let keyRepo: InMemoryKey;
	beforeEach(() => {
		keyRepo = new InMemoryKey();
	});

	it('should be able to update expired a keys', async () => {
		const oldDate = new Date(Date.now() - 1000);
		keyRepo.keys.push(
			keyFactory({
				actual: {
					content: 'content',
					buildedAt: Date.now(),
				},
				renewTime: undefined,
				ttl: 0,
			}),
		);
		for (let i = 1; i <= 20; i++) {
			keyRepo.keys.push(
				keyFactory({
					actual: {
						content: 'content',
						buildedAt: Date.now(),
					},
				}),
			);
		}

		await keyRepo.updateAllExpiredKeys();
		expect(keyRepo.keys[0].prev).toBeTruthy();
		expect(keyRepo.keys[0].renewTime > oldDate.getTime()).toBe(true);
	});
});
