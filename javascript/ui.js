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
    getCardValue, setCardValue,
    getDefaultStyle, setDefaultStyle,
    getBlackAndWhiteStyle, setBlackAndWhiteStyle,
    getDarkStyle, setDarkStyle,
    getGoldStyle, setGoldStyle,
    setCardStyle,
    setFlippedCard,
    getCardStyle,
    setCurrentUsername,
    getCurrentUsername
} from './globals.js';

import {
    drawCard,
    cardPointsSwitch,
    displayPlayerHand,
    displayDealerHand,
} from './utilities.js';

async function handleCreateAccount(event) {
    event.preventDefault();
    
    try {
        const username = document.getElementById('newUsername').value;
        const password = document.getElementById('newPassword').value;

        if (!username || !password) {
            throw new Error('Username and password are required');
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            document.getElementById('createAccountError').textContent = 'Password does not meet requirements';
            document.getElementById('createAccountError').style.display = 'block';
            document.getElementById('createAccountError').style.color = '#ff1212';
            return;
        }

        const response = await fetch('http://localhost:3000/api/create-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to create account');
        }

        document.getElementById('createAccountError').textContent = 'Account created successfully!';
        document.getElementById('createAccountError').style.display = 'block';
        document.getElementById('createAccountError').style.color = '#4CAF50';

        setTimeout(() => {
            document.getElementById('createAccountScreen').style.display = 'none';
            document.getElementById('signInScreen').style.display = 'block';
            document.getElementById('createAccountForm').reset();
        }, 2000);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('createAccountError').textContent = error.message;
        document.getElementById('createAccountError').style.display = 'block';
        document.getElementById('createAccountError').style.color = '#ff1212';
    }
}

async function handleSignIn(event) {
    event.preventDefault();
    
    try {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            throw new Error('Username and password are required');
        }

        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed');
        }

        const data = await response.json();
        handleSignInSuccess(data);
        
    } catch (error) {
        console.error('Login error:', error);
        document.getElementById('signInError').textContent = error.message;
        document.getElementById('signInError').style.display = 'block';
        document.getElementById('signInError').style.color = '#ff1212';
    }
}

function handleSignInSuccess(data) {
    setCurrentUsername(data.username);
    setPlayerCash(data.playerCash);
    setBlackAndWhiteStyle(data.styles.blackAndWhite);
    setDarkStyle(data.styles.dark);
    setGoldStyle(data.styles.gold);

    // Reset shop display
    document.getElementById("blackandwhitebuy").style.display = data.styles.blackAndWhite ? "none" : "block";
    document.getElementById("darkbuy").style.display = data.styles.dark ? "none" : "block";
    document.getElementById("goldbuy").style.display = data.styles.gold ? "none" : "block";
    
    // Reset style buttons display
    document.getElementById("blackandwhiteStyle").style.display = data.styles.blackAndWhite ? "block" : "none";
    document.getElementById("darkStyle").style.display = data.styles.dark ? "block" : "none";
    document.getElementById("goldStyle").style.display = data.styles.gold ? "block" : "none";

    // Apply last used style
    applyCardStyle(data.lastStyle || 'Default');

    // Update UI
    document.getElementById('signInScreen').style.display = 'none';
    document.getElementById('menuScreen').style.display = 'block';
    document.getElementById('signIn').style.display = 'none';
    document.getElementById('signOut').style.display = 'block';
    document.getElementById('createAccount').style.display = 'none';
    document.getElementById('deleteAccount').style.display = 'block'; 
    document.getElementById('playerCash').innerHTML = `${data.username}'s Cash: $${getPlayerCash()}`;
    document.getElementById('signInForm').reset();
}

