import { useGame } from "../contexts/gameContext.tsx";
import GameHand from "./GameHand.tsx";

const GameBoard = () => {
    const { game } = useGame();

    return (
        <div className={"GameBoard"}>
            <div className={"GameBoard-content"}>
                {game.players?.map((p) => (
                    <GameHand key={p._id} player={p} />
                ))}
            </div>
        </div>
    );
};

export default GameBoard;
