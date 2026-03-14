import { transformBrawlerToCard } from "../utils/card.utils.ts";
import { getFirebaseRef, updateFirebaseValue } from "./firebase.service.ts";
import { FIREBASE_PATHS } from "../constants/firebasePaths.ts";
import { getAllBrawlers } from "./brawlStars.service.ts";
import { equalTo, orderByChild, query } from "firebase/database";

export const generateCardsFromBrawlers = async (): Promise<void> => {
    const brawlers = await getAllBrawlers();
    const cards = transformBrawlerToCard(brawlers);
    return updateFirebaseValue(
        FIREBASE_PATHS.cards,
        cards.reduce((o, card) => ({ ...o, [card.id]: card }), {}),
    );
};

export const getAllUserDecks = (userId: string) => {
    return query(
        getFirebaseRef(FIREBASE_PATHS.decks),
        orderByChild("ownerId"),
        equalTo(userId),
    );
};
