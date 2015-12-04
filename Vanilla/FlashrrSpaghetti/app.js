var tempTopics = JSON.parse(localStorage.getItem("tempTopics")) || [],
	gridView = JSON.parse(localStorage.getItem("gridView")) || true,
	defaultCollection = {
		id: 'xxxxx',
		name: 'default_collection',
		description: 'initial collection to start off',
		topics: [],
		cards: []
	},
	collections = JSON.parse(localStorage.getItem("Collections")) || [defaultCollection],
	userName = JSON.parse(localStorage.getItem("userName")) || 'Guest',
	selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || collections[0],
	cardsPerPage = 12;

var createCardBtn = document.getElementById("createCardBtn"),
	pageWrapper = document.getElementById("pageWrapper"),
	cardCounter = document.getElementById("cardCounter"),
	cardsWrapper = document.getElementById("cardsWrapper"),
	searchCards = document.getElementById("searchCards"),
	listViewBtn = document.getElementById("listViewBtn"),
	gridViewBtn = document.getElementById("gridViewBtn"),
	topicSelect = document.getElementById("topicSelect"),
	hiUserName = document.getElementById("hiUserName"),
	collectionSelect = document.getElementById("collectionSelect"),
	pseudoFooter = document.getElementById("pseudoFooter");

createCardBtn.addEventListener('click', openCardForm );
document.addEventListener('click', handleCardEvents, true);
searchCards.addEventListener('keyup', searchCard );
gridViewBtn.addEventListener('click', toggleView);
listViewBtn.addEventListener('click', toggleView);
hiUserName.addEventListener('click', openUserNameForm );
topicSelect.addEventListener('change', selectCardsByTopic);
collectionSelect.addEventListener('change', selectCollection);

/**
*  Event Delegator
*/

function handleCardEvents(event) {
    var element = event.target,
        parentId = element.parentNode.id ? element.parentNode.id.slice(-5) : '',
        existingCards = selectedCollection.cards,
        i = null,
        obj = null;

    if(hasClass(element, 'remove-card')) {
		if (document.getElementById('viewCardSection')) {
			closeCardView();
		}
		for(i = 0; i < existingCards.length; i++) {
			obj = existingCards[i];
			if(parentId.indexOf(obj.id) !== -1) {
				existingCards.splice(i, 1);
				break;
			}
		}
		localStorage.setItem("Cards", JSON.stringify(existingCards));
		displayCards();
		countCards();
    } else if (hasClass(element, 'edit-card')) {
		if (document.getElementById('viewCardSection')) {
			closeCardView();
		}
		var editableCard = '';
		for(i = 0; i < existingCards.length; i++) {
			obj = existingCards[i];
			if(parentId.indexOf(obj.id) !== -1) {
				editableCard = existingCards[i];
				break;
			}
		}
		openCardForm(event, editableCard);
    } else if (hasClass(element, 'edit-collection')) {
		if (document.getElementById('viewCollectionSection')) {
			closeCollectionView();
		}
		var editableCollection = '';
		for(i = 0; i < existingCollections.length; i++) {
			obj = existingCollections[i];
			if(parentId.indexOf(obj.id) !== -1) {
				editableCollection = existingCollections[i];
				break;
			}
		}
		openCollectionForm(event, editableCollection);
	} else if (hasClass(element, 'card-thumb')) {
		var viewImg = window.open("", "Image Preview", "height=500,width=500");
		viewImg.document.write('<img src="' + element.src + '" />');
	} else if (hasClass(element, 'data-details')) {
		var detailedCard = '';
		for(i = 0; i < existingCards.length; i++) {
			obj = existingCards[i];
			if(parentId.indexOf(obj.id) !== -1) {
				detailedCard = existingCards[i];
				break;
			}
		}
		viewCard(event, detailedCard);
	} else if ( (hasClass(element, 'fog-blanket')) ||
				(hasClass(element, 'cancel-form')) ||
				(hasClass(element, 'close-btn')) ) {
		if (document.getElementById('createCardSection')) {
			closeCardForm();
		} else if (document.getElementById('viewCardSection')) {
			closeCardView();
		} else if (document.getElementById('userNameSection')) {
			closeUserNameForm();
		} else if (document.getElementById('topicSection')) {
			closeTopicForm();
		} else if (document.getElementById('collectionSection')) {
			closeCollectionForm();
		}
	}
}

