(function(global) {
	'use strict'

	/*!
	 * Flashrr App v0.6.0
	 * Vanilla, Revealing Module Pattern
	 * http://flashrr.com
	 *
	 * Author Paweł Kubera
	 * Released under the MIT license
	 * http://flashrr.com/license
	 *
	 * Date: 2016-04-23
	 */

	/**
	 * Revealing Module Pattern Pros:
	 * - each module has it's own private scope
     * - we privatize module members - both vaiables and methods
	 * - expose via Public API only those methods which are needed to 
     * - we dont need to initialize all modules at start - thanks to IIFE
	 */

	/**
	 * Spotted Drawbacks:
	 * - memory issue with copying all methods in object instantiations
	 * - poor extensibility
	 */

	/**
	 * Very basic Publish Subscribe module
	 */
	var events = (function() {

		var events = {};

		function on(eventName, fn) {
			events[eventName] = events[eventName] || [];
			events[eventName].push(fn);
		}

		function off(eventName, fn) {
			if (events[eventName]) {
				for (var i = 0; i < events[eventName].length; i++) {
					if( events[eventName][i] === fn ) {
						events[eventName].splice(i, 1);
						break;
					}
				}
			}
		}

		function emit(eventName, data) {
			if (events[eventName]) {
				events[eventName].forEach(function(fn) {
					fn(data);
				});
			}
		}

		return {
			on: on,
			off: off,
			emit: emit
		};

	})();


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
	var utils = (function() {

		function hasClass(element, cls) {
		    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
		}
		
		function urlify(text) {
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
		}

		function extractDomain(url) {
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
		}

		function makeid() {
		    var text = "",
		    	possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		    for( var i=0; i < 5; i++ )
		        text += possible.charAt(Math.floor(Math.random() * possible.length));
		    return text;
		}
		
		return {
			hasClass: hasClass,
			urlify: urlify,
			extractDomain: extractDomain,
			makeid: makeid
		};

	})();

	/**	
	 *  Flashcards only checkbox option module
	 */
	var flashcardsOnly = (function() {
		var selectedFlashcardsOnly = JSON.parse(localStorage.getItem("selectedFlashcardsOnly")) || false,
			selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection;

		// CacheDOM
		var showFlashcardsOnly = document.getElementById("showFlashcardsOnly");

		var init = (function() {		
			bindEvents();
			render();
		})();
		
		function bindEvents() {
			showFlashcardsOnly.addEventListener("click", toggleTextCards.bind(this));
		}

		function render() {
			// bring here html from index.html

			checkSelectedFlashcardsOnly();
		}

		function toggleTextCards(e) {

			var element = (typeof e !== 'undefined') ? e.target : showFlashcardsOnly;

			if(element.checked === true) {
				localStorage.setItem('selectedFlashcardsOnly', JSON.stringify(true));			
				
				for (var i=0;i < selectedCollection.cards.length;i++) {
					if(selectedCollection.cards[i].isFlashcard === false) {
						if(!document.getElementById("cardMiniature" + selectedCollection.cards[i].id)) {
							return;
						}
						var card = document.getElementById("cardMiniature" + selectedCollection.cards[i].id);
						if (typeof card !== 'undefined') {
							card.parentNode.removeChild(card);				
						}
						
						// POSSIBLE PUBSUB // nope commented out for now
						//pagination.init();
						//events.emit("setFlashcardsOnly", element.checked);
					}
				}
			} else {
				localStorage.setItem('selectedFlashcardsOnly', JSON.stringify(false));		
				
				events.emit("unsetFlashcardsOnly");		
			}


		}

		function checkSelectedFlashcardsOnly() {
			if(selectedFlashcardsOnly === true) {
				showFlashcardsOnly.checked = true;
				toggleTextCards();
			}
		}

	})();	

	/**	
	 *  Card counter module 
	 */
	var cardCounter = (function() {	
		var selectedCollection;

		//CacheDOM
		var cardCounter = document.getElementById("cardCounter");		

		function init() {			
			selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection;
			
			render(selectedCollection);
		}

		init();

		//Bind Events
		events.on('selectedCollectionChanged', render);
		events.on('selectCollection', init);

		function render(selectedCollection) {
			var existingCards = selectedCollection.cards,
				count = document.createTextNode(existingCards.length);
			
			cardCounter.innerHTML = '';
			cardCounter.appendChild(count);
			count.nodeValue = existingCards.length
		}
	})();

	/**	
	 *  Search cards module 
	 *
	 */
	var searchCards = (function() {
		var selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection;
		
		//CacheDOM
		var searchCards = document.getElementById("searchCards"),
			categorySearchSelect = document.getElementById("categorySearchSelect");			

		var init = (function() {
			_bindEvents();
			_render();
		})();

		function _bindEvents() {
			searchCards.addEventListener("keyup", searchCard);
		}

		function _render() {
			//wstawić tutaj render modułu szukacza
		}

		function searchCard(e) {
			var searchValue = searchCards.value,
				selectedCategorySearch = categorySearchSelect.options[categorySearchSelect.selectedIndex].value,
				selectedCards = selectedCollection.cards;
			console.log('search card start on search value' + searchValue);
			console.log('selectedCategorySearch: ' + selectedCategorySearch);

			//cards.init(pagination.selectedPage);
			events.emit("searchCardStarted");

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
				}
			}
			events.emit("searchCardCompleted");
		}	

		return {
			init: init
		};

	})();

	/**
	 *	Profile module
	 */
	var profile = (function() {
		var userName = JSON.parse(localStorage.getItem("userName")) || "Guest";

		//CacheDOM
		var hiUserName = document.getElementById("hiUserName"),
			userNameSection = document.getElementById('userNameSection');		

		function init(userName) {
			_bindEvents();
			_render(userName);
		}
		// czy powinno się to wywoływac we Flashrr module lepiej????
		init(userName);
				
		function _bindEvents() {
			hiUserName.addEventListener("click", function() { events.emit("hiUserNameClicked"); });

			events.on("userNameSubmited", _render);
		}
		
		function _render(userName) {
			hiUserName.innerHTML = userName;
		}

		return {
			init: init,
			userName: userName
		};

	})();

	var userNameForm = (function() {
		var userName = JSON.parse(localStorage.getItem("userName")) || "Guest";
		
		// Bind Events
		events.on("hiUserNameClicked", render);

		function render() {
			// ponadto przyda się ogólny obiekt na tworzenie FORMÓW, bo widać tu 
			// ewidentnie wspólne elementy takie jak: fogBlanket, metoda close, appendowanie do parenta itp.

			if (typeof userNameSection !== 'undefined') {
				return false;
			}

			var html = '';
				html += '	<form id="userNameForm">';
				html += '		<h2>Please enter your name</h2>';
				html += '		<span id="closeBtn" class="close-btn">X</span>';
				html += '		<div>';
				html += '			<input type="text" id="formUserName" name="formUserName" value="' + userName + '" placeholder="enter your name">';
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

			cacheRenderedDOM();
			bindRenderedEvents();
		}
		
		function cacheRenderedDOM() {
			var userNameSection = document.getElementById("userNameSection"),
				closeBtn = document.getElementById('closeBtn'),
				cancelForm = document.getElementById('cancelForm'),
				fogBlanket = document.getElementById('fogBlanket');
		}
		
		function bindRenderedEvents() {
			closeBtn.addEventListener('click', closeUserNameForm.bind(this));
			cancelForm.addEventListener('click', closeUserNameForm.bind(this));
			fogBlanket.addEventListener('click', closeUserNameForm.bind(this));
			userNameSection.addEventListener('submit', userNameSubmit.bind(this));			
		}
		
		function closeUserNameForm() {
			var userNameFormWrapper = document.getElementById('userNameForm').parentNode;
			userNameFormWrapper.parentNode.removeChild(userNameFormWrapper);
			closeUserNameFogBlanket();
		}
		
		function closeUserNameFogBlanket() {
			var isFog = !!document.getElementById("fogBlanket");
			
			if(isFog) {
				var fogBlanket = document.getElementById("fogBlanket");
				fogBlanket.parentNode.removeChild(fogBlanket);		
			}
		}
		
		function userNameSubmit() {
			userName = formUserName.value;
			localStorage.setItem("userName", JSON.stringify(userName));
			closeUserNameForm();
			events.emit("userNameSubmited", userName);
		}

	})();

	/**	
	 *  Card Collections module
	 *
	 */
	var collectionSelector = (function() {
		var collections, 
			selectedCollection, 
			selectedCollectionIndex, 
			selectedTopic;

		//CacheDOM
		var collectionSelect = document.getElementById("collectionSelect");
		
		function init() {			
			collections = JSON.parse(localStorage.getItem("Collections")) || [data.defaultCollection],
			selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection,
			selectedCollectionIndex = JSON.parse(localStorage.getItem("selectedCollectionIndex")) || 0,
			selectedTopic = JSON.parse(localStorage.getItem("selectedTopic")) || 0;
			
			_render();
			_bindEvents();			
		}

		init();
				
		function _bindEvents() {
			collectionSelect.addEventListener("change", _selectCollection.bind(this));		
		}
		
		function _render() {
			var selectedCards = selectedCollection.cards,
				collectionOptions = '',
				i = 0;

			for (;i < collections.length; i++) {
				var isSelected = (selectedCollection.name.indexOf(collections[i].name) !== -1) ? 'selected="selected"' : '';
				collectionOptions += '<option value="' + i + '"'+ isSelected +'>' + collections[i].name + '</option>';
			}
			var html = '';
				html += collectionOptions;
				html += '	<option value="addNewCollection">ADD NEW COLLECTION</option>';
			
			collectionSelect.innerHTML = html;
			
			if(collectionSelect.value !== 'addNewCollection'){
				_addEditCollectionBtn();
			}
		}
		
		// ta funkcja nie jest nigdzie wywoływana w tym momencie
		// do sprawdzenia...
		function _selectCollection(e) {
			var element = e.target || e;
			
			_removeEditCollectionBtn();
			
			if (element.value === 'addNewCollection') {
				collectionForm.init();
			} else {
				selectedCollection = collections[element.value];
				localStorage.setItem("selectedCollection", JSON.stringify(selectedCollection));
				selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || collections[0];
				
				selectedTopic = -1;
				localStorage.setItem("selectedTopic", JSON.stringify(selectedTopic));	

				selectedCollectionIndex = collectionSelect.options[collectionSelect.selectedIndex].value;
				localStorage.setItem("selectedCollectionIndex", JSON.stringify(selectedCollectionIndex));

				events.emit("selectCollection");
				
				_addEditCollectionBtn();
			}
		}
		
		function _addEditCollectionBtn() {
			var editCollectionBtn = document.createElement("i");
			editCollectionBtn.className = "edit-collection fa fa-cog";
			editCollectionBtn.id = "editCollectionBtn";
			collectionSelect.parentNode.appendChild(editCollectionBtn);
			
			editCollectionBtn.addEventListener("click", function(e) {
				if (document.getElementById('collectionSection')) {
					collectionForm.closeCreateCollectionForm();
				}

				var selectedCollectionIndex = collectionSelect.options[collectionSelect.selectedIndex].value,
					i = 0,
					obj = null,
					editableCollection = null;			

				for(;i < collections.length; i++) {
					obj = collections[i];
					if(collections[selectedCollectionIndex].id.indexOf(obj.id) !== -1) {
						editableCollection = collections[i];
						break;
					}
				}
				collectionForm.init(editableCollection);
			}.bind(this));
		}
		
		function _removeEditCollectionBtn() {
			if(!document.getElementById("editCollectionBtn")) {
				return false;
			}
			editCollectionBtn.parentNode.removeChild(editCollectionBtn);
		}

		return {
			init: init
		};

	})();

	/**
	*  Collection Form
	*/
	var collectionForm = (function() {
		var selectedCollection;

		function init(editableCollection) {
			selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection;			

			editableCollection = editableCollection || false;
			_render(editableCollection);
		}
				
		function _render(editableCollection) {
			if (document.getElementById('collectionSection')) {
				return false;
			}

			var editMode = editableCollection ? true : false,
				collectionFormHeader = editableCollection ? "Edit Collection" : "New Collection",	
				collectionName = editableCollection ? editableCollection.name : "",
				collectionDescription = editableCollection ? editableCollection.description : "",
				collectionTopics = editableCollection ? editableCollection.topics : [],
				collectionFormSubmitLabel = editableCollection ? "Update Collection" : "Add New Collection",
				updatedCollectionId = editableCollection ? editableCollection.id : null,
				collectionCards = editableCollection ? editableCollection.cards : [];

			selectedCollection.topics = editableCollection ? selectedCollection.topics : [];

			var html = '';
				html += '	<form id="collectionForm">';
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
				if(updatedCollectionId !== null) {	
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

			_cacheRenderedDOM();
			_bindRenderedEvents(updatedCollectionId, collectionCards);
		}

		function _cacheRenderedDOM() {			
			var collectionSection = document.getElementById('collectionSection'),
				fogBlanket = document.getElementById('fogBlanket'),			
				closeBtn = document.getElementById('closeBtn'),
				cancelFormBtn = document.getElementById('cancelFormBtn'),
				deleteCollectionBtn = document.getElementById('deleteCollectionBtn');
		}
		
		function _bindRenderedEvents(updatedCollectionId, collectionCards) {
			closeBtn.addEventListener('click', _closeCreateCollectionForm.bind(this));
			cancelFormBtn.addEventListener('click', _closeCreateCollectionForm.bind(this));
			fogBlanket.addEventListener('click', _closeCreateCollectionForm.bind(this));			
			collectionSection.addEventListener('submit', function(event) {
				event.preventDefault();
				createCollection(updatedCollectionId, collectionCards);
			}.bind(this));
		}

		function _closeCreateCollectionForm() {
			var collectionForm = document.getElementById("collectionForm").parentNode;
			collectionForm.parentNode.removeChild(collectionForm);
			_closeCreateCollectionFogBlanket();
		}
		
		function _closeCreateCollectionFogBlanket() {
			var isFog = !!document.getElementById("fogBlanket");
			
			if(isFog) {
				var fogBlanket = document.getElementById("fogBlanket");
				fogBlanket.parentNode.removeChild(fogBlanket);		
			}
		}

		function createCollection(updatedCollectionId, collectionCards) {
			var date = new Date(),
				form = document.forms[0],
				topics = JSON.parse(localStorage.getItem("selectedCollection")).topics,
				collection = {
					id: updatedCollectionId || utils.makeid(),
					name: collectionName.value,
					description: collectionDescription.value,
					author: profile.userName,
					date: date.getTime(),
					topics: topics,
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
			// Updating Collections data
			localStorage.setItem("Collections", JSON.stringify(existingCollections));
			
			// (??? is this necessary ???) Getting updated Collections data for our modules
			//var collections = JSON.parse(localStorage.getItem("Collections"));
			
			// Setting new selectedCollection
			localStorage.setItem("selectedCollection", JSON.stringify(collection));
			// Getting new selectedCollection for our modules
			selectedCollection = JSON.parse(localStorage.getItem("selectedCollection"));
			
			collectionSelector.init();

			topicSelector.init();
			//cards.init(pagination.selectedPage);
			cardCounter.init();
			pagination.init();
			
			_closeCreateCollectionForm();
		}

	 	function deleteCollection() {
	 		var confirmDelete = confirm("All your collection data including cards will be deleted. Continue?");
	 		
	 		if (confirmDelete) {
				if (document.getElementById('collectionForm')) {
					closeCollectionForm();
				}
				collections.splice(selectedCollectionIndex, 1);

				localStorage.setItem("Collections", JSON.stringify(collections));
				collections = JSON.parse(localStorage.getItem("Collections")) || [defaultCollection];
				selectedCollection = collections[selectedCollectionIndex - 1];
				localStorage.setItem("selectedCollection", JSON.stringify(selectedCollection));
				selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || collections[0];
				
				_closeCreateCollectionForm();

				collectionSelector.init();
				cards.init(selectedPage);
				cardsCount.init();

	 		} else {
	 			return false;
	 		}
	    }

	    return {
			init: init,
			createCollection: createCollection,
			deleteCollection: deleteCollection
		};

	})();

	/**	
	 *  Cards module
	 *
	 */			
	var cards = (function() {
		var collections, 
			selectedCollection, 
			viewType, 
			selectedSorting;

		//CacheDOM
		var createCardBtn = document.getElementById("createCardBtn"),
			cardsWrapper = document.getElementById("cardsWrapper"),
			header = document.getElementById("header"),
			pseudoFooter = document.getElementById("pseudoFooter"),
			collectionSelect = document.getElementById("collectionSelect");		

		function init(page) {		
			page = page || false;

			console.log('cards.init EXECUTED with page: ' + page);
		
			_bindEvents();
			_render(page);
		}
				
		function _bindEvents() {
			createCardBtn.addEventListener("click", function() { cardForm.init(); });

			events.on("unsetFlashcardsOnly", _render);
			events.on("searchCardStarted", _render);
			events.on("selectCollection", _render);
			events.on('sortingSelect', _render);
		}
		
		function _render(page) {
			collections = JSON.parse(localStorage.getItem("Collections")) || [data.defaultCollection],
			selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection,
			viewType = JSON.parse(localStorage.getItem("viewType")) || 'grid-view',
			selectedSorting = JSON.parse(localStorage.getItem("selectedSorting")) || 'date';

			var pageIndex = parseInt(page) || 1,
				i = 0,
				selectedCards = selectedCollection.cards,
				cardsPerPage = setCardsPerPage();

			_sortCards(selectedCards);

			cardsWrapper.innerHTML = '';

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
			setCardsWrapperHeight();

			events.emit('selectedCollectionChanged', selectedCollection);
		}
		
		function _sortCards(cards) {
			if(selectedSorting === 'date') {
				_sortCardsByDate(cards);
			} else if(selectedSorting === 'popularity') {
				_sortCardsByPopularity(cards);
			} else if(selectedSorting === 'title') {
				_sortCardsByTitle(cards);
			}		
		}
		
		function _sortCardsByDate(cards) {
			cards.sort(function(a, b){
				return b.date - a.date;
			});
		}
		
		function _sortCardsByPopularity(cards) {
			cards.sort(function(a, b){
				return b.views - a.views;
			});
		}
		
		function _sortCardsByTitle(cards) {
			cards.sort(function(a, b){
				if (a.title < b.title) {
					return -1;
				} else if (a.title > b.title) {
					return 1;
				} else {
					return 0;
				}
			});
		}
		
		function setCardsPerPage() {
	 		return (viewType === 'grid-view' || viewType === 'details-view') ? 12 : countCardsPerPage();
		}

		/**
	     *  Determine the number of cards to be displayed in the list view on a single page
	     */
		function countCardsPerPage() {
			// spr dlaczego tutaj musiałem dawać document.get zamiast 
			// np. this.pseudoFooter.offsetHeight - wyrzucało mi undefined
			// nie czaje czemu ????
			var cardsWrapperHeight = window.innerHeight - (document.getElementById("header").offsetHeight + document.getElementById("cardsFilter").offsetHeight + document.getElementById("pseudoFooter").offsetHeight),
				listViewCardHeight = 150, // ugly, should be avoided
				cardsPerPage = Math.floor(cardsWrapperHeight / listViewCardHeight);
			return cardsPerPage;
		}
		
		function setCardsWrapperHeight() {
	 		var cardsWrapperHeight = window.innerHeight - (document.getElementById("header").offsetHeight + document.getElementById("cardsFilter").offsetHeight + document.getElementById("pseudoFooter").offsetHeight);
	 		cardsWrapper.style.height = cardsWrapperHeight + 'px';
		}
		
		function setCardPreviewHeight() {
			var cardPreviewHeight = window.innerHeight - (document.getElementById("header").offsetHeight + document.getElementById("cardsFilter").offsetHeight + document.getElementById("pseudoFooter").offsetHeight),
				cardPreview = document.getElementById('cardPreview');
			
			cardPreview.style.height = cardPreviewHeight + 'px';
		}
		
		function removeCard(cardId) {
		    var selectedCollectionIndex = collectionSelect.options[collectionSelect.selectedIndex].value,
				i = 0,
				obj = null;

			if (document.getElementById('viewCardSection')) {
				cardView.closeCardView();
			}
			for(;i < selectedCollection.cards.length; i++) {
				obj = selectedCollection.cards[i];
				if(cardId.indexOf(obj.id) !== -1) {
					selectedCollection.cards.splice(i, 1);
					break;
				}
			}


			// DRY: Wstawić to do osobnej funkcji
			//      updateCardCollections()
			// Update and load new collections
			collections[selectedCollectionIndex].cards = selectedCollection.cards;
			localStorage.setItem("Collections", JSON.stringify(collections));
			collections = JSON.parse(localStorage.getItem("Collections")) || [defaultCollection];

			// Update and load new selectedCollection based on updated collections
			selectedCollection = collections[selectedCollectionIndex];
			localStorage.setItem("selectedCollection", JSON.stringify(selectedCollection));
			selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || collections[0];
		
			init(pagination.selectedPage);
			pagination.init();	
			cardCounter.init();
		}

		return {
			init: init,
			setCardsPerPage: setCardsPerPage,
			setCardsWrapperHeight: setCardsWrapperHeight,
			setCardPreviewHeight: setCardPreviewHeight,
			removeCard: removeCard
		};

	})();

	/**
	 * Card Miniature module
	 *
	 */
	var cardMiniature = (function() {
		var selectedCollection;

		function init(card) {
			selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection;

			_render(card);
		}
						
		function _render(card) {
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
			cardsWrapper.appendChild(tempCardMiniature);

			//var cardId = card.id,
			//	tempCardMiniature = document.getElementById("cardMiniature" + cardId);

			var tempCard = document.getElementById("cardMiniature" + card.id);

			tempCard.addEventListener('click', function(e) {
				var element = e.target,
					parentId = (element.parentNode && element.parentNode.id) ? element.parentNode.id.slice(-5) : '';

				if (utils.hasClass(element, 'edit-card')) {
					if (document.getElementById('viewCardSection')) {
						cardView.closeCardView();
					}
					var editableCard = '',
						i = 0,
						obj;
					for(; i < selectedCollection.cards.length; i++) {
						obj = selectedCollection.cards[i];

						if(parentId.indexOf(obj.id) !== -1) {
							editableCard = selectedCollection.cards[i];
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

					for(; i < selectedCollection.cards.length; i++) {
						obj = selectedCollection.cards[i];

						if(parentId.indexOf(obj.id) !== -1) {
							viewedCard = selectedCollection.cards[i];
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
					var i = 0;

					searchCards.value = '';
					categorySearchSelect.getElementsByTagName('option')[0].selected = 'selected';				
					for (;i < selectedCollection.topics.length;i++) {
						if(element.text.indexOf(selectedCollection.topics[i]) !== -1) {
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
		}	

		return {
			init: init
		};

	})();

	/**
	 * Card Form module
	 *
	 */
	var cardForm = (function() {
		var selectedCollection,
			collections;

		//CacheDOM
		var collectionSelect = document.getElementById('collectionSelect');

		function init(editableCard) {
			collections = JSON.parse(localStorage.getItem("Collections")) || data.defaultCollection,
			selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection,
			editableCard = editableCard || false;
			
			_render(editableCard);					
		}
				
		function _render(editableCard) {
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
				isFlashcard = editableCard ? editableCard.isFlashcard : false,
				updatedCardId = editableCard ? editableCard.id : null,
				cardAttachments = editableCard ? editableCard.attachments : [],
				cardThumbs = '',
				i = 0;

				for (;i < cardAttachments.length; i++) {
					cardThumbs += '<img src="' + cardAttachments[i] + '" class="view-card-thumb" />';
				}

			var html = '';
				html += '	<form id="createCardForm">';
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

			var closeBtn = document.getElementById('closeBtn'),
				cancelFormBtn = document.getElementById('cancelFormBtn'),
				fogBlanket = document.getElementById('fogBlanket');

			closeBtn.addEventListener('click', _closeCreateCardForm.bind(this));
			cancelFormBtn.addEventListener('click', _closeCreateCardForm.bind(this));
			fogBlanket.addEventListener('click', _closeCreateCardForm.bind(this));	

			createCardForm.addEventListener('submit', function(event) {
				event.preventDefault();
				createCard(updatedCardId, cardAttachments);
			});

			cardAttachment.addEventListener('change', function(event, cardAttachments) {
				_getAttachments(event, cardAttachments);
			});

			cardDropArea.addEventListener("dragover", function(event) {
				event.stopPropagation();
				event.preventDefault();
			});

			cardDropArea.addEventListener("dragleave", function(event) {
				event.stopPropagation();
				event.preventDefault();
			});

			cardDropArea.addEventListener("drop", function(event) {
				_getAttachments(event, cardAttachments);
			});
		}
		
		
		function _getAttachments(e, cardAttachments) {
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
		}
		
		function _closeCreateCardForm() {
			var createCardForm = document.getElementById("createCardForm").parentNode;			
			
			createCardForm.parentNode.removeChild(createCardForm);
			_closeCreateCardFogBlanket();
		}
		
		function _closeCreateCardFogBlanket() {
			var isFog = !!document.getElementById("fogBlanket");
			
			if(isFog) {
				var fogBlanket = document.getElementById("fogBlanket");
				fogBlanket.parentNode.removeChild(fogBlanket);		
			}
		}

		function createCard(updatedCardId, cardAttachments) {
			var selectedCollectionIndex = collectionSelect.options[collectionSelect.selectedIndex].value,
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
			existingCards = collections[selectedCollectionIndex].cards;

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
			collections[selectedCollectionIndex].cards = existingCards;
			localStorage.setItem("Collections", JSON.stringify(collections));
			collections = JSON.parse(localStorage.getItem("Collections")) || [defaultCollection];

			// Update and load new selectedCollection based on updated collections
			collections[selectedCollectionIndex].topics = selectedCollection.topics;
			selectedCollection = collections[selectedCollectionIndex];
			localStorage.setItem("selectedCollection", JSON.stringify(selectedCollection));
			
			//ewidentnie dry - trzeba ustawić selected collection w jednym miejscu
			selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || collections[0];
			//cardMiniature.selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || collections[0];

			_closeCreateCardForm();
			//getView();

			//topicSelector.getTopics();
			//selectCardsByTopic();
			//greetUser();
			cards.init();			
			pagination.init();
			
			// Can be removed thanks to PubSub cardCounter.init();			
		}

		return {
			init: init,
			createCard: createCard
		};

	})();

	/**
	 * Card View module
	 *
	 */
	var cardView = (function() {
		var selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection,
			viewType = JSON.parse(localStorage.getItem("viewType")) || 'grid-view',
			viewedCardIndex = 1;

		function init(viewedCard) {		
			_render(viewedCard);		
			_countView(viewedCard);
		}
		
		function _render(viewedCard) {			
			if (document.getElementById('viewCardSection') || !viewedCard) {
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

			var flashCardHtml = '',
				urlifiedText = utils.urlify(viewedCard.text),
				domain = utils.extractDomain(viewedCard.url);

			var html = '';
				html += '	<div id="viewCardForm">';
				html += '		<ul id="viewCardNavigation" class="view-card-navigation">';
				html += '			<li><span>' + viewedCardIndex + ' of ' + selectedCollection.cards.length + '</span></li>';
				html += '			<li><a class="previous-card-link">Previous</a></li>';
				html += '			<li><a class="next-card-link">Next</a></li>';
				html += '		</ul>';
				if(viewType !== 'details-view') {
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


			var tempCardForm = document.createElement('SECTION');
				tempCardForm.id = "viewCardSection";
				tempCardForm.className = "view-card-section " + cardTypeClass;
				tempCardForm.innerHTML = html.trim();
			
			if(viewType !== 'details-view') {
				pageWrapper.appendChild(tempCardForm);
				var fogBlanket = document.createElement('div');
				fogBlanket.className = "fog-blanket";
				fogBlanket.id = "fogBlanket";
				pageWrapper.appendChild(fogBlanket);	
			} else {
				var cardField = document.getElementById('cardField');
				cardField.appendChild(tempCardForm);	
			}

			if(viewedCard.isFlashcard) {
				_renderCardSide(event, viewedCard, true);	
			}
			
			var closeBtn = document.getElementById('closeBtn'),
				fogBlanket = document.getElementById('fogBlanket');

			closeBtn ? closeBtn.addEventListener('click', closeCardView.bind(this)) : false;
			fogBlanket ? fogBlanket.addEventListener('click', closeCardView.bind(this)) : false;	

			tempCardForm ? tempCardForm.addEventListener('click', function(e) {
				var element = e.target;
		
				if (utils.hasClass(element, 'previous-card-link')) {
					if(viewedCardIndex === 1) {
						return false;
					}
					closeCardView();
					viewedCardIndex -= 1;
					init(selectedCollection.cards[viewedCardIndex - 1]);
				} else if (utils.hasClass(element, 'next-card-link')) {
					if(viewedCardIndex === selectedCollection.cards.length) {
						return false;
					}
					closeCardView();
					viewedCardIndex += 1;
					init(selectedCollection.cards[viewedCardIndex - 1]);
				} else if (utils.hasClass(element, 'edit-card')) {
					closeCardView();					
					cardForm.init(selectedCollection.cards[viewedCardIndex - 1]);
				} else if (utils.hasClass(element, 'remove-card')) {
					closeCardView();
					cards.removeCard(selectedCollection.cards[viewedCardIndex - 1].id);
				}
			}.bind(this)) : false;
		}	
		
		function closeCardView() {
			var viewCardForm = document.getElementById("viewCardForm").parentNode;
			viewCardForm.parentNode.removeChild(viewCardForm);
			_closeCardViewFogBlanket();
		}
		
		function _closeCardViewFogBlanket() {
			var isFog = !!document.getElementById("fogBlanket");
			
			if(isFog) {
				var fogBlanket = document.getElementById("fogBlanket");
				fogBlanket.parentNode.removeChild(fogBlanket);		
			}
		}

		function _countView(viewedCard) {
			var selectedCollectionIndex = collectionSelect.options[collectionSelect.selectedIndex].value,
				collections = JSON.parse(localStorage.getItem("Collections")) || [defaultCollection];

			console.log('card views init');

			viewedCard.views += 1;

			// Update and load new collections
			collections[selectedCollectionIndex].cards = selectedCollection.cards;
			localStorage.setItem("Collections", JSON.stringify(collections));
			collections = JSON.parse(localStorage.getItem("Collections")) || [defaultCollection];

			// Update and load new selectedCollection based on updated collections
			selectedCollection = collections[selectedCollectionIndex];
			localStorage.setItem("selectedCollection", JSON.stringify(selectedCollection));
			selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || collections[0];

			//cards.init(pagination.selectedPage);
			topicSelector.selectCardsByTopic();
		}
		
		function _renderCardSide(e, viewedCard, frontSide) {
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

		return {
			init: init,
			closeCardView: closeCardView
		};

	})();

	/**
	 *  Topic Adder module
	 *
	 */
	var topicAdder = (function() {
		var selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection,
			selectedTopic = JSON.parse(localStorage.getItem("selectedTopic"));

		function init(parentId, isMultiple) {
			isMultiple = isMultiple || false;

			_render(parentId, isMultiple);
		}

		function _render(parentId, isMultiple) {

			var parent = document.getElementById(parentId),
				topicOptions = '';
			
			for (var i = 0; i < selectedCollection.topics.length; i++) {
				if (selectedTopic !== i) {
					topicOptions += '<option value="' + i + '">' + selectedCollection.topics[i] + '</option>';
				} else {
					topicOptions += '<option value="' + i + '" selected="selected">' + selectedCollection.topics[i] + '</option>';
				}	
			}				

			var html = '';
				html += '	<label for="cardTopic">Select Topic</label>';
				html += '	<select id="cardTopic" required>' + topicOptions + '</select>';
				html += '	<div id="createTopicValidationBox" class="validation-box"></div>';

			parent.innerHTML = html;

			var cardTopic = document.getElementById("cardTopic");
			
			if(isMultiple) {
				cardTopic.multiple = "multiple";
			}

			_createAddTopicLink(parentId);

			_bindRenderedEvents();
		}

		function _bindRenderedEvents() {
			cardTopic.addEventListener('change', function(event) {
				//spr czy nie trzeba tutaj dać warunku isMultiple?
				_setSelectedTopics();
			}.bind(this));
		}
		
		function _setSelectedTopics() {
			var selectedTopics = [],
				options = cardTopic && cardTopic.options;

			for (var i=0, iLen=options.length; i<iLen; i++) {
				if (options[i].selected) {
					selectedTopics.push(options[i].text);
				}
			}
			selectedCollection.topics = selectedTopics;
			localStorage.setItem("selectedCollection", JSON.stringify(selectedCollection));
		}
		
		function _createAddTopicLink(parentId) {
			
			var addTopicLink = document.createElement('a');
			addTopicLink.id = "addTopicLink";
			addTopicLink.className = "add-topic-link";
			
			var addTopicLinkLabel = document.createTextNode("+ Add new topic");
			addTopicLink.appendChild(addTopicLinkLabel);

			document.getElementById(parentId).appendChild(addTopicLink);

			addTopicLink.addEventListener('click', function(event) {
				event.stopPropagation();
				_createAddTopicInput(event, parentId);
			}.bind(this));
		}
		
		function _createAddTopicInput(e, parentId) {
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
				_createNewTopic(e);
				_removeAddTopicInput();
				_createAddTopicLink(parentId);				
			}.bind(this));
		}
		
		function _createNewTopic(e) {
			var createTopicValidationBox = document.getElementById('createTopicValidationBox'),
				newTopic = e.target.value;

			for(var i = 0; i < selectedCollection.topics.length; i++) {
				if(selectedCollection.topics[i].indexOf(newTopic) !== -1) {
					createTopicValidationBox.innerHTML = '<p class="validation-message">Specified topic already exists!</p>';
					return false;
				}
			}
			selectedCollection.topics.push(newTopic);
			localStorage.setItem("selectedCollection", JSON.stringify(selectedCollection));
			selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || cards.collections[0];		
			
			cardTopic.innerHTML = '';
			getCollectionTopics();
		}
		
		function _removeAddTopicLink() {
			var addTopicLink = document.getElementById("addTopicLink");
			addTopicLink.parentNode.removeChild(addTopicLink);
		}
		
		function _removeAddTopicInput() {
			var createTopicInput = document.getElementById('createTopicInput');
			createTopicInput.parentNode.removeChild(createTopicInput);
		}
		
		function getCollectionTopics() {
			var cardTopics = '',
				i = 0;

			for (; i < selectedCollection.topics.length; i++) {
				cardTopics += '<option>' + selectedCollection.topics[i] + '</option>';
			}
			cardTopic.innerHTML = cardTopics;
		}

		return {
			init: init,
			getCollectionTopics: getCollectionTopics
		};

	})();

	/**	
	 *  Pagination module
	 *
	 */	
	var pagination = (function() {			
		var selectedCollection,
			selectedPage,
			cardsPerPage;

			console.log('pag init pokazuje cardsPerPage' + cardsPerPage);

		//CacheDOM
		var pseudoFooter = document.getElementById('pseudoFooter');

		function init() {
			_render();
			_bindEvents();
		}
				
		function _bindEvents() {
			document.addEventListener("click", function(e) {
				var element = e.target,
					paginationList = document.getElementById('paginationList');

				if(utils.hasClass(element, "pagination-page")) {
					for(var i=0; i < paginationList.childNodes.length;i++) {
						paginationList.childNodes[i].className = "pagination-page";
					}		
					element.className += ' current-page';
					var page = element.firstChild.nodeValue;
					selectedPage = page;
					localStorage.setItem("selectedPage", JSON.stringify(page));
					
					cards.init(page);
				}
			}.bind(this));

			// funkcja render poniżej pobiera nieprawidłową liczbę widocznych kart (po zrobieniu searcha)
			events.on("searchCardCompleted", _render);
			events.on("selectCollection", _render);
		}
		
		function _render() {
			selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection,
			selectedPage = JSON.parse(localStorage.getItem("selectedPage")) || 1,
			cardsPerPage = cards.setCardsPerPage();			

			pseudoFooter.innerHTML = '';

			if(selectedCollection.cards.length <= cardsPerPage) {
				pseudoFooter.innerHTML = '';
				return false;
			}	

			var pagesCount = Math.ceil(selectedCollection.cards.length / cardsPerPage),
				buttons = '';

			for (var i=0; i < pagesCount; i++) {
				buttons += '<li class="pagination-page">' + (i+1) + '</li>';
			}

			var html = '';
				html += '	<ul id="paginationList" class="pagination-list">' + buttons + '</ul>';
			
			pseudoFooter.innerHTML = html;
			_setCurrentPageClass();
		}
		
		function _setCurrentPageClass() {
			var paginationList = document.getElementById('paginationList');
			
			if (paginationList.childNodes[parseInt(selectedPage) - 1]) {
				paginationList.childNodes[parseInt(selectedPage) - 1].className += ' current-page';
			} else {
				var pagesCount = Math.ceil(selectedCollection.cards.length / cardsPerPage);
				paginationList.childNodes[parseInt(pagesCount) - 1].className += ' current-page';
			}
		}

		return {
			init: init,
			selectedPage: selectedPage
		};

	})();

	/**	
	 *  Topic Selector module
	 *
	 */	
	var topicSelector = (function() {
		var selectedTopic, 
			selectedCollection;
		
		//CacheDOM
		var topicSelect = document.getElementById("topicSelect");		

		function init() {		
			selectedTopic = parseInt(JSON.parse(localStorage.getItem("selectedTopic"))) || -1,
			selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection;			

			_bindEvents();
			_render();
		};
		init();
		
		function _bindEvents() {
			topicSelect.addEventListener("change", selectCardsByTopic.bind(this));

			events.on("selectCollection", getTopics);
		}
		
		function _render() {
			//tutaj wstawić budowanie topic selectora z htmla
			
			getTopics();
			selectCardsByTopic();
		}
		
		function getTopics() {
			var topicOptions = '',
				i = 0;
			
			for (; i < selectedCollection.topics.length; i++) {
				if (selectedTopic !== i) {
					topicOptions += '<option value="' + i + '">' + selectedCollection.topics[i] + '</option>';
				} else {
					topicOptions += '<option value="' + i + '" selected="selected">' + selectedCollection.topics[i] + '</option>';
				}	
			}

			var html = '';
				html += '	<option value="-1">select topic</option>';
				html += topicOptions;
				html += '	<option value="addNewTopic">ADD NEW TOPIC</option>';
			
			topicSelect.innerHTML = html;
		}
		
		function selectCardsByTopic(e) {
			var element = e ? e.target.value : parseInt(selectedTopic);

			if (element === '-1' || element === -1) {
				selectedTopic = topicSelect.options[topicSelect.selectedIndex].value;
				localStorage.setItem("selectedTopic", JSON.stringify(selectedTopic));
				cards.init(pagination.selectedPage);
			} else if (element === 'addNewTopic') {
				topicForm.init();
			} else {
				element = parseInt(element);		
				cards.init(pagination.selectedPage);
				element = (element === '0') ? 0 : element;
				
				for(var i = 0; i < selectedCollection.cards.length; i++) {
					if(selectedCollection.topics[element].indexOf(selectedCollection.cards[i].topic) === -1) {
						var card = document.getElementById("cardMiniature" + selectedCollection.cards[i].id);
						if(card) {
							card.parentNode.removeChild(card);					
						}
					}
				}			
			}

			selectedTopic = topicSelect.options[topicSelect.selectedIndex].value;
			localStorage.setItem("selectedTopic", JSON.stringify(selectedTopic));				
		}

		return {
			init: init,
			getTopics: getTopics,
			selectCardsByTopic: selectCardsByTopic,
			topicSelect: topicSelect
		};

	})();

	/**
	 *	Topic Form Module
	 *
	 */
	var topicForm = (function() {
		var selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection,
			selectedCollectionIndex = JSON.parse(localStorage.getItem("selectedCollectionIndex")) || 0;

		function init() {
			_render();
		}
		
		function _render() {
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
				html += '			<a class="cancel-form" id="cancelFormBtn">Cancel</a>';
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

			var closeBtn = document.getElementById('closeBtn'),
				fogBlanket = document.getElementById("fogBlanket"),
				cancelFormBtn = document.getElementById('cancelFormBtn'),
				topicForm = document.getElementById('topicSection');

			closeBtn.addEventListener('click', _closeTopicForm.bind(this));
			cancelFormBtn.addEventListener('click', _closeTopicForm.bind(this));
			fogBlanket.addEventListener('click', _closeTopicForm.bind(this));
			topicForm.addEventListener('submit', function(event) {
				event.preventDefault();
				_createTopic(event);
			}.bind(this));
		}		
		
		function _closeTopicForm() {
			var topicForm = document.getElementById("topicForm").parentNode;
			topicForm.parentNode.removeChild(topicForm);
			topicSelect.getElementsByTagName('option')[0].selected = 'selected';
			_closeTopicFormFogBlanket();
		}
		
		function _closeTopicFormFogBlanket() {
			var isFog = !!document.getElementById("fogBlanket");
			
			if(isFog) {
				var fogBlanket = document.getElementById("fogBlanket");
				fogBlanket.parentNode.removeChild(fogBlanket);		
			}
		}
		
		function _createTopic(e) {
			var topicValidationBox = document.getElementById('topicValidationBox'),
				newTopicForm = document.getElementById('topicForm'),
				topicName = document.getElementById('topicName'),
				newTopic = topicName.value,
				existingCollections = JSON.parse(localStorage.getItem("Collections")),
				i = 0;

			for (;i < selectedCollection.topics.length;i++) {
				if(newTopic.indexOf(selectedCollection.topics[i]) !== -1) {
					topicValidationBox.innerHTML = '<p class="validation-message">Specified topic already exists!</p>';
					newTopicForm.reset();
					return false;
				}
			}
			
			// Adding newly created topic to selected collection
			selectedCollection.topics.push(newTopic);
			// Updating Collections to contain collection with new topic
			existingCollections[selectedCollectionIndex] = selectedCollection;

			// Updating Collections data
			localStorage.setItem("Collections", JSON.stringify(existingCollections));
			// Getting updated Collections data for our modules
			var collections = JSON.parse(localStorage.getItem("Collections"));
			
			// Setting new selectedCollection
			localStorage.setItem("selectedCollection", JSON.stringify(selectedCollection));
			// Getting new selectedCollection for our modules		
			topicSelector.selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || collections[0];
			selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || collections[0];
				
			topicSelector.init();		
			_closeTopicForm();
		}

		return {
			init: init
		};

	})();

	/**	
	 *  Views module for manipulating displaying 
	 *  cards options and types
	 *
	 */
	var viewTypes = (function() {
		var viewType = JSON.parse(localStorage.getItem("viewType")) || 'grid-view',
			selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection;

		//CacheDOM
		var listViewBtn = document.getElementById("listViewBtn"),
			gridViewBtn = document.getElementById("gridViewBtn"),
			detailsViewBtn = document.getElementById("detailsViewBtn"),
			sectionWrapper = document.getElementById("sectionWrapper"),
			cardsWrapper = document.getElementById("cardsWrapper");

		var init = (function() {
			_bindEvents();
			_render();
		})();
		
		function _bindEvents() {
			gridViewBtn.addEventListener("click", _toggleView.bind(this));
			listViewBtn.addEventListener("click", _toggleView.bind(this));
			detailsViewBtn.addEventListener("click", _toggleView.bind(this));
		}

		function _render() {
			//tu wstawić render buttonów do wyboru view type

			getView();
		}
		
		function _toggleView(e) {
			var element = e.target;
			
			if (element.id === "gridViewBtn" && viewType !== 'grid-view') {
				_switchGridView();
			} else if (element.id === "listViewBtn" && viewType !== 'list-view') {
				_switchListView();	
			} else if (element.id === "detailsViewBtn" && viewType !== 'details-view') {
				_switchDetailsView();	
			}
		}
		
		function getView() {
			if(viewType === 'grid-view') {
				_switchGridView();
			} else if (viewType === 'list-view') {
				_switchListView();
			} else {
				_switchDetailsView();
			}
		}
		
		function _switchGridView() {
			if (viewType === 'details-view') {
				_removeCardPreview();
			}	
			viewType = 'grid-view';
			var cardsPerPage = cards.setCardsPerPage();
			cardsWrapper.className = 'grid-view';
			gridViewBtn.className += ' active';
			listViewBtn.className = listViewBtn.className.replace( /(?:^|\s)active(?!\S)/g , '' );
			detailsViewBtn.className = detailsViewBtn.className.replace( /(?:^|\s)active(?!\S)/g , '' );
			localStorage.setItem("viewType", JSON.stringify(viewType));
			
			cards.init();
			pagination.init();
		}
		
		function _switchListView() {
			if (viewType === 'details-view') {
				_removeCardPreview();
			}	
			viewType = 'list-view';
			var cardsPerPage = cards.setCardsPerPage();
			cardsWrapper.className = 'list-view';
			listViewBtn.className += ' active';
			gridViewBtn.className = gridViewBtn.className.replace( /(?:^|\s)active(?!\S)/g , '' );
			detailsViewBtn.className = detailsViewBtn.className.replace( /(?:^|\s)active(?!\S)/g , '' );
			localStorage.setItem("viewType", JSON.stringify(viewType));
			
			cards.init();
			pagination.init();		
		}
		
		function _switchDetailsView() {
			viewType = 'details-view';
			var cardsPerPage = cards.setCardsPerPage();
			cardsWrapper.className = 'details-view';
			detailsViewBtn.className += ' active';
			listViewBtn.className = listViewBtn.className.replace( /(?:^|\s)active(?!\S)/g , '' );
			gridViewBtn.className = gridViewBtn.className.replace( /(?:^|\s)active(?!\S)/g , '' );
			localStorage.setItem("viewType", JSON.stringify(viewType));
			
			pagination.init();
			_createCardPreview();
			cardView.init(selectedCollection.cards[0]);
		}
		
		function _createCardPreview() {
			var html = '';

			html += '<div id="cardField" class="card-preview-sheet"></div>';

			var cardPreview = document.createElement('SECTION');
			cardPreview.id = "cardPreview";
			cardPreview.className = "card-preview";
			cardPreview.innerHTML = html.trim();
			sectionWrapper.appendChild(cardPreview);
			cards.setCardPreviewHeight();	
		}
		
		function _removeCardPreview() {
			var cardPreview = document.getElementById("cardPreview");
			cardPreview.parentNode.removeChild(cardPreview);	
		}

		return {
			init: init
		};

	})();

	/**	
	 *  Cards Filter module
	 *
	 */	
	var cardsFilter = (function() {
		var selectedSorting = JSON.parse(localStorage.getItem("selectedSorting")) || "date";

		//CacheDOM
		var cardsFilterWrapper = document.getElementById("cardsFilter");		

		var init = (function() {			
			_bindEvents();
			_setSorting();
		})();
				
		function _bindEvents() {
			cardsFilterWrapper.addEventListener("change", _selectSortingMethod.bind(this));
		}
				
		function _selectSortingMethod(e) {
			var element = e.target,
				selectedPage = JSON.parse(localStorage.getItem("selectedPage")) || 1;
				
			if (element.value === selectedSorting) {
				return false;
			} else {
				selectedSorting = element.value;
				localStorage.setItem("selectedSorting", JSON.stringify(selectedSorting));
				
				events.emit('sortingSelect', selectedPage);
			}
		}
		
		function _setSorting() {
			if (selectedSorting === 'date') {
				cardsFilterWrapper.getElementsByTagName('option')[0].selected = 'selected';
			} else if (selectedSorting === 'popularity') {
				cardsFilterWrapper.getElementsByTagName('option')[1].selected = 'selected';
			} else if (selectedSorting === 'title') {
				cardsFilterWrapper.getElementsByTagName('option')[2].selected = 'selected';
			}
		}

		return {
			init: init
		};

	})();

	/**
	 * Expose Flashrr modules via public API
	 */
	var Flashrr = (function(utils,
		events,
		flashcardsOnly, 
		searchCards, 
		profile, 
		collectionSelector, 
		cards, 
		viewTypes, 
		cardCounter, 
		topicSelector, 
		cardsFilter, 
		pagination) {
		var selectedCollection = JSON.parse(localStorage.getItem("selectedCollection")) || data.defaultCollection;

		// CacheDOM
		var pageWrapper = document.getElementById("pageWrapper"),	
			sectionWrapper = document.getElementById("sectionWrapper");
		
		// Start off
		var init = (function() {
			_bindEvents();
		})();		

		function _bindEvents() {
			document.addEventListener("keydown", _handleCardKeydownEvents.bind(this));			
			window.addEventListener("resize", _handleResize.bind(this));
			pageWrapper.addEventListener("dragover", _handlePageDragOver.bind(this));
			pageWrapper.addEventListener("dragleave", _handlePageDragLeave.bind(this));
			pageWrapper.addEventListener("drop", _handlePageDrop.bind(this));
		}
				
		function _handlePageDragOver(e) {
			e.preventDefault();
			if(utils.hasClass(pageWrapper, "drag")){
				return false;
			}
			pageWrapper.className += " drag";
		}
		
		function _handlePageDragLeave(e) {
			e.preventDefault();
			pageWrapper.className = pageWrapper.className.replace( /(?:^|\s)drag(?!\S)/g , '' );		
		}
		
		function _handlePageDrop(e) {
			e.stopPropagation();
			e.preventDefault();
			_getCardFromTxt(e);
			pageWrapper.className = pageWrapper.className.replace(/(?:^|\s)drag(?!\S)/g, "");
		}

		/**
		 *	Handle drag and drop txt files
		 */
		function _getCardFromTxt(e) {
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
		}
		
		function _handleResize() {
			cards.setCardsWrapperHeight();
		}
		
		function _handleCardKeydownEvents(e) {
			if (cardView.viewedCardIndex !== null) {
				var viewedCard = selectedCollection.cards[cardView.viewedCardIndex - 1];

				if ((e.keyCode === 0 || e.keyCode === 32) && viewedCard.isFlashcard) {
					cardView.renderCardSide(event, viewedCard);				
				}
			}	
		}

		return {
			utils: utils,
			events: events,
			flashcardsOnly: flashcardsOnly,
			searchCards: searchCards,
			profile: profile,
			collectionSelector: collectionSelector,
			cards: cards,
			topicSelector: topicSelector,
			cardsFilter: cardsFilter,
			pagination: pagination,
			viewTypes: viewTypes,		
			cardCounter: cardCounter			
		};

	})(utils,
	events,
	flashcardsOnly, 
	searchCards, 
	profile, 
	collectionSelector, 
	cards, 
	viewTypes, 
	cardCounter, 
	topicSelector, 
	cardsFilter, 
	pagination);

	window.Flashrr = Flashrr;
	
})(window);