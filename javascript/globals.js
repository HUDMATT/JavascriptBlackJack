//Variables which will be used to keep score of the game
var playerTotal = 0;
var dealerTotal = 0;
var playerCash = 100;
var currentBet = 0;

//Booleans for card styles
var defaultStyle = true;
var blackAndWhiteStyle = false;
var darkStyle = false;
var goldStyle = false;

//Card style variable
var cardStyle = "Default";

//Creates an array for the players and dealers hand, I will push more into the array if the player chooses to hit
var playerHand = [];
var dealerHand = [];

//Var to check if it is dealer or players card
var dealerOrPlayer;

//Creates an array with 52 numbers, each number will later indicate a card and score
var cardValue = [];
for (var i = 0; i < 104; ++i) {
    cardValue.push(i % 52);
}

// Creates a separate array for drawn cards, and for aces in case ace in deck needs to be 1 instead of 11
var playerDrawnCards = [];
var dealerDrawnCards = [];

// Variable to push a red card back, just for dealers first card
var flippedCard = "Images/CardStyles/Default/red_card_back.png";

// Variable to store the current username
var currentUsername = '';

//Getters and setters
function getPlayerTotal() {
    return playerTotal;
}
function setPlayerTotal(total) {
    playerTotal = total;
}
function getDealerTotal() {
    return dealerTotal;
}
function setDealerTotal(total) {
    dealerTotal = total;
}
function getPlayerCash() {
    return playerCash;
}
function setPlayerCash(cash) {
    playerCash = cash;
}
function getCurrentBet() {
    return currentBet;
}
function setCurrentBet(bet) {
    currentBet = bet;
}
function getPlayerHand() {
    return playerHand;
}
function setPlayerHand(hand) {
    playerHand = hand;
}
function getDealerHand() {
    return dealerHand;
}
function setDealerHand(hand) {
    dealerHand = hand;
}
function getDealerOrPlayer() {
    return dealerOrPlayer;
}
function setDealerOrPlayer(value) {
    dealerOrPlayer = value;
}
function getCardValue() {
    return cardValue;
}
function setCardValue(value) {
    cardValue = value;
}
function getPlayerDrawnCards() {
    return playerDrawnCards;
}
function setPlayerDrawnCards(cards) {
    playerDrawnCards = cards;
}
function getDealerDrawnCards() {
    return dealerDrawnCards;
}
function setDealerDrawnCards(cards) {
    dealerDrawnCards = cards;
}

function getDefaultStyle() {
    return defaultStyle;
}
function setDefaultStyle(style) {
    defaultStyle = style;
}
function getBlackAndWhiteStyle() {
    return blackAndWhiteStyle;
}
function setBlackAndWhiteStyle(style) {
    blackAndWhiteStyle = style;
}
function getDarkStyle() {
    return darkStyle;
}
function setDarkStyle(style) {
    darkStyle = style;
}
function getGoldStyle() {
    return goldStyle;
}
function setGoldStyle(style) {
    goldStyle = style;
}

function getCardStyle() {
    return cardStyle;
}
function setCardStyle(style) {
    cardStyle = style;
}

function setFlippedCard(card) {
    flippedCard = card;
}

function getCurrentUsername() {
    return currentUsername;
}

function setCurrentUsername(username) {
    currentUsername = username;
}

export {
    getPlayerTotal, setPlayerTotal,
    getDealerTotal, setDealerTotal,
    getPlayerCash, setPlayerCash,
    getCurrentBet, setCurrentBet,
    getPlayerHand, setPlayerHand,
    getDealerHand, setDealerHand,
    getDealerOrPlayer, setDealerOrPlayer,
    getCardValue, setCardValue,
    getPlayerDrawnCards, setPlayerDrawnCards,
    getDealerDrawnCards, setDealerDrawnCards,
    getDefaultStyle, setDefaultStyle,
    getBlackAndWhiteStyle, setBlackAndWhiteStyle,
    getDarkStyle, setDarkStyle,
    getGoldStyle, setGoldStyle,
    getCardStyle, setCardStyle,
    flippedCard, setFlippedCard,
    getCurrentUsername,
    setCurrentUsername
};