class Task extends Component {
	constructor (index, node, id) {
		super(node, id);

		this._index = index;

		this._types[this._types.length] = 'Task';

		this._isCompleted = false;
	}

	get isCompleted() {
		return this._isCompleted;
	}

	setCompleted(isCompleted) {
		this._isCompleted = isCompleted;
	}
}
