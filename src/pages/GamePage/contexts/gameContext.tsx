import { type GameModel } from "../../../models/game.model.ts";
import { type CardModel } from "../../../models/card.model.ts";
import { createContext, useContext } from "react";

export type GameContextValue = {
    game: GameModel;
    onClickOnCard(c: CardModel): void;
    onSkipDefense(): void;
    isLoggedPlayerTurn: boolean;
    shouldSelectCard: boolean;
};

export const GameContext = createContext<GameContextValue>({
    game: {} as GameModel,
    onClickOnCard(c: CardModel) {
        //
    },
    onSkipDefense() {
        //
    },
    isLoggedPlayerTurn: false,
    shouldSelectCard: false,
});

export const useGame = () => {
    return useContext(GameContext);
};
