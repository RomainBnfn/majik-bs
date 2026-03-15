import { createContext, useContext } from "react";

export type GameSettingGlobalValue = {
    maxPrice: number;
    maxCard: number;
    maxHealth: number;
    cardInHand: number;
};

export const GameSettingGlobalContext = createContext<GameSettingGlobalValue>({
    maxPrice: 30,
    maxCard: 10,
    cardInHand: 3,
    maxHealth: 5,
});

export const useGameSettingCards = () => {
    return useContext(GameSettingGlobalContext);
};
