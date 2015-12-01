var cards = JSON.parse(localStorage.getItem("Cards")),
	createCardBtn = document.getElementById("createCardBtn"),
	pageWrapper = document.getElementById("pageWrapper"),
	cardCounter = document.getElementById("cardCounter"),
	cardsWrapper = document.getElementById("cardsWrapper"),
	searchCards = document.getElementById("searchCards"),
	listViewBtn = document.getElementById("listViewBtn"),
	gridViewBtn = document.getElementById("gridViewBtn");

var gridView = JSON.parse(localStorage.getItem("gridView"));

createCardBtn.addEventListener('click', openCardForm );
document.addEventListener('click', handleCardEvents );
searchCards.addEventListener('keyup', searchCard );

gridViewBtn.addEventListener('click', toggleView);
listViewBtn.addEventListener('click', toggleView);

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
        parentId = element.parentNode.id.slice(-5),
        existingCards = JSON.parse(localStorage.getItem("Cards")),
        i = null,
        obj = null; 

    if(hasClass(element, 'remove-card')) {	
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
		var editableCard = '';
		for(i = 0; i < existingCards.length; i++) {
			obj = existingCards[i];
			if(parentId.indexOf(obj.id) !== -1) {
				editableCard = existingCards[i];
				break;
			}
		}
    	openCardForm(event, editableCard);
    }
}

function openCardForm(event, editableCard) {
	if (document.getElementById('createCardSection')) {
		return false;
	}

	var editMode = editableCard ? true : false,
		cardTitle = editableCard ? editableCard.title : "",
		cardText = editableCard ? editableCard.text : "",
		cardFormSubmitLabel = editableCard ? "Update Card" : "Create Card",
		updatedCardId = editableCard ? editableCard.id : null;

	var html = '';
	html += '	<form id="createCardForm">';
	html += '		<div>';
	html += '			<input type="text" id="cardTitle" name="cardTitle" value="' + cardTitle + '" placeholder="Card title" required>';
	html += '		</div>';
	html += '		<div>';		
	html += '			<textarea id="cardText" name="cardText" placeholder="Card Text" required>' + cardText + '</textarea>';
	html += '		</div>';
	html += '		<div>';		
	html += '			<input type="file" id="cardAttachment" multiple>';
	html += '		</div>';
	html += '		<div id="thumbList" class="thumb-list"></div>';
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

	var cancelCardCreate = document.getElementById("cancelCardCreate"),
		cardAttachment = document.getElementById("cardAttachment");
	
	cancelCardCreate.addEventListener('click', function(event){
		closeCardForm();
	});

	createCardForm.addEventListener('submit', function(event){
		event.preventDefault();
		createCard(updatedCardId);
	});
}

function getAttachments(event) {
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
				//console.log('e.target.result ' + e.target.result);				
			};
		})(f);
		// Read in the image file as a data URL.
		reader.readAsDataURL(f);	
	}

	return files;
}

function closeCardForm() {
	var createCardForm = document.getElementById("createCardForm").parentNode;
	createCardForm.parentNode.removeChild(createCardForm); 
}

function countCards() {
	cardCounter.innerHTML = '';
	var existingCards = JSON.parse(localStorage.getItem("Cards")),
		count = document.createTextNode(existingCards.length);
	cardCounter.appendChild(count);
	count.nodeValue = existingCards.length;
}

function createCard(updatedCardId) {
	var form = document.forms[0],
		card = {
			id: updatedCardId || makeid(),
			title: cardTitle.value,
			text: cardText.value
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
	var existingCards = JSON.parse(localStorage.getItem("Cards"));
	cardsWrapper.innerHTML = '';
	existingCards.forEach(buildCardMiniature);
}

function buildCardMiniature(card) {
	var html = '';
		html += ' <h3>' + card.title + '</h3>';
		html += ' <p>' + card.text + '</p>';
		html += ' <a class="remove-card">Remove</a>';
		html += ' <a class="edit-card">Edit</a>';

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

/* Utils */

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}