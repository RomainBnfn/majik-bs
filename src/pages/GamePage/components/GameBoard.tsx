import { useGame } from "../contexts/gameContext.tsx";
import GameHand from "./GameHand.tsx";
import GamePlayerStatistic from "./GamePlayerStatistic.tsx";
import CardDrawn from "./CardDraw.tsx";
import { getAvailableCardIds } from "../../../utils/game.utils.ts";
import { useAuth } from "../../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";
import GameCurrentPhase from "./GameCurrentPhase.tsx";
import { Adjust } from "@mui/icons-material";
import { Button } from "@mui/material";
import { TurnPhaseTypes } from "../../../enums/TurnPhaseType.enum.ts";

const GameBoard = () => {
    const { game, shouldSelectCard, onSkipDefense } = useGame();
    const { user } = useAuth();
    return (
        <div className={"GameBoard"}>
            <div className={"GameBoard-content"}>
                <div className={"GameBoard-content-background"}>
                    <Adjust className={""} />
                </div>
                <div className={"GameBoard-content-cards"}>
                    {game.players?.map((p) => (
                        <GameHand key={p._id} player={p} />
                    ))}
                </div>
                {game.players?.map((p) => (
                    <CardDrawn
                        cardIds={getAvailableCardIds(p)}
                        isSelf={p._id == user?.uid}
                    />
                ))}
                <GameCurrentPhase />
            </div>
            {game.players?.map((p) => (
                <>
                    <GamePlayerStatistic player={p} />
                </>
            ))}
            {game.currentPhase === TurnPhaseTypes.Defense &&
                shouldSelectCard && (
                    <Button onClick={() => onSkipDefense()} variant="outlined">
                        Skip
                    </Button>
                )}
        </div>
    );
};

export default GameBoard;
