import { captureCard, updateScore } from "./index";

interface Card {
    name: string;
    power: [number, number, number, number];
    face: string;
    cardID: string;
}

interface Square {
    playerID: string;
    cardID: string;
    power: [number, number, number, number];
}

const cardcollection = new Map<string, Card>();
const populateCardCollection = function() {
    cardcollection.set("cardid0", { name: "dodo", power: [4, 2, 3, 4], face: "", cardID: "cardid0" });
    cardcollection.set("cardid1", { name: "sabotender", power: [4, 3, 3, 3], face: "", cardID: "cardid1" });
    cardcollection.set("cardid2", { name: "bomb", power: [3, 4, 3, 3], face: "", cardID: "cardid2" });
    cardcollection.set("cardid3", { name: "mandragora", power: [4, 2, 5, 3], face: "", cardID: "cardid3" });
    cardcollection.set("cardid4", { name: "coeurl", power: [2, 5, 2, 5], face: "", cardID: "cardid4" });
}


populateCardCollection();


const board = new Map<string, Square>();

export default function playerDeck(cards: string[]): Card[] {
    let decklist: Card[] = [];
    for (let i = 0; i < cards.length; i++) {
        const cardInfo = cardcollection.get(cards[i]);
        if (cardInfo !== undefined) {
            decklist.push(cardInfo);
        }
    }
    return decklist;
}


const redplayerdeck = playerDeck(["cardid0", "cardid1", "cardid2", "cardid3", "cardid4"]);
const blueplayerdeck = playerDeck(["cardid0", "cardid1", "cardid2", "cardid3", "cardid4"]);

export function getcardfromcollection(cardid: string): Card | undefined {
    const card = cardcollection.get(cardid);
    if (card !== undefined) {
        return card;
    }
    return undefined;
}

//export { cardcollection };

const checkAdjSquares = function(squareid: string): string[] {
    let squaresToCheck: string[] = [];
    switch (squareid) {
        case "topleft":
            squaresToCheck.push(null, "topmid", "midleft", null);
            break;
        case "topmid":
            squaresToCheck.push(null, "topright", "midmid", "topleft");
            break;
        case "topright":
            squaresToCheck.push(null, null, "midright", "topmid");
            break;
        case "midleft":
            squaresToCheck.push("topleft", "midmid", "bottomleft", null);
            break;
        case "midmid":
            squaresToCheck.push("topmid", "midright", "bottommid", "midleft");
            break;
        case "midright":
            squaresToCheck.push("topright", null, "bottomright", "midmid");
            break;
        case "bottomleft":
            squaresToCheck.push("midleft", "bottommid", null, null);
            break;
        case "bottommid":
            squaresToCheck.push("midmid", "bottomright", null, "bottomleft");
            break;
        case "bottomright":
            squaresToCheck.push("midright", null, null, "bottommid");
            break;
        default:
            console.log("error");
    }
    return squaresToCheck;
}

const powerToCheckCoord = function(currentsquarecoord: number): number {
    switch (currentsquarecoord) {
        case 0:
            return 2;
        case 1:
            return 3;
        case 2:
            return 0;
        case 3:
            return 1;
        default:
            return -1;
    }
}

const checkCardsPower = function(squarestocheck: string[], playerid: string, cardid: string) {
    const cardpowers = cardcollection.get(cardid).power;
    if (cardpowers !== undefined) {
        for (let i = 0; i < squarestocheck.length; i++) {
            if (board.has(squarestocheck[i])) {
                // falta ver de quem é a carta
                const square = board.get(squarestocheck[i]);
                if (square.playerID === playerid) {
                    continue;
                } else {
                    const powerCardOnSquare = square.power;
                    const coordForPower = powerToCheckCoord(i);
                    if (coordForPower !== -1) {
                        const powerOnAdjSquare = powerCardOnSquare[coordForPower];
                        const powerOfNewCard = cardpowers[i];
                        if (powerOnAdjSquare < powerOfNewCard) {
                            board.set(squarestocheck[i], { playerID: playerid, cardID: square.cardID, power: square.power });
                            captureCard(squarestocheck[i], playerid);
                            updateScore(playerid);
                        }
                    } else {
                        break;
                    }
                }
            }
        }
    }
}




export const movesperround = () => {
    let moves: string[] = [];
    // cards captures by each player, total cards per each player, map of cards on each location, with powers 
    const redplayercard = function(cardmove: string) {
        moves.push(cardmove);
    }
    const redplayersquare = function(squaremove: string) {
        const currentcardid: string = moves[moves.length - 1];
        const cardStats = cardcollection.get(currentcardid);
        if (cardStats !== undefined) {
            board.set(squaremove, { playerID: "redplayer", cardID: currentcardid, power: [cardStats.power[0], cardStats.power[1], cardStats.power[2], cardStats.power[3]] });
        }
        moves.push(squaremove);
        //once card is placed, need to see what to adjacent cards
        const squaresToCheck = checkAdjSquares(squaremove);
        checkCardsPower(squaresToCheck, "redplayer", currentcardid);
    }
    const blueplayercard = function(cardmove: string) {
        moves.push(cardmove);
    }
    const blueplayersquare = function(squaremove: string) {
        const currentcardid: string = moves[moves.length - 1];
        const cardStats = cardcollection.get(currentcardid);
        if (cardStats !== undefined) {
            board.set(squaremove, { playerID: "blueplayer", cardID: currentcardid, power: [cardStats.power[0], cardStats.power[1], cardStats.power[2], cardStats.power[3]] });
        }
        moves.push(squaremove);
        const squaresToCheck = checkAdjSquares(squaremove);
        checkCardsPower(squaresToCheck, "blueplayer", currentcardid);
    }
    return { redplayercard, redplayersquare, blueplayercard, blueplayersquare }
};

//export {redplayermove.roundmoves }


export function updateDeck(playerid: string, cardid: string) {

}

export { blueplayerdeck, redplayerdeck }