/**
*  Collection Form
*/

function openCollectionForm(event, editableCollection) {
	if (document.getElementById('collectionSection')) {
		return false;
	}

	var updatedCollectionId = editableCollection ? editableCollection.id : null;

	var html = '';
		html += '	<form id="collectionForm">';
		html += '		<h2>New Collection</h2>';
		html += '		<span id="closeBtn" class="close-btn">X</span>';
		html += '		<div>';
		html += '			<input type="text" id="collectionName" name="collectionName" placeholder="name">';
		html += '		</div>';
		html += '		<div>';
		html += '			<input type="text" id="collectionDescription" name="collectionDescription" placeholder="description">';
		html += '		</div>';
		html += '		<div id="cardTopicWrapper"></div>';
		html += '		<div>';
		html += '			<button>Add New Collection</button>';
		html += '			<a class="cancel-form">Cancel</a>';
		html += '		</div>';
		html += '	</form>';

	var collectionForm = document.createElement('SECTION');
	collectionForm.id = "collectionSection";
	collectionForm.className = "collection-section";
	collectionForm.innerHTML = html.trim();
	pageWrapper.appendChild(collectionForm);

	var fogBlanket = document.createElement('div');
	fogBlanket.className = "fog-blanket";
	fogBlanket.id = "fogBlanket";
	pageWrapper.appendChild(fogBlanket);

	collectionForm.addEventListener('submit', function(event) {
		event.preventDefault();
		createCollection(updatedCollectionId);
	});

	createTopicAdder("cardTopicWrapper", true);
}

function createCollection(updatedCollectionId) {
	var date = new Date(),
		form = document.forms[0],
		collection = {
			id: updatedCollectionId || makeid(),
			name: collectionName.value,
			description: collectionDescription.value,
			author: userName,
			date: date.getTime(),
			topics: tempTopics,
			cards: []
		},
		existingCollections = JSON.parse(localStorage.getItem("Collections"));

	if(existingCollections === null) {
		existingCollections = [];
	}
	if (updatedCollectionId) {
		for(var i = 0; i < existingCollections.length; i++) {
			var obj = existingCollections[i];
			if(updatedCollectionId.indexOf(obj.id) !== -1) {
				existingCollections[i] = collection;
				break;
			}
		}
	}
	else {
		existingCollections.push(collection);
	}
	collections = existingCollections;
	localStorage.setItem("Collections", JSON.stringify(existingCollections));
	getCollections();
	closeCollectionForm();
}

/**
*  UserName Form
*/

function openUserNameForm() {
	if (document.getElementById('userNameSection')) {
		return false;
	}

	var userNameValue = JSON.parse(localStorage.getItem("userName")) || '';

	var html = '';
		html += '	<form id="userNameForm">';
		html += '		<h2>Please enter your name</h2>';
		html += '		<span id="closeBtn" class="close-btn">X</span>';
		html += '		<div>';
		html += '			<input type="text" id="formUserName" name="formUserName" value="' + userNameValue + '" placeholder="enter your name">';
		html += '		</div>';
		html += '		<div>';
		html += '			<button>Change Name</button>';
		html += '			<a class="cancel-form">Cancel</a>';
		html += '		</div>';
		html += '	</form>';

	var userNameForm = document.createElement('SECTION');
	userNameForm.id = "userNameSection";
	userNameForm.className = "user-name-section";
	userNameForm.innerHTML = html.trim();
	pageWrapper.appendChild(userNameForm);

	var fogBlanket = document.createElement('div');
	fogBlanket.className = "fog-blanket";
	fogBlanket.id = "fogBlanket";
	pageWrapper.appendChild(fogBlanket);

	userNameForm.addEventListener('submit', function(event) {
		event.preventDefault();
		localStorage.setItem("userName", JSON.stringify(formUserName.value));
		userName = JSON.parse(localStorage.getItem("userName")) || 'Guest';
		closeUserNameForm();
		greetUser();
	});
}

