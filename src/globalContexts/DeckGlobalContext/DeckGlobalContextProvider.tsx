import { DeckGlobalContext } from "./DeckGlobalContext.tsx";
import { fromObjectToList } from "../../utils/firebase.utils.ts";
import { useAuth } from "../AuthGlobalContext/AuthGlobalContext.tsx";
import { useEffect, useState } from "react";
import { type WithId } from "../../models/withId.model.ts";
import { type DeckModel } from "../../models/deck.model.ts";
import { onValue } from "firebase/database";
import { getAllUserDecks } from "../../services/cards.service.ts";

const DeckGlobalContextProvider = ({ children }) => {
    const { user } = useAuth();
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
    }, [user]);

    return (
        <DeckGlobalContext.Provider
            value={{
                userDecks: decks,
                getDeckById(id: string): DeckModel | undefined {
                    return decks?.find((c) => c._id == id);
                },
            }}
        >
            {children}
        </DeckGlobalContext.Provider>
    );
};

export default DeckGlobalContextProvider;
