import { useGame } from "../contexts/gameContext.tsx";
import { useAuth } from "../../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";

const GameCurrentPhase = () => {
    const { user } = useAuth();
    const { game, shouldSelectCard } = useGame();
    const isAA = game.currentPlayerId === user?.uid;

    return (
        <div className={"GameCurrentPhase"}>
            <div>Tour {game.currentTurn}</div>
            <div>
                Phase {game.currentPhase}:
                <b>{shouldSelectCard && "Action attendue"}</b>
            </div>
        </div>
    );
};

export default GameCurrentPhase;