function getCollections() {
	var collectionOptions = '';
	for (var i = 0; i < collections.length; i++) {
		var isSelected = (selectedCollection.name.indexOf(collections[i].name) !== -1) ? 'selected="selected"' : '';
		collectionOptions += '<option value="' + i + '"'+ isSelected +'>' + collections[i].name + '</option>';
	}
	var html = '';
		html += '	<option value="-1">Collections</option>';
		html += collectionOptions;
		html += '	<option value="addNewCollection">ADD NEW COLLECTION</option>';
	collectionSelect.innerHTML = html;
}

function selectCollection(event) {
	var element = event.target;
	if (element.value === '-1') {
		return false;
	} else if (element.value === 'addNewCollection') {
		openCollectionForm();
	} else {
		//displayCards();
		selectedCollection = collections[element.value];
		localStorage.setItem("selectedCollection", JSON.stringify(selectedCollection));
		displayCards(selectedCollection);
		countCards();
		getTopics();
	}
}

function greetUser() {
	hiUserName.innerHTML = userName;
}

function getTopics() {
	var topicOptions = '';
	for (var i = 0; i < selectedCollection.topics.length; i++) {
		topicOptions += '<option value="' + i + '">' + selectedCollection.topics[i] + '</option>';
	}
	var html = '';
		html += '	<option value="-1" selected="selected">select topic</option>';
		html += topicOptions;
		html += '	<option value="addNewTopic">ADD NEW TOPIC</option>';
	topicSelect.innerHTML = html;
}

function getTempTopics() {
	tempTopics = JSON.parse(localStorage.getItem("tempTopics"));
	var topicOptions = '';
	for (var i = 0; i < tempTopics.length; i++) {
		topicOptions += '<option value="' + i + '">' + tempTopics[i] + '</option>';
	}
	var html = '';
		html += '	<option value="-1" selected="selected">select topic</option>';
		html += topicOptions;
		html += '	<option value="addNewTopic">ADD NEW TOPIC</option>';
	cardTopic.innerHTML = html;
}

function selectCardsByTopic(event) {
	var element = event.target;
	if (element.value === '-1') {
		displayCards();
	} else if (element.value === 'addNewTopic') {
		openTopicForm();
	} else {
		var existingCards = JSON.parse(localStorage.getItem("Cards")) || [];
		displayCards();
		for(var i = 0; i < existingCards.length; i++) {
			var obj = existingCards[i];
			if(obj.topic.indexOf(topics[element.value]) === -1) {
				var card = document.getElementById("cardMiniature" + obj.id);
				card.parentNode.removeChild(card);
			}
		}
	}
}

function openTopicForm() {
	if (document.getElementById('topicSection')) {
		return false;
	}

	var html = '';
		html += '	<form id="topicForm">';
		html += '		<h2>New Topic</h2>';
		html += '		<span id="closeBtn" class="close-btn">X</span>';
		html += '		<div>';
		html += '			<input type="text" id="topicName" name="topicName" placeholder="enter new topic" required>';
		html += '		</div>';
		html += '		<div id="topicValidationBox"></div>';
		html += '		<div>';
		html += '			<button>Add Topic</button>';
		html += '			<a class="cancel-form">Cancel</a>';
		html += '		</div>';
		html += '	</form>';

	var topicForm = document.createElement('SECTION');
	topicForm.id = "topicSection";
	topicForm.className = "topic-section";
	topicForm.innerHTML = html.trim();
	pageWrapper.appendChild(topicForm);

	var fogBlanket = document.createElement('div');
	fogBlanket.className = "fog-blanket";
	fogBlanket.id = "fogBlanket";
	pageWrapper.appendChild(fogBlanket);

	closeBtn.addEventListener('click', function(event) {
		closeTopicForm();
	});

	topicForm.addEventListener('submit', function(event) {
		event.preventDefault();
		var topicValidationBox = document.getElementById('topicValidationBox'),
			newTopicForm = document.getElementById('topicForm'),
			newTopic = topicName.value;
		for(var i=0; i < selectedCollection.topics.length;i++) {
			if(newTopic.indexOf(selectedCollection.topics[i]) !== -1) {
				topicValidationBox.innerHTML = '<p class="validation-message">Specified topic already exists!</p>';
				newTopicForm.reset();
				return false;
			}
		}
		selectedCollection.topics.push(newTopic);
		localStorage.setItem("Collections", JSON.stringify(collections));
		closeTopicForm();
		getTopics();
	});
}

