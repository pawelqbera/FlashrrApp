# FlashrrApp
Flashrr is a knowledge management tool that helps you organize data in the clear form of flashcard collections

Visit official [Flashrr.com](http://flashrr.com) website for more details.

# WHYS
The goal is to create an example web app in many possible ways starting off from filthy and messy vanilla JavaScript spaghetti, continue by gradually refactoring and adding design patterns and libraries, to finally end up with a full stack web apps built with the most popular frameworks. 

Long way to go!

# Installation

## Vanilla versions 

All the versions in 'Vanilla' directory can simply be downloaded and run locally as they are. After creating a local copy, navigate to a single project main folder and run the index.html in the browser. Super-easy.

# Changelog

## 0.1.0
- a card is a model that have id, title, text and image attachments
- one can add new cards via form by entering card title, text content and [optionaly] image attachments
- data is saved in local storage 
- one can view a list of all his/her cards, it's a default view
- one can delete a card
- one can search for specific cards by filtering titles out 
- one can edit and update every single card
- there are two view modes to select (list and grid), also the current view mode is always saved in local storage
- one can open an image attachment in new window with normal sizes 
- one can display all the card details in separate view by clicking a miniature card on the list  
- a detailed card view also contains delete and edit buttons

## 0.1.1
- grouping cards in topics
  - filter cards by available topics
  - selecting or adding new topic when creating/updating a card
  - adding your own topics
- storing and displaying the card creation date
- card authorship 
  - one can set a name otherwise cards are signed 'by Anonymous' by clicking the displayed 'Welcome, <username>' message at the top right hand corner
- display the card author in the card miniature and in the detailed card view

## 0.2.0
- add new CSS styles and re-design
- select card types: a note or a flashcard
- if the 'flashcard' type is checked a miniature card reveils its title only (when clicked - the text content is shown instead)
- automatically detect and display URLs in card text content 
- pagination (display N cards only on the page)
- allow to create separate card collections
  - add new collection button and form
  - a collection name, description and topics can be initially specified and edited at anytime
  - one can select from the top right hand menu any collection he/she like and view its cards
- count and display unique view statistics 
- one can filter cards by date and popularity (number of views)

## 0.3.0
- save currently selected topic in local storage
- sort cards in collection by title (alphabetically)
- searching options: add a select to a search input with the following options: search in titles, text and authors
- add searching cards by tags
- add "previous" and "next" card navigation into detailed card view 
- removing collections (additional confirmation required)
- improve the pagination displaying in the "list" view mode
- anchors in card miniature: topic and author (on anchor click, display cards with specified topic or created by a specified author)
- YouTube videos and images are previewed in the card content when its details are viewed
- add [optional] tags for cards to be specified
- flashcards - on click, open yellow card with the title only  (more interactive and advanced design)
- new card type: a link/url to an external resources eg. articles, products, videos, images etc.
- "link" types are automatically previewed in their miniatures when YouTube video or image urls are detected
- drag and drop attachments
- automatically read and fill in a new card form depending on a dragged and dropped file to the app stage

## 0.4.0
- FIXED: Cards height issues on different screens
- FIXED: Edit Card click - attachments are disappearing
- checkbox in header "show flashcards only"
- FIXED: default collection: when searching for specific cards and decreasing the range of displayed cards to less than a page capacity - the pagination doesn't disappear
- FIXED: app.js:782 Uncaught TypeError: Cannot read property 'parentNode' of nullremoveAddTopicLink @ app.js:782(anonymous function) @ app.js:739
- FIXED: after closing a detailed card view, all collection cards are displayed even if the recent topic remains selected
- FIXED: event listener has to be removed (inactive) on viewcard close
- FIXED: if you're on the last page of "list" view and switch the view type to "grid" a following error is thrown: Uncaught TypeError: Cannot read property 'className' of undefined
- bugs fixing

## Currently working on Flashrr 0.4.0, Vanilla, Spaghetti 

## Features to be added in 0.4.0
- card drafts (save unfinished cards and mark them as drafts)
- move card from one collection to another
- more advanced and user friendly text editor (bold, italic, underline, lists, headlines, urls...)
- update counter every time when number of displayed cards changes
- add comments on cards
- presentation view where you can see the list of the cards and preview them at once  

## Bugs

# License

Everything in this repo is MIT License unless otherwise specified.

MIT © Paweł Kubera.