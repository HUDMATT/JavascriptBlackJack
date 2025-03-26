import {
    getPlayerTotal, setPlayerTotal,
    getDealerTotal, setDealerTotal,
    getPlayerCash, setPlayerCash,
    getCurrentBet, setCurrentBet,
    getPlayerHand, setPlayerHand,
    getDealerHand, setDealerHand,
    getDealerDrawnCards, setDealerOrPlayer,
    flippedCard, getPlayerDrawnCards,
    setPlayerDrawnCards, setDealerDrawnCards,
    getCardValue,
    setCardValue
} from './globals.js';

import {
    drawCard,
    cardPointsSwitch,
    displayPlayerHand,
    displayDealerHand,
} from './utilities.js';

//Function to start the game and reset the hands and scores
function startGame() {
    document.getElementById("cardDeck").style.display = "block";
    document.getElementById("title").innerHTML = '';
    document.getElementById("startButton").style.display = "none";
    document.getElementById("dealButton").style.display = "block";
    document.getElementById("betControls").style.display = "flex";
    document.getElementById("gameBody").style.backgroundImage = "url('Images/blackJackGameBackground.jpg')";
    document.getElementById("playerCash").innerHTML = "Player Cash: $" + getPlayerCash();
    setCurrentBet(0);
    document.getElementById("currentBet").innerHTML = "Current Bet: $" + getCurrentBet();
}

// Function to increase the bet amount
function increaseBet() {
    if (getCurrentBet() < getPlayerCash()) {
        setCurrentBet(getCurrentBet() + 10); // Increase bet by $10
        document.getElementById("currentBet").innerHTML = "Current Bet: $" + getCurrentBet();
    }
}

// Function to decrease the bet amount
function decreaseBet() {
    if (getCurrentBet() > 0) {
        setCurrentBet(getCurrentBet() - 10); // Decrease bet by $10
        document.getElementById("currentBet").innerHTML = "Current Bet: $" + getCurrentBet();
    }
}

//Displays players points
function playerCardPoints(cardValue, currentValue, drawnCards) {
    currentValue = cardPointsSwitch(cardValue, currentValue, drawnCards);
    console.log(`Player points after cardPointsSwitch: ${currentValue}`);
    document.getElementById("playerPoints").innerHTML = "Players Hand Value = " + currentValue;
    return currentValue
}

//Function to return the value of the dealer cards pertaining to the game (1 - 11)
function dealerCardPoints(cardValue, currentValue, drawnCards) {
    currentValue = cardPointsSwitch(cardValue, currentValue, drawnCards);
    console.log(`Dealer points after cardPointsSwitch: ${currentValue}`);
    document.getElementById("dealerPoints").innerHTML = "Dealers Hand Value = " + currentValue;
    return currentValue
}

//Function to check if the player busted
function didPlayerBust(playerTotal) {
    if ((playerTotal) > 21) {
        setTimeout(function () {
            showResultScreen("You busted! The House won!", -getCurrentBet());
        }, 1000);
    }
}

//Checks if dealer busted
function didDealerBust(dealerTotal) {
    if ((dealerTotal) > 21) {
        setTimeout(function () {
            showResultScreen("The Dealer busted! You won!", getCurrentBet());
        }, 1000);
    }
}

//Function for the deal button, it should essentially start the game, draw two cards for the dealer and player
function deal() {
    if (getCurrentBet() <= 0 || getCurrentBet() > getPlayerCash()) {
        alert("Invalid bet amount. Please enter a valid amount.");
        return;
    }
    var deckSize = getCardValue();
    console.log("Deck Size: " + deckSize.length);
    if (deckSize.length <= 20){ //Shuffles deck when cards are low
        for (var i = 0; i < 104; ++i) 
            deckSize.push(i % 52);
        setCardValue(deckSize);
        console.log("Shuffling deck");
        console.log("New Deck Size: " + deckSize.length);
    }
    document.getElementById("playerCash").innerHTML = "Player Cash: $" + getPlayerCash();
    document.getElementById("dealButton").style.display = "none";
    document.getElementById("betControls").style.display = "none";
    document.getElementById("playerPoints").innerHTML = "Players Hand Value = 0";
    document.getElementById("dealerPoints").innerHTML = "Dealers Hand Value = 0";
    document.getElementById("hitButton").style.display = "block";
    document.getElementById("stayButton").style.display = "block";
    var dealerHand = getDealerHand();
    dealerHand.push(flippedCard);
    setDealerHand(dealerHand);
    displayDealerHand();
    setTimeout(function () {
        setDealerOrPlayer(0);
        var cardImageDeal = drawCard();
        dealerHand.push(cardImageDeal);
        setDealerHand(dealerHand);
        setTimeout(function () {
            displayDealerHand();
            setDealerTotal(dealerCardPoints(cardImageDeal.charAt(27), getDealerTotal(), getDealerDrawnCards()));
            setDealerOrPlayer(1);
            var cardImagePlayer = drawCard();
            var playerHand = getPlayerHand();
            playerHand.push(cardImagePlayer);
            setPlayerHand(playerHand);
            setTimeout(function () {
                displayPlayerHand();
                setPlayerTotal(playerCardPoints(cardImagePlayer.charAt(27), getPlayerTotal(), getPlayerDrawnCards()));
                cardImagePlayer = drawCard();
                playerHand.push(cardImagePlayer);
                setPlayerHand(playerHand);
                setPlayerTotal(playerCardPoints(cardImagePlayer.charAt(27), getPlayerTotal(), getPlayerDrawnCards()));
                setTimeout(function () {
                    displayPlayerHand();
                    console.log("Drawn Player Array - " + getPlayerDrawnCards().map(String));
                    console.log("Drawn Dealer Array - " + getDealerDrawnCards().map(String));
                }, 750);
            }, 750);
        }, 750);
    }, 750);
}

