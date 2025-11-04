// UMD-themed card images
const cardImages = [
    'https://d.umn.edu/sites/d.umn.edu/files/styles/square/public/2021-09/UMD%20Primary%20Logo.jpg',
    'https://d.umn.edu/sites/d.umn.edu/files/styles/square/public/2021-09/UMD%20Athletics%20Logo.jpg',
    'https://d.umn.edu/sites/d.umn.edu/files/styles/square/public/2021-09/Champ%20Logo.jpg',
    'https://d.umn.edu/sites/d.umn.edu/files/styles/square/public/2021-09/UMD%20Seal.jpg',
    'https://d.umn.edu/sites/d.umn.edu/files/styles/square/public/2021-09/Bulldog%20Logo.jpg',
    'https://d.umn.edu/sites/d.umn.edu/files/styles/square/public/2021-09/UMD%20Library.jpg'
];

let cards = [...cardImages, ...cardImages];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matches = 0;
let gameTimer;
let gameStarted = false;
let seconds = 0;

// Shuffle cards
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Create game board
function createBoard() {
    const gameBoard = document.querySelector('.memory-game');
    shuffle(cards).forEach((img, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.cardIndex = index;
        card.dataset.cardImage = img;
        
        card.innerHTML = `
            <img class="front-face" src="${img}" alt="UMD Card">
            <div class="back-face"></div>
        `;
        
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard || this === firstCard) return;
    
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;
    
    moves++;
    document.getElementById('moveCount').textContent = moves;
    
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.cardImage === secondCard.dataset.cardImage;
    
    if (isMatch) {
        matches++;
        document.getElementById('matchCount').textContent = matches;
        disableCards();
        if (matches === cards.length / 2) {
            endGame();
        }
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function startTimer() {
    gameTimer = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        document.getElementById('timeCount').textContent = 
            `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function endGame() {
    clearInterval(gameTimer);
    setTimeout(() => {
        alert(`Congratulations! You completed the game in ${moves} moves and ${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}!`);
    }, 500);
}

// Initialize the game
document.addEventListener('DOMContentLoaded', createBoard);
