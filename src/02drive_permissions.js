Drive.Permissions = class {
	static create(fileId, resource) {
		gapi.client.drive.permissions.create({
			fileId: fileId,
			resource: resource
		}).then(obj => {
			return obj.result.files;
		});
	}
}
