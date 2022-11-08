interface Card {
    name: string;
    power: [number, number, number, number];
    face: string;
    cardID: string;
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

const blueplayerdeck = playerDeck(["cardid0", "cardid1", "cardid2", "cardid3", "cardid4"]);
const redplayerdeck = playerDeck(["cardid0", "cardid1", "cardid2", "cardid3", "cardid4"]);

export function getcardfromcollection(cardid: string): Card | undefined {
    const card = cardcollection.get(cardid);
    if (card !== undefined) {
        return card;
    }
    return undefined;
}

//export { cardcollection };

export const roundmoves = () => {
    let moves: string[] = [];
    const redplayermove = function(move: string) {
        moves.push(move);
    }
    const redplayermovessquare = function(move: string) {
        moves.push(move);
    }
    const blueplayermove = function(move: string) {
        moves.push(move);
    }
    const blueplayermovesquare = function(move: string) {
        moves.push(move);
    }
    const gameended = function() {
        console.log(moves);
    }
    return { redplayermove, redplayermovessquare, blueplayermove, blueplayermovesquare, gameended }
};

//export {redplayermove.roundmoves }


export function updateDeck(playerid: string, cardid: string) {

}

export { blueplayerdeck, redplayerdeck }

// need a function that given a player id, returns its current deck
