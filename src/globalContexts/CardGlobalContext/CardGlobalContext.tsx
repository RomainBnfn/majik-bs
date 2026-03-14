import type { CardModel } from "../../models/card.model.ts";
import { createContext, useContext } from "react";

type CardGlobalContext = {
    cards: CardModel[];
};

export const CardGlobalContext = createContext<CardGlobalContext>({
    cards: [],
});

export const useCards = () => {
    return useContext(CardGlobalContext);
};
