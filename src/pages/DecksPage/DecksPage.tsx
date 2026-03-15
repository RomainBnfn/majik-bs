import "./DecksPage.scss";
import { FIREBASE_PATHS } from "../../constants/firebasePaths.ts";
import { Link, Navigate, useNavigate } from "react-router";
import DeckPreview from "../../components/DeckPreview/DeckPreview.tsx";
import { Button } from "@mui/material";
import {
    pushFirebaseValue,
    removeFirebaseElement,
} from "../../services/firebase.service.ts";
import { useAuth } from "../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";
import { useDecks } from "../../globalContexts/DeckGlobalContext/DeckGlobalContext.tsx";

const DecksPage = () => {
    const { user, isLogged } = useAuth();
    const navigate = useNavigate();
    const { userDecks } = useDecks();
    if (!isLogged) {
        return <Navigate to={"/"} />;
    }
    return (
        <>
            <Link to={"/"}>Back</Link>
            {userDecks.map((d) => (
                <Link to={`/deck/${d._id}`} key={d._id}>
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
                        ownerId: user?.uid,
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
