import "./style.css";
import { blueplayerdeck, redplayerdeck, roundmoves } from "./game";
import getcardfromcollection from "./game";

interface Card {
  name: string;
  power: [number, number, number, number];
  face: string;
  cardID: string;
}


//buuuu

// load decks on page. players should have picked a deck previously


// round

//display both decks
// one player picks a card and a square
// the player picks a card and a square
//repeat until a player wins? 

const round = function(blueplayerdeck: Card[], redplayerdeck: Card[]) {
  let selectedsquare: string = "";
  let cardselected: string = "";
  let redplayercard: string = "";
  let redplayersquare: string = "";
  let blueplayercard: string = "";
  let blueplayersquare: string = "";
  let playerblueplayed = false;
  const keeptrackofmoves = roundmoves();

  const selectCard = function(this: HTMLElement) {
    this.classList.add("selected");
    const currentplayer = this.parentElement.id;

    if (currentplayer !== null) {
      const playerdiv = document.getElementById(currentplayer);
      if (playerdiv !== null) {
        const playerdeck = playerdiv.children;
        if (playerdeck.length !== 0) {
          for (let i = 0; i < playerdeck.length; i++) {
            const child = playerdeck[i];
            child.removeEventListener("click", selectCard);
          }
          //round(this.dataset.card);
          cardselected = this.dataset.card;
          if (currentplayer === "redplayer") {
            redplayercard = cardselected;
            keeptrackofmoves.redplayermove(cardselected);
          } else if (currentplayer === "blueplayer") {
            blueplayercard = cardselected;
            keeptrackofmoves.blueplayermove(cardselected);
          }
          if (cardselected !== "" && cardselected !== undefined) {
            createListenerOnBoard();
          }
        }
      }
    }
  }

  const deckListener = function(playerid: string) {
    const playerdiv = document.getElementById(playerid);
    const subdivs = playerdiv.children;
    if (subdivs.length !== 0) {
      for (let i = 0; i < subdivs.length; i++) {
        subdivs[i].addEventListener("click", selectCard);
      }
    }
  }

  // display both decks, add listener later
  const displayDeck = function(playerid: string, deck: Card[]): void {
    const numberofcards = deck.length;
    if (numberofcards > 0) {
      const playerdiv = document.getElementById(playerid);
      if (playerdiv !== null) {
        for (let i = 0; i < numberofcards; i++) {
          const newdiv = document.createElement("div");
          playerdiv.appendChild(newdiv);
          const title = document.createElement("h3");
          title.classList.add("cardtitle");
          title.textContent = deck[i].name;
          newdiv.appendChild(title);
          const cardpower = document.createElement("p");
          cardpower.textContent = `${deck[i].power[0]}, ${deck[i].power[1]}, ${deck[i].power[2]}, ${deck[i].power[3]}`;
          newdiv.appendChild(cardpower);
          newdiv.dataset.card = `${deck[i].cardID}`;
          // newdiv.addEventListener("click", selectCard);
        }
      }
    }
  }

  const selectSquare = function(this: HTMLElement) {
    // place card
    selectedsquare = this.id;

    const card = getcardfromcollection([cardselected]);
    if (card !== undefined) {
      const cardtitle = document.createElement("h3");
      this.appendChild(cardtitle);
      cardtitle.textContent = card[0].name;
    }
    // remove listeners
    const emptyboardsquares = document.querySelectorAll(".emptysquare");
    emptyboardsquares.forEach((square) => {
      square.removeEventListener("click", selectSquare);
    })
    this.classList.remove("emptysquare");
    if (playerblueplayed) {
      blueplayersquare = selectedsquare;
      keeptrackofmoves.blueplayermovesquare(selectedsquare);
      keeptrackofmoves.gameended();
    }
    if (!playerblueplayed) {
      redplayersquare = selectedsquare;
      keeptrackofmoves.redplayermovessquare(selectedsquare);
      deckListener("blueplayer");
      playerblueplayed = true;
    }
  }

  const createListenerOnBoard = function() {
    const emptyboardsquares = document.querySelectorAll(".emptysquare");
    emptyboardsquares.forEach((square) => {
      square.addEventListener("click", selectSquare);
    })
  }

  //first
  displayDeck("redplayer", redplayerdeck);
  deckListener("redplayer");
  //second
  displayDeck("blueplayer", blueplayerdeck);
}


const fewrounds = function() {
  console.log(round(blueplayerdeck, redplayerdeck));
  // let n = 0;
  // while (n < 3) {
  //   round(blueplayerdeck, redplayerdeck);
  //   n++;
  // }
}

fewrounds();



// //keep track of selected card




//map com cartas e cardID
// eventlistener on squares

// afer selecting card, remove other event listeners, create listeners on squares. once player selects square, update decks 

// tenho de controlar onde é que o player pode clicar


//existing cards. global variable :(
//function factory?


// game script should keep track of deck and current card; 
