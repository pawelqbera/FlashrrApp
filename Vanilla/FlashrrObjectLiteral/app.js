(function(window) {
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

	/**
	 *	Spotted drawbacks of Object Literal Pattern: 
	 *  - no private methods: all methods are actually avaiable via Public API 
	 */

	/** TODOOS:
	 *	1. collectionSelector.selectedCollection -> definiować i odwoływać się do tylko w jednym module
	 *		bo jest problem z updejtem, jak się coś w kolekcji zmieni
	 *  2. Ustawić w każdym module poprawną kolejność: cacheDOM, render, bindEvents
	 *  	- w cacheDOM nie powinny być odwołania do dynamicznych elementów z render
	 *	3. Przenieść wszystkie inicjacyjne komponenty z index.html do pustych funkcji render()
	 */

	/**
	 * Model with Default Data Collections
	 */
	var data = {
		defaultCollection: {
			id: "xxxxx",
			name: "default_collection",
			description: "initial collection to start off",
			topics: ['js patterns', 'css patterns', 'jquery patterns'],
			cards: [{
				attachments: [],
				author: "Johnny Ola",
				date: 1460809197759,
				id: "ZOgOd",
				isFlashcard: false,
				submitLabel:"Update Card",
				tags: ['jack', 'johnny'],
				text: "object literal pattern",
				title: "OLP in action ",
				topic: "js patterns",
				url: "olp.com",
				views: 20				
			}]
		}
	};

	/**	
	 *  Utils module contains shims, DOM manipulation 
	 *  function helpers and stuff for other purposes 
	 */
	var utils = {

		hasClass: function(element, cls) {
		    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
		},
		urlify: function(text) {
			/**
			* Store the base text string for further comparison
			*/
			var baseStr = text;
			/**
			* Match all URLs except image and YouTube video links
			*/ 
			var ordinaryUrlRegexp = /(?!(https?:\/\/.*\.(?:png|jpg|gif|jpeg)))(?!(http(?:s)?:\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?​=]*)?))(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;	
			/**
			* Match all YouTube video links
			*/
			var ytUrlRegexp = /http(?:s)?:\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?​=]*)?/ig;	
			/**
			* Match all image links
			*/   
			var imgUrlRegexp = /(https?:\/\/.*\.(?:png|jpg|gif|jpeg))/ig;
			text = text.replace(ordinaryUrlRegexp, '');
			text = text.replace(ytUrlRegexp, '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>');
			text = text.replace(imgUrlRegexp, '<img src="$1" alt />');	

			baseStr === text ? text = '' : text;			

			return text;
		},
		extractDomain: function(url) {
			var domain = null;
			
			/**
			 *  Find & remove protocol (http, ftp, etc.) and get domain
			 */
			if (url.indexOf("://") > -1) {
				domain = url.split('/')[2];
			} else {
				domain = url.split('/')[0];
			}

			/**
			 *  Find & remove port number
			 */	
			domain = domain.split(':')[0];

			return domain;
		},
		makeid: function() {
		    var text = "",
		    	possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		    for( var i=0; i < 5; i++ )
		        text += possible.charAt(Math.floor(Math.random() * possible.length));
		    return text;
		}
	};

	/**	
	 *  Card counter module 
	 */
	var cardCounter = {
		init: function() {
			collectionSelector.selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection;

			this.cacheDOM();
			this.render();
		},
		cacheDOM: function() {
			this.cardCounter = document.getElementById("cardCounter");
		},
		render: function() {
			var existingCards = collectionSelector.selectedCollection.cards,
				count = document.createTextNode(existingCards.length);
			
			this.cardCounter.innerHTML = '';
			this.cardCounter.appendChild(count);
			count.nodeValue = existingCards.length
		}		
	};

	/**	
	 *  Flashcards only checkbox option module
	 */
	var flashcardsOnly = {
		selectedFlashcardsOnly: JSON.parse(localStorage.getItem("selectedFlashcardsOnly")) || false,
		selectedCollection: JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection,

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
			// bring here html from index.html

			this.checkSelectedFlashcardsOnly();
		},
		toggleTextCards: function(e) {

			var element = (typeof e !== 'undefined') ? e.target : this.showFlashcardsOnly;

			if(element.checked === true) {
				localStorage.setItem('selectedFlashcardsOnly', JSON.stringify(true));			
				
				for (var i=0;i < collectionSelector.selectedCollection.cards.length;i++) {
					if(collectionSelector.selectedCollection.cards[i].isFlashcard === false) {
						if(!document.getElementById("cardMiniature" + collectionSelector.selectedCollection.cards[i].id)) {
							return;
						}
						var card = document.getElementById("cardMiniature" + collectionSelector.selectedCollection.cards[i].id);
						if (typeof card !== 'undefined') {
							card.parentNode.removeChild(card);				
						}
						pagination.render();
					}
				}
			} else {
				localStorage.setItem('selectedFlashcardsOnly', JSON.stringify(false));		
				cards.render(collectionSelector.selectedCollection.cards);
			}
		},
		checkSelectedFlashcardsOnly: function() {
			if(this.selectedFlashcardsOnly === true) {
				this.showFlashcardsOnly.checked = true;
				this.toggleTextCards();
			}
		}
		
	};

	/**	
	 *  Search cards module 
	 *
	 */
	var searchCards = {
		selectedCollection: JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection,

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
			//wstawić tutaj render modułu szukacza
		},
		searchCard: function(e) {
			var searchValue = this.searchCards.value,
				selectedCategorySearch = this.categorySearchSelect.options[this.categorySearchSelect.selectedIndex].value,
				selectedCards = collectionSelector.selectedCollection.cards;

			console.log('search init with ' + searchValue);

			cards.init(pagination.selectedPage);

			for(var i = 0; i < selectedCards.length; i++) {
				var obj = selectedCards[i];
				if(obj[selectedCategorySearch].indexOf(searchValue) === -1) {
					if(!document.getElementById("cardMiniature" + obj.id)) {
						return;
					}
					var card = document.getElementById("cardMiniature" + obj.id);
					if (card) {
						card.parentNode.removeChild(card);				
					}
					pagination.init();
				}
			}

		}		
	};

	/**	
	 *  Views module for manipulating displaying 
	 *  cards options and types
	 *
	 */
	var viewTypes = {
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
			this.sectionWrapper = document.getElementById("sectionWrapper");
		},
		bindEvents: function() {
			this.gridViewBtn.addEventListener("click", this.toggleView.bind(this));
			this.listViewBtn.addEventListener("click", this.toggleView.bind(this));
			this.detailsViewBtn.addEventListener("click", this.toggleView.bind(this));
		},
		render: function() {
			//tu wstawić render buttonów do wyboru view type

			this.getView();
		},
		toggleView: function(e) {
			var element = e.target;
			
			if (element.id === "gridViewBtn" && this.viewType !== 'grid-view') {
				this.switchGridView();
			} else if (element.id === "listViewBtn" && this.viewType !== 'list-view') {
				this.switchListView();	
			} else if (element.id === "detailsViewBtn" && this.viewType !== 'details-view') {
				this.switchDetailsView();	
			}
		},
		getView: function() {
			if(this.viewType === 'grid-view') {
				this.switchGridView();
			} else if (this.viewType === 'list-view') {
				this.switchListView();
			} else {
				this.switchDetailsView();
			}
		},
		switchGridView: function() {
			if (this.viewType === 'details-view') {
				this.removeCardPreview();
			}	
			this.viewType = 'grid-view';
			var cardsPerPage = cards.setCardsPerPage();
			cards.cardsWrapper.className = 'grid-view';
			this.gridViewBtn.className += ' active';
			this.listViewBtn.className = this.listViewBtn.className.replace( /(?:^|\s)active(?!\S)/g , '' );
			this.detailsViewBtn.className = this.detailsViewBtn.className.replace( /(?:^|\s)active(?!\S)/g , '' );
			localStorage.setItem("viewType", JSON.stringify(this.viewType));
			
			pagination.init();
		},
		switchListView: function() {
			if (this.viewType === 'details-view') {
				this.removeCardPreview();
			}	
			this.viewType = 'list-view';
			var cardsPerPage = cards.setCardsPerPage();
			cards.cardsWrapper.className = 'list-view';
			this.listViewBtn.className += ' active';
			this.gridViewBtn.className = this.gridViewBtn.className.replace( /(?:^|\s)active(?!\S)/g , '' );
			this.detailsViewBtn.className = this.detailsViewBtn.className.replace( /(?:^|\s)active(?!\S)/g , '' );
			localStorage.setItem("viewType", JSON.stringify(this.viewType));
			
			pagination.init();		
		},
		switchDetailsView: function() {
			this.viewType = 'details-view';
			var cardsPerPage = cards.setCardsPerPage();
			cards.cardsWrapper.className = 'details-view';
			this.detailsViewBtn.className += ' active';
			this.listViewBtn.className = this.listViewBtn.className.replace( /(?:^|\s)active(?!\S)/g , '' );
			this.gridViewBtn.className = this.gridViewBtn.className.replace( /(?:^|\s)active(?!\S)/g , '' );
			localStorage.setItem("viewType", JSON.stringify(this.viewType));
			
			pagination.init();
			this.createCardPreview();
			cardView.init(collectionSelector.selectedCollection.cards[0]);
		},
		createCardPreview: function() {
			var html = '';

			html += '<div id="cardField" class="card-preview-sheet"></div>';

			var cardPreview = document.createElement('SECTION');
			cardPreview.id = "cardPreview";
			cardPreview.className = "card-preview";
			cardPreview.innerHTML = html.trim();
			this.sectionWrapper.appendChild(cardPreview);
			cards.setCardPreviewHeight();	
		},
		removeCardPreview: function() {
			var cardPreview = document.getElementById("cardPreview");
			cardPreview.parentNode.removeChild(cardPreview);	
		}
	};

	/**
	 *	Profile module
	 */
	var profile = {
		userName: JSON.parse(localStorage.getItem("userName")) || "Guest",

		init: function() {
			this.cacheDOM();
			this.bindEvents();
			this.render();
		},
		cacheDOM: function() {
			this.hiUserName = document.getElementById("hiUserName");
			this.userNameSection = document.getElementById('userNameSection');
		},
		bindEvents: function() {
			this.hiUserName.addEventListener("click", function() { userNameForm.init(); });
		},
		render: function() {
			var data = {
				userName: this.userName
			}
			this.hiUserName.innerHTML = data.userName;
		}
	};

	var userNameForm = {
		userName: JSON.parse(localStorage.getItem("userName")) || "Guest",

		init: function() {
			this.render();
			this.cacheDOM();
			this.bindEvents();
		},
		render: function() {
			// ponadto przyda się ogólny obiekt na tworzenie FORMÓW, bo widać tu 
			// ewidentnie wspólne elementy takie jak: fogBlanket, metoda close, appendowanie do parenta itp.

			if (this.userNameSection) {
				return false;
			}

			var html = '';
				html += '	<form id="userNameForm" method="POST">';
				html += '		<h2>Please enter your name</h2>';
				html += '		<span id="closeBtn" class="close-btn">X</span>';
				html += '		<div>';
				html += '			<input type="text" id="formUserName" name="formUserName" value="' + this.userName + '" placeholder="enter your name">';
				html += '		</div>';
				html += '		<div>';
				html += '			<button>Change Name</button>';
				html += '			<a id="cancelForm" class="cancel-form">Cancel</a>';
				html += '		</div>';
				html += '	</form>';


			// ewidentny przykład DRY - utworzyć metodę append to
			var userNameForm = document.createElement('SECTION');
			userNameForm.id = "userNameSection";
			userNameForm.className = "user-name-section";
			userNameForm.innerHTML = html.trim();
			pageWrapper.appendChild(userNameForm);

			// ewidentny przykład #2 DRY - utworzyć metodę createFogBlanket
			var fogBlanket = document.createElement('div');
			fogBlanket.className = "fog-blanket";
			fogBlanket.id = "fogBlanket";
			pageWrapper.appendChild(fogBlanket);
		},
		cacheDOM: function() {
			this.userNameForm = document.getElementById("userNameForm");
			this.closeBtn = document.getElementById('closeBtn');
			this.cancelForm = document.getElementById('cancelForm');
			this.fogBlanket = document.getElementById('fogBlanket');
		},
		bindEvents: function() {
			this.closeBtn.addEventListener('click', this.closeUserNameForm.bind(this));
			this.cancelForm.addEventListener('click', this.closeUserNameForm.bind(this));
			this.fogBlanket.addEventListener('click', this.closeUserNameForm.bind(this));
			this.userNameForm.addEventListener('submit', this.userNameSubmit.bind(this));			
		},
		closeUserNameForm: function() {
			var userNameFormWrapper = this.userNameForm.parentNode;
			userNameFormWrapper.parentNode.removeChild(userNameFormWrapper);
			this.closeUserNameFogBlanket();
		},
		closeUserNameFogBlanket: function() {
			var isFog = !!document.getElementById("fogBlanket");
			
			if(isFog) {
				var fogBlanket = document.getElementById("fogBlanket");
				fogBlanket.parentNode.removeChild(fogBlanket);		
			}
		},
		userNameSubmit: function() {
			this.userName = formUserName.value;
			localStorage.setItem("userName", JSON.stringify(this.userName));
			this.closeUserNameForm();
			profile.render();
		}
	};

	/**	
	 *  Card Collections module
	 *
	 */
	var collectionSelector = {
		collections: JSON.parse(localStorage.getItem("Collections")) || [data.defaultCollection],
		selectedCollection: JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection,
		selectedCollectionIndex: JSON.parse(localStorage.getItem("selectedCollectionIndex")) || 0,

		init: function() {
			this.cacheDOM();
			this.render();
			this.bindEvents();			
		},
		cacheDOM: function() {
			this.collectionSelect = document.getElementById("collectionSelect");
		},
		bindEvents: function() {
			this.collectionSelect.addEventListener("change", this.selectCollection.bind(this));
			this.editCollectionBtn.addEventListener("click", function(e) {
				if (document.getElementById('collectionSection')) {
					collectionForm.closeCreateCollectionForm();
				}

				var selectedCollectionIndex = collectionSelect.options[collectionSelect.selectedIndex].value,
					i = 0,
					obj = null,
					editableCollection = null;			

				for(; i < cards.collections.length; i++) {
					obj = cards.collections[i];
					if(cards.collections[selectedCollectionIndex].id.indexOf(obj.id) !== -1) {
						editableCollection = cards.collections[i];
						break;
					}
				}
				collectionForm.init(editableCollection);
			}.bind(this));			
		},
		render: function() {
			this.selectedCards = this.selectedCollection.cards;
			var collectionOptions = '';
			for (var i = 0; i < this.collections.length; i++) {
				var isSelected = (this.selectedCollection.name.indexOf(this.collections[i].name) !== -1) ? 'selected="selected"' : '';
				collectionOptions += '<option value="' + i + '"'+ isSelected +'>' + this.collections[i].name + '</option>';
			}
			var html = '';
				html += '	<option value="-1">Collections</option>';
				html += collectionOptions;
				html += '	<option value="addNewCollection">ADD NEW COLLECTION</option>';
			
			this.collectionSelect.innerHTML = html;
			
			if(this.collectionSelect.value !== '-1' && this.collectionSelect.value !== 'addNewCollection'){
				this.addEditCollectionBtn();
			}
		},
		selectCollection: function(e) {

			var element = e.target || e;
			
			this.removeEditCollectionBtn();
			
			if (element.value === '-1') {
				return false;
			} else if (element.value === 'addNewCollection') {
				collectionForm.init();
			} else {
				this.selectedCollection = cards.collections[element.value];
				localStorage.setItem("selectedCollection", JSON.stringify(this.selectedCollection));
				this.selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || cards.collections[0];
				topicSelector.selectedTopic = -1;
				localStorage.setItem("selectedTopic", JSON.stringify(topicSelector.selectedTopic));	
				//selectedCards = this.selectedCollection.cards;
				this.selectedCollectionIndex = collectionSelector.collectionSelect.options[collectionSelector.collectionSelect.selectedIndex].value;
				localStorage.setItem("selectedCollectionIndex", JSON.stringify(this.selectedCollectionIndex));

				cards.init();
				cardCounter.init();
				
				topicSelector.getTopics();
				pagination.init();
				
				this.addEditCollectionBtn();

			}
		},
		addEditCollectionBtn: function() {
			this.editCollectionBtn = document.createElement("i");
			this.editCollectionBtn.className = "edit-collection fa fa-cog";
			this.editCollectionBtn.id = "editCollectionBtn";
			this.collectionSelect.parentNode.appendChild(this.editCollectionBtn);
		},
		removeEditCollectionBtn: function() {
			if(!document.getElementById("editCollectionBtn")) {
				return false;
			}
			this.collectionSelect.parentNode.removeChild(editCollectionBtn);
		}
	};

	/**
	*  Collection Form
	*/
	var collectionForm = {
		selectedCollection: JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection,

		init: function(editableCollection) {
			editableCollection = editableCollection || false;

			this.render(editableCollection);
			this.cacheDOM();
			this.bindEvents();
		},
		cacheDOM: function() {			
			this.collectionForm = document.getElementById('collectionForm');
			this.fogBlanket = document.getElementById('fogBlanket');			
			this.closeBtn = document.getElementById('closeBtn');
			this.cancelFormBtn = document.getElementById('cancelFormBtn');
			this.deleteCollectionBtn = document.getElementById('deleteCollectionBtn');
		},
		bindEvents: function() {
			this.closeBtn.addEventListener('click', this.closeCreateCollectionForm.bind(this));
			this.cancelFormBtn.addEventListener('click', this.closeCreateCollectionForm.bind(this));
			this.fogBlanket.addEventListener('click', this.closeCreateCollectionForm.bind(this));			
			this.collectionForm.addEventListener('submit', function(event) {
				event.preventDefault();
				this.createCollection(this.updatedCollectionId, this.collectionCards);
			}.bind(this));
		},
		render: function(editableCollection) {
			if (document.getElementById('collectionSection')) {
				return false;
			}

			var editMode = editableCollection ? true : false,
				collectionFormHeader = editableCollection ? "Edit Collection" : "New Collection",	
				collectionName = editableCollection ? editableCollection.name : "",
				collectionDescription = editableCollection ? editableCollection.description : "",
				collectionTopics = editableCollection ? editableCollection.topics : [],
				collectionFormSubmitLabel = editableCollection ? "Update Collection" : "Add New Collection";
				
			this.updatedCollectionId = editableCollection ? editableCollection.id : null;
			this.collectionCards = editableCollection ? editableCollection.cards : [];

			collectionSelector.selectedCollection.topics = editableCollection ? collectionSelector.selectedCollection.topics : [];

			var html = '';
				html += '	<form id="collectionForm" method="POST">';
				html += '		<h2>' + collectionFormHeader + '</h2>';
				html += '		<span id="closeBtn" class="close-btn">X</span>';
				html += '		<div>';
				html += '			<input type="text" id="collectionName" name="collectionName" value="' + collectionName + '" placeholder="name">';
				html += '		</div>';
				html += '		<div>';
				html += '			<input type="text" id="collectionDescription" name="collectionDescription" value="' + collectionDescription + '" placeholder="description">';
				html += '		</div>';
				html += '		<div id="cardTopicWrapper"></div>';
				html += '		<div>';
				html += '			<button>' + collectionFormSubmitLabel + '</button>';
				html += '			<a class="cancel-form" id="cancelFormBtn">Cancel</a>';
				if(this.updatedCollectionId !== null) {	
				html += '			<a class="delete-collection" id="deleteCollectionBtn">Delete Collection</a>';					
				}
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

			topicAdder.init("cardTopicWrapper", true);
		},
		closeCreateCollectionForm: function() {
			var collectionForm = document.getElementById("collectionForm").parentNode;
			collectionForm.parentNode.removeChild(collectionForm);
			this.closeCreateCollectionFogBlanket();
			collectionSelector.selectCollection(collectionSelector.selectedCollectionIndex);
		},
		closeCreateCollectionFogBlanket: function() {
			var isFog = !!document.getElementById("fogBlanket");
			
			if(isFog) {
				var fogBlanket = document.getElementById("fogBlanket");
				fogBlanket.parentNode.removeChild(fogBlanket);		
			}
		},		
		createCollection: function(updatedCollectionId, collectionCards) {
			var date = new Date(),
				form = document.forms[0],
				collection = {
					id: updatedCollectionId || utils.makeid(),
					name: collectionName.value,
					description: collectionDescription.value,
					author: profile.userName,
					date: date.getTime(),
					topics: collectionSelector.selectedCollection.topics,
					cards: collectionCards || []
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
			cards.collections = existingCollections;
			localStorage.setItem("Collections", JSON.stringify(existingCollections));
			cards.collections = JSON.parse(localStorage.getItem("Collections"));
			collectionSelector.selectedCollection = collection;
			localStorage.setItem("selectedCollection", JSON.stringify(collectionSelector.selectedCollection));
			collectionSelector.selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || cards.collections[0];	
			
			collectionSelector.removeEditCollectionBtn();
			
			collectionSelector.init();
			topicSelector.init();
			cards.init(pagination.selectedPage);
			cardCounter.init();
			pagination.init();
			
			this.closeCreateCollectionForm();
			
			topicSelector.selectCardsByTopic();
		},
	 	deleteCollection: function() {
	 		var confirmDelete = confirm("All your collection data including cards will be deleted. Continue?");
	 		
	 		if (confirmDelete) {
				if (document.getElementById('collectionForm')) {
					closeCollectionForm();
				}
				collections.splice(selectedCollectionIndex, 1);

				localStorage.setItem("Collections", JSON.stringify(collections));
				collections = JSON.parse(localStorage.getItem("Collections")) || [defaultCollection];
				collectionSelector.selectedCollection = collections[selectedCollectionIndex - 1];
				localStorage.setItem("selectedCollection", JSON.stringify(collectionSelector.selectedCollection));
				collectionSelector.selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || collections[0];
				
				this.closeCreateCollectionForm();

				collectionSelector.init();
				cards.init(this.selectedPage);
				cardsCount.init();

	 		} else {
	 			return false;
	 		}
	    }	
	};

	/**	
	 *  Cards module
	 *
	 */			
	var cards = {
		collections: JSON.parse(localStorage.getItem("Collections")) || [data.defaultCollection],
		selectedCollection: JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection,
		
		init: function(page) {
			page = page || false;

			this.cacheDOM();
			this.bindEvents();
			this.render(page);
		},
		cacheDOM: function() {
			this.createCardBtn = document.getElementById("createCardBtn");
			this.cardsWrapper = document.getElementById("cardsWrapper");
			this.header = document.getElementById("header");
			this.pseudoFooter = document.getElementById("pseudoFooter");			
		},
		bindEvents: function() {
			this.createCardBtn.addEventListener("click", function() { cardForm.init(); });
		},
		render: function(page) {

			var pageIndex = parseInt(page) || 1,
				i = 0,
				selectedCards = collectionSelector.selectedCollection.cards,
				cardsPerPage = this.setCardsPerPage();

			this.sortCards(selectedCards);

			this.cardsWrapper.innerHTML = '';

			var cardsCount = selectedCards.length; // 19 - number of cards
			var lastPageCardsCount = cardsCount % cardsPerPage; // 7 - liczba kart na ostatniej stronie

			if(lastPageCardsCount === 0) {
				lastPageCardsCount = cardsPerPage;
			}

			var pagesCount = Math.ceil(selectedCards.length / cardsPerPage); // 2 - liczba podstron

			if (pagesCount === 1) {
				for (i = 0; i < cardsCount; i++) {
					cardMiniature.init(selectedCards[i]);
				}
			} else if (pageIndex < pagesCount) { // wiem, że będzie 12 kart
				for (i = cardsPerPage * (pageIndex - 1);i < cardsPerPage * (pageIndex - 1) + cardsPerPage;i++) {
					cardMiniature.init(selectedCards[i]);
				}
			} else if (pageIndex === pagesCount) {
				for (i = (cardsCount - lastPageCardsCount);i < cardsCount;i++) {
					cardMiniature.init(selectedCards[i]);
				}		
			}

			this.setCardsWrapperHeight();

		},
		sortCards: function(cards) {
			if(cardsFilter.selectedSorting === 'date') {
				this.sortCardsByDate(cards);
			} else if(cardsFilter.selectedSorting === 'popularity') {
				this.sortCardsByPopularity(cards);
			} else if(cardsFilter.selectedSorting === 'title') {
				this.sortCardsByTitle(cards);
			}		
		},
		sortCardsByDate: function(cards) {
			cards.sort(function(a, b){
				return b.date - a.date;
			});
		},
		sortCardsByPopularity: function(cards) {
			cards.sort(function(a, b){
				return b.views - a.views;
			});
		},
		sortCardsByTitle: function(cards) {
			cards.sort(function(a, b){
				if (a.title < b.title) {
					return -1;
				} else if (a.title > b.title) {
					return 1;
				} else {
					return 0;
				}
			});
		},
		setCardsPerPage: function() {
	 		return (viewTypes.viewType === 'grid-view' || viewTypes.viewType === 'details-view') ? 12 : this.countCardsPerPage();
		},
		/**
	     *  Determine the number of cards to be displayed in the list view on a single page
	     */
		countCardsPerPage: function() {
			// spr dlaczego tutaj musiałem dawać document.get zamiast 
			// np. this.pseudoFooter.offsetHeight - wyrzucało mi undefined
			// nie czaje czemu ????
			var cardsWrapperHeight = window.innerHeight - (document.getElementById("header").offsetHeight + cardsFilter.cardsFilterWrapper.offsetHeight + document.getElementById("pseudoFooter").offsetHeight),
				listViewCardHeight = 150, // ugly, should be avoided such appending
				cardsPerPage = Math.floor(cardsWrapperHeight / listViewCardHeight);
			return cardsPerPage;
		},
		setCardsWrapperHeight: function() {
	 		var cardsWrapperHeight = window.innerHeight - (this.header.offsetHeight + cardsFilter.cardsFilterWrapper.offsetHeight + this.pseudoFooter.offsetHeight);
	 		cards.cardsWrapper.style.height = cardsWrapperHeight + 'px';
		},
		setCardPreviewHeight: function() {
			var cardPreviewHeight = window.innerHeight - (this.header.offsetHeight + cardsFilter.cardsFilterWrapper.offsetHeight + this.pseudoFooter.offsetHeight),
				cardPreview = document.getElementById('cardPreview');
			
			cardPreview.style.height = cardPreviewHeight + 'px';
		},
		removeCard: function(cardId) {
		    var selectedCollectionIndex = collectionSelect.options[collectionSelect.selectedIndex].value,
				i = 0,
				obj = null;

			if (document.getElementById('viewCardSection')) {
				cardView.closeCardView();
			}
			for(;i < collectionSelector.selectedCollection.cards.length; i++) {
				obj = collectionSelector.selectedCollection.cards[i];
				if(cardId.indexOf(obj.id) !== -1) {
					collectionSelector.selectedCollection.cards.splice(i, 1);
					break;
				}
			}


			// DRY: Wstawić to do osobnej funkcji
			//      updateCardCollections()
			// Update and load new collections
			cards.collections[selectedCollectionIndex].cards = collectionSelector.selectedCollection.cards;
			localStorage.setItem("Collections", JSON.stringify(cards.collections));
			cards.collections = JSON.parse(localStorage.getItem("Collections")) || [defaultCollection];

			// Update and load new selectedCollection based on updated collections
			collectionSelector.selectedCollection = cards.collections[selectedCollectionIndex];
			localStorage.setItem("selectedCollection", JSON.stringify(collectionSelector.selectedCollection));
			collectionSelector.selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || cards.collections[0];
		
			this.init(pagination.selectedPage);
			pagination.init();	
			cardCounter.init();
		}
	};

	/**
	 * Card Miniature module
	 *
	 */
	var cardMiniature = {
		selectedCollection: JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection,

		init: function(card) {
			this.render(card);
			this.cacheDOM(card);
			this.bindEvents();
		},
		cacheDOM: function(card) {
			this.cardId = card.id;			
			this.tempCardMiniature = document.getElementById("cardMiniature" + this.cardId);
		},
		bindEvents: function() {
			this.tempCardMiniature.addEventListener('click', function(e) {
				var element = e.target,
					parentId = (element.parentNode && element.parentNode.id) ? element.parentNode.id.slice(-5) : '';

				if (utils.hasClass(element, 'edit-card')) {
					if (document.getElementById('viewCardSection')) {
						cardView.closeCardView();
					}
					var editableCard = '',
						i = 0,
						obj;
					for(; i < collectionSelector.selectedCollection.cards.length; i++) {
						obj = collectionSelector.selectedCollection.cards[i];

						if(parentId.indexOf(obj.id) !== -1) {
							editableCard = collectionSelector.selectedCollection.cards[i];
							break;
						}
					}
					cardForm.init(editableCard);	
			    } else if (utils.hasClass(element, 'remove-card')) {
					cards.removeCard(parentId); 
			    } else if (utils.hasClass(element, 'data-details')) {
					if (document.getElementById('viewCardSection')) {
						cardView.closeCardView();
					}		
					
					var viewedCard = '',
						i = 0;

					for(; i < collectionSelector.selectedCollection.cards.length; i++) {
						obj = collectionSelector.selectedCollection.cards[i];

						if(parentId.indexOf(obj.id) !== -1) {
							viewedCard = collectionSelector.selectedCollection.cards[i];
							break;
						}
					}

					cardView.viewedCardIndex = i + 1;
					cardView.init(viewedCard);
				} else if (utils.hasClass(element, 'card-author-anchor')) {
					searchCards.value = element.text;
					categorySearchSelect.getElementsByTagName('option')[3].selected = 'selected';
					topicSelect.getElementsByTagName('option')[0].selected = 'selected';
					topicSelector.selectedTopic = topicSelect.options[topicSelect.selectedIndex].value;
					localStorage.setItem("selectedTopic", JSON.stringify(topicSelector.selectedTopic));
					topicSelector.selectCardsByTopic();		
					searchCards.searchCard();
				} else if (utils.hasClass(element, 'card-topic-anchor')) {
					searchCards.value = '';
					categorySearchSelect.getElementsByTagName('option')[0].selected = 'selected';				
					for (i = 0;i < collectionSelector.selectedCollection.topics.length;i++) {
						if(element.text.indexOf(collectionSelector.selectedCollection.topics[i]) !== -1) {
							topicSelector.topicSelect.getElementsByTagName('option')[i+1].selected = 'selected';
						}
					}
					topicSelector.selectedTopic = topicSelector.topicSelect.options[topicSelector.topicSelect.selectedIndex].value;
					localStorage.setItem("selectedTopic", JSON.stringify(topicSelector.selectedTopic));
					topicSelector.selectCardsByTopic();
				} else if (utils.hasClass(element, 'card-thumb')) {
					var viewImg = window.open("", "Image Preview", "height=500,width=500");
					viewImg.document.write('<img src="' + element.src + '" />');
				}
			}.bind(this));
		},
		render: function(card) {
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

			var flashcardClass = card.isFlashcard ? 'flashcard' : 'note',
				urlifiedText = utils.urlify(card.url),
				domain = utils.extractDomain(card.url);

			var html = '';
				html += ' <div id="data-container' + card.id + '" class="data-container data-details ' + flashcardClass +'">';
				html += ' 	<h3 class="data-details">' + card.title + '</h3>';
				html += ' 	<p class="topic data-details">';
				html += '		<span>' + timeString + '</span>';
				html += '		<span>, in: <a class="card-topic-anchor">' + card.topic + '</a></span>';
				html += '		<span> by <a class="card-author-anchor">' + card.author + '</a></span>';
				html += '	</p>';
				html += ' 	<p class="topic data-details"><b>' + card.views + '</b> views</p>';
				if(!card.isFlashcard) {
					html += ' 	<p class="data-details">' + card.text + '</p>';		
					html += ' 	<div class="thumbs-container data-details">';
					html += ' 		<p>Attachments: ' + card.attachments.length + '</p>';
					html += ' 		<div>' + thumbs + '</div>';
					html += ' 	</div>';
					html += '		<div class="card-url">';
					html += '			<label>External link:</label>';
					html += '			<a rel="nofollow" href="' + card.url + '" target="_blank">' + domain + '</a>';
					html += ' 			<div class="preview">' + urlifiedText + '</div>';
					html += '		</div>';		
					html += ' </div>';
				}
				html += ' <div class="card-actions" id="actions' + card.id + '">';
				html += ' 	<a class="edit-card">Edit</a>';
				html += ' 	<a class="remove-card">Remove</a>';
				html += ' </div>';

			var tempCardMiniature = document.createElement('DIV');
			tempCardMiniature.id = "cardMiniature" + card.id;
			tempCardMiniature.className = "card-miniature";
			tempCardMiniature.innerHTML = html.trim();
			cards.cardsWrapper.appendChild(tempCardMiniature);
		}		
	};

	/**	
	 *  Cards Filter module
	 *
	 */	
	var cardsFilter = {
		selectedSorting: JSON.parse(localStorage.getItem("selectedSorting")) || "date",

		init: function() {
			this.cacheDOM();
			this.bindEvents();
			this.render();
		},
		cacheDOM: function() {
			this.cardsFilterWrapper = document.getElementById("cardsFilter");
		},
		bindEvents: function() {
			this.cardsFilterWrapper.addEventListener("change", this.selectSortingMethod.bind(this));
		},
		render: function() {

		},
		selectSortingMethod: function(e) {
			var element = e.target;
			if (element.value === this.selectedSorting) {
				return false;
			} else {
				this.selectedSorting = element.value;
				localStorage.setItem("selectedSorting", JSON.stringify(this.selectedSorting));
				
				cards.init(pagination.selectedPage);
			}
		},
		setSorting: function() {
			// Zamienić to na pętlę???

			if (this.selectedSorting === 'date') {
				this.cardsFilterWrapper.getElementsByTagName('option')[0].selected = 'selected';
			} else if (this.selectedSorting === 'popularity') {
				this.cardsFilterWrapper.getElementsByTagName('option')[1].selected = 'selected';
			} else if (this.selectedSorting === 'title') {
				this.cardsFilterWrapper.getElementsByTagName('option')[2].selected = 'selected';
			}
		}
	};

	/**
	 * Card Form module
	 *
	 */
	var cardForm = {
		selectedCollection: JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection,

		init: function(editableCard) {
			editableCard = editableCard || false;
			this.render(editableCard);
			this.cacheDOM();			
			this.bindEvents();			
		},
		cacheDOM: function() {
			this.closeBtn = document.getElementById('closeBtn');
			this.cancelForm = document.getElementById('cancelFormBtn');
			this.fogBlanket = document.getElementById('fogBlanket');
		},
		bindEvents: function() {
			this.closeBtn.addEventListener('click', this.closeCreateCardForm.bind(this));
			this.cancelForm.addEventListener('click', this.closeCreateCardForm.bind(this));
			this.fogBlanket.addEventListener('click', this.closeCreateCardForm.bind(this));	

			createCardForm.addEventListener('submit', function(event) {
				event.preventDefault();
				this.createCard(this.updatedCardId, this.cardAttachments);
			}.bind(this));

			cardAttachment.addEventListener('change', function(event) {
				this.getAttachments(event, this.cardAttachments);
			}.bind(this));

			cardDropArea.addEventListener("dragover", function(event) {
				event.stopPropagation();
				event.preventDefault();
			}.bind(this));

			cardDropArea.addEventListener("dragleave", function(event) {
				event.stopPropagation();
				event.preventDefault();
			}.bind(this));

			cardDropArea.addEventListener("drop", function(event) {
				this.getAttachments(event, this.cardAttachments);
			}.bind(this));
		},
		render: function(editableCard) {
			if (document.getElementById('createCardSection')) {
				return false;
			}

			var editMode = editableCard ? true : false,
				cardFormHeader = editableCard ? "Edit Card" : "Create Card",
				cardTitle = editableCard ? editableCard.title : "",
				cardUrl = editableCard ? editableCard.url : "",
				cardText = editableCard ? editableCard.text : "",
				cardTags = editableCard ? editableCard.tags : "",
				cardThumbs = editableCard ? editableCard.thumbs : "",
				cardFormSubmitLabel = editableCard ? editableCard.submitLabel : "Create Card",
				isFlashcard = editableCard ? editableCard.isFlashcard : false;

			this.updatedCardId = editableCard ? editableCard.id : null;
			this.cardAttachments = editableCard ? editableCard.attachments : [];

			var cardThumbs = '',
				i = 0;

				for (; i < this.cardAttachments.length; i++) {
					cardThumbs += '<img src="' + this.cardAttachments[i] + '" class="view-card-thumb" />';
				}

			var html = '';
				html += '	<form id="createCardForm" method="POST">';
				html += '		<h2>' + cardFormHeader + '</h2>';
				html += '		<span id="closeBtn" class="close-btn">X</span>';
				html += '		<div class="card-type-wrapper">';
				html += '			<label for="cardType">Card Type</label>';
				html += '			<select id="cardType" name="cardType" required>';
				html +=	'				<option value="text" selected="selected">default text</option>';
				html += '			</select>';
				html += '		</div>';
				html += '		<div id="cardTopicWrapper" class="card-topic-wrapper"></div>';
				html += '		<div>';
				html += '			<input type="text" id="cardTitle" name="cardTitle" value="' + cardTitle + '" placeholder="title" required>';
				html += '		</div>';
				html += '		<div>';
				html += '			<input type="text" id="cardUrl" name="cardUrl" value="' + cardUrl + '" placeholder="external link">';
				html += '		</div>';
				html += '		<div>';
				html += '			<textarea id="cardText" name="cardText" placeholder="enter some content here..." required>' + cardText + '</textarea>';
				html += '		</div>';
				html += '		<div>';
				html += '			<label>Tags [optional]</label>';
				html += '			<input type="text" id="cardTags" name="cardTags" value="' + cardTags + '" placeholder="eg. books, reading, literature">';
				html += '		</div>';
				html += '		<div id="cardDropArea" class="card-drop-area">';
				html += '			<input type="file" id="cardAttachment" class="card-attachment" multiple>';
				html += '		</div>';
				html += '		<div>';
				html += '			<label>Attachments:</label>';				
				html += '			<div class="view-thumb-list">' + cardThumbs + '</div>';
				html += '		</div>';
				html += '		<div id="thumbList" class="thumb-list"></div>';
				html += '		<div>';
				html += '			<input type="checkbox" id="flashcardCheck">';
				html += '			<label for="flashcardCheck">Flashcard</label>';
				html += '		</div>';
				html += '		<div>';
				html += '			<button class="submit-card-form">' + cardFormSubmitLabel + '</button>';
				html += '			<a id="cancelFormBtn" class="cancel-form">Cancel</a>';
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
				flashcardCheck = document.getElementById("flashcardCheck"),
				cardDropArea = document.getElementById("cardDropArea");

			if(isFlashcard) {
				flashcardCheck.checked = true;
			} else {
				flashcardCheck.checked = false;
			}

			topicAdder.init("cardTopicWrapper");

			//this.createAddTopicLink();

			var addTopicLink = document.getElementById("addTopicLink");

			topicAdder.getCollectionTopics();

		},
		getAttachments: function(e, cardAttachments) {
			e.stopPropagation();
			e.preventDefault();	

			var files = e.target.files || e.dataTransfer.files;

			for (var i = 0, f = files[i]; i < files.length; i++) {

				var reader = new FileReader();
				
				if (f.type.match('image.*')) {
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
							cardAttachments.push(e.target.result);
						};
					})(f);
					// Read in the image file as a data URL.
					reader.readAsDataURL(f);		
				}
			}

			return cardAttachments;
		},
		closeCreateCardForm: function() {
			var createCardForm = document.getElementById("createCardForm").parentNode;			
			createCardForm.parentNode.removeChild(createCardForm);
			this.closeCreateCardFogBlanket();
		},
		closeCreateCardFogBlanket: function() {
			var isFog = !!document.getElementById("fogBlanket");
			
			if(isFog) {
				var fogBlanket = document.getElementById("fogBlanket");
				fogBlanket.parentNode.removeChild(fogBlanket);		
			}
		},		
		createCard: function(updatedCardId, cardAttachments) {
			var selectedCollectionIndex = collectionSelector.collectionSelect.options[collectionSelector.collectionSelect.selectedIndex].value,
				tags = (typeof cardTags !== 'undefined') ? cardTags.value.split(",") : tags,
				date = new Date(),
				form = document.forms[0],
				card = {
					id: updatedCardId || utils.makeid(),
					topic: cardTopic.options[cardTopic.selectedIndex].text,
					title: cardTitle.value,
					url: cardUrl.value || '',
					text: cardText.value,
					tags: tags,
					attachments: cardAttachments,
					author: profile.userName,
					date: date.getTime(),
					isFlashcard: flashcardCheck.checked,
					views: 0,
					submitLabel: 'Update Card'
				},
			existingCards = cards.collections[selectedCollectionIndex].cards;

		    if(!existingCards) {
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

			var selectedCollectionIndex = collectionSelect.options[collectionSelect.selectedIndex].value;
			
			// Update and load new collections
			cards.collections[selectedCollectionIndex].cards = existingCards;
			localStorage.setItem("Collections", JSON.stringify(cards.collections));
			cards.collections = JSON.parse(localStorage.getItem("Collections")) || [defaultCollection];

			// Update and load new selectedCollection based on updated collections
			cards.collections[selectedCollectionIndex].topics = collectionSelector.selectedCollection.topics;
			collectionSelector.selectedCollection = cards.collections[selectedCollectionIndex];
			localStorage.setItem("selectedCollection", JSON.stringify(collectionSelector.selectedCollection));
			
			//ewidentnie dry - trzeba ustawić selected collection w jednym miejscu
			cards.selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || cards.collections[0];
			cardMiniature.selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || cards.collections[0];

			this.closeCreateCardForm();
			//getView();
			//getCollections();
			//getTopics();
			//selectCardsByTopic();
			//greetUser();
			cards.init();			
			pagination.init();
			cardCounter.init();			
		}
	};

	/**
	 * Card View module
	 *
	 */
	var cardView = {
		selectedCollection: JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection,
		viewedCardIndex: 1,

		init: function(viewedCard) {
			this.cacheDOM();			
			this.render(viewedCard);
			this.bindEvents();
		},
		cacheDOM: function() {

		},
		bindEvents: function() {
			this.closeBtn ? this.closeBtn.addEventListener('click', this.closeCardView.bind(this)) : false;
			this.fogBlanket ? this.fogBlanket.addEventListener('click', this.closeCardView.bind(this)) : false;	

			this.tempCardForm.addEventListener('click', function(e) {
				var element = e.target;
		
				if (utils.hasClass(element, 'previous-card-link')) {
					if(this.viewedCardIndex === 1) {
						return false;
					}
					this.closeCardView();
					this.viewedCardIndex -= 1;
					this.init(collectionSelector.selectedCollection.cards[this.viewedCardIndex - 1]);
				} else if (utils.hasClass(element, 'next-card-link')) {
					if(this.viewedCardIndex === collectionSelector.selectedCollection.cards.length) {
						return false;
					}
					this.closeCardView();
					this.viewedCardIndex += 1;
					this.init(collectionSelector.selectedCollection.cards[this.viewedCardIndex - 1]);
				} else if (utils.hasClass(element, 'edit-card')) {
					this.closeCardView();					
					cardForm.init(collectionSelector.selectedCollection.cards[this.viewedCardIndex - 1]);
				} else if (utils.hasClass(element, 'remove-card')) {
					this.closeCardView();
					cards.removeCard(collectionSelector.selectedCollection.cards[this.viewedCardIndex - 1].id);
				}
			}.bind(this));
		},
		render: function(viewedCard) {
			
			if (document.getElementById('viewCardSection')) {
				return false;
			}

			var thumbs = '',
				tags = '',
				i,
				cardTypeClass = viewedCard.isFlashcard ? 'flashcard' : 'textcard';
			
			for (i = 0; i < viewedCard.attachments.length; i++) {
				thumbs += '<img src="' + viewedCard.attachments[i] + '" class="view-card-thumb" />';
			}

			for (i = 0; i < viewedCard.tags.length; i++) {
				tags += '<span class="tag">' + viewedCard.tags[i] + '</span>';
			}

			var flashCardHtml = '';
				
			var urlifiedText = utils.urlify(viewedCard.text);
			var domain = utils.extractDomain(viewedCard.url);

			var html = '';
				html += '	<div id="viewCardForm">';
				html += '		<ul id="viewCardNavigation" class="view-card-navigation">';
				html += '			<li><span>' + this.viewedCardIndex + ' of ' + collectionSelector.selectedCollection.cards.length + '</span></li>';
				html += '			<li><a class="previous-card-link">Previous</a></li>';
				html += '			<li><a class="next-card-link">Next</a></li>';
				html += '		</ul>';
				if(viewTypes.viewType !== 'details-view') {
					html += '		<span id="closeBtn" class="close-btn">X</span>';
				}
				html += '		<div id="cardContent">';		
				if(cardTypeClass === 'flashcard') {	
					html += flashCardHtml;			
				} 
				else {			
					html += '		<div>';
					html += '			<h3>' + viewedCard.title + '</h3>';
					html += '			<p class="topic">in: ' + viewedCard.topic + ' by ' + viewedCard.author + '</p>';
					html += '		</div>';
					html += '		<div>';
					html += '			<p class="card-text">' + urlifiedText + '</p>';
					html += '		</div>';
					html += '		<div>';
					html += '			<label>Tags:</label>';
					html += '			<p class="tags">' + tags + '</p>';
					html += '		</div>';
					html += '		<div>';
					html += '			<label>Attachments:</label>';				
					html += '			<div class="view-thumb-list">' + thumbs + '</div>';
					html += '		</div>';			
					if(viewedCard.url) {
						html += '		<div class="card-url">';
						html += '			<label>External link:</label>';
						html += '			<a rel="nofollow" href="' + viewedCard.url + '" target="_blank">' + domain + '</a>';
						html += '		</div>';
					}
					html += '		<div class="view-card-actions" id="actions' + viewedCard.id + '">';
					html += '			<a class="edit-card">Edit</a>';
					html += '			<a class="remove-card">Remove</a>';
					html += '		</div>';
				}
				html += '		</div>';		
				html += '	</div>';


			this.tempCardForm = document.createElement('SECTION');
			this.tempCardForm.id = "viewCardSection";
			this.tempCardForm.className = "view-card-section " + cardTypeClass;
			this.tempCardForm.innerHTML = html.trim();
			
			if(viewTypes.viewType !== 'details-view') {
				pageWrapper.appendChild(this.tempCardForm);
				var fogBlanket = document.createElement('div');
				fogBlanket.className = "fog-blanket";
				fogBlanket.id = "fogBlanket";
				pageWrapper.appendChild(fogBlanket);	
			} else {
				var cardField = document.getElementById('cardField');
				cardField.appendChild(this.tempCardForm);	
			}

			if(viewedCard.isFlashcard) {
				this.renderCardSide(event, viewedCard, true);	
			}

			this.closeBtn = document.getElementById('closeBtn');
			this.fogBlanket = document.getElementById('fogBlanket');

			this.countView(viewedCard);

		},
		closeCardView: function() {
			var viewCardForm = document.getElementById("viewCardForm").parentNode;
			viewCardForm.parentNode.removeChild(viewCardForm);
			this.closeCardViewFogBlanket();
		},
		closeCardViewFogBlanket: function() {
			var isFog = !!document.getElementById("fogBlanket");
			
			if(isFog) {
				var fogBlanket = document.getElementById("fogBlanket");
				fogBlanket.parentNode.removeChild(fogBlanket);		
			}
		},		
		countView: function(viewedCard) {
			var selectedCollectionIndex = collectionSelect.options[collectionSelect.selectedIndex].value;
			
			viewedCard.views += 1;

			// Update and load new collections
			cards.collections[selectedCollectionIndex].cards = collectionSelector.selectedCollection.cards;
			localStorage.setItem("Collections", JSON.stringify(cards.collections));
			cards.collections = JSON.parse(localStorage.getItem("Collections")) || [defaultCollection];

			// Update and load new selectedCollection based on updated collections
			collectionSelector.selectedCollection = cards.collections[selectedCollectionIndex];
			localStorage.setItem("selectedCollection", JSON.stringify(collectionSelector.selectedCollection));
			collectionSelector.selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || cards.collections[0];

			cards.init(pagination.selectedPage);
			topicSelector.selectCardsByTopic();
		},
		renderCardSide: function(e, viewedCard, frontSide) {
			var flashCardText = document.getElementById('flashCardText') ? document.getElementById('flashCardText') : null,	
				cardContent = document.getElementById('cardContent');

				cardContent.innerHTML = '';
			
			var flashCardHtml = '';

			flashCardHtml += '	<div id="flashCardContent" class="flash-card-content">';
			
			if(frontSide || utils.hasClass(flashCardText, 'back-side')) {
				flashCardHtml += '	<p id="flashCardText" class="front-side">' + viewedCard.title + '</h3>';
				frontSide = false;
			} else {
				flashCardHtml += '	<p id="flashCardText" class="back-side">' + utils.urlify(viewedCard.text) + '</p>';
				frontSide = true;
			}
			flashCardHtml += '		<p class="flashcard-action-info">Hit SPACE to flip the card</p>';
			flashCardHtml += '	</div>';
			cardContent.innerHTML = flashCardHtml;
		}
	};	

	/**
	 *  Topic Adder module
	 *
	 */
	var topicAdder = {
		selectedCollection: JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection,

		init: function(parentId, isMultiple) {
			isMultiple = isMultiple || false; 

			this.render(parentId, isMultiple);
			this.cacheDOM();
			this.bindEvents();			
		},
		cacheDOM: function() {

		},
		bindEvents: function() {
			this.cardTopic.addEventListener('change', function(event) {
				//spr czy nie trzeba tutaj dać warunku isMultiple?
				this.setSelectedTopics();
			}.bind(this));
		},
		render: function(parentId, isMultiple) {

			var parent = document.getElementById(parentId),
				cardTopics = '';

			var html = '';
				html += '	<label for="cardTopic">Select Topic</label>';
				html += '	<select id="cardTopic" required>' + cardTopics + '</select>';
				html += '	<div id="createTopicValidationBox" class="validation-box"></div>';

			parent.innerHTML = html;

			this.cardTopic = document.getElementById("cardTopic");
			
			if(isMultiple) {
				this.cardTopic.multiple = "multiple";
			}

			this.createAddTopicLink(parentId);
		},
		setSelectedTopics: function() {
			var selectedTopics = [],
				options = this.cardTopic && this.cardTopic.options;

			for (var i=0, iLen=options.length; i<iLen; i++) {
				if (options[i].selected) {
					selectedTopics.push(options[i].text);
				}
			}
			collectionSelector.selectedCollection.topics = selectedTopics;
		},
		createAddTopicLink: function(parentId) {
			
			var addTopicLink = document.createElement('a');
			addTopicLink.id = "addTopicLink";
			addTopicLink.className = "add-topic-link";
			
			var addTopicLinkLabel = document.createTextNode("+ Add new topic");
			addTopicLink.appendChild(addTopicLinkLabel);

			document.getElementById(parentId).appendChild(addTopicLink);

			addTopicLink.addEventListener('click', function(event) {
				event.stopPropagation();
				this.createAddTopicInput(event, parentId);
			}.bind(this));
		},
		createAddTopicInput: function(e, parentId) {
			var element = e.target;
			var createTopicInput = document.createElement('input');
			createTopicInput.id = "createTopicInput";
			createTopicInput.className = "create-topic-input";
			createTopicInput.placeholder = "enter topic name";
			createTopicInput.required = "required";
			element.parentNode.appendChild(createTopicInput);
			createTopicInput.focus();
			element.parentNode.removeChild(element);

			createTopicInput.addEventListener('blur', function(e) {
				this.createNewTopic(e);
				this.removeAddTopicInput();
				this.createAddTopicLink(parentId);				
			}.bind(this));
		},
		createNewTopic: function(e) {
			var createTopicValidationBox = document.getElementById('createTopicValidationBox'),
				newTopic = e.target.value;

			for(var i = 0; i < collectionSelector.selectedCollection.topics.length; i++) {
				if(collectionSelector.selectedCollection.topics[i].indexOf(newTopic) !== -1) {
					createTopicValidationBox.innerHTML = '<p class="validation-message">Specified topic already exists!</p>';
					return false;
				}
			}
			collectionSelector.selectedCollection.topics.push(newTopic);
			localStorage.setItem("selectedCollection", JSON.stringify(collectionSelector.selectedCollection));
			collectionSelector.selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || cards.collections[0];		
			
			this.cardTopic.innerHTML = '';
			this.getCollectionTopics();
		},
		removeAddTopicLink: function() {
			var addTopicLink = document.getElementById("addTopicLink");
			addTopicLink.parentNode.removeChild(addTopicLink);
		},
		removeAddTopicInput: function() {
			var createTopicInput = document.getElementById('createTopicInput');
			createTopicInput.parentNode.removeChild(createTopicInput);
		},
		getCollectionTopics: function() {
			// Get Collection Topics
			var cardTopics = '',
				i = 0;

			for (; i < collectionSelector.selectedCollection.topics.length; i++) {
				cardTopics += '<option>' + collectionSelector.selectedCollection.topics[i] + '</option>';
			}
			this.cardTopic.innerHTML = cardTopics;
		}
	};

	/**	
	 *  Topic Selector module
	 *
	 */	
	var topicSelector = {
		selectedTopic: JSON.parse(localStorage.getItem("selectedTopic")) || -1,
		selectedCollection: JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection,
		
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
		render: function() {
			//tutaj wstawić budowanie topic selectora z htmla
			this.getTopics();
		},
		getTopics: function() {
			var topicOptions = '';
			
			for (var i = 0; i < collectionSelector.selectedCollection.topics.length; i++) {
				if (parseInt(this.selectedTopic) !== i) {
					topicOptions += '<option value="' + i + '">' + collectionSelector.selectedCollection.topics[i] + '</option>';
				} else {
					topicOptions += '<option value="' + i + '" selected="selected">' + collectionSelector.selectedCollection.topics[i] + '</option>';
				}	
			}

			var html = '';
				html += '	<option value="-1">select topic</option>';
				html += topicOptions;
				html += '	<option value="addNewTopic">ADD NEW TOPIC</option>';
			
			this.topicSelect.innerHTML = html;
		},
		selectCardsByTopic: function(e) {
			var element = e ? parseInt(e.target.value) : parseInt(this.selectedTopic);
			
			if (element === -1) {
				this.selectedTopic = this.topicSelect.options[this.topicSelect.selectedIndex].value;
				localStorage.setItem("selectedTopic", JSON.stringify(this.selectedTopic));
				cards.init(pagination.selectedPage);
			} else if (element === 'addNewTopic') {
				// tu bedzie co innego
				topicForm.init();
			} else {
				cards.init(pagination.selectedPage);
				
				for(var i = 0; i < collectionSelector.selectedCollection.cards.length; i++) {
					if(collectionSelector.selectedCollection.topics[element].indexOf(collectionSelector.selectedCollection.cards[i].topic) === -1) {
						var card = document.getElementById("cardMiniature" + collectionSelector.selectedCollection.cards[i].id);
						if(card) {
							card.parentNode.removeChild(card);					
						}
						this.selectedTopic = this.topicSelect.options[this.topicSelect.selectedIndex].value;
						localStorage.setItem("selectedTopic", JSON.stringify(this.selectedTopic));			
					}
				}
			}
		}
	};

	/**
	 *	Topic Form Module
	 *
	 */
	var topicForm = {
		selectedCollection: JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection,

		init: function() {
			this.render();
			this.cacheDOM();			
			this.bindEvents();
		},
		cacheDOM: function() {

		},
		bindEvents: function() {
			this.closeBtn.addEventListener('click', this.closeTopicForm.bind(this));
			this.cancelFormBtn.addEventListener('click', this.closeTopicForm.bind(this));
			this.fogBlanket.addEventListener('click', this.closeTopicForm.bind(this));
			this.topicForm.addEventListener('submit', function(event) {
				this.createTopic(event);
			}.bind(this));
		},
		render: function() {
			if (document.getElementById('topicSection')) {
				return false;
			}

			var html = '';
				html += '	<form id="topicForm" method="POST">';
				html += '		<h2>New Topic</h2>';
				html += '		<span id="closeBtn" class="close-btn">X</span>';
				html += '		<div>';
				html += '			<input type="text" id="topicName" name="topicName" placeholder="enter new topic" required>';
				html += '		</div>';
				html += '		<div id="topicValidationBox"></div>';
				html += '		<div>';
				html += '			<button>Add Topic</button>';
				html += '			<a class="cancel-form" id="cancelFormBtn">Cancel</a>';
				html += '		</div>';
				html += '	</form>';

			this.topicForm = document.createElement('SECTION');
			this.topicForm.id = "topicSection";
			this.topicForm.className = "topic-section";
			this.topicForm.innerHTML = html.trim();
			pageWrapper.appendChild(this.topicForm);

			this.fogBlanket = document.createElement('div');
			this.fogBlanket.className = "fog-blanket";
			this.fogBlanket.id = "fogBlanket";
			pageWrapper.appendChild(this.fogBlanket);

			this.closeBtn = document.getElementById('closeBtn');
			this.cancelFormBtn = document.getElementById('cancelFormBtn');

		},
		closeTopicForm: function() {
			var topicForm = document.getElementById("topicForm").parentNode;
			topicForm.parentNode.removeChild(topicForm);
			topicSelect.getElementsByTagName('option')[0].selected = 'selected';
			this.closeTopicFormFogBlanket();
		},
		closeTopicFormFogBlanket: function() {
			var isFog = !!document.getElementById("fogBlanket");
			
			if(isFog) {
				var fogBlanket = document.getElementById("fogBlanket");
				fogBlanket.parentNode.removeChild(fogBlanket);		
			}
		},
		createTopic: function(e) {
			e.preventDefault();
			var topicValidationBox = document.getElementById('topicValidationBox'),
				newTopicForm = document.getElementById('topicForm'),
				topicName = document.getElementById('topicName'),
				newTopic = topicName.value;
			for(var i=0; i < collectionSelector.selectedCollection.topics.length;i++) {
				if(newTopic.indexOf(collectionSelector.selectedCollection.topics[i]) !== -1) {
					topicValidationBox.innerHTML = '<p class="validation-message">Specified topic already exists!</p>';
					newTopicForm.reset();
					return false;
				}
			}
			collectionSelector.selectedCollection.topics.push(newTopic);
			
			// wstawić nową selectedCollection do collections
			var selectedCollectionIndex = collectionSelect.options[collectionSelect.selectedIndex].value;	
			// Update and load new collections
			cards.collections[selectedCollectionIndex] = collectionSelector.selectedCollection;
			localStorage.setItem("Collections", JSON.stringify(cards.collections));
			cards.collections = JSON.parse(localStorage.getItem("Collections")) || [defaultCollection];

			// Update and load new selectedCollection based on updated collections
			collectionSelector.selectedCollection = cards.collections[selectedCollectionIndex];
			localStorage.setItem("selectedCollection", JSON.stringify(collectionSelector.selectedCollection));
			
			topicSelector.selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || cards.collections[0];			
			topicSelector.init();		
			this.closeTopicForm();			
		}
	};

	/**	
	 *  Pagination module
	 *
	 */	
	var pagination = {		
		init: function() {
			collectionSelector.selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection;
			this.selectedPage = JSON.parse(localStorage.getItem("selectedPage")) || 1;
			this.cardsPerPage = cards.setCardsPerPage();

			this.cacheDOM();			
			this.render();
			this.bindEvents();
		},
		cacheDOM: function() {
			this.pseudoFooter = document.getElementById('pseudoFooter');
		},
		bindEvents: function() {
			document.addEventListener("click", function(e) {
				var element = e.target,
					paginationList = document.getElementById('paginationList');

				if(utils.hasClass(element, "pagination-page")) {
					for(var i=0; i < paginationList.childNodes.length;i++) {
						paginationList.childNodes[i].className = "pagination-page";
					}		
					element.className += ' current-page';
					var page = element.firstChild.nodeValue;
					this.selectedPage = page;
					localStorage.setItem("selectedPage", JSON.stringify(page));
					
					cards.init(page);
				}
			}.bind(this));
		},
		render: function() {
			if(collectionSelector.selectedCollection.cards.length <= this.cardsPerPage) {
				this.pseudoFooter.innerHTML = '';
				return false;
			}	

			var pagesCount = Math.ceil(collectionSelector.selectedCollection.cards.length / this.cardsPerPage),
				buttons = '';

			for (var i=0; i < pagesCount; i++) {
				buttons += '<li class="pagination-page">' + (i+1) + '</li>';
			}

			var html = '';
				html += '	<ul id="paginationList" class="pagination-list">' + buttons + '</ul>';
			
			this.pseudoFooter.innerHTML = html;
			this.setCurrentPageClass();
		},
		setCurrentPageClass: function() {
			var paginationList = document.getElementById('paginationList');
			
			if (paginationList.childNodes[parseInt(this.selectedPage) - 1]) {
				paginationList.childNodes[parseInt(this.selectedPage) - 1].className += ' current-page';
			} else {
				var pagesCount = Math.ceil(collectionSelector.selectedCollection.cards.length / this.cardsPerPage);
				paginationList.childNodes[parseInt(pagesCount) - 1].className += ' current-page';
			}
		}
	};

	/**
	 * Expose Flashrr modules via public API
	 */
	var Flashrr = {
		selectedCollection: JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection,
		
		utils: utils,
		flashcardsOnly: flashcardsOnly,
		searchCards: searchCards,
		profile: profile,
		collectionSelector: collectionSelector,
		cards: cards,
		viewTypes: viewTypes,		
		cardCounter: cardCounter,
		topicSelector: topicSelector,
		cardsFilter: cardsFilter,
		pagination: pagination,

		cacheDOM: function() {
			this.pageWrapper = document.getElementById("pageWrapper");	
			this.sectionWrapper = document.getElementById("sectionWrapper");
		},
		bindEvents: function() {
			document.addEventListener("keydown", this.handleCardKeydownEvents.bind(this));			
			window.addEventListener("resize", this.handleResize.bind(this));
			this.pageWrapper.addEventListener("dragover", this.handlePageDragOver.bind(this));
			this.pageWrapper.addEventListener("dragleave", this.handlePageDragLeave.bind(this));
			this.pageWrapper.addEventListener("drop", this.handlePageDrop.bind(this));
		},
		init: function() {
			this.cacheDOM();
			this.bindEvents();

			flashcardsOnly.init();
			searchCards.init();
			profile.init();
			collectionSelector.init();
			topicSelector.init();	
			cardsFilter.init();
			pagination.init();			
			cards.init();
			viewTypes.init();			
			cardCounter.init();
		},
		handlePageDragOver: function(e){
			e.preventDefault();
			if(utils.hasClass(this.pageWrapper, "drag")){
				return false;
			}
			this.pageWrapper.className += " drag";
		},
		handlePageDragLeave: function(e){
			event.preventDefault();
			this.pageWrapper.className = pageWrapper.className.replace( /(?:^|\s)drag(?!\S)/g , '' );		
		},
		handlePageDrop: function(e){
			e.stopPropagation();
			e.preventDefault();
			this.getCardFromTxt(e);
			this.pageWrapper.className = this.pageWrapper.className.replace(/(?:^|\s)drag(?!\S)/g, "");
		},
		/**
		 *	Handle drag and drop txt files
		 */
		getCardFromTxt: function(e) {
			var files = e.target.files || e.dataTransfer.files,
				f = files[0];
				
			if (!f) {
				alert("Failed to load file");
			} else if (!f.type.match('text.*')) {
				alert(f.name + " is not a valid text file.");
			} else {
				var reader = new FileReader();

				reader.onload = function(e) { 
					var contents = {
						title: f.name,
						url: '',
						text : e.target.result,
						tags : '',
						submitLabel: 'Create Card',
						attachments: []
					};
					cardForm.init(contents);
				};
				reader.readAsText(f);	
			}
		},
		handleResize: function() {
			cards.setCardsWrapperHeight();
			
			//na razie to zakomentuje nie wiem czy potrzebne
			// ale pewnie jakiś re-render sie przyda
			//setCardsPerPage();
			//getView();
		},
		handleCardKeydownEvents: function(e) {
			if (cardView.viewedCardIndex !== null) {
				var viewedCard = collectionSelector.selectedCollection.cards[cardView.viewedCardIndex - 1];

				if ((e.keyCode === 0 || e.keyCode === 32) && viewedCard.isFlashcard) {
					cardView.renderCardSide(event, viewedCard);				
				}
			}	
		}				
	};

	Flashrr.init();
	window.Flashrr = Flashrr;
	

})(window);