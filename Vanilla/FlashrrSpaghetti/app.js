var gridView = JSON.parse(localStorage.getItem("gridView")) || true,
	topics = JSON.parse(localStorage.getItem("topics")) || [],
	cards = JSON.parse(localStorage.getItem("Cards")) || [],
	userName = JSON.parse(localStorage.getItem("userName")) || 'Guest';

var createCardBtn = document.getElementById("createCardBtn"),
	pageWrapper = document.getElementById("pageWrapper"),
	cardCounter = document.getElementById("cardCounter"),
	cardsWrapper = document.getElementById("cardsWrapper"),
	searchCards = document.getElementById("searchCards"),
	listViewBtn = document.getElementById("listViewBtn"),
	gridViewBtn = document.getElementById("gridViewBtn"),
	topicSelect = document.getElementById("topicSelect"),
	hiUserName = document.getElementById("hiUserName");

createCardBtn.addEventListener('click', openCardForm );
document.addEventListener('click', handleCardEvents, true);
searchCards.addEventListener('keyup', searchCard );
gridViewBtn.addEventListener('click', toggleView);
listViewBtn.addEventListener('click', toggleView);
hiUserName.addEventListener('click', openUserNameForm );
topicSelect.addEventListener('change', selectCardsByTopic);

function openUserNameForm() {
	if (document.getElementById('userNameSection')) {
		return false;
	}

	var userNameValue = JSON.parse(localStorage.getItem("userName")) || '';

	var html = '';
		html += '	<form id="userNameForm">';
		html += '		<span id="closeBtn" class="close-btn">X</span>';
		html += '		<div>';
		html += '			<input type="text" id="formUserName" name="formUuserName" value="' + userNameValue + '" placeholder="enter your name">';
		html += '		</div>';
		html += '		<div>';
		html += '			<button>Change Name</button>';
		html += '			<a id="cancelUserNameEdit">Cancel</a>';
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
	
	closeBtn.addEventListener('click', function(event) {
		closeUserNameForm();
	});

	userNameForm.addEventListener('submit', function(event) {
		event.preventDefault();
		localStorage.setItem("userName", JSON.stringify(formUserName.value));
		userName = JSON.parse(localStorage.getItem("userName")) || 'Guest';
		closeUserNameForm();
		greetUser();
	});
}

function greetUser() {
	hiUserName.innerHTML = userName;
}

