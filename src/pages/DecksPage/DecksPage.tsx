import "./DecksPage.scss";
import { useFirebaseValues } from "../../hooks/useFirebaseValues.ts";
import { FIREBASE_PATHS } from "../../constants/firebasePaths.ts";
import type { CardModel } from "../../models/card.model.ts";
import { fromObjectToList } from "../../utils/firebase.utils.ts";
import { Link } from "react-router";

const DecksPage = () => {
    const [decks, areCardsLoading] = useFirebaseValues<CardModel[]>(
        FIREBASE_PATHS.decks,
        {},
    );
    return (
        <>
            <Link to={"/"}>Back</Link>
            {fromObjectToList<CardModel>(decks).map((d) => (
                <Link to={`/deck/${d.id}`} key={d.id}>
                    Deck {d.name}
                </Link>
            ))}
        </>
    );
};

export default DecksPage;