function closeTopicForm() {
	var topicForm = document.getElementById("topicForm").parentNode;
	topicForm.parentNode.removeChild(topicForm);
	topicSelect.getElementsByTagName('option')[0].selected = 'selected';
	closeFogBlanket();
}


function toggleView(event) {
	var element = event.target;
	if (element.id === "gridViewBtn" && !gridView) {
		switchGridView();
	} else if (element.id === "listViewBtn" && gridView) {
		switchListView();
	}
}

function getView() {
	if(gridView) {
		switchGridView();
	} else {
		switchListView();
	}
}

function switchGridView() {
	gridView = true;
	cardsWrapper.className = 'grid-view';
	localStorage.setItem("gridView", JSON.stringify(true));
}

function switchListView() {
	gridView = false;
	cardsWrapper.className = 'list-view';
	localStorage.setItem("gridView", JSON.stringify(false));
}

function searchCard(event) {
	var searchValue = searchCards.value,
		existingCards = JSON.parse(localStorage.getItem("Cards"));

	displayCards();

	for(var i = 0; i < existingCards.length; i++) {
		var obj = existingCards[i];
		if(obj.title.indexOf(searchValue) === -1) {
			var card = document.getElementById("cardMiniature" + obj.id);
			card.parentNode.removeChild(card);
		}
	}
}

function viewCard(event, detailedCard) {
	if (document.getElementById('viewCardSection')) {
		return false;
	}

	var thumbs = '';

	for (var i = 0; i < detailedCard.attachments.length; i++) {
		thumbs += '<img src="' + detailedCard.attachments[i] + '" class="view-card-thumb" />';
	}

	var urlifiedText = urlify(detailedCard.text);

	var html = '';
		html += '	<div id="viewCardForm">';
		html += '		<span id="closeBtn" class="close-btn">X</span>';
		html += '		<div>';
		html += '			<h3>' + detailedCard.title + '</h3>';
		html += '			<p class="topic">in: ' + detailedCard.topic + ' by ' + detailedCard.author + '</p>';
		html += '		</div>';
		html += '		<div>';
		html += '			<p class="card-text">' + urlifiedText + '</p>';
		html += '		</div>';
		html += '		<div class="view-thumb-list">' + thumbs + '</div>';
		html += '		<div class="view-card-actions" id="actions' + detailedCard.id + '">';
		html += '			<a class="edit-card">Edit</a>';
		html += '			<a class="remove-card">Remove</a>';
		html += '		</div>';
		html += '	</div>';

	var tempCardForm = document.createElement('SECTION');
	tempCardForm.id = "viewCardSection";
	tempCardForm.className = "view-card-section";
	tempCardForm.innerHTML = html.trim();
	pageWrapper.appendChild(tempCardForm);

	var fogBlanket = document.createElement('div');
	fogBlanket.className = "fog-blanket";
	fogBlanket.id = "fogBlanket";
	pageWrapper.appendChild(fogBlanket);
}

function urlify(text) {
	var regexp =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	return text.replace(regexp, '<a href="$1" target="_blank">$1</a>');
}

function closeCardView() {
	var viewCardForm = document.getElementById("viewCardForm").parentNode;
	viewCardForm.parentNode.removeChild(viewCardForm);
	closeFogBlanket();
}

function closeUserNameForm() {
	var userNameForm = document.getElementById("userNameForm").parentNode;
	userNameForm.parentNode.removeChild(userNameForm);
	closeFogBlanket();
}

function closeCollectionForm() {
	var collectionForm = document.getElementById("collectionForm").parentNode;
	collectionForm.parentNode.removeChild(collectionForm);
	closeFogBlanket();
}

function closeFogBlanket() {
	var fogBlanket = document.getElementById("fogBlanket");
	fogBlanket.parentNode.removeChild(fogBlanket);
}

