import classNames from "classnames";
import Card from "../../../components/Card/Card.tsx";
import { useGame } from "../contexts/gameContext.tsx";
import { useAuth } from "../../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";
import { useCards } from "../../../globalContexts/CardGlobalContext/CardGlobalContext.tsx";
import { useGameSettingCards } from "../../../globalContexts/GameSettingGlobalContext/GameSettingGlobalContext.tsx";
import { TurnPhaseTypes } from "../../../enums/TurnPhaseType.enum.ts";
import type { PlayerGameModel } from "../../../models/playerGame.model.ts";
import type { ReactElement } from "react";
import { getOppositeTurnPhase } from "../../../utils/game.utils.ts";

type GameHandProps = {
    player: PlayerGameModel | undefined;
    message?: ReactElement;
};
const GameHand = ({ player, message }: GameHandProps) => {
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
                const isActive =
                    game.currentPlayerId === player?._id &&
                    game.currentSelectedCardId == c;
                const disabled =
                    isUs &&
                    game.currentPlayerId == user?.uid &&
                    game.currentSelectedCardId &&
                    game.currentSelectedCardId != c;
                const toSelect = isUs && shouldSelectCard;
                const aa = isActive
                    ? getOppositeTurnPhase(game.currentPhase)
                    : toSelect
                      ? game.currentPhase
                      : undefined;
                return (
                    <div className={"GameHand-slot"}>
                        {card && (
                            <Card
                                card={card}
                                toSelect={toSelect}
                                active={isActive}
                                disabled={disabled}
                                reverse={
                                    !isUs &&
                                    (!shouldSelectCard ||
                                        game.currentPhase ===
                                            TurnPhaseTypes.Attack ||
                                        game.currentSelectedCardId !== card._id)
                                }
                                onClick={() =>
                                    isUs &&
                                    card &&
                                    shouldSelectCard &&
                                    onClickOnCard(card)
                                }
                                highlightMode={
                                    disabled
                                        ? undefined
                                        : aa?.toLocaleLowerCase()
                                }
                            />
                        )}
                    </div>
                );
            })}
            {message}
        </div>
    );
};
export default GameHand;
