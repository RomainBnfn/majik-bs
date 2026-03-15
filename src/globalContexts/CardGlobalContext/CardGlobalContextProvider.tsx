import { CardGlobalContext } from "./CardGlobalContext.tsx";
import { useFirebaseValues } from "../../hooks/useFirebaseValues.ts";
import { FIREBASE_PATHS } from "../../constants/firebasePaths.ts";
import type { ListObject } from "../../models/listObject.model.ts";
import { fromObjectToList } from "../../utils/firebase.utils.ts";
import type { CardModel } from "../../models/card.model.ts";

const CardGlobalContextProvider = ({ children }) => {
    const [cards, areCardsLoading] = useFirebaseValues<
        CardModel[],
        ListObject<CardModel>
    >(FIREBASE_PATHS.userDecks, [], fromObjectToList);
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