// Add helper function to apply card style
function applyCardStyle(style) {
    setCardStyle(style);
    document.getElementById("cardDeck").src = `Images/CardStyles/${style}/card_deck.png`;
    setFlippedCard(`Images/CardStyles/${style}/red_card_back.png`);
    
    // Update button styles based on card style
    const buttons = document.querySelectorAll('.button, .menuButton, #startButton, #dealButton, #openMenu');
    
    switch(style) {
        case 'Default':
            buttons.forEach(button => {
                button.style.background = '#ff1212';
                button.style.backgroundImage = 'linear-gradient(to bottom, #ff1212, #9e2929)';
            });
            break;
        case 'BlackAndWhite':
        case 'Dark':
            buttons.forEach(button => {
                button.style.background = '#4a4a4a';
                button.style.backgroundImage = 'linear-gradient(to bottom, #4a4a4a, #2d2d2d)';
            });
            break;
        case 'Gold':
            buttons.forEach(button => {
                button.style.background = '#ffd700';
                button.style.backgroundImage = 'linear-gradient(to bottom, #ffd700, #b8860b)';
            });
            break;
    }
    
    document.getElementById("gameBody").style.backgroundImage = `url('Images/CardStyles/${style}/blackJackGameBackground.jpg')`;
}

//Function to start the game and reset the hands and scores
function startGame() {
    document.getElementById("cardDeck").style.display = "block";
    document.getElementById("title").innerHTML = '';
    document.getElementById("startButton").style.display = "none";
    document.getElementById("dealButton").style.display = "block";
    document.getElementById("betControls").style.display = "flex";
    document.getElementById("gameBody").style.backgroundImage = `url('Images/CardStyles/${getCardStyle()}/blackJackGameBackground.jpg')`;
    document.getElementById("playerCash").innerHTML = getCurrentUsername() ? 
        `${getCurrentUsername()}'s Cash: $${getPlayerCash()}` : 
        `Player Cash: $${getPlayerCash()}`;
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
    var cardStyleChar = getCardStyle();
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
            setDealerTotal(dealerCardPoints(cardImageDeal.charAt(19 + cardStyleChar.length), getDealerTotal(), getDealerDrawnCards()));
            setDealerOrPlayer(1);
            var cardImagePlayer = drawCard();
            var playerHand = getPlayerHand();
            playerHand.push(cardImagePlayer);
            setPlayerHand(playerHand);
            setTimeout(function () {
                displayPlayerHand();
                setPlayerTotal(playerCardPoints(cardImagePlayer.charAt(19 + cardStyleChar.length), getPlayerTotal(), getPlayerDrawnCards()));
                cardImagePlayer = drawCard();
                playerHand.push(cardImagePlayer);
                setPlayerHand(playerHand);
                setPlayerTotal(playerCardPoints(cardImagePlayer.charAt(19 + cardStyleChar.length), getPlayerTotal(), getPlayerDrawnCards()));
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
        var cardStyleChar = getCardStyle();
        setDealerTotal(dealerCardPoints(flipCardOver.charAt(19 + cardStyleChar.length), getDealerTotal(), getDealerDrawnCards()));
    }, 500);
    
    // Add delay after initial card flip
    await new Promise(resolve => setTimeout(resolve, 500));

    while (getPlayerTotal() > getDealerTotal() && getDealerTotal() < 17) {
        var cardImage = drawCard();
        dealerHand.push(cardImage);
        setDealerHand(dealerHand);
        await new Promise(resolve => setTimeout(resolve, 750));
        displayDealerHand(true); 
        var cardStyleChar = getCardStyle();
        setDealerTotal(dealerCardPoints(cardImage.charAt(19 + cardStyleChar.length), getDealerTotal(), getDealerDrawnCards()));
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
    var cardStyleChar = getCardStyle();
    setPlayerTotal(playerCardPoints(cardImage.charAt(19 + cardStyleChar.length), getPlayerTotal(), getPlayerDrawnCards()));
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
async function showResultScreen(message, cashChange) {
    setPlayerCash(getPlayerCash() + cashChange);
    document.getElementById("resultMessage").innerHTML = message;
    document.getElementById("resultCash").innerHTML = "You " + 
        (cashChange >= 0 ? "won" : "lost") + " $" + Math.abs(cashChange) + 
        ". Your new total is $" + getPlayerCash();
    document.getElementById("resultScreen").style.display = "block";
    
    const username = getCurrentUsername();
    if (username) {
        try {
            // Update player data
            await updatePlayerData();

            // Update leaderboard stats
            await fetch('http://localhost:3000/api/leaderboard/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    cashChange: cashChange,
                    gameWon: cashChange > 0,
                    currentCash: getPlayerCash(),
                    bankrupt: getPlayerCash() <= 0
                })
            });
        } catch (error) {
            console.error('Error updating game data:', error);
        }
    }

    // Update display
    document.getElementById("playerCash").innerHTML = username ? 
        `${username}'s Cash: $${getPlayerCash()}` : 
        `Player Cash: $${getPlayerCash()}`;

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

