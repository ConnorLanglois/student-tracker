class ComponentContainer {
	constructor () {
		this._components = [];
	}

	add(component) {
		this._components[this._components.length] = component;
	}

	get(index) {
		return this._components[index];
	}

	getByType(type) {
		var components = [];

		this._components.forEach(e => {
			if (e.types.includes(type)) {
				components[components.length] = e;
			}
		});

		return components;
	}

	update() {
		var chain = new Promise((resolve, reject) => {
			resolve();
		});

		for (let i = 0, count = 0; i < this._components.length; i++) {
			const component = this._components[i];

			if (!component.isEnabled) {
				chain = chain.then(() => {
					var ret = component.enable();

					if (count % 2 === 0) {
						return ret;
					}
				});

				if (component instanceof Clone) {
					count++;
				}
			}

			if ((component instanceof Assessment || component instanceof LockedAssignment) && !component.isCompleted) {
				for (let j = i + 1; j < this._components.length; j++) {
					const component = this._components[j];

					if (component.isEnabled) {
						component.disable();
					}
				}

				return;
			}
		}
	}

	onSignIn() {
		var clones = this.getByType('Clone');

		if (clones.length != 0) {
			const HOSTNAME = window.location.hostname.match(/\.(.+)\./)[1];
			const PATHNAME = window.location.pathname.match(/\/([^.]*)/)[1];

			var parent = Drive.Files.list("mimeType = 'application/vnd.google-apps.folder' and properties has {key = 'id' and value = '" + HOSTNAME + "'}").then(files => {
				if (files.length != 0) {
					console.log('CLONE: Found parent');

					return files[0].id;
				} else {
					console.log('CLONE: Not Found parent');

					var folder = Drive.Files.createFolder(HOSTNAME, {
						properties: {
							id: HOSTNAME
						}
					});

					var emailAddress = Drive.Files.get(MAIN_SPREADSHEET_ID, 'owners').then(obj => {
						return obj.owners[0].emailAddress;
					});

					return Promise.all([folder, emailAddress]).then(values => {
						var folder = values[0];
						var emailAddress = values[1];

						Drive.Permissions.create(folder.id, {
							role: 'writer',
							type: 'user',
							emailAddress: emailAddress
						});

						return folder.id;
					});
				}
			});

			var child = parent.then(parentFolderId => {
				return Drive.Files.list("mimeType = 'application/vnd.google-apps.folder' and '" + parentFolderId + "' in parents and properties has {key = 'id' and value = '" + PATHNAME + "'}")
			});

			drive = new Drive(Promise.all([parent, child]).then(values => {
				var parentFolderId = values[0];
				var files = values[1];

				if (files.length != 0) {
					console.log('CLONE: Found child');

					return files[0].id;
				} else {
					console.log('CLONE: Not Found child');

					return Drive.Files.createFolder(document.title, {
						properties: {
							id: PATHNAME
						},
						parents: [
							parentFolderId
						]
					}).then(file => {
						return file.id;
					});
				}
			}));
		}
	}

	disableAll() {
		this._components.forEach(component => {
			component.disable();
		});
	}

	get size() {
		return this._components.length;
	}
}