//Function for the stay button, essentially it will be the dealers AI
async function stay() {
    var dealerHand = getDealerHand();
    dealerHand.shift();
    setDealerHand(dealerHand);
    setDealerOrPlayer(0);
    var flipCardOver = drawCard();
    dealerHand.unshift(flipCardOver);
    setDealerHand(dealerHand);
    var dealerHandElement = document.getElementById("dealerHand");
    var flippedCardElement = dealerHandElement.firstChild;
    flippedCardElement.classList.add("flip-2-ver-right-1");
    
    // First animation delay
    setTimeout(function () {
        flippedCardElement.src = flipCardOver;
    }, 250);
    
    // Wait for flip animation and add extra delay
    setTimeout(function () {
        flippedCardElement.classList.remove("flip-2-ver-right-1");
        displayDealerHand(true); 
        setDealerTotal(dealerCardPoints(flipCardOver.charAt(27), getDealerTotal(), getDealerDrawnCards()));
    }, 500);
    
    // Add delay after initial card flip
    await new Promise(resolve => setTimeout(resolve, 500));

    while (getPlayerTotal() > getDealerTotal() && getDealerTotal() < 17) {
        var cardImage = drawCard();
        dealerHand.push(cardImage);
        setDealerHand(dealerHand);
        await new Promise(resolve => setTimeout(resolve, 750));
        displayDealerHand(true); 
        setDealerTotal(dealerCardPoints(cardImage.charAt(27), getDealerTotal(), getDealerDrawnCards()));
        console.log("Drawn Dealer Array - " + getDealerDrawnCards().map(String));
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    if (getDealerTotal() > 21) {
        didDealerBust(getDealerTotal());
        return;
    } else if (getDealerTotal() < getPlayerTotal() && getPlayerTotal() <= 21) {
        setTimeout(function () {
            showResultScreen("You scored more than the dealer! You won!", getCurrentBet());
        }, 1000);
        return;
    } else if (getDealerTotal() == getPlayerTotal()) {
        setTimeout(function () {
            showResultScreen("The Dealer tied with you! It is a draw!", 0);
        }, 1000);
        return;
    } else if ((getDealerTotal() > getPlayerTotal()) && (getPlayerTotal() < 21)) {
        setTimeout(function () {
            showResultScreen("The Dealer scored more than you! You lost!", -getCurrentBet());
        }, 1000);
        return;
    } else {
        setTimeout(function () {
            showResultScreen("The Dealer scored more than you! You lost!", -getCurrentBet());
        }, 1000);
        return;
    }
}

//Function for the hit button, it should draw a card for the player
function hit() {
    setDealerOrPlayer(1);
    var cardImage = drawCard();
    var playerHand = getPlayerHand();
    playerHand.push(cardImage);
    setPlayerHand(playerHand);
    setPlayerTotal(playerCardPoints(cardImage.charAt(27), getPlayerTotal(), getPlayerDrawnCards()));
    displayPlayerHand();
    didPlayerBust(getPlayerTotal());
}

//Function to reset the hand
function resetHand() {
    setPlayerTotal(0);
    setDealerTotal(0);
    setPlayerHand([]);
    setDealerHand([]);
    setDealerDrawnCards([]);
    setPlayerDrawnCards([]);
    document.getElementById("playerHand").innerHTML = '';
    document.getElementById("dealerHand").innerHTML = '';
    document.getElementById("playerPoints").innerHTML = "";
    document.getElementById("dealerPoints").innerHTML = "";
    document.getElementById("dealButton").style.display = "block";
    document.getElementById("hitButton").style.display = "none";
    document.getElementById("stayButton").style.display = "none";
    document.getElementById("betControls").style.display = "flex";
}

//Function to reset the game
function resetGame() {
    setPlayerCash(100);
    resetHand();
    document.getElementById("playerCash").innerHTML = "Player Cash: $" + getPlayerCash();
    document.getElementById("lostScreen").style.display = "none";
}

//Function to show the result screen
function showResultScreen(message, cashChange) {
    setPlayerCash(getPlayerCash() + cashChange);
    document.getElementById("resultMessage").innerHTML = message;
    document.getElementById("resultCash").innerHTML = "You " + (cashChange >= 0 ? "won" : "lost") + " $" + Math.abs(cashChange) + ". Your new total is $" + getPlayerCash();
    document.getElementById("resultScreen").style.display = "block";
    document.getElementById("playerCash").innerHTML = "Player Cash: $" + getPlayerCash();
    document.getElementById("hitButton").style.display = "none";
    document.getElementById("stayButton").style.display = "none";
    if (getPlayerCash() <= 0) {
        showLostScreen();
    }
}

//Function to show the lost screen
function showLostScreen() {
    document.getElementById("resultScreen").style.display = "none";
    document.getElementById("lostScreen").style.display = "block";
}

//Function to deal again
function dealAgain() {
    document.getElementById("resultScreen").style.display = "none";
    resetHand();
}

//Function to quit the game
function quitGame() {
    document.getElementById("resultScreen").style.display = "none";
    resetGame();
    document.getElementById("startButton").style.display = "block";
    document.getElementById("dealButton").style.display = "none";
    document.getElementById("betControls").style.display = "none";
    document.getElementById("gameBody").style.backgroundImage = "url('Images/startMenuBackground.jpg')";
    document.getElementById("title").innerHTML = 'JavaScript<br> BlackJack<br> Game';
    document.getElementById("playerCash").innerHTML = '';
}

export {
    startGame,
    increaseBet,
    decreaseBet,
    playerCardPoints,
    dealerCardPoints,
    deal,
    stay,
    hit,
    showResultScreen,
    dealAgain,
    quitGame,
    resetGame
};
