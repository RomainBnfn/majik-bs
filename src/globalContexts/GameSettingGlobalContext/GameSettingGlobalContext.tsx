import { createContext, useContext } from "react";

export type GameSettingGlobalValue = {
    maxPrice: number;
    maxCard: number;
    cardInHand: number;
};

export const GameSettingGlobalContext = createContext<GameSettingGlobalValue>({
    maxPrice: 30,
    maxCard: 10,
    cardInHand: 3,
});

export const useGameSettingCards = () => {
    return useContext(GameSettingGlobalContext);
};
