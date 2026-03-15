import "./GamesPage.scss";
import { Link, Navigate } from "react-router";
import {
    createGame,
    getAllPlayerGames,
    joinGame,
} from "../../services/game.service.ts";
import { useAuth } from "../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";
import { useGameSettingCards } from "../../globalContexts/GameSettingGlobalContext/GameSettingGlobalContext.tsx";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { onValue } from "firebase/database";
import { fromObjectToList } from "../../utils/firebase.utils.ts";
import type { GameModel } from "../../models/game.model.ts";
import { transformGameResponse } from "../GamePage/contexts/GameContextProvider.tsx";
import { useDecks } from "../../globalContexts/DeckGlobalContext/DeckGlobalContext.tsx";

const GamesPage = () => {
    const { user } = useAuth();
    const { maxHealth } = useGameSettingCards();
    const [invitationCode, setInvitationCode] = useState("");
    const [games, setGames] = useState<GameModel[]>([]);
    const { userDecks } = useDecks();
    const [selectedDeckId, setSelectedDeckId] = useState<string | undefined>(
        userDecks[0]?._id,
    );

    useEffect(() => {
        if (!selectedDeckId && userDecks.length) {
            setSelectedDeckId(userDecks[0]._id);
        }
    }, [selectedDeckId, userDecks]);

    useEffect(() => {
        if (!user) {
            return;
        }
        const unsubscribe = onValue(getAllPlayerGames(user.uid), (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists() && data !== undefined) {
                setGames(
                    fromObjectToList(data).map((v) =>
                        transformGameResponse(v, v._id),
                    ),
                );
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

    if (!user) {
        return <Navigate to={"/"} />;
    }
    return (
        <div>
            <Link to={"/"}>Back</Link>
            GAMES
            {userDecks.map((d) => (
                <div
                    className={d._id == selectedDeckId ? "DeckSelected" : ""}
                    onClick={() => {
                        setSelectedDeckId(d._id);
                    }}
                >
                    Deck {d.name} ({Object.keys(d.cardIds).length})
                </div>
            ))}
            {!!selectedDeckId && (
                <>
                    <div>
                        {games.map((g) => (
                            <div>
                                <Link to={`/game/${g._id}`}>
                                    Game ${g.invitationCode}
                                </Link>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => {
                            if (!user || !selectedDeckId) {
                                return;
                            }
                            createGame(user, selectedDeckId, maxHealth);
                        }}
                    >
                        Create game
                    </button>
                    <div>
                        <TextField
                            label="Invitation code"
                            variant="filled"
                            value={invitationCode}
                            onChange={(e) => setInvitationCode(e.target.value)}
                        />
                        <button
                            onClick={() => {
                                if (!user || !selectedDeckId) {
                                    return;
                                }
                                joinGame(
                                    user,
                                    invitationCode,
                                    selectedDeckId,
                                    maxHealth,
                                );
                            }}
                        >
                            Join
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default GamesPage;
