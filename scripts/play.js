export function play(levelArray, currentLevel) {
  // Function to duplicate each card
  function duplicateCards(cards) {
    return cards.concat(cards); // Each card appears twice
  }

  // Function to shuffle the array (Fisher-Yates shuffle)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  }

  // Initialize the timer variables
  let timer;
  let timeRemaining = 180; // Time in seconds (3 minutes 30 seconds)
  
  function startTimer(shuffledLevel, currentLevel) {
    timer = setInterval(() => {
      if (timeRemaining <= 0) {
        clearInterval(timer); // Stop the timer
        showLosePage(); // Show lose page when time is up
        return;
      }
      timeRemaining--;
      updateTimerDisplay();
      checkWinCondition(shuffledLevel, currentLevel); // Use shuffledLevel here
    }, 1000); // Update every second
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.querySelector('.timer h3').textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  function showLosePage() {
    document.querySelector('.card-grid-wrapper').innerHTML = `
      <div class="game-over">
        <img src="https://AyaHA20.github.io/Memory-card-game/img/game-over.png" alt="Game Over">
        <h1>Game Over</h1>
        <p>You ran out of time!</p>
        <div class="start-button">
           <a href="index.html" class="button-link">Home</a>
        </div>
      </div>
    `;
  }

  function showWinPage() {
    document.querySelector('.card-grid-wrapper').innerHTML = `
      <div class="game-win">
        <img src="https://AyaHA20.github.io/Memory-card-game/img/win.png" alt="Winner">
        <h1>You Win :)</h1>
        <p>You are the super 'Master Memory'!</p>
        <div class="start-button">
           <a href="index.html" class="button-link">Home</a>
        </div>
      </div>
    `;
  }

  function showNextLevelPage(currentLevel) {
    if (currentLevel === 'level1') {
      document.querySelector('.js-restart-button').innerHTML = '<a href="level2.html" class="button-link">Next Level</a>';
    } else if (currentLevel === 'level2') {
      document.querySelector('.js-restart-button').innerHTML = '<a href="level3.html" class="button-link">Next Level</a>';
    }
  }

  function checkWinCondition(shuffledLevel, currentLevel) {
    setTimeout(() => {
      const allCardsVisible = shuffledLevel.every(card => {
        const img = document.querySelector(`img[src="${card.image}"]`);
        return img && img.classList.contains('visible'); // Check if all images are visible 
      });
      
      if (allCardsVisible) {
        clearInterval(timer); // Stop the timer
        if (currentLevel === 'level3') {
          showWinPage(); // If it's the final level, show the win page
        } else {
          showNextLevelPage(currentLevel); // If not, show a restart button for the next level
        }
      }
    }, 100); // Add a 100ms delay to ensure the DOM is fully updated
  }
  

  // Start the game
  const duplicatedLevel = duplicateCards(levelArray);
  const shuffledLevel = shuffleArray(duplicatedLevel);

  // Start the timer
  startTimer(shuffledLevel, currentLevel);

  // Generate the cards and display them
  let levelHTML = "";
  shuffledLevel.forEach(element => {
    levelHTML += `
      <div class="card-container" data-card-id="${element.id}">
        <div class="card-img-container" data-image="${element.image}">
          <img src="${element.image}" class="hidden">
        </div>
      </div>
    `;
  });

  let clickedCards = [];
  let lockBoard = false; // Prevents clicking while checking
  let moves = 0;

  // Inject the HTML into the page
  document.querySelector('.js-card-grid').innerHTML = levelHTML;

  // Add event listener to each card container
  document.querySelectorAll('.card-container').forEach(container => {
    container.addEventListener('click', function() {
      // Prevent clicking if board is locked (while waiting for hiding mismatched cards)
      if (lockBoard) return;

      const img = this.querySelector('img');
      if (img.classList.contains('visible')) return; // If the image is already visible

      // Reveal the card
      img.classList.add('visible');
      clickedCards.push(this); // Add the clicked card to the clickedCards array

      // If two cards have been clicked, check for a match
      if (clickedCards.length === 2) {
        moves++;
        checkForMatch();
        document.querySelector('.js-move-nbr').innerHTML = `<h3>Moves: ${moves}</h3>`;
      }
    });
  });

  // Function to check if the two clicked cards match
  function checkForMatch() {
    const [firstCard, secondCard] = clickedCards;

    // Compare the data-card-id attributes to check if they match
    if (firstCard.getAttribute('data-card-id') === secondCard.getAttribute('data-card-id')) {
      // Cards match, keep them visible and reset clickedCards array
      clickedCards = [];
    } else {
      // Cards don't match, hide them after a short delay
      lockBoard = true; // Lock the board to prevent further clicks
      setTimeout(() => {
        firstCard.querySelector('img').classList.remove('visible');
        secondCard.querySelector('img').classList.remove('visible');
        clickedCards = []; // Clear the array for the next pair
        lockBoard = false; // Unlock the board
      }, 1000); // Wait for 1 second before hiding the cards
    }
  }
}
