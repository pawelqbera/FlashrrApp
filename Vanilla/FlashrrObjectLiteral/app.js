(function() {
	'use strict'

	/*!
	 * Flashrr App v0.5.0
	 * Vanilla, Object Literal Pattern
	 * http://flashrr.com
	 *
	 * Author Paweł Kubera
	 * Released under the MIT license
	 * http://flashrr.com/license
	 *
	 * Date: 2016-03-21
	 */

	var Flashrr = {};

	var pageWrapper = document.getElementById("pageWrapper"),
		header = document.getElementById("header"),
		sectionWrapper = document.getElementById("sectionWrapper"),		
		pseudoFooter = document.getElementById("pseudoFooter");



	var cardCounter = {
		init: function() {
			this.cacheDOM();
			this.bindEvents();
			this.render();
		},
		cacheDOM: function() {
			this.cardCounter = document.getElementById("cardCounter");
		},
		bindEvents: function() {

		},
		render: function() {

		}
	};

	var flashcardsOnly = {
		selectedFlashcardsOnly: JSON.parse(localStorage.getItem("selectedFlashcardsOnly")) || false,
		init: function() {
			this.cacheDOM();
			this.bindEvents();
			this.render();
		},
		cacheDOM: function() {
			this.showFlashcardsOnly = document.getElementById("showFlashcardsOnly");
		},
		bindEvents: function() {
			this.showFlashcardsOnly.addEventListener("click", this.toggleTextCards.bind(this));
		},
		render: function() {

		},

		toggleTextCards: function(e) {
			console.log('event');

		}
	};

	var searchCards = {
		init: function() {
			this.cacheDOM();
			this.bindEvents();
			this.render();
		},
		cacheDOM: function() {
			this.searchCards = document.getElementById("searchCards");
			this.categorySearchSelect = document.getElementById("categorySearchSelect");			
		},
		bindEvents: function() {
			this.searchCards.addEventListener("keyup", this.searchCard.bind(this));
		},
		render: function() {

		},

		searchCard: function(e) {
			console.log('event');

		}		
	};

	var views = {
		viewType: JSON.parse(localStorage.getItem("viewType")) || 'grid-view',
		init: function() {
			this.cacheDOM();
			this.bindEvents();
			this.render();
		},
		cacheDOM: function() {
			this.listViewBtn = document.getElementById("listViewBtn");
			this.gridViewBtn = document.getElementById("gridViewBtn");
			this.detailsViewBtn = document.getElementById("detailsViewBtn");
		},
		bindEvents: function() {
			this.gridViewBtn.addEventListener("click", this.toggleView.bind(this));
			this.listViewBtn.addEventListener("click", this.toggleView.bind(this));
			this.detailsViewBtn.addEventListener("click", this.toggleView.bind(this));
		},
		render: function() {

		},

		toggleView: function(e) {
			console.log('event');

		}
	};

	var profile = {
		userName: JSON.parse(localStorage.getItem("userName")) || "Guest",

		init: function() {
			this.cacheDOM();
			this.bindEvents();
			this.render();
		},
		cacheDOM: function() {
			this.hiUserName = document.getElementById("hiUserName");			
		},
		bindEvents: function() {
			this.hiUserName.addEventListener("click", this.openUserNameForm.bind(this));
		},
		render: function() {

		},

		openUserNameForm: function(e) {
			console.log('event');

		}
	};

	var collections = {
		defaultCollection: {
			id: "xxxxx",
			name: "default_collection",
			description: "initial collection to start off",
			topics: [],
			cards: []
		},
		collections: JSON.parse(localStorage.getItem("Collections")) || [defaultCollection],
		selectedCollection: JSON.parse(localStorage.getItem("selectedCollection")) || collections[0],
		//selectedCards: selectedCollection.cards,

		init: function() {
			this.cacheDOM();
			this.bindEvents();
			this.render();
		},
		cacheDOM: function() {
			this.collectionSelect = document.getElementById("collectionSelect");
		},
		bindEvents: function() {
			this.collectionSelect.addEventListener("change", this.selectCollection.bind(this));
		},
		render: function() {

		},

		selectCollection: function(e) {
			console.log('event');
			
		},

		editCollection: function() {

		},
		addCollection: function() {

		}	
	};
			
	var cards = {
		init: function() {
			this.cacheDOM();
			this.bindEvents();
			this.render();
		},
		cacheDOM: function() {
			this.createCardBtn = document.getElementById("createCardBtn");
			this.cardsWrapper = document.getElementById("cardsWrapper");
		},
		bindEvents: function() {
			this.createCardBtn.addEventListener("click", this.openCardForm.bind(this));
		},
		render: function() {

		},

		openCardForm: function(e) {
			console.log('event');

		}
	};

	var cardsFilter = {
		selectedSorting: JSON.parse(localStorage.getItem("selectedSorting")) || "date",

		init: function() {
			this.cacheDOM();
			this.bindEvents();
			this.render();
		},
		cacheDOM: function() {
			this.cardsFilter = document.getElementById("cardsFilter");
		},
		bindEvents: function() {
			this.cardsFilter.addEventListener("change", this.selectSortingMethod.bind(this));
		},
		render: function() {

		},

		selectSortingMethod: function(e) {
			console.log('event');

		},

		cardMiniature: function() {

		},
		viewCard: function() {

		},
		editCard: function() {

		}
	}

	var topics = {
		selectedTopic: JSON.parse(localStorage.getItem("selectedTopic")) || -1,
		init: function() {
			this.cacheDOM();
			this.bindEvents();
			this.render();
		},
		cacheDOM: function() {
			this.topicSelect = document.getElementById("topicSelect");
		},
		bindEvents: function() {
			this.topicSelect.addEventListener("change", this.selectCardsByTopic.bind(this));
		},

		selectCardsByTopic: function(e) {
			console.log('event');

		},

		render: function() {

		},
		addTopic: function() {

		}
	};

	var pagination = {
		selectedPage: JSON.parse(localStorage.getItem("selectedPage")) || 1,
		init: function() {
			this.cacheDOM();
			this.bindEvents();
			this.render();
		},
		cacheDOM: function() {

		},
		bindEvents: function() {

		},
		render: function() {

		}
	};

	cardCounter.init();
	flashcardsOnly.init();
	searchCards.init();
	views.init();
	profile.init();
	collections.init();
	cards.init();
	topics.init();	
	cardsFilter.init();
	pagination.init();

	
	// 	viewedCardIndex = null,
	// 	listViewCardHeight = 150,
	// 	cardsPerPage = setCardsPerPage();



	// /**
	// *  Event Listeners
	// */

	// document.addEventListener("click", handleCardClickEvents);
	// document.addEventListener("keydown", handleCardKeydownEvents);
	// window.addEventListener("resize", handleResize);


	// pageWrapper.addEventListener("dragover", function(event) {
	// 	event.preventDefault();
	// 	if(hasClass(pageWrapper, "drag")) {
	// 		return false;
	// 	}
	// 	pageWrapper.className += " drag";
	// });

	// pageWrapper.addEventListener("dragleave", function(event) {
	// 	event.preventDefault();
	// 	pageWrapper.className = pageWrapper.className.replace( /(?:^|\s)drag(?!\S)/g , '' );		
	// });



	// function FU(extractedMethodSettings) {
	//     extractedMethodSettings.pageWrapper.addEventListener("drop", function(event) {
	//         event.stopPropagation();
	//         event.preventDefault();
	//         getCardFromTxt(event);
	//         extractedMethodSettings.pageWrapper.className = extractedMethodSettings.pageWrapper.className.replace(/(?:^|\s)drag(?!\S)/g, "")
	//     });
	// }

	// FU({
	//     pageWrapper: pageWrapper
	// });

	// /**
	// *  Event Delegator
	// */
	// function handleCardKeydownEvents(event) {
	// 	var existingCards = selectedCollection.cards,
	// 		selectedCollectionIndex = collectionSelect.options[collectionSelect.selectedIndex].value,
	// 		i = null,
	// 		obj = null;

	// 	if (viewedCardIndex !== null) {
	// 		var viewedCard = existingCards[viewedCardIndex - 1];

	// 		if ((event.keyCode === 0 || event.keyCode === 32) && viewedCard.isFlashcard) {
	// 			renderCardSide(event, viewedCard);				
	// 		}
	// 	}
			
	// }

	// function handleCardClickEvents(event) {
	//     var element = event.target,
	// 		parentId = (element.parentNode && element.parentNode.id) ? element.parentNode.id.slice(-5) : '',
	// 		existingCards = selectedCollection.cards,
	// 		selectedCollectionIndex = collectionSelect.options[collectionSelect.selectedIndex].value,
	// 		i = null,
	// 		obj = null;

	// 	if(hasClass(element, 'remove-card')) {
	// 		removeCard(event);
	//     } else if (hasClass(element, 'delete-collection')) {
	//  		var confirmDelete = confirm("All your collection data including cards will be deleted. Continue?");
	//  		if (confirmDelete) {
	// 			if (document.getElementById('collectionForm')) {
	// 				closeCollectionForm();
	// 			}
	// 			collections.splice(selectedCollectionIndex, 1);

	// 			localStorage.setItem("Collections", JSON.stringify(collections));
	// 			collections = JSON.parse(localStorage.getItem("Collections")) || [defaultCollection];
	// 			selectedCollection = collections[selectedCollectionIndex - 1];
	// 			localStorage.setItem("selectedCollection", JSON.stringify(selectedCollection));
	// 			selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || collections[0];
	// 			getCollections();
	// 			displayCards(selectedPage);
	// 			countCards();
	//  		} else {
	//  			return false;
	//  		}
	//     } else if (hasClass(element, 'edit-card')) {
	// 		if (document.getElementById('viewCardSection')) {
	// 			closeCardView();
	// 		}
	// 		var editableCard = '';
	// 		for(i = 0; i < existingCards.length; i++) {
	// 			obj = existingCards[i];
	// 			if(parentId.indexOf(obj.id) !== -1) {
	// 				editableCard = existingCards[i];
	// 				break;
	// 			}
	// 		}
	// 		openCardForm(event, editableCard);
	//     } else if (hasClass(element, 'edit-collection')) {
	// 		if (document.getElementById('viewCollectionSection')) {
	// 			closeCollectionView();
	// 		}
	// 		var editableCollection = '';
	// 		for(i = 0; i < collections.length; i++) {
	// 			obj = collections[i];
	// 			if(collections[selectedCollectionIndex].id.indexOf(obj.id) !== -1) {
	// 				editableCollection = collections[i];
	// 				break;
	// 			}
	// 		}
	// 		openCollectionForm(event, editableCollection);
	// 	} else if (hasClass(element, 'card-thumb')) {
	// 		var viewImg = window.open("", "Image Preview", "height=500,width=500");
	// 		viewImg.document.write('<img src="' + element.src + '" />');
	// 	} else if (hasClass(element, 'data-details')) {
	// 		if (document.getElementById('viewCardSection')) {
	// 			closeCardView();
	// 		}		
	// 		var viewedCard = '';
	// 		for(i = 0; i < existingCards.length; i++) {
	// 			obj = existingCards[i];
	// 			if(parentId.indexOf(obj.id) !== -1) {
	// 				viewedCard = existingCards[i];
	// 				break;
	// 			}
	// 		}
	// 		// setViewedCardIndex
	// 		viewedCardIndex = i + 1;
	// 		// count view
	// 		countView(viewedCard);
	// 		// view card
	// 		viewCard(event, viewedCard);
	// 	} else if ( (hasClass(element, 'fog-blanket')) ||
	// 				(hasClass(element, 'cancel-form')) ||
	// 				(hasClass(element, 'close-btn')) ) {
	// 		if (document.getElementById('createCardSection')) {
	// 			closeCardForm();
	// 		} else if (document.getElementById('viewCardSection')) {
	// 			closeCardView();
	// 		} else if (document.getElementById('userNameSection')) {
	// 			closeUserNameForm();
	// 		} else if (document.getElementById('topicSection')) {
	// 			closeTopicForm();
	// 		} else if (document.getElementById('collectionSection')) {
	// 			closeCollectionForm();
	// 		}
	// 	} else if (hasClass(element, 'previous-card-link')) {
	// 		if(viewedCardIndex === 1) {
	// 			return false;
	// 		}
	// 		closeCardView();
	// 		viewedCardIndex -= 1;
	// 		viewCard(event, existingCards[viewedCardIndex - 1]);
	// 	} else if (hasClass(element, 'next-card-link')) {
	// 		if(viewedCardIndex === existingCards.length) {
	// 			return false;
	// 		}
	// 		closeCardView();
	// 		viewedCardIndex += 1;
	// 		viewCard(event, existingCards[viewedCardIndex - 1]);
	// 	} else if (hasClass(element, 'card-author-anchor')) {
	// 		searchCards.value = element.text;
	// 		categorySearchSelect.getElementsByTagName('option')[3].selected = 'selected';
	// 		topicSelect.getElementsByTagName('option')[0].selected = 'selected';
	// 		selectedTopic = topicSelect.options[topicSelect.selectedIndex].value;
	// 		localStorage.setItem("selectedTopic", JSON.stringify(selectedTopic));
	// 		selectCardsByTopic();		
	// 		searchCard();
	// 		// ustawiam search category
	// 	} else if (hasClass(element, 'card-topic-anchor')) {
	// 		searchCards.value = '';
	// 		categorySearchSelect.getElementsByTagName('option')[0].selected = 'selected';				
	// 		for (i = 0;i < selectedCollection.topics.length;i++) {
	// 			if(element.text.indexOf(selectedCollection.topics[i]) !== -1) {
	// 				topicSelect.getElementsByTagName('option')[i+1].selected = 'selected';
	// 			}
	// 		}
	// 		selectedTopic = topicSelect.options[topicSelect.selectedIndex].value;
	// 		localStorage.setItem("selectedTopic", JSON.stringify(selectedTopic));
	// 		selectCardsByTopic();
	// 	}
	// }

	// function removeCard(event) {
	//     var element = event.target,
	// 		parentId = element.parentNode.id ? element.parentNode.id.slice(-5) : '',
	// 		existingCards = selectedCollection.cards,
	// 		selectedCollectionIndex = collectionSelect.options[collectionSelect.selectedIndex].value,
	// 		i = null,
	// 		obj = null;

	// 	if (document.getElementById('viewCardSection')) {
	// 		closeCardView();
	// 	}
	// 	for(i = 0; i < existingCards.length; i++) {
	// 		obj = existingCards[i];
	// 		if(parentId.indexOf(obj.id) !== -1) {
	// 			existingCards.splice(i, 1);
	// 			break;
	// 		}
	// 	}
	// 	// DRY: Wstawić to do osobnej funkcji
	// 	//      updateCardCollections()
	// 	// Update and load new collections
	// 	collections[selectedCollectionIndex].cards = existingCards;
	// 	localStorage.setItem("Collections", JSON.stringify(collections));
	// 	collections = JSON.parse(localStorage.getItem("Collections")) || [defaultCollection];

	// 	// Update and load new selectedCollection based on updated collections
	// 	selectedCollection = collections[selectedCollectionIndex];
	// 	localStorage.setItem("selectedCollection", JSON.stringify(selectedCollection));
	// 	selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || collections[0];
	// 	displayCards(selectedPage);
	// 	countCards();
	// 	addPagination();	
	// }

	// function toggleTextCards(event) {

	// 	var element = (typeof event !== 'undefined') ? event.target : showFlashcardsOnly;

	// 	if(element.checked === true) {
	// 		localStorage.setItem('selectedFlashcardsOnly', JSON.stringify(true));			
	// 		for (var i=0;i<selectedCollection.cards.length;i++) {
	// 			if(selectedCollection.cards[i].isFlashcard === false) {
	// 				if(!document.getElementById("cardMiniature" + selectedCollection.cards[i].id)) {
	// 					return;
	// 				}
	// 				var card = document.getElementById("cardMiniature" + selectedCollection.cards[i].id);
	// 				if (typeof card !== 'undefined') {
	// 					card.parentNode.removeChild(card);				
	// 				}
	// 				addPagination();			
	// 			}
	// 		}
	// 	} else {
	// 		localStorage.setItem('selectedFlashcardsOnly', JSON.stringify(false));		
	// 		displayCards(selectedCards);
	// 	}
		
	// }

	// function checkSelectedFlashcardsOnly() {
	// 	if(selectedFlashcardsOnly === true) {
	// 		showFlashcardsOnly.checked = true;
	// 		toggleTextCards();
	// 	}
	// }

	// function selectSortingMethod(event) {
	// 	var element = event.target;
	// 	if (element.value === selectedSorting) {
	// 		return false;
	// 	} else {
	// 		selectedSorting = element.value;
	// 		localStorage.setItem("selectedSorting", JSON.stringify(selectedSorting));
	// 		displayCards();
	// 	}
	// }

	// function sortCards(cards) {
	// 	if(selectedSorting === 'date') {
	// 		sortCardsByDate(cards);
	// 	} else if(selectedSorting === 'popularity') {
	// 		sortCardsByPopularity(cards);
	// 	} else if(selectedSorting === 'title') {
	// 		sortCardsByTitle(cards);
	// 	}
	// }

	// function sortCardsByDate(cards) {
	// 	cards.sort(function(a, b){
	// 		return b.date - a.date;
	// 	});
	// }

	// function sortCardsByPopularity(cards) {
	// 	cards.sort(function(a, b){
	// 		return b.views - a.views;
	// 	});
	// }

	// function sortCardsByTitle(cards) {
	// 	cards.sort(function(a, b){
	// 		if (a.title < b.title) {
	// 			return -1;
	// 		} else if (a.title > b.title) {
	// 			return 1;
	// 		} else {
	// 			return 0;
	// 		}
	// 	});
	// }

	// function setSorting() {
	// 	// Zamienić to na pętlę

	// 	if (selectedSorting === 'date') {
	// 		cardsFilter.getElementsByTagName('option')[0].selected = 'selected';
	// 	} else if (selectedSorting === 'popularity') {
	// 		cardsFilter.getElementsByTagName('option')[1].selected = 'selected';
	// 	} else if (selectedSorting === 'title') {
	// 		cardsFilter.getElementsByTagName('option')[2].selected = 'selected';
	// 	}
	// }

	// function countView(viewedCard) {
	// 	var existingCards = selectedCollection.cards,
	// 		selectedCollectionIndex = collectionSelect.options[collectionSelect.selectedIndex].value;
		
	// 	viewedCard.views += 1;

	// 	// Update and load new collections
	// 	collections[selectedCollectionIndex].cards = existingCards;
	// 	localStorage.setItem("Collections", JSON.stringify(collections));
	// 	collections = JSON.parse(localStorage.getItem("Collections")) || [defaultCollection];

	// 	// Update and load new selectedCollection based on updated collections
	// 	selectedCollection = collections[selectedCollectionIndex];
	// 	localStorage.setItem("selectedCollection", JSON.stringify(selectedCollection));
	// 	selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || collections[0];

	// 	displayCards(selectedPage);
	// 	selectCardsByTopic();
	// }

	// /**
	// *	Handle drag and drop txt files
	// */
	// function getCardFromTxt(event) {

	// 	var files = event.target.files || event.dataTransfer.files;

	// 	var f = files[0];
			
	// 	if (!f) {
	// 		alert("Failed to load file");
	// 	} else if (!f.type.match('text.*')) {
	// 		alert(f.name + " is not a valid text file.");
	// 	} else {

	// 		var reader = new FileReader();

	// 		reader.onload = function(e) { 
	// 			var contents = {
	// 				title: f.name,
	// 				url: '',
	// 				text : e.target.result,
	// 				tags : '',
	// 				submitLabel: 'Create Card',
	// 				attachments: []
	// 			};
	// 			openCardForm(event, contents);
	// 		};
	// 		reader.readAsText(f);	
	// 	}
	// }

	// /**
	// *  Collection Form
	// */

	// function openCollectionForm(event, editableCollection) {
	// 	if (document.getElementById('collectionSection')) {
	// 		return false;
	// 	}
	// 	var editMode = editableCollection ? true : false,
	// 		collectionFormHeader = editableCollection ? "Edit Collection" : "New Collection",	
	// 		collectionName = editableCollection ? editableCollection.name : "",
	// 		collectionDescription = editableCollection ? editableCollection.description : "",
	// 		collectionTopics = editableCollection ? editableCollection.topics : [],
	// 		collectionFormSubmitLabel = editableCollection ? "Update Collection" : "Add New Collection",
	// 		updatedCollectionId = editableCollection ? editableCollection.id : null,
	// 		collectionCards = editableCollection ? editableCollection.cards : [];

	// 	selectedCollection.topics = editableCollection ? selectedCollection.topics : [];

	// 	var html = '';
	// 		html += '	<form id="collectionForm">';
	// 		html += '		<h2>' + collectionFormHeader + '</h2>';
	// 		html += '		<span id="closeBtn" class="close-btn">X</span>';
	// 		html += '		<div>';
	// 		html += '			<input type="text" id="collectionName" name="collectionName" value="' + collectionName + '" placeholder="name">';
	// 		html += '		</div>';
	// 		html += '		<div>';
	// 		html += '			<input type="text" id="collectionDescription" name="collectionDescription" value="' + collectionDescription + '" placeholder="description">';
	// 		html += '		</div>';
	// 		html += '		<div id="cardTopicWrapper"></div>';
	// 		html += '		<div>';
	// 		html += '			<button>' + collectionFormSubmitLabel + '</button>';
	// 		html += '			<a class="cancel-form">Cancel</a>';
	// 		html += '			<a class="delete-collection">Delete Collection</a>';		
	// 		html += '		</div>';
	// 		html += '	</form>';

	// 	var collectionForm = document.createElement('SECTION');
	// 	collectionForm.id = "collectionSection";
	// 	collectionForm.className = "collection-section";
	// 	collectionForm.innerHTML = html.trim();
	// 	pageWrapper.appendChild(collectionForm);

	// 	var fogBlanket = document.createElement('div');
	// 	fogBlanket.className = "fog-blanket";
	// 	fogBlanket.id = "fogBlanket";
	// 	pageWrapper.appendChild(fogBlanket);

	// 	collectionForm.addEventListener('submit', function(event) {
	// 		event.preventDefault();
	// 		createCollection(updatedCollectionId, collectionCards);
	// 	});

	// 	createTopicAdder("cardTopicWrapper", true);
	// }

	// function createCollection(updatedCollectionId, collectionCards) {
	// 	var date = new Date(),
	// 		form = document.forms[0],
	// 		collection = {
	// 			id: updatedCollectionId || makeid(),
	// 			name: collectionName.value,
	// 			description: collectionDescription.value,
	// 			author: userName,
	// 			date: date.getTime(),
	// 			topics: selectedCollection.topics,
	// 			cards: collectionCards
	// 		},
	// 		existingCollections = JSON.parse(localStorage.getItem("Collections"));

	// 	if(existingCollections === null) {
	// 		existingCollections = [];
	// 	}
	// 	if (updatedCollectionId) {
	// 		for(var i = 0; i < existingCollections.length; i++) {
	// 			var obj = existingCollections[i];
	// 			if(updatedCollectionId.indexOf(obj.id) !== -1) {
	// 				existingCollections[i] = collection;
	// 				break;
	// 			}
	// 		}
	// 	}
	// 	else {
	// 		existingCollections.push(collection);
	// 	}
	// 	collections = existingCollections;
	// 	localStorage.setItem("Collections", JSON.stringify(existingCollections));
	// 	collections = JSON.parse(localStorage.getItem("Collections"));
	// 	selectedCollection = collection;
	// 	localStorage.setItem("selectedCollection", JSON.stringify(selectedCollection));
	// 	selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || collections[0];	
	// 	removeEditCollectionBtn();
	// 	getCollections();
	// 	getTopics();
	// 	displayCards(selectedPage);
	// 	countCards();
	// 	addPagination();
	// 	closeCollectionForm();
	// 	selectCardsByTopic();
	// }

	// /**
	// *  UserName Form
	// */

	// function openUserNameForm() {
	// 	if (document.getElementById('userNameSection')) {
	// 		return false;
	// 	}

	// 	var userNameValue = JSON.parse(localStorage.getItem("userName")) || '';

	// 	var html = '';
	// 		html += '	<form id="userNameForm">';
	// 		html += '		<h2>Please enter your name</h2>';
	// 		html += '		<span id="closeBtn" class="close-btn">X</span>';
	// 		html += '		<div>';
	// 		html += '			<input type="text" id="formUserName" name="formUserName" value="' + userNameValue + '" placeholder="enter your name">';
	// 		html += '		</div>';
	// 		html += '		<div>';
	// 		html += '			<button>Change Name</button>';
	// 		html += '			<a class="cancel-form">Cancel</a>';
	// 		html += '		</div>';
	// 		html += '	</form>';

	// 	var userNameForm = document.createElement('SECTION');
	// 	userNameForm.id = "userNameSection";
	// 	userNameForm.className = "user-name-section";
	// 	userNameForm.innerHTML = html.trim();
	// 	pageWrapper.appendChild(userNameForm);

	// 	var fogBlanket = document.createElement('div');
	// 	fogBlanket.className = "fog-blanket";
	// 	fogBlanket.id = "fogBlanket";
	// 	pageWrapper.appendChild(fogBlanket);

	// 	userNameForm.addEventListener('submit', function(event) {
	// 		event.preventDefault();
	// 		localStorage.setItem("userName", JSON.stringify(formUserName.value));
	// 		userName = JSON.parse(localStorage.getItem("userName")) || 'Guest';
	// 		closeUserNameForm();
	// 		greetUser();
	// 	});
	// }

	// function getCollections() {
	// 	var collectionOptions = '';
	// 	for (var i = 0; i < collections.length; i++) {
	// 		var isSelected = (selectedCollection.name.indexOf(collections[i].name) !== -1) ? 'selected="selected"' : '';
	// 		collectionOptions += '<option value="' + i + '"'+ isSelected +'>' + collections[i].name + '</option>';
	// 	}
	// 	var html = '';
	// 		html += '	<option value="-1">Collections</option>';
	// 		html += collectionOptions;
	// 		html += '	<option value="addNewCollection">ADD NEW COLLECTION</option>';
	// 	collectionSelect.innerHTML = html;
	// 	if(collectionSelect.value !== '-1' && collectionSelect.value !== 'addNewCollection'){
	// 		addEditCollectionBtn();
	// 	}
	// }

	// function selectCollection(event) {
	// 	var element = event.target;
	// 	removeEditCollectionBtn();
	// 	if (element.value === '-1') {
	// 		return false;
	// 	} else if (element.value === 'addNewCollection') {
	// 		openCollectionForm();
	// 	} else {
	// 		selectedCollection = collections[element.value];
	// 		localStorage.setItem("selectedCollection", JSON.stringify(selectedCollection));
	// 		selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || collections[0];
	// 		selectedTopic = -1;
	// 		localStorage.setItem("selectedTopic", JSON.stringify(selectedTopic));	
	// 		selectedCards = selectedCollection.cards;
	// 		displayCards();
	// 		countCards();
	// 		getTopics();
	// 		addPagination();
	// 		addEditCollectionBtn();
	// 	}
	// }

	// function addEditCollectionBtn() {
	// 	var editCollectionBtn = document.createElement("i");
	// 	editCollectionBtn.className = "edit-collection fa fa-cog";
	// 	editCollectionBtn.id = "editCollectionBtn";
	// 	collectionSelect.parentNode.appendChild(editCollectionBtn);
	// }

	// function removeEditCollectionBtn() {
	// 	if(!document.getElementById("editCollectionBtn")) {
	// 		return false;
	// 	}
	// 	collectionSelect.parentNode.removeChild(editCollectionBtn);
	// }

	// function greetUser() {
	// 	hiUserName.innerHTML = userName;
	// }

	// function getTopics() {
	// 	var topicOptions = '';
	// 	for (var i = 0; i < selectedCollection.topics.length; i++) {
	// 		if (parseInt(selectedTopic) !== i) {
	// 			topicOptions += '<option value="' + i + '">' + selectedCollection.topics[i] + '</option>';
	// 		} else {
	// 			topicOptions += '<option value="' + i + '" selected="selected">' + selectedCollection.topics[i] + '</option>';
	// 		}	
	// 	}
	// 	var html = '';
	// 		html += '	<option value="-1">select topic</option>';
	// 		html += topicOptions;
	// 		html += '	<option value="addNewTopic">ADD NEW TOPIC</option>';
	// 	topicSelect.innerHTML = html;
	// }

	// function selectCardsByTopic(event) {
	// 	var element = event ? event.target.value : parseInt(selectedTopic);
	// 	if (element === -1) {
	// 		selectedTopic = topicSelect.options[topicSelect.selectedIndex].value;
	// 		localStorage.setItem("selectedTopic", JSON.stringify(selectedTopic));
	// 		displayCards(selectedPage);
	// 	} else if (element === 'addNewTopic') {
	// 		openTopicForm();
	// 	} else {
	// 		displayCards(selectedPage);
	// 		for(var i = 0; i < selectedCards.length; i++) {
	// 			if(selectedCollection.topics[element].indexOf(selectedCards[i].topic) === -1) {
	// 				var card = document.getElementById("cardMiniature" + selectedCards[i].id);
	// 				if(card) {
	// 					card.parentNode.removeChild(card);					
	// 				}
	// 				selectedTopic = topicSelect.options[topicSelect.selectedIndex].value;
	// 				localStorage.setItem("selectedTopic", JSON.stringify(selectedTopic));			
	// 			}
	// 		}
	// 	}
	// }

	// function openTopicForm() {
	// 	if (document.getElementById('topicSection')) {
	// 		return false;
	// 	}

	// 	var html = '';
	// 		html += '	<form id="topicForm">';
	// 		html += '		<h2>New Topic</h2>';
	// 		html += '		<span id="closeBtn" class="close-btn">X</span>';
	// 		html += '		<div>';
	// 		html += '			<input type="text" id="topicName" name="topicName" placeholder="enter new topic" required>';
	// 		html += '		</div>';
	// 		html += '		<div id="topicValidationBox"></div>';
	// 		html += '		<div>';
	// 		html += '			<button>Add Topic</button>';
	// 		html += '			<a class="cancel-form">Cancel</a>';
	// 		html += '		</div>';
	// 		html += '	</form>';

	// 	var topicForm = document.createElement('SECTION');
	// 	topicForm.id = "topicSection";
	// 	topicForm.className = "topic-section";
	// 	topicForm.innerHTML = html.trim();
	// 	pageWrapper.appendChild(topicForm);

	// 	var fogBlanket = document.createElement('div');
	// 	fogBlanket.className = "fog-blanket";
	// 	fogBlanket.id = "fogBlanket";
	// 	pageWrapper.appendChild(fogBlanket);

	// 	closeBtn.addEventListener('click', function(event) {
	// 		closeTopicForm();
	// 	});

	// 	topicForm.addEventListener('submit', function(event) {
	// 		event.preventDefault();
	// 		var topicValidationBox = document.getElementById('topicValidationBox'),
	// 			newTopicForm = document.getElementById('topicForm'),
	// 			newTopic = topicName.value;
	// 		for(var i=0; i < selectedCollection.topics.length;i++) {
	// 			if(newTopic.indexOf(selectedCollection.topics[i]) !== -1) {
	// 				topicValidationBox.innerHTML = '<p class="validation-message">Specified topic already exists!</p>';
	// 				newTopicForm.reset();
	// 				return false;
	// 			}
	// 		}
	// 		selectedCollection.topics.push(newTopic);
			
	// 		// wstawić nową selectedCollection do collections
	// 		var selectedCollectionIndex = collectionSelect.options[collectionSelect.selectedIndex].value;	
	// 		// Update and load new collections
	// 		collections[selectedCollectionIndex] = selectedCollection;
	// 		localStorage.setItem("Collections", JSON.stringify(collections));
	// 		collections = JSON.parse(localStorage.getItem("Collections")) || [defaultCollection];

	// 		// Update and load new selectedCollection based on updated collections
	// 		selectedCollection = collections[selectedCollectionIndex];
	// 		localStorage.setItem("selectedCollection", JSON.stringify(selectedCollection));
	// 		selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || collections[0];		
	// 		getTopics();		
	// 		closeTopicForm();
	// 	});
	// }

	// function closeTopicForm() {
	// 	var topicForm = document.getElementById("topicForm").parentNode;
	// 	topicForm.parentNode.removeChild(topicForm);
	// 	topicSelect.getElementsByTagName('option')[0].selected = 'selected';
	// 	closeFogBlanket();
	// }

	// function toggleView(event) {
	// 	var element = event.target;
	// 	if (element.id === "gridViewBtn" && viewType !== 'grid-view') {
	// 		switchGridView();
	// 	} else if (element.id === "listViewBtn" && viewType !== 'list-view') {
	// 		switchListView();	
	// 	} else if (element.id === "detailsViewBtn" && viewType !== 'details-view') {
	// 		switchDetailsView();	
	// 	}
	// }

	// function getView() {
	// 	if(viewType === 'grid-view') {
	// 		switchGridView();
	// 	} else if (viewType === 'list-view') {
	// 		switchListView();
	// 	} else {
	// 		switchDetailsView();
	// 	}
	// }

	// function switchGridView() {
	// 	if (viewType === 'details-view') {
	// 		removeCardPreview();
	// 	}	
	// 	viewType = 'grid-view';
	// 	cardsPerPage = setCardsPerPage();
	// 	cardsWrapper.className = 'grid-view';
	// 	gridViewBtn.className += ' active';
	// 	listViewBtn.className = listViewBtn.className.replace( /(?:^|\s)active(?!\S)/g , '' );
	// 	detailsViewBtn.className = detailsViewBtn.className.replace( /(?:^|\s)active(?!\S)/g , '' );
	// 	localStorage.setItem("viewType", JSON.stringify(viewType));
	// 	addPagination();
	// }

	// function switchListView() {
	// 	if (viewType === 'details-view') {
	// 		removeCardPreview();
	// 	}	
	// 	viewType = 'list-view';
	// 	cardsPerPage = setCardsPerPage();
	// 	cardsWrapper.className = 'list-view';
	// 	listViewBtn.className += ' active';
	// 	gridViewBtn.className = gridViewBtn.className.replace( /(?:^|\s)active(?!\S)/g , '' );
	// 	detailsViewBtn.className = detailsViewBtn.className.replace( /(?:^|\s)active(?!\S)/g , '' );
	// 	localStorage.setItem("viewType", JSON.stringify(viewType));
	// 	addPagination();		
	// }

	// function switchDetailsView() {
	// 	viewType = 'details-view';
	// 	cardsPerPage = setCardsPerPage();
	// 	cardsWrapper.className = 'details-view';
	// 	detailsViewBtn.className += ' active';
	// 	listViewBtn.className = listViewBtn.className.replace( /(?:^|\s)active(?!\S)/g , '' );
	// 	gridViewBtn.className = gridViewBtn.className.replace( /(?:^|\s)active(?!\S)/g , '' );
	// 	localStorage.setItem("viewType", JSON.stringify(viewType));
	// 	addPagination();
	// 	createCardPreview();
	// }

	// function createCardPreview() {

	// 	var html = '';

	// 	html += '<div id="cardField" class="card-preview-sheet"></div>';

	// 	var cardPreview = document.createElement('SECTION');
	// 	cardPreview.id = "cardPreview";
	// 	cardPreview.className = "card-preview";
	// 	cardPreview.innerHTML = html.trim();
	// 	sectionWrapper.appendChild(cardPreview);
	// 	setCardPreviewHeight();	
	// }

	// function removeCardPreview() {
	// 	var cardPreview = document.getElementById("cardPreview");
	// 	cardPreview.parentNode.removeChild(cardPreview);	
	// }

	// function searchCard(event) {
	// 	var searchValue = searchCards.value,
	// 		selectedCategorySearch = categorySearchSelect.options[categorySearchSelect.selectedIndex].value;
	// 	selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || collections[0];
	// 	selectedCards = selectedCollection.cards;
	// 	displayCards(selectedPage);

	// 	for(var i = 0; i < selectedCards.length; i++) {
	// 		var obj = selectedCards[i];
	// 		if(obj[selectedCategorySearch].indexOf(searchValue) === -1) {
	// 			if(!document.getElementById("cardMiniature" + obj.id)) {
	// 				return;
	// 			}
	// 			var card = document.getElementById("cardMiniature" + obj.id);
	// 			if (card) {
	// 				card.parentNode.removeChild(card);				
	// 			}
	// 			addPagination();
	// 		}
	// 	}
	// }

	// function renderCardSide(event, viewedCard, frontSide) {
	// 	var flashCardText = document.getElementById('flashCardText') ? document.getElementById('flashCardText') : null;	
		
	// 	document.getElementById('cardContent').innerHTML = '';
	// 	var flashCardHtml = '';

	// 	flashCardHtml += '	<div id="flashCardContent" class="flash-card-content">';
		
	// 	if(frontSide || hasClass(flashCardText, 'back-side')) {
	// 		flashCardHtml += '	<p id="flashCardText" class="front-side">' + viewedCard.title + '</h3>';
	// 		frontSide = false;
	// 	} else {
	// 		flashCardHtml += '	<p id="flashCardText" class="back-side">' + urlify(viewedCard.text) + '</p>';
	// 		frontSide = true;
	// 	}
	// 	flashCardHtml += '		<p class="flashcard-action-info">Hit SPACE to flip the card</p>';
	// 	flashCardHtml += '	</div>';
	// 	document.getElementById('cardContent').innerHTML = flashCardHtml;
	// }

	// function viewCard(event, viewedCard) {
	// 	if (document.getElementById('viewCardSection')) {
	// 		return false;
	// 	}

	// 	var thumbs = '',
	// 		tags = '',
	// 		i,
	// 		cardTypeClass = viewedCard.isFlashcard ? 'flashcard' : 'textcard';
		
	// 	for (i = 0; i < viewedCard.attachments.length; i++) {
	// 		thumbs += '<img src="' + viewedCard.attachments[i] + '" class="view-card-thumb" />';
	// 	}

	// 	for (i = 0; i < viewedCard.tags.length; i++) {
	// 		tags += '<span class="tag">' + viewedCard.tags[i] + '</span>';
	// 	}

	// 	var flashCardHtml = '';
			
	// 	var urlifiedText = urlify(viewedCard.text);
	// 	var domain = extractDomain(viewedCard.url);

	// 	var html = '';
	// 		html += '	<div id="viewCardForm">';
	// 		html += '		<ul id="viewCardNavigation" class="view-card-navigation">';
	// 		html += '			<li><span>' + viewedCardIndex + ' of ' + selectedCollection.cards.length + '</span></li>';
	// 		html += '			<li><a class="previous-card-link">Previous</a></li>';
	// 		html += '			<li><a class="next-card-link">Next</a></li>';
	// 		html += '		</ul>';
	// 		if(viewType !== 'details-view') {
	// 			html += '		<span id="closeBtn" class="close-btn">X</span>';
	// 		}
	// 		html += '		<div id="cardContent">';		
	// 		if(cardTypeClass === 'flashcard') {	
	// 			html += flashCardHtml;			
	// 		} 
	// 		else {			
	// 			html += '		<div>';
	// 			html += '			<h3>' + viewedCard.title + '</h3>';
	// 			html += '			<p class="topic">in: ' + viewedCard.topic + ' by ' + viewedCard.author + '</p>';
	// 			html += '		</div>';
	// 			html += '		<div>';
	// 			html += '			<p class="card-text">' + urlifiedText + '</p>';
	// 			html += '		</div>';
	// 			html += '		<div>';
	// 			html += '			<label>Tags:</label>';
	// 			html += '			<p class="tags">' + tags + '</p>';
	// 			html += '		</div>';
	// 			html += '		<div>';
	// 			html += '			<label>Attachments:</label>';				
	// 			html += '			<div class="view-thumb-list">' + thumbs + '</div>';
	// 			html += '		</div>';			
	// 			if(viewedCard.url) {
	// 				html += '		<div class="card-url">';
	// 				html += '			<label>External link:</label>';
	// 				html += '			<a rel="nofollow" href="' + viewedCard.url + '" target="_blank">' + domain + '</a>';
	// 				html += '		</div>';
	// 			}
	// 			html += '		<div class="view-card-actions" id="actions' + viewedCard.id + '">';
	// 			html += '			<a class="edit-card">Edit</a>';
	// 			html += '			<a class="remove-card">Remove</a>';
	// 			html += '		</div>';
	// 		}
	// 		html += '		</div>';		
	// 		html += '	</div>';


	// 	var tempCardForm = document.createElement('SECTION');
	// 	tempCardForm.id = "viewCardSection";
	// 	tempCardForm.className = "view-card-section " + cardTypeClass;
	// 	tempCardForm.innerHTML = html.trim();
	// 	if(viewType !== 'details-view') {
	// 		pageWrapper.appendChild(tempCardForm);
	// 		var fogBlanket = document.createElement('div');
	// 		fogBlanket.className = "fog-blanket";
	// 		fogBlanket.id = "fogBlanket";
	// 		pageWrapper.appendChild(fogBlanket);	
	// 	} else {
	// 		cardField.appendChild(tempCardForm);	
	// 	}

	// 	if(viewedCard.isFlashcard) {
	// 		renderCardSide(event, viewedCard, true);	
	// 	}
	// }

	// function extractDomain(url) {
	// 	var domain;
	// 	//find & remove protocol (http, ftp, etc.) and get domain
	// 	if (url.indexOf("://") > -1) {
	// 		domain = url.split('/')[2];
	// 	} else {
	// 		domain = url.split('/')[0];
	// 	}

	// 	//find & remove port number
	// 	domain = domain.split(':')[0];

	// 	return domain;
	// }

	// function urlify(text) {
	// 	/**
	// 	* Match all URLs except image and YouTube video links
	// 	*/ 
	// 	var ordinaryUrlRegexp = /(?!(https?:\/\/.*\.(?:png|jpg|gif|jpeg)))(?!(http(?:s)?:\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?​=]*)?))(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;	
	// 	/**
	// 	* Match all YouTube video links
	// 	*/
	// 	var ytUrlRegexp = /http(?:s)?:\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?​=]*)?/ig;	
	// 	/**
	// 	* Match all image links
	// 	*/   
	// 	var imgUrlRegexp = /(https?:\/\/.*\.(?:png|jpg|gif|jpeg))/ig;
	// 	text = text.replace(ordinaryUrlRegexp, '<a href="$6" target="_blank">$6</a>');
	// 	text = text.replace(ytUrlRegexp, '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>');
	// 	text = text.replace(imgUrlRegexp, '<img src="$1" alt />');	
	// 	return text;
	// }

	// function miniatureUrlify(text) {
	// 	/**
	// 	* Store the base text string for further comparison
	// 	*/
	// 	var baseStr = text;
	// 	/**
	// 	* Match all URLs except image and YouTube video links
	// 	*/ 
	// 	var ordinaryUrlRegexp = /(?!(https?:\/\/.*\.(?:png|jpg|gif|jpeg)))(?!(http(?:s)?:\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?​=]*)?))(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;	
	// 	/**
	// 	* Match all YouTube video links
	// 	*/
	// 	var ytUrlRegexp = /http(?:s)?:\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?​=]*)?/ig;	
	// 	/**
	// 	* Match all image links
	// 	*/   
	// 	var imgUrlRegexp = /(https?:\/\/.*\.(?:png|jpg|gif|jpeg))/ig;
	// 	text = text.replace(ordinaryUrlRegexp, '');
	// 	text = text.replace(ytUrlRegexp, '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>');
	// 	text = text.replace(imgUrlRegexp, '<img src="$1" alt />');	

	// 	baseStr === text ? text = '' : text;			

	// 	return text;
	// }

	// function closeCardView() {
	// 	var viewCardForm = document.getElementById("viewCardForm").parentNode;
	// 	viewCardForm.parentNode.removeChild(viewCardForm);
	// 	closeFogBlanket();

	// 	// to musiałem zakomentować, bo nie działał 
	// 	// przez to card next/previous naviagator
	// 	//viewedCardIndex = null;
	// }

	// function closeUserNameForm() {
	// 	var userNameForm = document.getElementById("userNameForm").parentNode;
	// 	userNameForm.parentNode.removeChild(userNameForm);
	// 	closeFogBlanket();
	// }

	// function closeCollectionForm() {
	// 	var collectionForm = document.getElementById("collectionForm").parentNode;
	// 	collectionForm.parentNode.removeChild(collectionForm);
	// 	closeFogBlanket();
	// }

	// function closeFogBlanket() {
	// 	var isFog = !!document.getElementById("fogBlanket");
	// 	if(isFog) {
	// 		var fogBlanket = document.getElementById("fogBlanket");
	// 		fogBlanket.parentNode.removeChild(fogBlanket);		
	// 	}
	// }

	// function openCardForm(event, editableCard) {
	// 	if (document.getElementById('createCardSection')) {
	// 		return false;
	// 	}

	// 	var editMode = editableCard ? true : false,
	// 		cardFormHeader = editableCard ? "Edit Card" : "Create Card",
	// 		cardTitle = editableCard ? editableCard.title : "",
	// 		cardUrl = editableCard ? editableCard.url : "",
	// 		cardText = editableCard ? editableCard.text : "",
	// 		cardTags = editableCard ? editableCard.tags : "",
	// 		cardThumbs = editableCard ? editableCard.thumbs : "",
	// 		cardFormSubmitLabel = editableCard ? editableCard.submitLabel : "Create Card",
	// 		updatedCardId = editableCard ? editableCard.id : null,
	// 		cardAttachments = editableCard ? editableCard.attachments : [],
	// 		isFlashcard = editableCard ? editableCard.isFlashcard : false;

	// 	var cardThumbs = '',
	// 		i = 0;

	// 		for (; i < cardAttachments.length; i++) {
	// 			cardThumbs += '<img src="' + cardAttachments[i] + '" class="view-card-thumb" />';
	// 		}

	// 	var html = '';
	// 		html += '	<form id="createCardForm">';
	// 		html += '		<h2>' + cardFormHeader + '</h2>';
	// 		html += '		<span id="closeBtn" class="close-btn">X</span>';
	// 		html += '		<div class="card-type-wrapper">';
	// 		html += '			<label for="cardType">Card Type</label>';
	// 		html += '			<select id="cardType" name="cardType" required>';
	// 		html +=	'				<option value="text" selected="selected">default text</option>';
	// 		html += '			</select>';
	// 		html += '		</div>';
	// 		html += '		<div id="cardTopicWrapper" class="card-topic-wrapper"></div>';
	// 		html += '		<div>';
	// 		html += '			<input type="text" id="cardTitle" name="cardTitle" value="' + cardTitle + '" placeholder="title" required>';
	// 		html += '		</div>';
	// 		html += '		<div>';
	// 		html += '			<input type="text" id="cardUrl" name="cardUrl" value="' + cardUrl + '" placeholder="external link">';
	// 		html += '		</div>';
	// 		html += '		<div>';
	// 		html += '			<textarea id="cardText" name="cardText" placeholder="enter some content here..." required>' + cardText + '</textarea>';
	// 		html += '		</div>';
	// 		html += '		<div>';
	// 		html += '			<label>Tags [optional]</label>';
	// 		html += '			<input type="text" id="cardTags" name="cardTags" value="' + cardTags + '" placeholder="eg. books, reading, literature">';
	// 		html += '		</div>';
	// 		html += '		<div id="cardDropArea" class="card-drop-area">';
	// 		html += '			<input type="file" id="cardAttachment" class="card-attachment" multiple>';
	// 		html += '		</div>';
	// 		html += '		<div>';
	// 		html += '			<label>Attachments:</label>';				
	// 		html += '			<div class="view-thumb-list">' + cardThumbs + '</div>';
	// 		html += '		</div>';
	// 		html += '		<div id="thumbList" class="thumb-list"></div>';
	// 		html += '		<div>';
	// 		html += '			<input type="checkbox" id="flashcardCheck">';
	// 		html += '			<label for="flashcardCheck">Flashcard</label>';
	// 		html += '		</div>';
	// 		html += '		<div>';
	// 		html += '			<button class="submit-card-form">' + cardFormSubmitLabel + '</button>';
	// 		html += '			<a id="cancelFormBtn" class="cancel-form">Cancel</a>';
	// 		html += '		</div>';
	// 		html += '	</form>';

	// 	var tempCardForm = document.createElement('SECTION');
	// 	tempCardForm.id = "createCardSection";
	// 	tempCardForm.className = "create-card-section";
	// 	tempCardForm.innerHTML = html.trim();
	// 	pageWrapper.appendChild(tempCardForm);

	// 	var fogBlanket = document.createElement('div');
	// 	fogBlanket.className = "fog-blanket";
	// 	fogBlanket.id = "fogBlanket";
	// 	pageWrapper.appendChild(fogBlanket);

	// 	var cardAttachment = document.getElementById("cardAttachment"),
	// 		flashcardCheck = document.getElementById("flashcardCheck"),
	// 		cardDropArea = document.getElementById("cardDropArea");

	// 	if(isFlashcard) {
	// 		flashcardCheck.checked = true;
	// 	} else {
	// 		flashcardCheck.checked = false;
	// 	}

	// 	createCardForm.addEventListener('submit', function(event) {
	// 		event.preventDefault();
	// 		createCard(updatedCardId, cardAttachments);
	// 	});

	// 	cardAttachment.addEventListener('change', function(event) {
	// 		getAttachments(event, cardAttachments);
	// 	});

	// 	cardDropArea.addEventListener("dragover", function(event) {
	// 		event.stopPropagation();
	// 		event.preventDefault();
	// 	});

	// 	cardDropArea.addEventListener("dragleave", function(event) {
	// 		event.stopPropagation();
	// 		event.preventDefault();
	// 	});

	// 	cardDropArea.addEventListener("drop", function(event) {
	// 		getAttachments(event, cardAttachments);
	// 	});

	// 	createTopicAdder("cardTopicWrapper");

	// }

	// /**
	//  *  Topic Adder Component
	//  */
	// function createTopicAdder(parentId, isMultiple) {

	// 	var parent = document.getElementById(parentId),
	// 		cardTopics = '';

	// 	var html = '';
	// 		html += '	<label for="cardTopic">Select Topic</label>';
	// 		html += '	<select id="cardTopic" required>' + cardTopics + '</select>';
	// 		html += '	<div id="createTopicValidationBox" class="validation-box"></div>';

	// 	parent.innerHTML = html;

	// 	var cardTopic = document.getElementById("cardTopic");
	// 	if(isMultiple) {
	// 		cardTopic.multiple = "multiple";
		
	// 		cardTopic.addEventListener('change', function(event) {
	// 			setSelectedTopics();
	// 		});
	// 	}

	// 	function setSelectedTopics() {
	// 		var selectedTopics = [],
	// 			options = cardTopic && cardTopic.options;

	// 		for (var i=0, iLen=options.length; i<iLen; i++) {
	// 			if (options[i].selected) {
	// 				selectedTopics.push(options[i].text);
	// 			}
	// 		}
	// 		selectedCollection.topics = selectedTopics;
	// 	}

	// 	function createAddTopicLink() {
	// 		var addTopicLink = document.createElement('a');
	// 		addTopicLink.id = "addTopicLink";
	// 		addTopicLink.className = "add-topic-link";
	// 		var addTopicLinkLabel = document.createTextNode("+ Add new topic");
	// 		addTopicLink.appendChild(addTopicLinkLabel);
	// 		parent.appendChild(addTopicLink);

	// 		addTopicLink.addEventListener('click', function(event) {
	// 			event.stopPropagation();
	// 			createAddTopicInput(event);
	// 		});
	// 	}

	// 	function createAddTopicInput(event) {
	// 		var element = event.target;
	// 		var createTopicInput = document.createElement('input');
	// 		createTopicInput.id = "createTopicInput";
	// 		createTopicInput.className = "create-topic-input";
	// 		createTopicInput.placeholder = "enter topic name";
	// 		createTopicInput.required = "required";
	// 		element.parentNode.appendChild(createTopicInput);
	// 		createTopicInput.focus();
	// 		element.parentNode.removeChild(element);

	// 		createTopicInput.addEventListener('blur', function(event) {
	// 			createNewTopic(event);
	// 			createAddTopicLink();
	// 			removeAddTopicInput();
	// 		});
	// 	}

	// 	function createNewTopic(event) {
	// 		var createTopicValidationBox = document.getElementById('createTopicValidationBox'),
	// 			newTopic = event.target.value;

	// 		for(var i = 0; i < selectedCollection.topics.length; i++) {
	// 			if(selectedCollection.topics[i].indexOf(newTopic) !== -1) {
	// 				createTopicValidationBox.innerHTML = '<p class="validation-message">Specified topic already exists!</p>';
	// 				return false;
	// 			}
	// 		}
	// 		selectedCollection.topics.push(newTopic);
	// 		localStorage.setItem("selectedCollection", JSON.stringify(selectedCollection));
	// 		selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || collections[0];		
			

	// 		cardTopic.innerHTML = '';
	// 		getCollectionTopics();
	// 	}

	// 	function removeAddTopicLink() {
	// 		var addTopicLink = document.getElementById("addTopicLink");
	// 		addTopicLink.parentNode.removeChild(addTopicLink);
	// 	}

	// 	function removeAddTopicInput() {
	// 		createTopicInput.parentNode.removeChild(createTopicInput);
	// 	}

	// 	function getCollectionTopics() {
	// 		// Get Collection Topics
	// 		cardTopics = '';
	// 		for (var i = 0; i < selectedCollection.topics.length; i++) {
	// 			cardTopics += '<option>' + selectedCollection.topics[i] + '</option>';
	// 		}
	// 		cardTopic.innerHTML = cardTopics;
	// 	}

	// 	createAddTopicLink();

	// 	var addTopicLink = document.getElementById("addTopicLink");

	// 	getCollectionTopics();	
	// }

	// /**
	// *  Handles File Selection
	// */
	// function getAttachments(event, cardAttachments) {
	// 	event.stopPropagation();
	// 	event.preventDefault();	

	// 	var files = event.target.files || event.dataTransfer.files;

	// 	for (var i = 0, f = files[i]; i < files.length; i++) {

	// 		var reader = new FileReader();
			
	// 		if (f.type.match('image.*')) {
	// 			// Closure to capture the file information.
	// 			reader.onload = (function(theFile) {
	// 				return function(e) {
	// 					// Render thumbnail.
	// 					var span = document.createElement('span');
						
	// 					span.innerHTML = ['<img class="thumb" src="', e.target.result,
	// 					'" title="', escape(theFile.name), '"/>'].join('');
						
	// 					var thumbList = document.getElementById("thumbList");
	// 					thumbList.insertBefore(span, null);
	// 					//localStorage.setItem('img', e.target.result);
	// 					cardAttachments.push(e.target.result);
	// 				};
	// 			})(f);
	// 			// Read in the image file as a data URL.
	// 			reader.readAsDataURL(f);		
	// 		}
	// 	}

	// 	return cardAttachments;
	// }

	// function closeCardForm() {
	// 	var createCardForm = document.getElementById("createCardForm").parentNode;
	// 	createCardForm.parentNode.removeChild(createCardForm);
	// 	closeFogBlanket();
	// }

	// function countCards() {
	// 	var selectedCollectionIndex = collectionSelect.options[collectionSelect.selectedIndex].value,
	// 		index = selectedCollectionIndex !== "-1" ? selectedCollectionIndex : 0,
	// 		existingCards = collections[index].cards,
	// 		count = document.createTextNode(existingCards.length);
	// 	cardCounter.innerHTML = '';
	// 	cardCounter.appendChild(count);
	// 	count.nodeValue = existingCards.length;
	// }

	// function createCard(updatedCardId, cardAttachments) {
	// 	var tags = cardTags.value.split(","),
	// 		date = new Date(),
	// 		form = document.forms[0],
	// 		card = {
	// 			id: updatedCardId || makeid(),
	// 			topic: cardTopic.options[cardTopic.selectedIndex].text,
	// 			title: cardTitle.value,
	// 			url: cardUrl.value || '',
	// 			text: cardText.value,
	// 			tags: tags || [],
	// 			attachments: cardAttachments,
	// 			author: userName,
	// 			date: date.getTime(),
	// 			isFlashcard: flashcardCheck.checked,
	// 			views: 0,
	// 			submitLabel: 'Update Card'
	// 		},
	// 	existingCards = collections[collectionIndex].cards;

	//     if(!existingCards) {
	//     	existingCards = [];
	//     }

	// 	if (updatedCardId) {
	// 		for(var i = 0; i < existingCards.length; i++) {
	// 			var obj = existingCards[i];
	// 			if(updatedCardId.indexOf(obj.id) !== -1) {
	// 				existingCards[i] = card;
	// 				break;
	// 			}
	// 		}
	// 	}
	// 	else {
	// 		existingCards.push(card);
	// 	}

	// 	var selectedCollectionIndex = collectionSelect.options[collectionSelect.selectedIndex].value;
		
	// 	// Update and load new collections
	// 	collections[selectedCollectionIndex].cards = existingCards;
	// 	localStorage.setItem("Collections", JSON.stringify(collections));
	// 	collections = JSON.parse(localStorage.getItem("Collections")) || [defaultCollection];

	// 	// Update and load new selectedCollection based on updated collections
	// 	collections[selectedCollectionIndex].topics = selectedCollection.topics;
	// 	selectedCollection = collections[selectedCollectionIndex];
	// 	localStorage.setItem("selectedCollection", JSON.stringify(selectedCollection));
	// 	selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || collections[0];
		
	// 	getView();
	// 	getCollections();
	// 	countCards();
	// 	getTopics();
	// 	selectCardsByTopic();
	// 	greetUser();
	// 	addPagination();
	// }

	// function makeid()
	// {
	//     var text = "",
	//     	possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	//     for( var i=0; i < 5; i++ )
	//         text += possible.charAt(Math.floor(Math.random() * possible.length));
	//     return text;
	// }

	// function displayCards(page) {

	// 	collections = JSON.parse(localStorage.getItem("Collections")) || [defaultCollection];

	// 	var pageIndex = parseInt(page) || 1,
	// 		i = 0; // wybrana strona do pokazania: 1 lub 2

	// 	// bug: outdated number of cards in selectedCollection
	// 	selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || collections[0];
	// 	selectedCards = selectedCollection.cards;

	// 	sortCards(selectedCards);

	// 	cardsWrapper.innerHTML = '';

	// 	var cardsCount = selectedCards.length; // 19 - number of cards
	// 	var lastPageCardsCount = cardsCount % cardsPerPage; // 7 - liczba kart na ostatniej stronie

	// 	if(lastPageCardsCount === 0) {
	// 		lastPageCardsCount = cardsPerPage;
	// 	}

	// 	var pagesCount = Math.ceil(selectedCards.length / cardsPerPage); // 2 - liczba podstron

	// 	// jezeli pagesCount === 1 to 
	// 			//rob normalna petle [bedzie tylko jedna podstrona, nie ma paginacji]

	// 	// jezeli pagesCount jest > 1 to
	// 			// to jezeli wolana strona czyli pageIndex jest mniejsze od (pagesCount -1) [petla #1 do przedostatniej strony wlacznie]
	// 					//to pokazuj 12 kart: i = 12 * pageIndex; i < 12 * pageIndex + 12; i++ [petla do przedostatniej karty ]

	// 			// jezeli wolana strona jest pagesCount (ostatnia strona)
	// 					// iteracja z ostatniej karty: i = cardsCount - lastPageCardsCount (12) a i < cardsCount;

	// 	if (pagesCount === 1) {
	// 		for (i = 0; i < cardsCount; i++) {
	// 			buildCardMiniature(selectedCards[i]);
	// 		}
	// 	} else if (pageIndex < pagesCount) { // wiem, że będzie 12 kart
	// 		for (i = cardsPerPage * (pageIndex - 1);i < cardsPerPage * (pageIndex - 1) + cardsPerPage;i++) {
	// 			buildCardMiniature(selectedCards[i]);
	// 		}
	// 	} else if (pageIndex === pagesCount) {
	// 		for (i = (cardsCount - lastPageCardsCount);i < cardsCount;i++) {
	// 			buildCardMiniature(selectedCards[i]);
	// 		}		
	// 	}

	// 	setCardsWrapperHeight();
	// }

	// function buildCardMiniature(card) {
	// 	var thumbs = '',
	// 		timeString = '';

	// 	for (var i = 0; i < card.attachments.length; i++) {
	// 		thumbs += '<img src="' + card.attachments[i] + '" class="card-thumb" />';
	// 	}

	// 	var now = new Date(),
	// 		relativeDate = now.getTime() - card.date;

	// 	if(relativeDate < 60000) {
	// 		timeString = 'just';
	// 	} else if (relativeDate < 3600000) {
	// 		timeString = (Math.floor(relativeDate / 60000)) + ' minutes ago';
	// 	} else if (relativeDate < 86400000) {
	// 		timeString = (Math.floor(relativeDate / 3600000)) + ' hours ago';
	// 	} else if (relativeDate > 86400000) {
	// 		timeString = (Math.floor(relativeDate / 86400000)) + ' days ago';
	// 	}

	// 	var flashcardClass = card.isFlashcard ? 'flashcard' : 'note',
	// 		urlifiedText = miniatureUrlify(card.url),
	// 		domain = extractDomain(card.url);

	// 	var html = '';
	// 		html += ' <div id="data-container' + card.id + '" class="data-container data-details ' + flashcardClass +'">';
	// 		html += ' 	<h3 class="data-details">' + card.title + '</h3>';
	// 		html += ' 	<p class="topic data-details">';
	// 		html += '		<span>' + timeString + '</span>';
	// 		html += '		<span>, in: <a class="card-topic-anchor">' + card.topic + '</a></span>';
	// 		html += '		<span> by <a class="card-author-anchor">' + card.author + '</a></span>';
	// 		html += '	</p>';
	// 		html += ' 	<p class="topic data-details"><b>' + card.views + '</b> views</p>';
	// 		if(!card.isFlashcard) {
	// 			html += ' 	<p class="data-details">' + card.text + '</p>';		
	// 			html += ' 	<div class="thumbs-container data-details">';
	// 			html += ' 		<p>Attachments: ' + card.attachments.length + '</p>';
	// 			html += ' 		<div>' + thumbs + '</div>';
	// 			html += ' 	</div>';
	// 			html += '		<div class="card-url">';
	// 			html += '			<label>External link:</label>';
	// 			html += '			<a rel="nofollow" href="' + card.url + '" target="_blank">' + domain + '</a>';
	// 			html += ' 			<div class="preview">' + urlifiedText + '</div>';
	// 			html += '		</div>';		
	// 			html += ' </div>';
	// 		}
	// 		html += ' <div class="card-actions" id="actions' + card.id + '">';
	// 		html += ' 	<a class="edit-card">Edit</a>';
	// 		html += ' 	<a class="remove-card">Remove</a>';
	// 		html += ' </div>';

	// 	var tempCardMiniature = document.createElement('DIV');
	// 	tempCardMiniature.id = "cardMiniature" + card.id;
	// 	tempCardMiniature.className = "card-miniature";
	// 	tempCardMiniature.innerHTML = html.trim();
	// 	cardsWrapper.appendChild(tempCardMiniature);
	// }

	// function addPagination() {
	// 	if(selectedCards.length <= cardsPerPage) {
	// 		pseudoFooter.innerHTML = '';
	// 		return false;
	// 	}	

	// 	var pagesCount = Math.ceil(selectedCards.length / cardsPerPage),
	// 		buttons = '';

	// 	for (var i=0; i < pagesCount; i++) {
	// 		buttons += '<li class="pagination-page">' + (i+1) + '</li>';
	// 	}

	// 	var html = '';
	// 		html += '	<ul id="paginationList" class="pagination-list">' + buttons + '</ul>';

	// 	pseudoFooter.innerHTML = html;

	// 	setCurrentPageClass();

	// 	document.addEventListener("click", function(event) {
	// 		var element = event.target;
	// 		if(hasClass(element, "pagination-page")) {
	// 			for(var i=0; i < paginationList.childNodes.length;i++) {
	// 				paginationList.childNodes[i].className = "pagination-page";
	// 			}		
	// 			element.className += ' current-page';
	// 			var page = element.firstChild.nodeValue;
	// 			selectedPage = page;
	// 			localStorage.setItem("selectedPage", JSON.stringify(page));
	// 			displayCards(page);
	// 		}
	// 	});

	// }

	// function setCurrentPageClass() {
	// 	if (paginationList.childNodes[parseInt(selectedPage) - 1]) {
	// 		paginationList.childNodes[parseInt(selectedPage) - 1].className += ' current-page';
	// 		//displayCards(selectedPage);
	// 	} else {
	// 		var pagesCount = Math.ceil(selectedCards.length / cardsPerPage);
	// 		paginationList.childNodes[parseInt(pagesCount) - 1].className += ' current-page';
	// 		//displayCards(pagesCount);
	// 	}
	// }

	// // Set Heights
	// function setCardsWrapperHeight() {
	// 	//cardsWrapper = wysokość okna - ( header + cardsFilter + pseudoFooter)
	// 	var cardsWrapperHeight = window.innerHeight - (header.offsetHeight + cardsFilter.offsetHeight + pseudoFooter.offsetHeight);
	// 	cardsWrapper.style.height = cardsWrapperHeight + 'px';
	// }

	// function setCardPreviewHeight() {
	// 	var cardPreviewHeight = window.innerHeight - (header.offsetHeight + cardsFilter.offsetHeight + pseudoFooter.offsetHeight);
	// 	cardPreview.style.height = cardPreviewHeight + 'px';
	// }

	// //Determine the number of cards to be displayed in the list view on a single page
	// function countCardsPerPage() {
	// 	var cardsWrapperHeight = window.innerHeight - (header.offsetHeight + cardsFilter.offsetHeight + pseudoFooter.offsetHeight),
	// 		cards = Math.floor(cardsWrapperHeight / listViewCardHeight);
	// 	return cards;
	// }

	// function setCardsPerPage() {
	// 	return (viewType === 'grid-view' || viewType === 'details-view') ? 12 : countCardsPerPage();
	// }

	// function handleResize() {
	// 	setCardsWrapperHeight();
	// 	setCardsPerPage();
	// 	getView();
	// }

	
	// /* Utils */
	// function hasClass(element, cls) {
	//     return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
	// }

	// /**
	//  *  Initialize Flashrr app
	//  */
	// init: function() {
	// 	getCollections();
	// 	setSorting();
	// 	countCards();
	// 	getView();
	// 	getTopics();
	// 	selectCardsByTopic();
	// 	greetUser();
	// 	addPagination();
	// 	checkSelectedFlashcardsOnly();		
	// }

})();