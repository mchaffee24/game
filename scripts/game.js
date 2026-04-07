import { saveBestScore, loadBestScore, savePlayerSettings, loadPlayerSettings } from "./storage.js";

const baseCards = [
  { id: 1, symbol: "🍎" },
  { id: 2, symbol: "🍌" },
  { id: 3, symbol: "🍇" },
  { id: 4, symbol: "🍒" },
  { id: 5, symbol: "🍉" },
  { id: 6, symbol: "🍓" }
];

const gameBoard = document.getElementById("game-board");
const attemptsDisplay = document.getElementById("attempts");
const matchesDisplay = document.getElementById("matches");
const resetButton = document.getElementById("reset-btn");
const settingsForm = document.getElementById("settings-form");
const playerNameInput = document.getElementById("player-name");
const difficultySelect = document.getElementById("difficulty");
const gameMessage = document.getElementById("game-message");

let attempts = 0;
let matches = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let cardsInPlay = [];

console.log("Secret hint: type enableSecretTheme() in the console.");

window.enableSecretTheme = function () {
  document.body.classList.toggle("secret-theme");
};

function shuffleArray(array) {
  const shuffled = [...array];

  for (let index = shuffled.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function getCardsForDifficulty() {
  const selectedDifficulty = difficultySelect.value || "easy";

  if (selectedDifficulty === "medium") {
    return baseCards;
  }

  return baseCards.slice(0, 4);
}

function buildDeck() {
  const selectedCards = getCardsForDifficulty();
  const duplicatedCards = [...selectedCards, ...selectedCards];

  cardsInPlay = shuffleArray(duplicatedCards);
}

function updateScoreDisplay() {
  attemptsDisplay.textContent = attempts;
  matchesDisplay.textContent = matches;
}

function createCardElement(cardData, index) {
  const column = document.createElement("div");
  column.className = "col-3";

  const button = document.createElement("button");
  button.className = "card-tile w-100 border-0";
  button.type = "button";
  button.dataset.id = cardData.id;
  button.dataset.index = index;
  button.dataset.symbol = cardData.symbol;
  button.setAttribute("aria-label", "Hidden card");
  button.textContent = "?";

  button.addEventListener("click", handleCardClick);

  column.appendChild(button);
  return column;
}

function renderBoard() {
  gameBoard.innerHTML = "";

  cardsInPlay.forEach((cardData, index) => {
    const cardElement = createCardElement(cardData, index);
    gameBoard.appendChild(cardElement);
  });
}

function flipCard(cardElement) {
  cardElement.classList.add("flipped");
  cardElement.textContent = cardElement.dataset.symbol;
  cardElement.setAttribute("aria-label", `Card ${cardElement.dataset.symbol}`);
}

function unflipCard(cardElement) {
  cardElement.classList.remove("flipped");
  cardElement.textContent = "?";
  cardElement.setAttribute("aria-label", "Hidden card");
}

function markCardsAsMatched(cardOne, cardTwo) {
  cardOne.classList.add("matched");
  cardTwo.classList.add("matched");
  cardOne.disabled = true;
  cardTwo.disabled = true;
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function checkForWin() {
    const totalPairs = cardsInPlay.length / 2;
  
    if (matches === totalPairs) {
      const bestScore = loadBestScore();
  
      let messageText = "";
  
      if (bestScore === null || attempts < bestScore) {
        saveBestScore(attempts);
        messageText = `🎉 You won! New best score: ${attempts} attempts.`;
      } else {
        messageText = `🎉 You won in ${attempts} attempts. Best score: ${bestScore}.`;
      }
  
      gameMessage.textContent = messageText;
      gameMessage.classList.remove("d-none");
    }
  }

function handleMatchedCards() {
  markCardsAsMatched(firstCard, secondCard);
  matches++;
  updateScoreDisplay();
  checkForWin();
  resetTurn();
}

function handleUnmatchedCards() {
  lockBoard = true;

  setTimeout(() => {
    unflipCard(firstCard);
    unflipCard(secondCard);
    resetTurn();
  }, 800);
}

function handleCardClick(event) {
  const clickedCard = event.currentTarget;

  if (lockBoard) {
    return;
  }

  if (clickedCard === firstCard) {
    return;
  }

  if (clickedCard.classList.contains("matched")) {
    return;
  }

  flipCard(clickedCard);

  if (!firstCard) {
    firstCard = clickedCard;
    return;
  }

  secondCard = clickedCard;
  attempts++;
  updateScoreDisplay();

  if (firstCard.dataset.id === secondCard.dataset.id) {
    handleMatchedCards();
  } else {
    handleUnmatchedCards();
  }
}

function resetGame() {
    attempts = 0;
    matches = 0;
    resetTurn();
    updateScoreDisplay();
  
    gameMessage.classList.add("d-none"); // hide message
  
    buildDeck();
    renderBoard();
  }

function applySavedSettings() {
  const savedSettings = loadPlayerSettings();

  if (!savedSettings) {
    return;
  }

  if (savedSettings.playerName) {
    playerNameInput.value = savedSettings.playerName;
  }

  if (savedSettings.difficulty) {
    difficultySelect.value = savedSettings.difficulty;
  }
}

function handleSettingsSubmit(event) {
  event.preventDefault();

  if (!settingsForm.checkValidity()) {
    settingsForm.reportValidity();
    return;
  }

  const settings = {
    playerName: playerNameInput.value.trim(),
    difficulty: difficultySelect.value
  };

  savePlayerSettings(settings);
  resetGame();
}

resetButton.addEventListener("click", resetGame);
settingsForm.addEventListener("submit", handleSettingsSubmit);

applySavedSettings();
resetGame();
function setupValidationLinks() {
    const currentUrl = window.location.href;
  
    const htmlValidatorLink = document.getElementById("html-validator");
    const waveCheckerLink = document.getElementById("wave-checker");
  
    htmlValidatorLink.href = `https://validator.w3.org/nu/?doc=${encodeURIComponent(currentUrl)}`;
    waveCheckerLink.href = `https://wave.webaim.org/report#/${encodeURIComponent(currentUrl)}`;
  }
  
  setupValidationLinks();