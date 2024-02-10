import { keyFactory } from "@lib/test"
import { InMemoryKey } from "."
import { RepositoryError } from "@lib";

describe('InMemoryKey remove method test', () => {
	let keyRepo: InMemoryKey;
	beforeEach(() => {
		keyRepo = new InMemoryKey()
	})

	it('should be able to remove a key', async () => {
		const key = keyFactory()
		keyRepo.keys.push(key)

		await keyRepo.remove(key.id)
		expect(keyRepo.keys.length === 0).toBe(true)
	})

	it('should throw one error - entity already exist', async () => {
		const key = keyFactory()
		await expect(keyRepo.remove(key.id)).rejects.toThrow(RepositoryError)
	})
})
