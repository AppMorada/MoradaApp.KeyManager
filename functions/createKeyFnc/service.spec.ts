import { keyRepoId } from '@lib';
import { InMemoryKey } from '@lib/test';
import { Container } from 'inversify';
import { CreateKeyService } from './service';
import { Key } from '@lib';

describe('Create Key service test', () => {
	const container = new Container();

	beforeEach(() => {
		container.bind(keyRepoId).to(InMemoryKey);
	});

	it('should be able to create one key', async () => {
		const repo = container.get<InMemoryKey>(keyRepoId);

		const service = new CreateKeyService(repo);
		await service.exec({ name: 'my key', ttl: 60 * 60 });

		expect(repo.keys[0] instanceof Key).toBe(true);
	});
});
