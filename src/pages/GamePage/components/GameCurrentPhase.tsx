import { useGame } from "../contexts/gameContext.tsx";
import { getPlayer } from "../../../utils/game.utils.ts";

const GameCurrentPhase = () => {
    const { game, shouldSelectCard, hasStarted } = useGame();

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
            <div className={"GameCurrentPhase"}>
                <div>Waiting for a player...</div>
                <div>
                    Invitation code:
                    <b className={"GameCurrentPhase-invitation-code"}>
                        {game.invitationCode}
                    </b>
                </div>
            </div>
        );
    }
    return (
        <div className={"GameCurrentPhase"}>
            <div>Tour {game.currentTurn}</div>
            <b>{shouldSelectCard && "A vous de jouer !"}</b>
        </div>
    );
};

export default GameCurrentPhase;
