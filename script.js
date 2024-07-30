//Variables which will be used to keep score of the game
var playerTotal = 0;
var dealerTotal = 0;

//Creates an array for the players and dealers hand, I will push more into the array if the player chooses to hit
var playerHand = [];
var dealerHand = [];

//Var to check if it is dealer or players card
var dealerOrPlayer;

//Creates an array with 52 numbers, each number will later indicate a card and score
var cardValue = [];
for (var i = 0; i < 52; ++i) {
	cardValue.push(i);
}

// Creates a separate array for drawn cards, and for aces in case ace in deck needs to be 1 instead of 11
var playerDrawnCards = [];
var dealerDrawnCards = [];

// Variable to push a red card back, just for dealers first card
var flippedCard = "Playing Card Images/red_card_back.png";
		
//Function to draw card, and then splice from array so previous card can no longer be drawn 
function drawCard() {
	var randomIndex = Math.floor(Math.random() * cardValue.length);
    var cardNumber = cardValue.splice(randomIndex, 1)[0];
    var cardImage = getCardImage(cardNumber);
	if (dealerOrPlayer == 1) {
		playerDrawnCards.push(cardImage);
	}
	else {
		dealerDrawnCards.push(cardImage);
		}
	console.log("Drawn Player Array - " + playerDrawnCards.map(String));
    console.log("Drawn Dealer Array - " + dealerDrawnCards.map(String));
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
	return `Playing Card Images/${cardValue}_${suit}.png`;
}

//Function to handle ace logic
//Was working at first, now only works sometimes, I have no idea why, I want to die
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
			alert("You busted! The House won!\nClick OK to start a new game");
			resetGame();
		}, 1000);
	}
}

//Checks if dealer busted
function didDealerBust(dealerTotal) {
	if ((dealerTotal) > 21) {
		setTimeout(function () {
			alert("The Dealer busted! You won!\nClick OK to start a new game");
			resetGame();
		}, 1000);
	}
}

