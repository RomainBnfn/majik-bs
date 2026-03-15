import classNames from "classnames";
import Card from "../../../components/Card/Card.tsx";
import { useGame } from "../contexts/gameContext.tsx";
import { useAuth } from "../../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";
import { useCards } from "../../../globalContexts/CardGlobalContext/CardGlobalContext.tsx";
import { useGameSettingCards } from "../../../globalContexts/GameSettingGlobalContext/GameSettingGlobalContext.tsx";
import { TurnPhaseTypes } from "../../../enums/TurnPhaseType.enum.ts";
import type { PlayerGameModel } from "../../../models/playerGame.model.ts";

type GameHandProps = {
    player: PlayerGameModel | undefined;
};
const GameHand = ({ player }: GameHandProps) => {
    const { game, shouldSelectCard } = useGame();
    const { getCardById } = useCards();
    const { user } = useAuth();
    const isUs = player?._id == user?.uid;

    const { cardInHand } = useGameSettingCards();
    const { onClickOnCard } = useGame();

    return (
        <div className={classNames("GameHand", isUs && "GameHand-self")}>
            {[...new Array(cardInHand).keys()].map((i) => {
                const c = player?.inHandCardIds[i];
                const card = c ? getCardById(c) : undefined;
                return (
                    <div className={"GameHand-slot"}>
                        {card && (
                            <Card
                                card={card}
                                active={
                                    isUs &&
                                    game.currentPlayerId == user?.uid &&
                                    game.currentSelectedCardId == c
                                }
                                reverse={
                                    !isUs &&
                                    (!shouldSelectCard ||
                                        game.currentPhase ===
                                            TurnPhaseTypes.Attack ||
                                        game.currentSelectedCardId !== card._id)
                                }
                                onClick={() =>
                                    card &&
                                    shouldSelectCard &&
                                    onClickOnCard(card)
                                }
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};
export default GameHand;
