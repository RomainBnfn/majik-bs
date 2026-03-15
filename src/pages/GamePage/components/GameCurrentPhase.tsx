import { useGame } from "../contexts/gameContext.tsx";
import { useAuth } from "../../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";
import { getPlayer } from "../../../utils/game.utils.ts";

const GameCurrentPhase = () => {
    const { user } = useAuth();
    const { game, shouldSelectCard, hasStarted } = useGame();
    const isAA = game.currentPlayerId === user?.uid;

    const winner = game.winnerPlayerId
        ? getPlayer(game, game.winnerPlayerId)
        : undefined;

    if (winner) {
        return (
            <div className={"GameCurrentPhase"}>
                {winner.displayName} a gagné!
            </div>
        );
    }
    if (!hasStarted) {
        return (
            <div className={"GameCurrentPhase"}>Waiting for a player...</div>
        );
    }
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
