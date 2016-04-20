# FlashrrApp
Flashrr is a knowledge management tool that helps organize your data in a clear and intuitive form of flashcard collections.

Visit official [Flashrr.com](http://flashrr.com) website for more details.

# WHYS

## More than a to-do list app...

The goal is to create an example web app in many possible ways starting off from filthy and messy vanilla JavaScript spaghetti code, continuing by gradually refactoring by implementation most common design patterns and libraries, and finally ending up with a full stack web app built with recently most popular frameworks. 

Long way to go!

# Installation

## Vanilla versions 

All versions of Flashrr can be simply be downloaded and opened in the browser locally as they are. After creating a local copy, navigate to a single project main folder and open index.html in the browser. Super-easy.

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
- presentation view where you can see the list of the cards and preview them at once
- FIXED: next/previous card navigation doesnt work properly
- FIXED: card searching has stopped working correctly
- FIXED: broken Display flashcards only checkbox
- FIXED: selected topic is not correctly saved into database (after page refresh wrong topic is displayed)
- FIXED: if I change collection, all topics are still displayed at once

## 0.5.0
- get rid of global variables by wrapping the whole code in self-executed anonymous function
- add 'use strict'
- re-think the modularity by dividing monolithic code into object literal modules
- separation of concerns: every module contains its own core methods like init, cache the DOM, bind events and render
- expose Flashrr modules to public API and enable communication across module via this API
- refactor of profile module

## Currently working on Flashrr 0.5.0, Vanilla, Object Literal 

## Features to be added in 0.5.0
- extract and re-factor the rest of the code

## Bugs

# License

Everything in this repo is MIT License unless otherwise specified.

MIT © Paweł Kubera.