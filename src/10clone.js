class Clone extends Component {
	constructor (node) {
		super(node, CLONE_ID);

		this._element = function findElement(e) {
			if (e.tagName == 'A') {
				return e;
			} else {
				for (var e of Array.from(e.children)) {
					var ret = findElement(e);

					if (ret != undefined) {
						return ret;
					}
				}
			}
		}(this._element);
		this._types[this._types.length] = 'Clone';

		this._fileId = this._element.href.match(/(?:d\/|id=)(.{44})/)[1];
	}

	enable() {
		super.enable();

		var files = drive.childFolderId.then(childFolderId => {
			return Drive.Files.list("'" + childFolderId + "' in parents and properties has {key = 'id' and value = '" + this._fileId + "'}");
		});

		var ret = Promise.all([drive.childFolderId, files]).then(values => {
			var childFolderId = values[0];
			var files = values[1];

			if (files.length != 0) {
				console.log('CLONE ' + this._fileId + ': Found file');

				return Drive.Files.get(files[0].id, 'webViewLink');
			} else {
				console.log('CLONE ' + this._fileId + ': Not Found file');

				return Drive.Files.copy(this._fileId, {
					properties: {
						id: this._fileId
					},
					parents: [
						childFolderId
					]
				}).then(file => {
					return Drive.Files.get(file.id, 'webViewLink');
				});
			}
		}).then(file => {
			this._element.href = file.webViewLink;
		});

		return ret;
	}
}
