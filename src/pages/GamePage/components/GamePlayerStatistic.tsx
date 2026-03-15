import classNames from "classnames";
import { useGame } from "../contexts/gameContext.tsx";
import { useAuth } from "../../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";
import type { PlayerGameModel } from "../../../models/game.model.ts";
import { useCards } from "../../../globalContexts/CardGlobalContext/CardGlobalContext.tsx";
import { useGameSettingCards } from "../../../globalContexts/GameSettingGlobalContext/GameSettingGlobalContext.tsx";

type GamePlayerStatisticProps = {
    player: PlayerGameModel;
};
const GamePlayerStatistic = ({ player }: GamePlayerStatisticProps) => {
    const { game, shouldSelectCard } = useGame();
    const { getCardById } = useCards();
    const { user } = useAuth();
    const isUs = player._id == user?.uid;

    const { cardInHand } = useGameSettingCards();
    const { onClickOnCard } = useGame();

    return (
        <div
            className={classNames(
                "GamePlayerStatistic",
                isUs && "GamePlayerStatistic-self",
            )}
        >
            Statis HP : {player.health}/5
        </div>
    );
};
export default GamePlayerStatistic;