//Menu functions
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("openMenu").addEventListener("click", () => {
        const menuScreen = document.getElementById("menuScreen");
        menuScreen.style.display = menuScreen.style.display === "block" ? "none" : "block";
    });

    document.getElementById("closeMenu").addEventListener("click", () => {
        document.getElementById("menuScreen").style.display = "none";
    });

    document.getElementById("selectStyle").addEventListener("click", () => {
        document.getElementById("menuScreen").style.display = "none";
        document.getElementById("styleScreen").style.display = "block";
        if (getBlackAndWhiteStyle() == true) {
            document.getElementById("blackandwhiteStyle").style.display = "block";
        }
        if (getDarkStyle() == true) {
            document.getElementById("darkStyle").style.display = "block";
        }
        if (getGoldStyle() == true) {
            document.getElementById("goldStyle").style.display = "block";
        }
    });

    document.getElementById("defaultStyle").addEventListener("click", async () => {
        applyCardStyle("Default");
        document.getElementById("styleScreen").style.display = "none";
        await updateLastStyle("Default");
    });

    document.getElementById("blackandwhiteStyle").addEventListener("click", async () => {
        applyCardStyle("BlackAndWhite");
        document.getElementById("styleScreen").style.display = "none";
        await updateLastStyle("BlackAndWhite");
    });

    document.getElementById("darkStyle").addEventListener("click", async () => {
        applyCardStyle("Dark");
        document.getElementById("styleScreen").style.display = "none";
        await updateLastStyle("Dark");
    });

    document.getElementById("goldStyle").addEventListener("click", async () => {
        applyCardStyle("Gold");
        document.getElementById("styleScreen").style.display = "none";
        await updateLastStyle("Gold");
    });

    document.getElementById("shopButton").addEventListener("click", () => {
        document.getElementById("menuScreen").style.display = "none";
        document.getElementById("shopScreen").style.display = "block"
        if (getBlackAndWhiteStyle() == true) {
            document.getElementById("blackandwhiteStyle").style.display = "none";
        }
        if (getDarkStyle() == true) {
            document.getElementById("darkStyle").style.display = "none";
        }
        if (getGoldStyle() == true) {
            document.getElementById("goldStyle").style.display = "none";
        }
    })

    document.getElementById("blackandwhitebuy").addEventListener("click", async () => {
        if (getPlayerCash() > 150) {
            setPlayerCash(getPlayerCash() - 150);
            setBlackAndWhiteStyle(true);
            document.getElementById("blackandwhitebuy").style.display = "none";
            document.getElementById("blackandwhiteStyle").style.display = "block";
            await updatePlayerData();
        }
        document.getElementById("playerCash").innerHTML = getCurrentUsername() ? 
            `${getCurrentUsername()}'s Cash: $${getPlayerCash()}` : 
            `Player Cash: $${getPlayerCash()}`;
    });

    document.getElementById("darkbuy").addEventListener("click", async () => {
        if (getPlayerCash() > 200) {
            setPlayerCash(getPlayerCash() - 200);
            setDarkStyle(true);
            document.getElementById("darkbuy").style.display = "none";
            document.getElementById("darkStyle").style.display = "block";
            await updatePlayerData();
        }
        document.getElementById("playerCash").innerHTML = getCurrentUsername() ? 
            `${getCurrentUsername()}'s Cash: $${getPlayerCash()}` : 
            `Player Cash: $${getPlayerCash()}`;
    });

    document.getElementById("goldbuy").addEventListener("click", async () => {
        if (getPlayerCash() > 250) {
            setPlayerCash(getPlayerCash() - 250);
            setGoldStyle(true);
            document.getElementById("goldbuy").style.display = "none";
            document.getElementById("goldStyle").style.display = "block";
            await updatePlayerData();
        }
        document.getElementById("playerCash").innerHTML = getCurrentUsername() ? 
            `${getCurrentUsername()}'s Cash: $${getPlayerCash()}` : 
            `Player Cash: $${getPlayerCash()}`;
    });

    document.getElementById("closeShop").addEventListener("click", () => {
        document.getElementById("shopScreen").style.display = "none";
        document.getElementById("menuScreen").style.display = "block";
    });

    document.getElementById("signIn").addEventListener("click", () => {
        document.getElementById("menuScreen").style.display = "none";
        document.getElementById("signInScreen").style.display = "block";
    });

    document.getElementById("closeSignIn").addEventListener("click", () => {
            document.getElementById("signInScreen").style.display = "none";
            document.getElementById("menuScreen").style.display = "block";
            document.getElementById("signInError").style.display = "none";
            document.getElementById("signInForm").reset();
    });

    document.getElementById("signInForm").addEventListener("submit", (e) => {
        e.preventDefault();
        document.getElementById("signInError").style.display = "block";
    });
    document.getElementById("signInForm").addEventListener("submit", handleSignIn);
    document.getElementById("createAccountForm").addEventListener("submit", handleCreateAccount);
    document.getElementById("createAccount").addEventListener("click", () => {
        document.getElementById("menuScreen").style.display = "none";
        document.getElementById("createAccountScreen").style.display = "block";
    });
    
    document.getElementById("closeCreateAccount").addEventListener("click", () => {
        document.getElementById("createAccountScreen").style.display = "none";
        document.getElementById("menuScreen").style.display = "block";
        document.getElementById("createAccountError").style.display = "none";
        document.getElementById("createAccountForm").reset();
    });
    
    document.getElementById("createAccountForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const password = document.getElementById("newPassword").value;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        
        if (passwordRegex.test(password)) {
            document.getElementById("createAccountError").textContent = "Work in progress";
            document.getElementById("createAccountError").style.display = "block";
        } else {
            document.getElementById("createAccountError").textContent = "Password does not meet requirements";
            document.getElementById("createAccountError").style.display = "block";
        }
    });

    document.getElementById("signOut").addEventListener("click", async () => {
        try {
            const response = await fetch('http://localhost:3000/api/signout', {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Sign out failed');
            }

            // Reset user state
            setCurrentUsername('');
            setPlayerCash(100);
            setBlackAndWhiteStyle(false);
            setDarkStyle(false);
            setGoldStyle(false);
            setCardStyle('Default');

            // Reset shop display
            document.getElementById("blackandwhitebuy").style.display = "block";
            document.getElementById("darkbuy").style.display = "block";
            document.getElementById("goldbuy").style.display = "block";
            
            // Reset style buttons
            document.getElementById("blackandwhiteStyle").style.display = "none";
            document.getElementById("darkStyle").style.display = "none";
            document.getElementById("goldStyle").style.display = "none";

            // Update UI
            document.getElementById('signIn').style.display = 'block';
            document.getElementById('signOut').style.display = 'none';
            document.getElementById('createAccount').style.display = 'block';
            document.getElementById('menuScreen').style.display = 'none';
            document.getElementById('playerCash').innerHTML = 'Player Cash: $100';

            // Reset game state
            resetGame();

            // Show signed out message
            alert('Signed out successfully');

        } catch (error) {
            console.error('Sign out error:', error);
            alert('Error signing out');
        }
    });

    // Add leaderboard button handler
    document.getElementById("leaderboard").addEventListener("click", async () => {
        document.getElementById("menuScreen").style.display = "none";
        document.getElementById("leaderboardScreen").style.display = "block";
        await updateLeaderboards();
    });

    document.getElementById("closeLeaderboard").addEventListener("click", () => {
        document.getElementById("leaderboardScreen").style.display = "none";
        document.getElementById("menuScreen").style.display = "block";
    });

    document.getElementById("deleteAccount").addEventListener("click", async () => {
        const confirmation = confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (!confirmation) return;

        const username = getCurrentUsername();
        if (!username) {
            alert("No user is currently logged in.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/delete-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete account');
            }

            alert('Account deleted successfully');
            setCurrentUsername('');
            setPlayerCash(100);
            resetGame();
            
            document.getElementById('signIn').style.display = 'block';
            document.getElementById('signOut').style.display = 'none';
            document.getElementById('createAccount').style.display = 'block';
            document.getElementById('deleteAccount').style.display = 'none';
            document.getElementById('menuScreen').style.display = 'none';
            document.getElementById('playerCash').innerHTML = 'Player Cash: $100';

        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Error deleting account: ' + error.message);
        }
    });
});

