import { transformBrawlerToCard } from "../utils/card.utils.ts";
import { updateFirebaseValue } from "./firebase.service.ts";
import { FIREBASE_PATHS } from "../constants/firebasePaths.ts";
import { getAllBrawlers } from "./brawlStars.service.ts";

export async function generateCardsFromBrawlers(): Promise<void> {
    const brawlers = await getAllBrawlers();
    const cards = transformBrawlerToCard(brawlers);
    return updateFirebaseValue(FIREBASE_PATHS.cards, cards);
}