function getTopics() {
	var topicOptions = '';
	for (var i = 0; i < topics.length; i++) {
		topicOptions += '<option value="' + i + '">' + topics[i] + '</option>';
	}
	var html = '';
		html += '	<option value="-1" selected="selected">select topic</option>';
		html += topicOptions;
		html += '	<option value="addNewTopic">ADD NEW TOPIC</option>';
	topicSelect.innerHTML = html;
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
		html += '		<span id="closeBtn" class="close-btn">X</span>';
		html += '		<div>';
		html += '			<input type="text" id="topicName" name="topicName" placeholder="enter new topic" required>';
		html += '		</div>';
		html += '		<div id="topicValidationBox"></div>';		
		html += '		<div>';
		html += '			<button>Add Topic</button>';
		html += '			<a id="cancelTopicEdit">Cancel</a>';
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
		for(var i=0; i < topics.length;i++) {
			if(newTopic.indexOf(topics[i]) !== -1) {
				topicValidationBox.innerHTML = '<p class="validation-message">Specified topic already exists!</p>';
				newTopicForm.reset();
				return false;
			}
		}
		topics.push(newTopic);
		localStorage.setItem("topics", JSON.stringify(topics));
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

function handleCardEvents(event) {
    var element = event.target,
        parentId = element.parentNode.id ? element.parentNode.id.slice(-5) : '',
        existingCards = JSON.parse(localStorage.getItem("Cards")),
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
	} else if (hasClass(element, 'fog-blanket')) {
		if (document.getElementById('createCardSection')) {
			closeCardForm();
		} else if (document.getElementById('viewCardSection')) {
			closeCardView();
		} else if (document.getElementById('userNameSection')) {		
			closeUserNameForm();
		} else if (document.getElementById('topicSection')) {		
			closeTopicForm();
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

	var html = '';
		html += '	<div id="viewCardForm">';
		html += '		<span id="closeBtn" class="close-btn">X</span>';
		html += '		<div>';
		html += '			<h3>' + detailedCard.title + '</h3>';
		html += '			<p class="topic">in: ' + detailedCard.topic + ' by ' + detailedCard.author + '</p>';
		html += '		</div>';
		html += '		<div>';		
		html += '			<p class="card-text">' + detailedCard.text + '</p>';
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
	
	closeBtn.addEventListener('click', function(event) {
		closeCardView();
	});
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
		cardTopics = '';
	
	var html = '';
		html += '	<form id="createCardForm">';
		html += '		<span id="closeBtn" class="close-btn">X</span>';		
		html += '		<div id="cardTopicWrapper">';
		html += '			<label for="cardTopic">Select Topic</label>';
		html += '			<select id="cardTopic" required>' + cardTopics + '</select>';
		html += '		</div>';
		html += '		<div id="createTopicValidationBox"></div>';
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
		html += '			<a id="cancelCardCreate">Cancel</a>';
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

	var cancelCardCreate = document.getElementById("cancelCardCreate"),
		cardAttachment = document.getElementById("cardAttachment"),
		cardTopic = document.getElementById("cardTopic"),
		addTopicLink = document.getElementById("addTopicLink"),
		cardTopicWrapper = document.getElementById("cardTopicWrapper"),
		flashcardCheck = document.getElementById("flashcardCheck");

	if(editableCard.isFlashcard) {
		flashcardCheck.checked = true;
	} else {
		flashcardCheck.checked = false;
	}
	
	getCardFormTopics();

	cancelCardCreate.addEventListener('click', function(event) {
		closeCardForm();
	});

	createCardForm.addEventListener('submit', function(event) {
		event.preventDefault();
		createCard(updatedCardId, attachments);
	});

	cardAttachment.addEventListener('change', function(event) {
		getAttachments(event, attachments);
	});

	closeBtn.addEventListener('click', function(event) {
		closeCardForm();
	});

	createAddTopicLink();

	function createAddTopicLink() {
		var addTopicLink = document.createElement('a');
		addTopicLink.id = "addTopicLink";
		addTopicLink.className = "add-topic-link";
		var addTopicLinkLabel = document.createTextNode("+ Add new topic");
		addTopicLink.appendChild(addTopicLinkLabel);
		cardTopicWrapper.appendChild(addTopicLink);

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

		for(var i=0; i < topics.length;i++) {
			if(newTopic.indexOf(topics[i]) !== -1) {
				createTopicValidationBox.innerHTML = '<p class="validation-message">Specified topic already exists!</p>';
				return false;
			}
		}
		topics.push(newTopic);
		localStorage.setItem("topics", JSON.stringify(topics));
		getTopics();
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
		for (var i = 0; i < topics.length; i++) {
			cardTopics += '<option>' + topics[i] + '</option>';
		}
		cardTopic.innerHTML = cardTopics;		
	}

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
	cardCounter.innerHTML = '';
	var existingCards = JSON.parse(localStorage.getItem("Cards")) || [],
		count = document.createTextNode(existingCards.length);
	cardCounter.appendChild(count);
	count.nodeValue = existingCards.length;
}

function createCard(updatedCardId, attachments) {
	
	console.log('attachments ' + attachments.length);

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
	    existingCards = JSON.parse(localStorage.getItem("Cards"));
    
    if(existingCards === null) {
    	existingCards = [];
    }
    // jeżeli jest editMode czyli updatedCardId
	// znajdź index i czyli który element existingCards posiada id = updatedCardId
	// ten element ma się równać - card
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

	localStorage.setItem("Cards", JSON.stringify(existingCards));

	closeCardForm();
	displayCards();
	countCards();
}

function makeid()
{
    var text = "",
    	possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function displayCards() {
	var existingCards = JSON.parse(localStorage.getItem("Cards")) || cards;
	cardsWrapper.innerHTML = '';
	existingCards.forEach(buildCardMiniature);
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

// Initialization
displayCards();
countCards();
getView();
getTopics();
greetUser();

/* Utils */

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}