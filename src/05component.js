class Component {
	constructor (node, id) {
		this._element = node.parentElement;

		this._types = ['Component'];

		this._allChildren = function findAllChildren(parent, children) {
			if (parent.childElementCount == 0) {
				return children;
			} else {
				Array.from(parent.children).forEach(function (child) {
					children[children.length] = child;

					findAllChildren(child, children);
				});
			}

			return children;
		}(this._element, []);

		this._isEnabled = false;

		node.data = node.data.replace(id, '');
	}

	enable() {
		this._element.onclick = () => {};
		this._element.style.setProperty('color', '');

		this._allChildren.forEach(element => {
			element.onclick = () => {};
			element.style.setProperty('color', '');
		});

		this._isEnabled = true;
	}

	disable() {
		this._element.onclick = e => {
			e.preventDefault();
		};
		this._element.style.setProperty('color', 'gray', 'important');

		this._allChildren.forEach(element => {
			element.onclick = e => {
				e.preventDefault();
			};
			element.style.setProperty('color', 'gray', 'important');
		});

		this._isEnabled = false;
	}

	get isEnabled() {
		return this._isEnabled;
	}

	get types() {
		return this._types;
	}
}