function openCardForm(event, editableCard) {
	if (document.getElementById('createCardSection')) {
		return false;
	}

	var editMode = editableCard ? true : false,
		cardTitle = editableCard ? editableCard.title : "",
		cardText = editableCard ? editableCard.text : "",
		cardFormSubmitLabel = editableCard ? "Update Card" : "Create Card",
		updatedCardId = editableCard ? editableCard.id : null,
		attachments = [],
		isFlashcard = editableCard ? editableCard.isFlashcard : false;

	var html = '';
		html += '	<form id="createCardForm">';
		html += '		<h2>New Card</h2>';
		html += '		<span id="closeBtn" class="close-btn">X</span>';
		html += '		<div id="cardTopicWrapper"></div>';
		html += '		<div>';
		html += '			<input type="text" id="cardTitle" name="cardTitle" value="' + cardTitle + '" placeholder="Card title" required>';
		html += '		</div>';
		html += '		<div>';
		html += '			<textarea id="cardText" name="cardText" placeholder="Card Text" required>' + cardText + '</textarea>';
		html += '		</div>';
		html += '		<div>';
		html += '			<input type="file" id="cardAttachment" class="card-attachment" multiple>';
		html += '		</div>';
		html += '		<div id="thumbList" class="thumb-list"></div>';
		html += '		<div>';
		html += '			<input type="checkbox" id="flashcardCheck">';
		html += '			<label for="flashcardCheck">Flashcard</label>';
		html += '		</div>';
		html += '		<div>';
		html += '			<button>' + cardFormSubmitLabel + '</button>';
		html += '			<a class="cancel-form">Cancel</a>';
		html += '		</div>';
		html += '	</form>';

	var tempCardForm = document.createElement('SECTION');
	tempCardForm.id = "createCardSection";
	tempCardForm.className = "create-card-section";
	tempCardForm.innerHTML = html.trim();
	pageWrapper.appendChild(tempCardForm);

	var fogBlanket = document.createElement('div');
	fogBlanket.className = "fog-blanket";
	fogBlanket.id = "fogBlanket";
	pageWrapper.appendChild(fogBlanket);

	var cardAttachment = document.getElementById("cardAttachment"),
		flashcardCheck = document.getElementById("flashcardCheck");

	if(isFlashcard) {
		flashcardCheck.checked = true;
	} else {
		flashcardCheck.checked = false;
	}

	createCardForm.addEventListener('submit', function(event) {
		event.preventDefault();
		createCard(updatedCardId, attachments);
	});

	cardAttachment.addEventListener('change', function(event) {
		getAttachments(event, attachments);
	});

	createTopicAdder("cardTopicWrapper");
}

/**
*  Topic Adder Component
*/

function createTopicAdder(parentId, isMultiple) {

	var parent = document.getElementById(parentId),
		cardTopics = '';

	var html = '';
		html += '	<label for="cardTopic">Select Topic</label>';
		html += '	<select id="cardTopic" required>' + cardTopics + '</select>';
		html += '	<div id="createTopicValidationBox"></div>';

	parent.innerHTML = html;

	var cardTopic = document.getElementById("cardTopic");
	if(isMultiple) {
		cardTopic.multiple = "multiple";
	}

	function createAddTopicLink() {
		var addTopicLink = document.createElement('a');
		addTopicLink.id = "addTopicLink";
		addTopicLink.className = "add-topic-link";
		var addTopicLinkLabel = document.createTextNode("+ Add new topic");
		addTopicLink.appendChild(addTopicLinkLabel);
		parent.appendChild(addTopicLink);

		addTopicLink.addEventListener('click', function(event) {
			createAddTopicInput(event);
			removeAddTopicLink();
		});
	}

	function createAddTopicInput(event) {
		var element = event.target;
		var createTopicInput = document.createElement('input');
		createTopicInput.id = "createTopicInput";
		createTopicInput.className = "create-topic-input";
		createTopicInput.placeholder = "enter topic name";
		createTopicInput.required = "required";
		element.parentNode.appendChild(createTopicInput);
		createTopicInput.focus();
		element.parentNode.removeChild(element);

		createTopicInput.addEventListener('blur', function(event) {
			createNewTopic(event);
			createAddTopicLink();
			removeAddTopicInput();
		});
	}

	function createNewTopic(event) {
		var createTopicValidationBox = document.getElementById('createTopicValidationBox'),
			newTopic = event.target.value;

		for(var i=0; i < tempTopics.length;i++) {
			if(newTopic.indexOf(tempTopics[i]) !== -1) {
				createTopicValidationBox.innerHTML = '<p class="validation-message">Specified topic already exists!</p>';
				return false;
			}
		}
		tempTopics.push(newTopic);
		localStorage.setItem("tempTopics", JSON.stringify(tempTopics));
		getTempTopics();
		getCardFormTopics();
	}

	function removeAddTopicLink() {
		var addTopicLink = document.getElementById("addTopicLink");
		addTopicLink.parentNode.removeChild(addTopicLink);
	}

	function removeAddTopicInput() {
		createTopicInput.parentNode.removeChild(createTopicInput);
	}

	function getCardFormTopics() {
		for (var i = 0; i < tempTopics.length; i++) {
			cardTopics += '<option>' + tempTopics[i] + '</option>';
		}
		cardTopic.innerHTML = cardTopics;
	}

	createAddTopicLink();

	var addTopicLink = document.getElementById("addTopicLink");

	getCardFormTopics();
}




