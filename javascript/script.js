import {
    startGame,
    deal,
    hit,
    stay,
    increaseBet,
    decreaseBet,
    quitGame,
    resetGame,
    dealAgain
} from './ui.js';

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("startButton").addEventListener("click", startGame);
    document.getElementById("dealButton").addEventListener("click", deal);
    document.getElementById("hitButton").addEventListener("click", hit);
    document.getElementById("stayButton").addEventListener("click", stay);
    document.getElementById("increaseBetButton").addEventListener("click", increaseBet);
    document.getElementById("decreaseBetButton").addEventListener("click", decreaseBet);
    document.getElementById("dealAgainButton").addEventListener("click", dealAgain);
    document.getElementById("quitButton").addEventListener("click", quitGame);
    document.getElementById("restartButton").addEventListener("click", resetGame);
});