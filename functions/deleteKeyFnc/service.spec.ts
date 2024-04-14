import { keyRepoId } from '@lib';
import { InMemoryKey } from '@lib/test';
import { Container } from 'inversify';
import { DeleteKeyFuncService } from './service';
import { keyFactory } from '@lib/test';

describe('Delete Key service test', () => {
	const container = new Container();

	beforeEach(() => {
		container.bind(keyRepoId).to(InMemoryKey);
	});

	it('should be able to delete one key', async () => {
		const repo = container.get<InMemoryKey>(keyRepoId);
		const key = keyFactory();
		await repo.create(key);

		const service = new DeleteKeyFuncService(repo);
		await service.exec({ id: key.id });

		expect(typeof repo.keys[0] === 'undefined').toBe(true);
	});
});