function getAttachments(event, attachments) {
	var files = event.target.files;

	for (var i = 0, f; f = files[i]; i++) {

		if (!f.type.match('image.*')) {
			continue;
		}

		var reader = new FileReader();

		// Closure to capture the file information.
		reader.onload = (function(theFile) {
			return function(e) {
				// Render thumbnail.
				var span = document.createElement('span');
				span.innerHTML = ['<img class="thumb" src="', e.target.result,
				'" title="', escape(theFile.name), '"/>'].join('');
				var thumbList = document.getElementById("thumbList");
				thumbList.insertBefore(span, null);
				//localStorage.setItem('img', e.target.result);
				attachments.push(e.target.result);
			};
		})(f);
		// Read in the image file as a data URL.
		reader.readAsDataURL(f);
	}

	return attachments;
}

function closeCardForm() {
	var createCardForm = document.getElementById("createCardForm").parentNode;
	createCardForm.parentNode.removeChild(createCardForm);
	closeFogBlanket();
}

function countCards() {
	var selectedCollectionIndex = collectionSelect.options[collectionSelect.selectedIndex].value,
		index = selectedCollectionIndex !== "-1" ? selectedCollectionIndex : 0,
		existingCards = collections[index].cards,
		count = document.createTextNode(existingCards.length);
	cardCounter.innerHTML = '';
	cardCounter.appendChild(count);
	count.nodeValue = existingCards.length;
}

function createCard(updatedCardId, attachments) {
	var date = new Date(),
		form = document.forms[0],
		card = {
			id: updatedCardId || makeid(),
			topic: cardTopic.value,
			title: cardTitle.value,
			text: cardText.value,
			attachments: attachments,
			author: userName,
			date: date.getTime(),
			isFlashcard: flashcardCheck.checked
		},
	existingCards = selectedCollection.cards;

    if(existingCards === null) {
    	existingCards = [];
    }
	if (updatedCardId) {
		for(var i = 0; i < existingCards.length; i++) {
			var obj = existingCards[i];
			if(updatedCardId.indexOf(obj.id) !== -1) {
				existingCards[i] = card;
				break;
			}
		}
	}
	else {
		existingCards.push(card);
	}
	localStorage.setItem("Collections", JSON.stringify(collections));
	displayCards();
	countCards();
	closeCardForm();
}

