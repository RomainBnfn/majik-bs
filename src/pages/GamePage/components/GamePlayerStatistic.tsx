import classNames from "classnames";
import { useGame } from "../contexts/gameContext.tsx";
import { useAuth } from "../../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";
import { useCards } from "../../../globalContexts/CardGlobalContext/CardGlobalContext.tsx";
import { useGameSettingCards } from "../../../globalContexts/GameSettingGlobalContext/GameSettingGlobalContext.tsx";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import type { PlayerGameModel } from "../../../models/playerGame.model.ts";

type GamePlayerStatisticProps = {
    player: PlayerGameModel;
};
const GamePlayerStatistic = ({ player }: GamePlayerStatisticProps) => {
    const { game, shouldSelectCard } = useGame();
    const { getCardById } = useCards();
    const { user } = useAuth();
    const isUs = player._id == user?.uid;

    const { cardInHand, maxHealth } = useGameSettingCards();
    const { onClickOnCard } = useGame();

    return (
        <div
            className={classNames(
                "GamePlayerStatistic",
                isUs && "GamePlayerStatistic-self",
            )}
        >
            {player.displayName}
            {[...new Array(maxHealth).keys()].map((_, i) =>
                player.health >= i + 1 ? <Favorite /> : <FavoriteBorder />,
            )}
        </div>
    );
};
export default GamePlayerStatistic;
