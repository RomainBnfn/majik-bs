import { CardGlobalContext } from "./CardGlobalContext.tsx";
import { useFirebaseValues } from "../../hooks/useFirebaseValues.ts";
import { FIREBASE_PATHS } from "../../constants/firebasePaths.ts";
import type { ListObject } from "../../models/listObject.model.ts";
import { fromObjectToList } from "../../utils/firebase.utils.ts";
import type { CardModel } from "../../models/card.model.ts";

const CardGlobalContextProvider = ({ children }) => {
    const [cards, areCardsLoading] = useFirebaseValues<ListObject<CardModel>>(
        FIREBASE_PATHS.cards,
        {},
    );
    return (
        <CardGlobalContext.Provider
            value={{
                cards: areCardsLoading
                    ? []
                    : fromObjectToList<CardModel>(cards ?? {}),
            }}
        >
            {children}
        </CardGlobalContext.Provider>
    );
};

export default CardGlobalContextProvider;
