import { CardGlobalContext } from "./CardGlobalContext.tsx";
import { useFirebaseValues } from "../../hooks/useFirebaseValues.ts";
import { FIREBASE_PATHS } from "../../constants/firebasePaths.ts";
import type { ListObject } from "../../models/listObject.model.ts";
import { fromObjectToList } from "../../utils/firebase.utils.ts";
import type { CardModel, FirebaseCardModel } from "../../models/card.model.ts";

export const transformCard = (
    cards: ListObject<FirebaseCardModel>,
): CardModel[] => {
    return fromObjectToList(cards).map((card) => ({
        ...card,
        powers: fromObjectToList(card.powers),
    }));
};

const CardGlobalContextProvider = ({ children }) => {
    const [cards, areCardsLoading] = useFirebaseValues<
        CardModel[],
        ListObject<FirebaseCardModel>
    >(FIREBASE_PATHS.userDecks, [], transformCard);
    return (
        <CardGlobalContext.Provider
            value={{
                cards: areCardsLoading ? [] : cards,
                getCardById(id: string): CardModel | undefined {
                    return cards?.find((c) => c._id == id);
                },
            }}
        >
            {children}
        </CardGlobalContext.Provider>
    );
};

export default CardGlobalContextProvider;
