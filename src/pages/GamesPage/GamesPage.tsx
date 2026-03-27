import "./GamesPage.scss";
import { Navigate, useNavigate } from "react-router";
import {
    createGame,
    getAllPlayerGames,
    joinGame,
} from "../../services/game.service.ts";
import { useAuth } from "../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";
import { useGameSettingCards } from "../../globalContexts/GameSettingGlobalContext/GameSettingGlobalContext.tsx";
import { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { onValue } from "firebase/database";
import { fromObjectToList } from "../../utils/firebase.utils.ts";
import type { GameModel } from "../../models/game.model.ts";
import { transformGameResponse } from "../GamePage/contexts/GameContextProvider.tsx";
import { useDecks } from "../../globalContexts/DeckGlobalContext/DeckGlobalContext.tsx";
import { useGetIsDeckValid } from "../../utils/card.utils.ts";
import DeckPreview from "../../components/DeckPreview/DeckPreview.tsx";
import { useLocalStorageState } from "../../hooks/useLocalStorageState.ts";
import GamePreview from "../../components/GamePreview/GamePreview.tsx";

const SELECTED_DECK_PATH = "selectedDeck";
const GamesPage = () => {
    const { user } = useAuth();
    const { maxHealth } = useGameSettingCards();
    const [invitationCode, setInvitationCode] = useState("");
    const [games, setGames] = useState<GameModel[]>([]);
    const { userDecks } = useDecks();
    const isValid = useGetIsDeckValid();
    const validDecks = userDecks.filter(isValid);
    const [selectedDeckId, setSelectedDeckId] = useLocalStorageState<
        string | undefined
    >(SELECTED_DECK_PATH, validDecks[0]?._id);

    const navigate = useNavigate();
    const nonTerminatedGames = games.filter((g) => !g.winnerPlayerId);

    useEffect(() => {
        if (
            selectedDeckId &&
            !validDecks.some((d) => d._id == selectedDeckId)
        ) {
            setSelectedDeckId(validDecks[0]?._id);
        }
    }, [selectedDeckId, setSelectedDeckId, validDecks]);

    useEffect(() => {
        if (!selectedDeckId && validDecks.length) {
            setSelectedDeckId(validDecks[0]._id);
        }
    }, [selectedDeckId, setSelectedDeckId, validDecks]);

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

    const handleJoinGame = () => {
        if (!user || !selectedDeckId || !invitationCode) {
            return;
        }
        joinGame(user, invitationCode, selectedDeckId, maxHealth).then((g) => {
            if (g) {
                navigate(`/game/${g._id}`);
            }
        });
    };
    if (!user) {
        return <Navigate to={"/"} />;
    }
    return (
        <div className={"GamesPage"}>
            <h1>Vos parties</h1>
            {!!selectedDeckId && (
                <>
                    <div className={"Invitation-field"}>
                        <TextField
                            label="Rejoindre une partie"
                            variant="filled"
                            value={invitationCode}
                            onChange={(e) => setInvitationCode(e.target.value)}
                            onKeyUp={(e) => {
                                if (e.key === "Enter") {
                                    handleJoinGame();
                                }
                            }}
                        />
                        <Button
                            onClick={() => {
                                handleJoinGame();
                            }}
                        >
                            Join
                        </Button>
                    </div>
                    <p>Or</p>
                    <Button
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
                    </Button>
                </>
            )}
            <div className={"GamesPage-decks"}>
                <h2>Deck actif</h2>
                <div className={"GamesPage-decks-list"}>
                    {validDecks.map((d) => (
                        <DeckPreview
                            deck={d}
                            active={d._id == selectedDeckId}
                            canDelete={false}
                            onClick={() => setSelectedDeckId(d._id)}
                        />
                    ))}
                </div>
                {!validDecks.length && (
                    <p>
                        Commencez par créer un deck avant de créer ou rejoindre
                        une partie
                    </p>
                )}
            </div>
            {!!selectedDeckId && !!nonTerminatedGames.length && (
                <div className={"GamesPage-games"}>
                    <h2>Active games</h2>
                    <p>Reprendre une ancienne partie non terminée</p>
                    <div className={"GamesPage-games-list"}>
                        {nonTerminatedGames.map((g) => (
                            <GamePreview game={g} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GamesPage;
