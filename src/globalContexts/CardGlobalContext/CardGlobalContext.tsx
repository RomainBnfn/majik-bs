import type { CardModel } from "../../models/card.model.ts";
import { createContext, useContext } from "react";

type CardGlobalContext = {
    cards: CardModel[];
    getCardById(id: string): CardModel | undefined;
};

export const CardGlobalContext = createContext<CardGlobalContext>({
    cards: [],
    getCardById(): CardModel | undefined {
        return undefined;
    },
});

export const useCards = () => {
    return useContext(CardGlobalContext);
};
