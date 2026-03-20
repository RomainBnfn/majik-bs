import { type GameModel } from "../../../models/game.model.ts";
import { type CardModel } from "../../../models/card.model.ts";
import { createContext, useContext } from "react";
import type { PreviousTurn } from "../../../models/previousTurn.model.ts";

export type GameContextValue = {
    game: GameModel;
    onClickOnCard(c: CardModel): void;
    onSkipDefense(): void;
    isLoggedPlayerTurn: boolean;
    shouldSelectCard: boolean;
    hasStarted: boolean;
    nonPlayedPreviousTurn: PreviousTurn[];
    seenPlayedTurn(turn: PreviousTurn): void;
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
    hasStarted: false,
    nonPlayedPreviousTurn: [],
    seenPlayedTurn(turn: PreviousTurn) {
        //
    },
});

export const useGame = () => {
    return useContext(GameContext);
};
