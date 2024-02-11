export enum FirestoreCustomErrorTag {
	malformedEntity = '__malformed_entity_err__',
	createEntity = '__create_entity_err__',
	deleteEntity = '__delete_entity_err__',
	updateEntity = '__update_entity_err__',
	getEntity = '__get_entity_err__',
}

interface IProps {
	message: string;
	tag: FirestoreCustomErrorTag;
	cause: string;
}

export class FirestoreCustomError extends Error {
	readonly cause: string;
	readonly tag: FirestoreCustomErrorTag;

	constructor(input: IProps) {
		super();

		this.name = 'Firestore Custom Error';
		this.message = input.message;
		this.cause = input.cause;
		this.tag = input.tag;
	}
}