//Function for flipping card animation
function flipCardAnimation(cardElement, newImage) {
  cardElement.classList.add('flip-card');
	 setTimeout(() => {
    cardElement.src = newImage;
  }, 500);
	 setTimeout(() => {
    cardElement.classList.remove('flip-card');
  }, 1000);

//Function for the deal button, it should essentially start the game, draw two cards for the dealer and player
function deal() {
	document.getElementById("dealButton").style.display = "none";
	document.getElementById("playerPoints").innerHTML = "Players Hand Value = 0";
	document.getElementById("dealerPoints").innerHTML = "Dealers Hand Value = 0";
	document.getElementById("hitButton").style.display = "block";
	document.getElementById("stayButton").style.display = "block";
	dealerHand.push(flippedCard);
	displayDealerHand();
	setTimeout(function () {
		dealerOrPlayer = 0;
		var cardImageDeal = drawCard();
		dealerHand.push(cardImageDeal);
		setTimeout(function () {
			displayDealerHand();
			dealerTotal = dealerCardPoints(cardImageDeal.charAt(20), dealerTotal, dealerDrawnCards);
			dealerOrPlayer = 1;
			var cardImagePlayer = drawCard();
			playerHand.push(cardImagePlayer);
			setTimeout(function () {
				displayPlayerHand();
				playerTotal = playerCardPoints(cardImagePlayer.charAt(20), playerTotal, playerDrawnCards);
				cardImagePlayer = drawCard();
				playerHand.push(cardImagePlayer);
				playerTotal = playerCardPoints(cardImagePlayer.charAt(20), playerTotal, playerDrawnCards);
				setTimeout(function () {
					displayPlayerHand();
					console.log("Drawn Player Array - " + playerDrawnCards.map(String));
					console.log("Drawn Dealer Array - " + dealerDrawnCards.map(String));
					},750);
				},750);
			},750);
	},750);
}
	
//Function for the Hit button, raising the playerHand array, and assigning points to player, and rendering the players hand
async function hit() {
	dealerOrPlayer = 1;
	var cardImage = drawCard();
	playerHand.push(cardImage);
	displayPlayerHand();
	playerTotal = playerCardPoints(cardImage.charAt(20), playerTotal, playerDrawnCards);
	didPlayerBust(playerTotal);
	console.log("Drawn Player Array - " + playerDrawnCards.map(String));
}

//Function for the stay button, essentially it will be the dealers AI
async function stay() {
  dealerHand.shift();
  dealerOrPlayer = 0;
  var flipCardOver = drawCard();
  var dealerHandElement = document.getElementById("dealerHand");
  var firstCardElement = dealerHandElement.querySelector("img");
  flipCardAnimation(firstCardElement, flipCardOver);
  setTimeout(() => {
    dealerHand.unshift(flipCardOver);
    displayDealerHand();
    dealerTotal = dealerCardPoints(flipCardOver.charAt(20), dealerTotal, dealerDrawnCards);
    while (playerTotal > dealerTotal && dealerTotal < 17) {
      var cardImage = drawCard();
      dealerHand.push(cardImage);
      await new Promise(resolve => setTimeout(resolve, 750));
      displayDealerHand();
      dealerTotal = dealerCardPoints(cardImage.charAt(20), dealerTotal, dealerDrawnCards);
      console.log("Drawn Dealer Array - " + dealerDrawnCards.map(String));
    }
    if (dealerTotal > 21) {
      didDealerBust(dealerTotal);
      return;
    } else if (dealerTotal < playerTotal && playerTotal <= 21) {
      setTimeout(function () {
        alert("You scored more than the dealer! You won!\nClick OK to start a new game");
        resetGame();
      }, 1000);
      return;
    } else if (dealerTotal == playerTotal) {
      setTimeout(function () {
        alert("The Dealer tied with you! It is a draw!\nClick OK to start a new game");
        resetGame();
      }, 1000);
      return;
    } else if ((dealerTotal > playerTotal) && (playerTotal < 21)) {
      setTimeout(function () {
        alert("The Dealer scored more than you! You lost!\nClick OK to start a new game");
        resetGame();
      }, 1000);
      return;
    } else {
      setTimeout(function () {
        alert("The Dealer scored more than you! You lost!\nClick OK to start a new game");
        resetGame();
      }, 1000);
      return;
    }
  }, 1000);
}
	
//Function for rendering the players hand
function displayPlayerHand() {
  var playerHandElement = document.getElementById("playerHand");
  playerHandElement.innerHTML = '';

  for (var i = 0; i < playerHand.length; ++i) {
    var cardImageElement = document.createElement("img");
    cardImageElement.src = playerHand[i];

    if (i == playerHand.length - 1) {
      cardImageElement.classList.add("card-animation");
    }

    playerHandElement.appendChild(cardImageElement);
  }
}

//Function for rendering the dealers hand
function displayDealerHand() {
  var dealerHandElement = document.getElementById("dealerHand");
  dealerHandElement.innerHTML = '';

  for (var i = 0; i < dealerHand.length; ++i) {
    var cardImageElement = document.createElement("img");
    cardImageElement.src = dealerHand[i];

    if (i == dealerHand.length - 1) {
      cardImageElement.classList.add("card-animation");
    }

    dealerHandElement.appendChild(cardImageElement);
  }
}

//Function to start the game and reset the hands and scores
function startGame() {
	document.getElementById("title").innerHTML = '';
	document.getElementById("startButton").style.display = "none";
	document.getElementById("dealButton").style.display = "block";
	document.getElementById("gameBody").style.backgroundImage = "url('blackJackGameBackground.jpg')";
}

//Function to reset the game
function resetGame() {
    playerTotal = 0;
    dealerTotal = 0;
    playerHand = [];
    dealerHand = [];
    dealerDrawnCards = [];
	playerDrawnCards = [];
    drawnAces = [];
    document.getElementById("playerHand").innerHTML = '';
    document.getElementById("dealerHand").innerHTML = '';
    document.getElementById("playerPoints").innerHTML = "";
    document.getElementById("dealerPoints").innerHTML = "";
    document.getElementById("dealButton").style.display = "block";
    document.getElementById("hitButton").style.display = "none";
	document.getElementById("stayButton").style.display = "none";
}
