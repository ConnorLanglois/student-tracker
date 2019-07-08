const DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4', 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive';

const SCRIPT = document.createElement('script');

const MAIN_SPREADSHEET = new Spreadsheet(MAIN_SPREADSHEET_ID);
const FORM_SPREADSHEET = new Spreadsheet(FORM_SPREADSHEET_ID);

const COMPONENT_CONTAINER = new ComponentContainer();

const ELEMENTS = [];
const CHECKBOXES = [];

var student;
var drive;

var buttonSignIn;
var buttonSignOut;

window.onload = () => {
	setTimeout(() => {
		init();
		run();
	}, 250);
};

function init() {
	SCRIPT.src = 'https://apis.google.com/js/api.js';
	SCRIPT.onload = () => {
		handleClientLoad();
	};
	SCRIPT.defer = 'defer';
}

function run() {
	var allElements = Array.from(document.getElementsByTagName('*'));
	var index = 0;
	var assessmentIndex = 0;

	allElements.forEach(e => {
		if (e.tagName != 'SCRIPT') {
			for (var node = e.firstChild; node; node = node.nextSibling) {
				if (node.nodeType == 3) {
					if (node.data.includes(ASSIGNMENT_ID)) {
						COMPONENT_CONTAINER.add(new Assignment(index, node));

						index++;
					}

					if (node.data.includes(LOCKED_ASSIGNMENT_ID)) {
						COMPONENT_CONTAINER.add(new LockedAssignment(index, node));

						index++;
					}

					if (node.data.includes(ASSESSMENT_ID)) {
						COMPONENT_CONTAINER.add(new Assessment(index, node, assessmentIndex));

						index++;
						assessmentIndex++;
					}

					if (node.data.includes(CLONE_ID)) {
						COMPONENT_CONTAINER.add(new Clone(node));
					}
				}
			}
		}
	});

	COMPONENT_CONTAINER.disableAll();

	document.body.appendChild(SCRIPT);
}

function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}

function initClient() {
	gapi.client.init({
		apiKey: API_KEY,
		discoveryDocs: DISCOVERY_DOCS,
		clientId: CLIENT_ID,
		scope: SCOPES
	}).then(() => {
		buttonSignIn = document.createElement('li');
		buttonSignIn.className = 'wsite-menu-item-wrap   wsite-nav-6';
		buttonSignIn.style = 'position: relative;';
		buttonSignIn.innerHTML = '<a id="authorize-button" class="wsite-button wsite-button-small wsite-button-normal" onclick="handleSignInClick()"><span class="wsite-button-inner">Sign In</span></a>';

		buttonSignOut = buttonSignIn.cloneNode(true);
		buttonSignOut.className = 'wsite-menu-item-wrap   wsite-nav-7';
		buttonSignOut.innerHTML = '<a id="signout-button" class="wsite-button wsite-button-small wsite-button-normal" onclick="handleSignOutClick()"><span class="wsite-button-inner">Sign Out</span></a>';

		var appendButtons = () => {
			if (document.documentElement.clientWidth <= 1024) {
				document.getElementsByClassName('wsite-menu-default wsite-menu-slide')[0].appendChild(buttonSignIn);
				document.getElementsByClassName('wsite-menu-default wsite-menu-slide')[0].appendChild(buttonSignOut);
			} else {
				document.getElementsByClassName('wsite-menu-default')[0].appendChild(buttonSignIn);
				document.getElementsByClassName('wsite-menu-default')[0].appendChild(buttonSignOut);
			}
		};

		appendButtons();

		window.onresize = appendButtons;

		updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
	});
}

function updateSignInStatus(isSignedIn) {
	if (isSignedIn) {
		var rawName = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName();
		var rawEmail = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail();

		student = new Student(rawName, rawEmail);

		COMPONENT_CONTAINER.onSignIn();

		student.getData().then(data => {
			/* Drive.Files.get(MAIN_SPREADSHEET_ID, 'ownedByMe').then(file => {
				if (!file.ownedByMe) {
					Drive.Files.delete(MAIN_SPREADSHEET_ID);
				}
			}); */

			if (data != null) {
				var tasks = COMPONENT_CONTAINER.getByType('Task');
				
				data.forEach((value, i) => {
					if (i < tasks.length && value == '5') {
						tasks[i].setCompleted(true);
					}
				});
			} else {
				var period = -1;

				do {
					period = prompt(PROMPT_PERIOD);

					if (period === null) {
						gapi.auth2.getAuthInstance().signOut();

						return;
					}
				} while (!period == 'admin' && (!Number.isInteger(period = Number(period)) || (period < 1 || period > 7)));

				student.period = period;

				MAIN_SPREADSHEET.appendValues(SHEET, [[student.period, student.name]]).then(() => {
					MAIN_SPREADSHEET.sort();
				});
			}

			COMPONENT_CONTAINER.update();
		});

		buttonSignIn.style.display = 'none';
		buttonSignOut.style.display = '';
	} else {
		COMPONENT_CONTAINER.disableAll();

		buttonSignOut.style.display = 'none';
		buttonSignIn.style.display = '';
	}
}

function handleSignInClick(event) {
	gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
	gapi.auth2.getAuthInstance().signOut();
}
