import { useGame } from "../contexts/gameContext.tsx";
import GameHand from "./GameHand.tsx";
import GamePlayerStatistic from "./GamePlayerStatistic.tsx";

const GameBoard = () => {
    const { game } = useGame();

    return (
        <div className={"GameBoard"}>
            <div className={"GameBoard-content"}>
                {game.players?.map((p) => (
                    <GameHand key={p._id} player={p} />
                ))}
            </div>
            {game.players?.map((p) => (
                <GamePlayerStatistic player={p} />
            ))}
        </div>
    );
};

export default GameBoard;
