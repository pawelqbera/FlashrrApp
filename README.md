# FlashrrApp
Flashrr is a knowledge management tool that helps you organize data in the clear form of flashcard collections

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

## Currently working on Flashrr 0.2.0, Vanilla, Spaghetti 

## Features to be added in 0.2.0
- select card types: a note or a flashcard
- if the 'flashcard' type is checked a miniature card reveils its title only (when clicked - the text content is shown instead)
- automatically detect and display URLs in card text content 
- pagination (display N cards only on the page)
- allow to create separate card collections
  - add new collection button and form
  - a collection name, description and topics can be initially specified and edited at anytime
  - one can select from the top right hand menu any collection he/she like and view its cards
- allow other file types to be attached and downloaded
- count and display unique view statistics 
- one can filter cards by date and popularity
