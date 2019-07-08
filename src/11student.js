class Student {
	constructor (rawName, rawEmail) {
		this._rawName = rawName;
		this._rawEmail = rawEmail;

		this._name = this._rawName.substring(this._rawName.lastIndexOf(' ') + 1) + ', ' + this._rawName.substring(0, this._rawName.lastIndexOf(' '));
		this._email = this._rawEmail.toLowerCase();
	}

	getIndex() {
		return MAIN_SPREADSHEET.getValues(SHEET, 'B2:B').then(obj => {
			var names = obj.result.values != undefined ? obj.result.values : [[]];

			for (var i = 0; i < names.length; ++i) {
				if (names[i][0] == student.name) {
					return i;
				}
			}

			return -1;
		});
	}

	getData() {
		return this.getIndex().then(index => {
			return index != -1 ? MAIN_SPREADSHEET.getValues(SHEET, 'C' + (index + 2) + ':' + (index + 2)) : null;
		}).then(obj => {
			return obj != null && obj.result.values != undefined ? obj.result.values[0] : obj != null ? [[]] : null;
		});
	}

	get name() {
		return this._name;
	}

	get email() {
		return this._email;
	}

	get period() {
		return this._period;
	}

	set period(period) {
		this._period = period;
	}
}
