import { initializeApp } from 'firebase-admin/app';
import { Firestore } from 'firebase-admin/firestore';
import admin from 'firebase-admin';
import { injectable } from 'inversify';

interface IFirestoreContainer {
	INSTANCE: undefined | Firestore;
}

export const firestoreServiceId = Symbol.for('__firestore_service__');
const FIRESTORE: IFirestoreContainer = {
	INSTANCE: undefined,
};

@injectable()
export class FirestoreService {
	private readonly _instance: Firestore;

	constructor() {
		if (!FIRESTORE.INSTANCE) {
			initializeApp({
				projectId: process.env.GCP_PROJECT,
			});

			FIRESTORE.INSTANCE = admin.firestore();
			FIRESTORE.INSTANCE.settings({
				ignoreUndefinedProperties: true,
			});
		}

		this._instance = FIRESTORE.INSTANCE;
	}

	get instance(): Firestore {
		return this._instance;
	}

	async close() {
		await this._instance.terminate();
	}
}
