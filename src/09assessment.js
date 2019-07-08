class Assessment extends Task {
	constructor (index, node, assessmentIndex) {
		super(index, node, ASSESSMENT_ID);

		this._assessmentIndex = assessmentIndex;

		this._types[this._types.length] = 'Assessment';

		this._id = -1;
	}

	enable() {
		console.log('ASSESSMENT ' + this._index + ': enabling');

		super.enable();

		if (!this._isCompleted) {
			this.onUpdate();
			
			this._id = setInterval(this.onUpdate.bind(this), 30000);

			console.log('ASSESSMENT ' + this._index + ': interval id ' + this._id);
		}
	}

	disable() {
		console.log('ASSESSMENT ' + this._index + ': disabling');

		super.disable();

		clearInterval(this._id);
	}

	onUpdate() {
		console.log('ASSESSMENT ' + this._index + ': updating');

		FORM_SPREADSHEET.getSheets().then(sheets => {
			var sheet = sheets[this._assessmentIndex];

			console.log('ASSESSMENT ' + this._index + ': sheet ' + sheet.properties.title);
			
			return FORM_SPREADSHEET.getValues(sheet.properties.title, 'B1:' + Spreadsheet.getLetter(sheet.properties.gridProperties.columnCount - 1));
		}).then(obj => {
			var values = obj.result.values;
			var success = false;

			var emailIndex = -1;
			var scoreIndex = -1;

			for (var i = 0; i < values[0].length; i++) {
				if (emailIndex != -1 && scoreIndex != -1) {
					break;
				}

				switch (values[0][i]) {
					case 'Email Address':
						emailIndex = i;

						break;

					case 'Score':
						scoreIndex = i;

						break;
				}
			}

			console.log('ASSESSMENT ' + this._index + ': email col - ' + emailIndex + ', score col - ' + scoreIndex);
			console.log('ASSESSMENT ' + this._index + ': email - ' + student.email);

			values.splice(0, 1);
			
			for (var row of values) {
				if (row[emailIndex] == student.email && Number(row[scoreIndex].substring(0, row[scoreIndex].indexOf('/') - 1)) == Number(row[scoreIndex].substring(row[scoreIndex].indexOf('/') + 2))) {
					success = true;

					console.log('ASSESSMENT ' + this._index + ': found student and is completed');

					break;
				}
			}

			if (success && !this._isCompleted || !success && this._isCompleted) {
				student.getIndex().then(studentIndex => {
					MAIN_SPREADSHEET.setValues(SHEET, Spreadsheet.getLetter(this._index + 2) + (studentIndex + 2), [[success ? '5' : '']]);
				});

				this._isCompleted = success;

				clearInterval(this._id);

				COMPONENT_CONTAINER.update();
			}

			if (!success) {
				console.log('ASSESSMENT ' + this._index + ': did not find student or is not completed');
			}
		});
	}
}
