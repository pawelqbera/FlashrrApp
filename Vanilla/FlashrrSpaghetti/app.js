var cards = JSON.parse(localStorage.getItem("Cards")),
	createCardBtn = document.getElementById("createCardBtn"),
	pageWrapper = document.getElementById("pageWrapper"),
	cardCounter = document.getElementById("cardCounter"),
	cardsWrapper = document.getElementById("cardsWrapper"),
	searchCards = document.getElementById("searchCards");

createCardBtn.addEventListener('click', openCardForm );
document.addEventListener('click', removeCard );
searchCards.addEventListener('keyup', searchCard );


function getAttachments(event) {
	console.log('Attached!');
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

function removeCard(event) {
    var element = event.target;
    if(hasClass(element, 'remove-card')) {
        var parentId = element.parentNode.id.slice(-5),
        	existingCards = JSON.parse(localStorage.getItem("Cards"));
		
		for(var i = 0; i < existingCards.length; i++) {
			var obj = existingCards[i];
			if(parentId.indexOf(obj.id) !== -1) {
				existingCards.splice(i, 1);
				break;
			}
		}
		localStorage.setItem("Cards", JSON.stringify(existingCards));
		displayCards();
		countCards();        
    }
}

function openCardForm() {
	if (document.getElementById('createCardSection')) {
		return false;
	}
	var html = '';
	html += '  <form id="createCardForm">';
	html += '  	<div>';
	html += '    <input type="text" id="cardTitle" name="cardTitle" placeholder="Card title" required>';
	html += '  	</div>';
	html += '  	<div>';		
	html += '    <textarea id="cardText" name="cardText" placeholder="Card Text" required></textarea>';
	html += '  	</div>';
	html += '  	<div>';		
	html += '    <input type="file" id="cardAttachment" multiple>';
	html += '  	</div>';
	html += '  	<div>';		
	html += '    <button>Create Card</button>';
	html += '    <a id="cancelCardCreate">Cancel</a>';
	html += '  	</div>';
	html += '  </form>';

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
		createCard();
	});

	cardAttachment.addEventListener('change', getAttachments);
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

function createCard() {
	var form = document.forms[0],
		card = {
			id: makeid(),
			title: cardTitle.value,
			text: cardText.value
		},
	    existingCards = JSON.parse(localStorage.getItem("Cards"));
    
    if(existingCards === null) {
    	existingCards = [];
    }

	existingCards.push(card);
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

	var tempCardMiniature = document.createElement('DIV');
	tempCardMiniature.id = "cardMiniature" + card.id; 
	tempCardMiniature.className = "card-miniature"; 
	tempCardMiniature.innerHTML = html.trim();
	cardsWrapper.appendChild(tempCardMiniature);
}

// Initialization
displayCards();
countCards();

/* Utils */

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}