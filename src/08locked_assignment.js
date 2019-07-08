class LockedAssignment extends Assignment {
	constructor (index, node) {
		super(index, node, LOCKED_ASSIGNMENT_ID);

		this._types[this._types.length] = 'LockedAssignment';
	}

	setCompleted(isCompleted) {
		super.setCompleted(isCompleted);

		COMPONENT_CONTAINER.update();
	}
}
