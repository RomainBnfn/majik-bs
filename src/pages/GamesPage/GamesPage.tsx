import "./GamesPage.scss";
import { Link, Navigate, useNavigate } from "react-router";
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
import { useGetIsDeckValid } from "../../utils/card.utils.ts";
import DeckPreview from "../../components/DeckPreview/DeckPreview.tsx";

const GamesPage = () => {
    const { user } = useAuth();
    const { maxHealth } = useGameSettingCards();
    const [invitationCode, setInvitationCode] = useState("");
    const [games, setGames] = useState<GameModel[]>([]);
    const { userDecks } = useDecks();
    const isValid = useGetIsDeckValid();
    const validDecks = userDecks.filter(isValid);
    const [selectedDeckId, setSelectedDeckId] = useState<string | undefined>(
        validDecks[0]?._id,
    );
    const navigate = useNavigate();
    const nonTerminatedGames = games.filter((g) => !g.winnerPlayerId);

    useEffect(() => {
        if (!selectedDeckId && validDecks.length) {
            setSelectedDeckId(validDecks[0]._id);
        }
    }, [selectedDeckId, validDecks]);

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
    }, [user]);

    if (!user) {
        return <Navigate to={"/"} />;
    }
    return (
        <div>
            <Link to={"/"}>Back</Link>
            GAMES
            {validDecks.map((d) => (
                <DeckPreview
                    deck={d}
                    active={d._id == selectedDeckId}
                    canDelete={false}
                    onClick={() => setSelectedDeckId(d._id)}
                />
            ))}
            {!!selectedDeckId && (
                <>
                    <div>
                        {nonTerminatedGames.map((g) => (
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
                            createGame(user, selectedDeckId, maxHealth).then(
                                (r) => {
                                    if (r?.key) {
                                        console.log("ke", r);
                                        navigate(`/game/${r.key}`);
                                    }
                                },
                            );
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
                                ).then((g) => {
                                    if (g) {
                                        navigate(`/game/${g._id}`);
                                    }
                                });
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
