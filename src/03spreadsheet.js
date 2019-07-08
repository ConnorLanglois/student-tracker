class Spreadsheet {
	constructor (spreadsheetId) {
		this._spreadsheetId = spreadsheetId;
	}

	static getLetter(index) {
		var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
		var letter = index == 0 ? letters[0] : '';

		for (var i = index; i > 0; i = Math.floor(i / 26)) {
			var digit = Math.floor(i % 26);

			letter = (digit == 1 && i != index ? letters[0] : letters[digit]) + letter;
		}

		return letter;
	};

	appendValues(sheet, body) {
		return gapi.client.sheets.spreadsheets.values.append({
			spreadsheetId: this._spreadsheetId,
			range: sheet + '!A:A',
			valueInputOption: 'USER_ENTERED',
			values: body
		}).then();
	}

	getValues(sheet, range) {
		return gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: this._spreadsheetId,
			range: sheet + '!' + range
		}).then();
	}

	getSpreadsheet() {
		return gapi.client.sheets.spreadsheets.get({
			spreadsheetId: this._spreadsheetId
		}).then();
	}

	getSheets() {
		return this.getSpreadsheet().then(obj => {
			return obj.result.sheets;
		});
	}

	setValues(sheet, range, body) {
		return gapi.client.sheets.spreadsheets.values.update({
			spreadsheetId: this._spreadsheetId,
			range: sheet + '!' + range,
			valueInputOption: 'USER_ENTERED',
			values: body
		}).then();
	}

	sort() {
		return gapi.client.sheets.spreadsheets.batchUpdate({
			spreadsheetId: this._spreadsheetId,
			requests: [{
				sortRange: {
					range: {
						sheetId: 0,
						startRowIndex: 1,
						endRowIndex: 1000,
						startColumnIndex: 0,
						endColumnIndex: 1000
					},
					sortSpecs: [{
						dimensionIndex: 0,
						sortOrder: 'ASCENDING'
					}, {
						dimensionIndex: 1,
						sortOrder: 'ASCENDING'
					}]
				}
			}]
		}).then();
	}
}