function makeid()
{
    var text = "",
    	possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function displayCards(page) {

	var pageIndex = page || 1,
		i = 0; // wybrana strona do pokazania: 1 lub 2

	selectedCards = selectedCollection.cards;
	cardsWrapper.innerHTML = '';

	var cardsCount = selectedCards.length; // 19 - number of cards
	var lastPageCardsCount = cardsCount % cardsPerPage; // 7 - liczba kart na ostatniej stronie
	var pagesCount = Math.ceil(selectedCards.length / cardsPerPage); // 2 - liczba podstron

	// jezeli pagesCount === 1 to 
			//rob normalna petle [bedzie tylko jedna podstrona, nie ma paginacji]

	// jezeli pagesCount jest > 1 to
			// to jezeli wolana strona czyli pageIndex jest mniejsze od (pagesCount -1) [petla #1 do przedostatniej strony wlacznie]
					//to pokazuj 12 kart: i = 12 * pageIndex; i < 12 * pageIndex + 12; i++ [petla do przedostatniej karty ]

			// jezeli wolana strona jest pagesCount (ostatnia strona)
					// iteracja z ostatniej karty: i = cardsCount - lastPageCardsCount (12) a i < cardsCount;

	if (pagesCount === 1) {
		for (i = 0; i < cardsCount; i++) {
			buildCardMiniature(selectedCards[i]);
		}
	} else if (pageIndex < pagesCount) { // wiem, że będzie 12 kart
		for (i = cardsPerPage * (pageIndex - 1);i < cardsPerPage * (pageIndex - 1) + cardsPerPage;i++) {
			buildCardMiniature(selectedCards[i]);
		}
	} else if (pageIndex == pagesCount) {
		for (i = (cardsCount - lastPageCardsCount);i < cardsCount;i++) {
			console.log(selectedCards[i]);
			buildCardMiniature(selectedCards[i]);
		}		
	}
}

function buildCardMiniature(card) {
	var thumbs = '',
		timeString = '';

	for (var i = 0; i < card.attachments.length; i++) {
		thumbs += '<img src="' + card.attachments[i] + '" class="card-thumb" />';
	}

	var now = new Date(),
		relativeDate = now.getTime() - card.date;

	if(relativeDate < 60000) {
		timeString = 'just';
	} else if (relativeDate < 3600000) {
		timeString = (Math.floor(relativeDate / 60000)) + ' minutes ago';
	} else if (relativeDate < 86400000) {
		timeString = (Math.floor(relativeDate / 3600000)) + ' hours ago';
	} else if (relativeDate > 86400000) {
		timeString = (Math.floor(relativeDate / 86400000)) + ' days ago';
	}

	var flashcardClass = card.isFlashcard ? 'flashcard' : 'note';

	var html = '';
		html += ' <div id="data-container' + card.id + '" class="data-container data-details ' + flashcardClass +'">';
		html += ' 	<h3 class="data-details">' + card.title + '</h3>';
		html += ' 	<p class="topic data-details">' + timeString + ', in: ' + card.topic + ' by ' + card.author + '</p>';
		if(!card.isFlashcard) {
			html += ' 	<p class="data-details">' + card.text + '</p>';
		}
		html += ' 	<div class="thumbs-container data-details">';
		html += ' 		<p>Attachments: ' + card.attachments.length + '</p>';
		html += ' 		<div>' + thumbs + '</div>';
		html += ' 	</div>';
		html += ' </div>';
		html += ' <div class="card-actions" id="actions' + card.id + '">';
		html += ' 	<a class="edit-card">Edit</a>';
		html += ' 	<a class="remove-card">Remove</a>';
		html += ' </div>';

	var tempCardMiniature = document.createElement('DIV');
	tempCardMiniature.id = "cardMiniature" + card.id;
	tempCardMiniature.className = "card-miniature";
	tempCardMiniature.innerHTML = html.trim();
	cardsWrapper.appendChild(tempCardMiniature);
}

function addPagination() {
	if(selectedCards.length <= cardsPerPage) {
		return false;
	}

	console.log('jest więcej niz cardsPerPage kart. buduje paginacje');

	// if each site contains max 12 cards, the number of pages is selectedCards.length / 12 floored

	var pagesCount = Math.ceil(selectedCards.length / cardsPerPage),
		buttons = '';

	console.log("liczba podstron: " + pagesCount);

	for (var i=0; i < pagesCount; i++) {
		buttons += '<li class="pagination-page">' + (i+1) + '</li>';
	}

	var html = '';
		html += '	<ul id="paginationList" class="pagination-list">' + buttons + '</ul>';

	pseudoFooter.innerHTML = html;

	document.addEventListener("click", function(event) {
		var element = event.target;
		if(hasClass(element, "pagination-page")) {
			var page = element.firstChild.nodeValue;
			displayCards(page);
		}
	});

}

// Initialization
getCollections();
displayCards();
countCards();
getView();
getTopics();
greetUser();
addPagination();
/* Utils */

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}