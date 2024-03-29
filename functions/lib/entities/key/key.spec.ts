import { keyFactory } from '@lib/test';

describe('Key Entitie Test', () => {
	it('should be able to create a key entitie', () => {
		const key = keyFactory();
		const anotherKey = key;

		expect(key.equalTo({ key: anotherKey })).toBe(true);

		const anotherKey2 = keyFactory({
			name: 'another key',
			actual: {
				buildedAt: Date.now() - 10000,
				content: key.actual.content,
			},
		});
		expect(key.equalTo({ key: anotherKey2 })).toBe(false);
	});
});
