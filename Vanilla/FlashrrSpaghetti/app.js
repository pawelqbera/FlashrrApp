var cards = [],
	createCardBtn = document.getElementById("createCardBtn"),
	pageWrapper = document.getElementById("pageWrapper"),
	cardCounter = document.getElementById("cardCounter");

createCardBtn.addEventListener('click', function(event){
	openCardForm();
});

function openCardForm() {
	if (document.getElementById('createCardSection')) {
		return false;
	}
	var html = '';
	html += '  <form id="createCardForm">';
	html += '  	<div>';
	html += '    <input type="text" id="cardTitle" placeholder="Card title" required>';
	html += '  	</div>';
	html += '  	<div>';		
	html += '    <textarea id="cardText" placeholder="Card Text" required></textarea>';
	html += '  	</div>';
	html += '  	<div>';		
	html += '    <input type="file" id="cardAttachment">';
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

	var cancelCardCreate = document.getElementById("cancelCardCreate");
	
	cancelCardCreate.addEventListener('click', function(event){
		closeCardForm();
	});

	createCardForm.addEventListener('submit', function(event){
		console.log('submitting');
	});
}

function closeCardForm() {
	var createCardForm = document.getElementById("createCardForm").parentNode;
	createCardForm.parentNode.removeChild(createCardForm); 
}

function countCards() {
	var count = document.createTextNode(cards.length);
	cardCounter.appendChild(count);
}

// Initialization

countCards();