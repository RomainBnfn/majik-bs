import "./DecksPage.scss";
import { useFirebaseValues } from "../../hooks/useFirebaseValues.ts";
import { FIREBASE_PATHS } from "../../constants/firebasePaths.ts";
import type { CardModel } from "../../models/card.model.ts";
import { fromObjectToList } from "../../utils/firebase.utils.ts";
import { Link, useNavigate } from "react-router";
import DeckPreview from "../../components/DeckPreview/DeckPreview.tsx";
import { Button } from "@mui/material";
import {
    pushFirebaseValue,
    removeFirebaseElement,
} from "../../services/firebase.service.ts";
import type { DeckModel } from "../../models/deck.model.ts";

const DecksPage = () => {
    const [decks, areCardsLoading] = useFirebaseValues<DeckModel[]>(
        FIREBASE_PATHS.decks,
        {},
    );
    const navigate = useNavigate();
    return (
        <>
            <Link to={"/"}>Back</Link>
            {fromObjectToList<CardModel>(decks).map((d) => (
                <Link to={`/deck/${d._id}`} key={d.id}>
                    <DeckPreview
                        deck={d}
                        onDelete={() => {
                            removeFirebaseElement(
                                `${FIREBASE_PATHS.decks}/${d._id}`,
                            );
                        }}
                    />
                </Link>
            ))}
            <Button
                onClick={() => {
                    pushFirebaseValue(FIREBASE_PATHS.decks, {
                        ownerId: "soon",
                        name: "Nouveau",
                        cardIds: "",
                    }).then((r) => {
                        navigate(`/deck/${r.key}`);
                    });
                }}
            >
                Add
            </Button>
        </>
    );
};

export default DecksPage;
