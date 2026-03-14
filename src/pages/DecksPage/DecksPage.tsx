import "./DecksPage.scss";
import { FIREBASE_PATHS } from "../../constants/firebasePaths.ts";
import { Link, Navigate, useNavigate } from "react-router";
import DeckPreview from "../../components/DeckPreview/DeckPreview.tsx";
import { Button } from "@mui/material";
import { onValue } from "firebase/database";
import {
    pushFirebaseValue,
    removeFirebaseElement,
} from "../../services/firebase.service.ts";
import type { DeckModel } from "../../models/deck.model.ts";
import { useEffect, useState } from "react";
import { getAllUserDecks } from "../../services/cards.service.ts";
import { useAuth } from "../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";
import { fromObjectToList } from "../../utils/firebase.utils.ts";
import type { WithId } from "../../models/withId.model.ts";

const DecksPage = () => {
    const { user, isLogged } = useAuth();
    const navigate = useNavigate();
    const [decks, setDecks] = useState<WithId<DeckModel>[]>([]);

    useEffect(() => {
        if (!user) {
            return;
        }
        const unsubscribe = onValue(getAllUserDecks(user.uid), (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists() && data !== undefined) {
                setDecks(fromObjectToList(data));
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

    if (!isLogged) {
        return <Navigate to={"/"} />;
    }
    return (
        <>
            <Link to={"/"}>Back</Link>
            {decks.map((d) => (
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
