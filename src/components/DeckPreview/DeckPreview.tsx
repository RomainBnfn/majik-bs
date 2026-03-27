import "./DeckPreview.scss";
import type { DeckModel } from "../../models/deck.model.ts";
import { DeleteForever, Style } from "@mui/icons-material";
import { Card as MUICard, IconButton } from "@mui/material";
import { useGameSettingCards } from "../../globalContexts/GameSettingGlobalContext/GameSettingGlobalContext.tsx";
import classNames from "classnames";
import { useIsDeckValid } from "../../utils/card.utils.ts";
import RoundStatistic from "../RoundStatistic/RoundStatistic.tsx";
import { useCards } from "../../globalContexts/CardGlobalContext/CardGlobalContext.tsx";
import Card from "../Card/Card.tsx";

type DeckPreviewProps = {
    deck: DeckModel;
    onDelete?(): void;
    onClick?(): void;
    canDelete?: boolean;
    active?: boolean;
};
const DeckPreview = ({
    deck,
    onDelete,
    onClick,
    active,
    canDelete,
}: DeckPreviewProps) => {
    const { maxCard } = useGameSettingCards();
    const isValid = useIsDeckValid(deck);
    const { getCardById } = useCards();
    const selectedCardIds = Object.keys(deck.cardIds);
    const getScale = () => {
        if (!selectedCardIds?.length) {
            return 1;
        }
        if (selectedCardIds.length <= 2) {
            return 2;
        }
        if (selectedCardIds.length <= 4) {
            return 2.5;
        }
        if (selectedCardIds.length <= 6) {
            return 3;
        }
        if (selectedCardIds.length <= 8) {
            return 3.5;
        }
        if (selectedCardIds.length <= 10) {
            return 4;
        }
        return 5;
    };
    return (
        <MUICard
            className={classNames(
                "DeckPreview",
                active && "DeckPreview-active",
                !isValid && "DeckPreview-invalid",
            )}
            variant="outlined"
            onClick={onClick}
        >
            <div className={"DeckPreview-cards"}>
                {!selectedCardIds?.length ? (
                    "No card"
                ) : (
                    <div
                        className="DeckPreview-cards-wrapper"
                        style={{
                            "--deck-preview-card-scale": getScale(),
                        }}
                    >
                        {selectedCardIds?.map((c) => {
                            const card = getCardById(c);
                            if (card) {
                                return (
                                    <Card
                                        className={"DeckPreview-cards-card"}
                                        key={c}
                                        card={card}
                                        hideStatistics={true}
                                    />
                                );
                            }
                            return null;
                        })}
                    </div>
                )}
            </div>
            <span className={"DeckPreview-name"}>{deck.name}</span>
            <div className={"DeckPreview-actions"}>
                <RoundStatistic
                    value={`${Object.keys(deck.cardIds ?? {}).length}/${maxCard}`}
                    type={"card"}
                    icon={<Style />}
                />
                {canDelete && (
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onDelete?.();
                        }}
                    >
                        <DeleteForever />
                    </IconButton>
                )}
            </div>
        </MUICard>
    );
};

export default DeckPreview;
