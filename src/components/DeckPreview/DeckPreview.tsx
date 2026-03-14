import "./DeckPreview.scss";
import type { DeckModel } from "../../models/deck.model.ts";
import RoundStatistic from "../RoundStatistic/RoundStatistic.tsx";
import { DeleteForever, Style } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useGameSettingCards } from "../../globalContexts/GameSettingGlobalContext/GameSettingGlobalContext.tsx";

type DeckPreviewProps = {
    deck: DeckModel;
    onDelete(): void;
};
const DeckPreview = ({ deck, onDelete }: DeckPreviewProps) => {
    const { maxCard } = useGameSettingCards();
    return (
        <div className={"DeckPreview"}>
            {deck.name}
            <RoundStatistic
                value={`${Object.keys(deck.cardIds).length}/${maxCard}`}
                type={"card"}
                icon={<Style />}
            />
            <IconButton
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onDelete();
                }}
            >
                <DeleteForever />
            </IconButton>
        </div>
    );
};

export default DeckPreview;
