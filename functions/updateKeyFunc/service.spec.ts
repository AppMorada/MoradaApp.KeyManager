import { keyRepoId } from "@lib"
import { UpdateKeysService } from "./service";
import { InMemoryKey } from "@lib/test";
import { Container } from "inversify";
import { keyFactory } from "@lib/test";

describe('Update Key service test', () => {
	const container = new Container()

	beforeEach(() => {
		container.bind(keyRepoId).to(InMemoryKey)
	})

	it('should be able to update all expired keys', async () => {
		const key = keyFactory({ 
			actual: { 
				content: 'content',
				buildedAt: new Date()
			},
			renewTime: undefined,
			ttl: 0
		})
		const repo = container.get<InMemoryKey>(keyRepoId)
		await repo.create(key)

		const service = new UpdateKeysService(repo)
		await service.exec()

		expect(repo.keys[0].prev).toBeTruthy()
	})
})
