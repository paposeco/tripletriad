import "./style.css";
import { blueplayerdeck, redplayerdeck, movesperround } from "./game";
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

const keeptrackofmoves = movesperround();

const round = async function(redplayerdeck: Card[], blueplayerdeck: Card[], emptysquares: number) {
    let selectedsquare: string = "";
    let cardselected: string = "";
    let currentemptysquares = emptysquares;
    let playerblueplayed = false;
    let redplayerplayed = false;

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
                        keeptrackofmoves.redplayercard(cardselected);
                    } else if (currentplayer === "blueplayer") {
                        keeptrackofmoves.blueplayercard(cardselected);
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
        const playerdiv = document.getElementById(playerid);
        if (numberofcards > 0 && playerdiv.children.length === 0) {
            if (playerdiv !== null) {
                const h2player = document.createElement("h2");
                playerdiv.appendChild(h2player);
                if (playerid === "redplayer") {
                    h2player.textContent = "Red Player";
                } else {
                    h2player.textContent = "Blue Player";
                }
                for (let i = 0; i < numberofcards; i++) {
                    const newdiv = document.createElement("div");
                    playerdiv.appendChild(newdiv);
                    const title = document.createElement("h3");
                    title.classList.add("cardtitle");
                    title.textContent = deck[i].name;
                    newdiv.appendChild(title);
                    newdiv.classList.add("boardcard");


                    // const cardpower = document.createElement("p");
                    // cardpower.textContent = `${deck[i].power[0]}, ${deck[i].power[1]}, ${deck[i].power[2]}, ${deck[i].power[3]}`;
                    // newdiv.appendChild(cardpower);

                    const toppower = document.createElement("div");
                    toppower.textContent = `${deck[i].power[0]}`;
                    const midpowers = document.createElement("div");
                    const rightpower = document.createElement("div");
                    rightpower.textContent = `${deck[i].power[1]}`;
                    const bottompower = document.createElement("div");
                    bottompower.textContent = `${deck[i].power[2]}`;
                    const leftpower = document.createElement("div");
                    leftpower.textContent = `${deck[i].power[3]}`;
                    midpowers.appendChild(leftpower);
                    midpowers.appendChild(rightpower);
                    newdiv.appendChild(toppower);
                    newdiv.appendChild(midpowers);
                    newdiv.appendChild(bottompower);
                    newdiv.dataset.card = `${deck[i].cardID}`;
                    midpowers.classList.add("boardcardmid");
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
            const newdiv = document.createElement("div");
            this.appendChild(newdiv);
            newdiv.classList.add("boardcard");
            const toppower = document.createElement("div");
            newdiv.appendChild(toppower);
            toppower.textContent = `${card[0].power[0]}`;
            const midpowers = document.createElement("div");
            newdiv.appendChild(midpowers);
            midpowers.classList.add("boardcardmid");
            const rightpower = document.createElement("div");
            rightpower.textContent = `${card[0].power[1]}`;
            const leftpower = document.createElement("div");
            midpowers.appendChild(leftpower);
            midpowers.appendChild(rightpower);
            leftpower.textContent = `${card[0].power[3]}`;
            const bottompower = document.createElement("div");
            newdiv.appendChild(bottompower);
            bottompower.textContent = `${card[0].power[2]}`;

        }
        // remove listeners
        const emptyboardsquares = document.querySelectorAll(".emptysquare");
        emptyboardsquares.forEach((square) => {
            square.removeEventListener("click", selectSquare);
        })
        this.classList.remove("emptysquare");

        if (!redplayerplayed) {
            redplayerplayed = true;
            this.classList.add("redplayercard");
            keeptrackofmoves.redplayersquare(selectedsquare);
            --currentemptysquares;
            if (currentemptysquares === 0) {
                const currentscoreRed = Number(document.getElementById("scorered").textContent);
                const currentscoreBlue = Number(document.getElementById("scoreblue").textContent);
                if (currentscoreRed === currentscoreBlue) {
                    alert("it's a draw");
                } else if (currentscoreRed > currentscoreBlue) {
                    alert("red player wins");
                } else {
                    alert("blue player wins");
                }
                return;
            }
            deckListener("blueplayer");
        } else {
            keeptrackofmoves.blueplayersquare(selectedsquare);
            --currentemptysquares;
            playerblueplayed = true;
            this.classList.add("blueplayercard");
        }

        if (currentemptysquares > 0 && redplayerplayed && playerblueplayed) {
            round(redplayerdeck, blueplayerdeck, currentemptysquares);
        } else if (currentemptysquares === 0) {
            const currentscoreRed = Number(document.getElementById("scorered").textContent);
            const currentscoreBlue = Number(document.getElementById("scoreblue").textContent);
            if (currentscoreRed === currentscoreBlue) {
                alert("it's a draw");
            } else if (currentscoreRed > currentscoreBlue) {
                alert("red player wins");
            } else {
                alert("blue player wins");
            }

            return;
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


round(redplayerdeck, blueplayerdeck, 9);



// //keep track of selected card

// como fazer um while que depende de uma funcao async, e que so quero que avance quando returnar a promessa ? 


//map com cartas e cardID
// eventlistener on squares

// afer selecting card, remove other event listeners, create listeners on squares. once player selects square, update decks 

// tenho de controlar onde é que o player pode clicar


//existing cards. global variable :(
//function factory?


// game script should keep track of deck and current card; 
export const captureCard = function(squareid: string, playerid: string) {
    const div = document.getElementById(squareid);
    if (div !== undefined) {
        if (playerid === "redplayer") {
            div.classList.replace("blueplayercard", "redplayercard");
        } else if (playerid === "blueplayer") {
            div.classList.replace("redplayercard", "blueplayercard");
        }
    }
}

export const updateScore = function(playerid: string) {
    if (playerid === "redplayer") {
        const scorediv = document.getElementById("scorered");
        const currentscore = Number(scorediv.textContent);
        scorediv.textContent = `${currentscore + 1}`;
        const scoredivblue = document.getElementById("scoreblue");
        const currentscoreblue = Number(scoredivblue.textContent);
        scoredivblue.textContent = `${currentscoreblue - 1}`;
    } else if (playerid === "blueplayer") {
        const scorediv = document.getElementById("scorered");
        const currentscore = Number(scorediv.textContent);
        scorediv.textContent = `${currentscore - 1}`;
        const scoredivblue = document.getElementById("scoreblue");
        const currentscoreblue = Number(scoredivblue.textContent);
        scoredivblue.textContent = `${currentscoreblue + 1}`;
    }
}

// fim do jogo
