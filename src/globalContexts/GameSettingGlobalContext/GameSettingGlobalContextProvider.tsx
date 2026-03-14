import {
    GameSettingGlobalContext,
    type GameSettingGlobalValue,
} from "./GameSettingGlobalContext.tsx";
import { useFirebaseValues } from "../../hooks/useFirebaseValues.ts";
import { FIREBASE_PATHS } from "../../constants/firebasePaths.ts";

const GameSettingGlobalContextProvider = ({ children }) => {
    const [settings, areGameSettings] =
        useFirebaseValues<GameSettingGlobalValue>(FIREBASE_PATHS.gameSettings, {
            maxCard: 0,
            maxPrice: 0,
        });
    return (
        <GameSettingGlobalContext value={settings}>
            {children}
        </GameSettingGlobalContext>
    );
};

export default GameSettingGlobalContextProvider;
