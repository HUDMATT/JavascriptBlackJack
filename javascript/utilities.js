import {
    getPlayerDrawnCards, setPlayerDrawnCards,
    getDealerDrawnCards, setDealerDrawnCards,
    getDealerOrPlayer, getDealerHand,
    getCardValue, setCardValue,
    getPlayerHand
} from './globals.js';

//Function to draw card, and then splice from array so previous card can no longer be drawn 
function drawCard() {
    var cardValue = getCardValue();
    var randomIndex = Math.floor(Math.random() * cardValue.length);
    var cardNumber = cardValue.splice(randomIndex, 1)[0];
    setCardValue(cardValue);
    var cardImage = getCardImage(cardNumber);
    if (getDealerOrPlayer() == 1) {
        var playerDrawnCards = getPlayerDrawnCards();
        playerDrawnCards.push(cardImage);
        setPlayerDrawnCards(playerDrawnCards);
    } else {
        var dealerDrawnCards = getDealerDrawnCards();
        dealerDrawnCards.push(cardImage);
        setDealerDrawnCards(dealerDrawnCards);
    }
    console.log("Drawn Player Array - " + getPlayerDrawnCards().map(String));
    console.log("Drawn Dealer Array - " + getDealerDrawnCards().map(String));
    return cardImage;
}

//Function to turn all card images into array, and return image file of said card
function getCardImage(cardNumber) {
    const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
    const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
    const suitIndex = Math.floor(cardNumber / 13);
    const cardValueIndex = cardNumber % 13;
    const suit = suits[suitIndex];
    const cardValue = cardValues[cardValueIndex];
    return `../Images/Playing Card Images/${cardValue}_${suit}.png`;
}

//Function to handle ace logic
function aceLogic(cardValue, currentValue, drawnCards, points) {
    const acesToChange = [];
    for (var i = 0; i < drawnCards.length; i++) {
        console.log(`Checking card at index ${i}: ${drawnCards[i]}`);
        console.log(`Points + currentValue > 21: ${(points + currentValue) > 21}`);
        if (drawnCards[i].includes(`ace_`) && (points + currentValue) > 21) {
            console.log(`Found ace to change at index ${i}`);
            acesToChange.push(i);
        }
        console.log('Aces to change:', acesToChange);
    }
    for (const aceIndex of acesToChange) {
        console.log(`Changing ace at index ${aceIndex}`);
        points = points - 10;
        drawnCards[aceIndex] = drawnCards[aceIndex].replace('ace', 'ace1');
    }
    console.log(`Final points after ace logic: ${points}`);
    console.log("Drawn Cards after ace logic: " + drawnCards.map(String));
    return points;
}

//Function to return the value of the cards pertaining to the game (1 - 11), also includes logic to switch aces in deck to 1 from 11 if neccessary
function cardPointsSwitch(cardValue, currentValue, drawnCards) {
    var points = 0;
    switch (cardValue) {
        case '2':
            points = 2;
            console.log(`Before calling aceLogic - points: ${points}, currentValue: ${currentValue}`);
            points = aceLogic(cardValue, currentValue, drawnCards, points);
            console.log(`After calling aceLogic - points: ${points}, currentValue: ${currentValue}`);
            break;
        case '3':
            points = 3;
            console.log(`Before calling aceLogic - points: ${points}, currentValue: ${currentValue}`);
            points = aceLogic(cardValue, currentValue, drawnCards, points);
            console.log(`After calling aceLogic - points: ${points}, currentValue: ${currentValue}`);
            break;
        case '4':
            points = 4;
            console.log(`Before calling aceLogic - points: ${points}, currentValue: ${currentValue}`);
            points = aceLogic(cardValue, currentValue, drawnCards, points);
            console.log(`After calling aceLogic - points: ${points}, currentValue: ${currentValue}`);
            break;
        case '5':
            points = 5;
            console.log(`Before calling aceLogic - points: ${points}, currentValue: ${currentValue}`);
            points = aceLogic(cardValue, currentValue, drawnCards, points);
            console.log(`After calling aceLogic - points: ${points}, currentValue: ${currentValue}`);
            break;
        case '6':
            points = 6;
            console.log(`Before calling aceLogic - points: ${points}, currentValue: ${currentValue}`);
            points = aceLogic(cardValue, currentValue, drawnCards, points);
            console.log(`After calling aceLogic - points: ${points}, currentValue: ${currentValue}`);
            break;
        case '7':
            points = 7;
            console.log(`Before calling aceLogic - points: ${points}, currentValue: ${currentValue}`);
            points = aceLogic(cardValue, currentValue, drawnCards, points);
            console.log(`After calling aceLogic - points: ${points}, currentValue: ${currentValue}`);
            break;
        case '8':
            points = 8;
            console.log(`Before calling aceLogic - points: ${points}, currentValue: ${currentValue}`);
            points = aceLogic(cardValue, currentValue, drawnCards, points);
            console.log(`After calling aceLogic - points: ${points}, currentValue: ${currentValue}`);
            break;
        case '9':
            points = 9;
            console.log(`Before calling aceLogic - points: ${points}, currentValue: ${currentValue}`);
            points = aceLogic(cardValue, currentValue, drawnCards, points);
            console.log(`After calling aceLogic - points: ${points}, currentValue: ${currentValue}`);
            break;
        case '1':
        case 'j':
        case 'q':
        case 'k':
            points = 10;
            console.log(`Before calling aceLogic - points: ${points}, currentValue: ${currentValue}`);
            points = aceLogic(cardValue, currentValue, drawnCards, points);
            console.log(`After calling aceLogic - points: ${points}, currentValue: ${currentValue}`);
            break;
        case 'a':
            points = 11;
            console.log(`Before calling aceLogic - points: ${points}, currentValue: ${currentValue}`);
            points = aceLogic(cardValue, currentValue, drawnCards, points);
            console.log(`After calling aceLogic - points: ${points}, currentValue: ${currentValue}`);
            break;
    }
    currentValue += points;
    return currentValue
}

//Function for rendering the players hand
function displayPlayerHand() {
    var playerHandElement = document.getElementById("playerHand");
    playerHandElement.innerHTML = '';

    for (var i = 0; i < getPlayerHand().length; ++i) {
        var cardImageElement = document.createElement("img");
        cardImageElement.src = getPlayerHand()[i];

        if (i == getPlayerHand().length - 1) {
            cardImageElement.classList.add("card-animation");
        }

        playerHandElement.appendChild(cardImageElement);
    }
}

//Function for rendering the dealers hand
function displayDealerHand() {
    var dealerHandElement = document.getElementById("dealerHand");
    dealerHandElement.innerHTML = '';

    for (var i = 0; i < getDealerHand().length; ++i) {
        var cardImageElement = document.createElement("img");
        cardImageElement.src = getDealerHand()[i];

        if (i == getDealerHand().length - 1) {
            cardImageElement.classList.add("card-animation");
        }

        dealerHandElement.appendChild(cardImageElement);
    }
}

export {
    drawCard,
    getCardImage,
    aceLogic,
    cardPointsSwitch,
    displayPlayerHand,
    displayDealerHand
};