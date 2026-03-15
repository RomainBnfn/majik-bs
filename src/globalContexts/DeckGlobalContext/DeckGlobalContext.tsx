import { createContext, useContext } from "react";
import type { DeckModel } from "../../models/deck.model.ts";
import type { WithId } from "../../models/withId.model.ts";

type DeckGlobalContext = {
    userDecks: WithId<DeckModel>[];
    getDeckById(id: string): DeckModel | undefined;
};

export const DeckGlobalContext = createContext<DeckGlobalContext>({
    userDecks: [],
    getDeckById(): DeckModel | undefined {
        return undefined;
    },
});

export const useDecks = () => {
    return useContext(DeckGlobalContext);
};
