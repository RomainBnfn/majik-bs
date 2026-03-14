import { createContext, useContext } from "react";

export type GameSettingGlobalValue = {
    maxPrice: number;
    maxCard: number;
};

export const GameSettingGlobalContext = createContext<GameSettingGlobalValue>({
    maxPrice: 30,
    maxCard: 10,
});

export const useGameSettingCards = () => {
    return useContext(GameSettingGlobalContext);
};