async function updatePlayerData() {
    const username = getCurrentUsername();
    if (!username) return;

    try {
        const response = await fetch('http://localhost:3000/api/update-player', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                username: username,
                playerCash: getPlayerCash(),
                styles: {
                    blackAndWhite: getBlackAndWhiteStyle(),
                    dark: getDarkStyle(),
                    gold: getGoldStyle()
                }
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update player data');
        }

        const data = await response.json();
        console.log('Player data updated:', data); // Debug log
    } catch (error) {
        console.error('Error updating player data:', error);
        throw error;
    }
}

// Add function to update last style in database
async function updateLastStyle(style) {
    const username = getCurrentUsername();
    if (!username) return;

    try {
        const response = await fetch('http://localhost:3000/api/update-style', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                username: username,
                style: style
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update style preference');
        }
    } catch (error) {
        console.error('Error updating style preference:', error);
    }
}

async function updateLeaderboards() {
    try {
        // Fetch global leaderboard
        const globalResponse = await fetch('http://localhost:3000/api/leaderboard/global');
        const globalData = await globalResponse.json();

        const tbody = document.querySelector('#globalLeaderboardTable tbody');
        tbody.innerHTML = '';
        globalData.forEach((player, index) => {
            const winnings = player.total_winnings || 0;
            tbody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${player.username}</td>
                    <td>$${winnings.toLocaleString()}</td>
                </tr>
            `;
        });

        // Fetch personal stats if logged in
        const username = getCurrentUsername();
        if (username) {
            document.getElementById("personalStats").style.display = "block";
            const personalResponse = await fetch(`http://localhost:3000/api/leaderboard/personal/${username}`);
            const stats = await personalResponse.json();

            // Handle potential null/undefined values
            document.getElementById("highestCash").textContent = (stats.highest_cash || 0).toLocaleString();
            document.getElementById("totalCashEarned").textContent = (stats.total_winnings || 0).toLocaleString();
            document.getElementById("timesBankrupt").textContent = stats.times_bankrupt || 0;
            document.getElementById("playerRank").textContent = stats.global_rank || 'N/A';
            document.getElementById("gamesPlayed").textContent = stats.games_played || 0;
            document.getElementById("gamesWon").textContent = stats.games_won || 0;
            document.getElementById("winRate").textContent = 
                stats.games_played ? ((stats.games_won / stats.games_played * 100) || 0).toFixed(1) : '0.0';
        } else {
            document.getElementById("personalStats").style.display = "none";
        }
    } catch (error) {
        console.error('Error updating leaderboards:', error);
    }
}

// Update stats after each game
async function updatePlayerStats(cashChange, gameWon = false) {
    const username = getCurrentUsername();
    if (!username) return;

    try {
        await fetch('http://localhost:3000/api/leaderboard/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                username: username,
                cashChange: cashChange,
                gameWon: gameWon,
                bankrupt: getPlayerCash() <= 0
            })
        });
    } catch (error) {
        console.error('Error updating player stats:', error);
    }
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









