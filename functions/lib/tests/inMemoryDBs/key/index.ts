import { Key } from "@lib";
import { RepositoryError } from "@lib";
import { KeyRepo } from "@lib";
import { injectable } from "inversify";

@injectable()
export class InMemoryKey implements KeyRepo {
	keys: Key[] = [];

	async remove(id: string): Promise<void> {
		const searchedIndexKey = this.keys.findIndex((item) => item.id === id)
		if(searchedIndexKey < 0)
			throw new RepositoryError('Esta entidade não existe')

		this.keys.splice(searchedIndexKey);
	}

	async create(input: Key) {
		const searchedKey = this.keys.find((item) => item.id === input.id)
		if(searchedKey)
			throw new RepositoryError('Esta entidade já existe')

		this.keys.push(input)
	}

	async updateAllExpiredKeys(): Promise<void> {
		const searchedKeys = this.keys.filter(
			(item) => item.renewTime <= Date.now()
		)

		const asyncTasks: Promise<void>[] = []
		searchedKeys.forEach(async (item) => {
			item.prev = { ...item.actual }
			item.actual = {
				...item.actual,
				buildedAt: new Date()
			}
			item.renewTime = Date.now()

			asyncTasks.push(this.update(item))
		})

		await Promise.all(asyncTasks)
	}

	private async update(input: Key): Promise<void> {
		const searchedIndexKey = this.keys.findIndex((item) => item.id === input.id)
		if(searchedIndexKey < 0)
			throw new RepositoryError('Esta entidade não existe')

		this.keys[searchedIndexKey] = input
	}
}
