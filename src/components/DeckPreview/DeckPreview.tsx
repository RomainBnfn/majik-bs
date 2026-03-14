import "./DeckPreview.scss";
import type { DeckModel } from "../../models/deck.model.ts";
import RoundStatistic from "../RoundStatistic/RoundStatistic.tsx";
import { DeleteForever, Style } from "@mui/icons-material";
import { IconButton } from "@mui/material";

type DeckPreviewProps = {
    deck: DeckModel;
    onDelete(): void;
};
const DeckPreview = ({ deck, onDelete }: DeckPreviewProps) => {
    return (
        <div className={"DeckPreview"}>
            {deck.name}
            <RoundStatistic
                value={`${Object.keys(deck.cardIds).length}/10`}
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
