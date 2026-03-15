import { transformBrawlerToCard } from "../utils/card.utils.ts";
import {
    getFirebaseRef,
    getFirebaseValue,
    setFirebaseValue,
} from "./firebase.service.ts";
import { FIREBASE_PATHS } from "../constants/firebasePaths.ts";
import { getAllBrawlers } from "./brawlStars.service.ts";
import { equalTo, orderByChild, query } from "firebase/database";
import { type DeckModel } from "../models/deck.model.ts";

export const generateCardsFromBrawlers = async (): Promise<void> => {
    const brawlers = await getAllBrawlers();
    const cards = transformBrawlerToCard(brawlers);
    return setFirebaseValue(
        FIREBASE_PATHS.userDecks,
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

export const getDeckFromId = async (id: string) => {
    const firebaseDeckCards = await getFirebaseValue(
        `${FIREBASE_PATHS.decks}/${id}`,
    );
    if (!firebaseDeckCards.exists()) {
        return;
    }
    return firebaseDeckCards.val() as DeckModel;
};
