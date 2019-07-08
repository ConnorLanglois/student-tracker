Drive.Files = class {
	static copy(fileId, resource) {
		return gapi.client.drive.files.copy({
			fileId: fileId,
			resource: resource
		}).then(obj => {
			return obj.result;
		});
	}

	static create(resource) {
		return gapi.client.drive.files.create({
			resource: resource
		}).then(obj => {
			return obj.result;
		});
	}

	static createFolder(name, resource) {
		return Drive.Files.create(Object.assign({
			name: name,
			mimeType: 'application/vnd.google-apps.folder'
		}, resource));
	}

	static delete(fileId) {
		return gapi.client.drive.files.delete({
			fileId: fileId
		}).then();
	}

	static get(fileId, fields = 'id, kind, mimeType, name') {
		return gapi.client.drive.files.get({
			fileId: fileId,
			fields: fields
		}).then(obj => {
			return obj.result;
		});
	}

	static list(q = '') {
		return gapi.client.drive.files.list({
			q: q
		}).then(obj => {
			return obj.result.files;
		});
	}
}
