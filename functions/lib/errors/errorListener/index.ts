export class ErrorListener {
	static exec() {
		const errorTypes = ['uncaughtException', 'unhandledRejection'];

		errorTypes.forEach((item) => {
			process.on(item, (err) => {
				console.error(
					`Something bad happened! Event: ${item}, msg: ${err.stack || err}`,
				);
			});
		});
	}
}
