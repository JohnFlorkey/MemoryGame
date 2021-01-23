const gameContainer = document.getElementById("game");

const controlForm = document.querySelector('form');

const score = document.querySelector('#score');

const lowScoreSpan = document.querySelector('#lowScore');

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// keep track of whether game is complete
let gameOver = false;

// keep track of number og guesses aka score
let guesses = 0;

// keep track of lowest score
let lowScore = localStorage.getItem("lowScore");

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // give it data attributes to monitor clicked and matched statuses
    newDiv.setAttribute('data-isclicked', 'false');
    newDiv.setAttribute('data-ismatched', 'false');

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked

  // if the card clicked on is already matched then do nothing
  const isMatched = event.target.dataset.ismatched;
  if(isMatched === 'false'){

    // prevent the user from quickly clicking more than two cards
    let clickedCards = document.querySelectorAll("[data-isClicked='true']");
    if(clickedCards.length < 2) {
      
      // mark the card as clicked and change its background color
      event.target.setAttribute('data-isclicked', true);
      event.target.style.backgroundColor = event.target.className;
    }
    
    // clicked card count may have been updated so update variable
    clickedCards = document.querySelectorAll("[data-isclicked='true']");

    // with exactly two careds select time to compare
    if(clickedCards.length === 2){
      
      // increment guesses
      guesses ++;
      score.innerText = `Score: ${guesses}`;

      // compare classNames (colors)
      if (clickedCards[0].className === clickedCards[1].className){
        
        // update attributes when matched 
        for(let card of clickedCards){
          card.setAttribute('data-ismatched', true);
          card.setAttribute('data-isclicked', false);
        }
        const matchedCards = document.querySelectorAll("[data-ismatched='true']").length;
        if(matchedCards === 10){
          gameOver = true;
          if(guesses < lowScore || lowScore === ''){
            localStorage.setItem("lowScore", guesses);
          }
        }
      } else {
        // schedule the no match actions for 1 second after compare
        setTimeout(function(){ noMatch(clickedCards) }, 1000);
      }
    }
  }
}

// reset click attribute and card color
function noMatch(clickedCards){
  for(let card of clickedCards){
    card.setAttribute('data-isclicked', false);
    card.style.backgroundColor = "white";
  }
}

// when the DOM loads
// cards aren't created until the begin button is clicked
const beginBtn = document.querySelector('#begin');
beginBtn.addEventListener("click", function(event){
  event.preventDefault();
  if(gameContainer.childElementCount === 0) {
    lowScore = (lowScore === null) ? '' : lowScore;
    lowScoreSpan.innerText = `Low Score: ${lowScore}`;
    createDivsForColors(shuffledColors);
  }
})
const restartBtn = document.querySelector('#restart');
restartBtn.addEventListener("click", function(event){
  event.preventDefault();
  if(gameOver === true){
    controlForm.submit();
  }
})
// createDivsForColors(shuffledColors);