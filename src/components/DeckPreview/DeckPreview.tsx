import "./DeckPreview.scss";
import type { DeckModel } from "../../models/deck.model.ts";
import RoundStatistic from "../RoundStatistic/RoundStatistic.tsx";
import { DeleteForever, Style } from "@mui/icons-material";
import { Card, IconButton } from "@mui/material";
import { useGameSettingCards } from "../../globalContexts/GameSettingGlobalContext/GameSettingGlobalContext.tsx";
import classNames from "classnames";
import { useIsDeckValid } from "../../utils/card.utils.ts";

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

    return (
        <Card
            className={classNames(
                "DeckPreview",
                active && "DeckPreview-active",
                !isValid && "DeckPreview-invalid",
            )}
            variant="outlined"
            onClick={onClick}
        >
            <span className={"DeckPreview-name"}>{deck.name}</span>
            <RoundStatistic
                value={`${Object.keys(deck.cardIds).length}/${maxCard}`}
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
        </Card>
    );
};

export default DeckPreview;
