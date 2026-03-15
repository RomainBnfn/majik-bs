import { createContext, useContext } from "react";

export type GameSettingGlobalValue = {
    maxPrice: number;
    maxCard: number;
    minCard: number;
    maxHealth: number;
    cardInHand: number;
};

export const GameSettingGlobalContext = createContext<GameSettingGlobalValue>({
    maxPrice: 30,
    minCard: 5,
    maxCard: 10,
    cardInHand: 3,
    maxHealth: 5,
});

export const useGameSettingCards = () => {
    return useContext(GameSettingGlobalContext);
};
