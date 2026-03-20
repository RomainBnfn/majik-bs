import { CardGlobalContext } from "./CardGlobalContext.tsx";
import { useFirebaseValues } from "../../hooks/useFirebaseValues.ts";
import { FIREBASE_PATHS } from "../../constants/firebasePaths.ts";
import type { ListObject } from "../../models/listObject.model.ts";
import { fromObjectToList } from "../../utils/firebase.utils.ts";
import type { CardModel, FirebaseCardModel } from "../../models/card.model.ts";
import type {
    FirebasePowerModel,
    PowerModel,
} from "../../models/power.model.ts";

export const transformPowers = (
    powers: ListObject<FirebasePowerModel>,
): PowerModel[] => {
    return fromObjectToList(powers).map((power) => ({
        ...power,
        conditions: fromObjectToList(power.conditions),
    }));
};

export const transformCard = (
    cards: ListObject<FirebaseCardModel>,
): CardModel[] => {
    return fromObjectToList(cards).map((card) => ({
        ...card,
        powers: transformPowers(card.powers),
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
