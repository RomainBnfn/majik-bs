import { useGame } from "../contexts/gameContext.tsx";
import type { PlayerGameModel } from "../../../models/playerGame.model.ts";
import { useAuth } from "../../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";
import { TurnPhaseTypes } from "../../../enums/TurnPhaseType.enum.ts";

type GameHandMessageProps = {
    player: PlayerGameModel;
};
const GameHandMessage = ({ player }: GameHandMessageProps) => {
    const { game, shouldSelectCard } = useGame();
    const { user } = useAuth();
    const isUs = user?.uid === player?._id;
    if (isUs || shouldSelectCard || game.winnerPlayerId || !game.isStarted) {
        return null;
    }
    return (
        <div className={"GameHandMessage"}>
            {game.currentPhase === TurnPhaseTypes.Attack
                ? "En train d'attaquer..."
                : "En train de défendre..."}
        </div>
    );
};

export default GameHandMessage;
