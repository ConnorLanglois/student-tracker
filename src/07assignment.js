class Assignment extends Task {
	constructor (index, node, id = ASSIGNMENT_ID) {
		super(index, node, id);

		this._types[this._types.length] = 'Assignment';

		this._checkbox = document.createElement('input');
		this._checkbox.type = 'checkbox';
		this._checkbox.disabled = true;
		this._checkbox.onchange = () => {
			var value = this._checkbox.checked ? '5' : '';

			student.getIndex().then(studentIndex => {
				MAIN_SPREADSHEET.setValues(SHEET, Spreadsheet.getLetter(this._index + 2) + (studentIndex + 2), [[value]]);
			});

			this.setCompleted(this._checkbox.checked);
		};

		this._element.insertBefore(document.createTextNode(' '), this._element.firstChild);
		this._element.insertBefore(this._checkbox, this._element.firstChild);
	}

	enable() {
		super.enable();

		this._checkbox.disabled = false;
	}

	disable() {
		super.disable();

		this._checkbox.disabled = true;
	}

	setCompleted(isCompleted) {
		super.setCompleted(isCompleted);

		this._checkbox.checked = isCompleted;
	}
}
