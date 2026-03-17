import "./index.scss";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./assets/firebaseConfig.ts";
import { createBrowserRouter, Outlet } from "react-router";
import { RouterProvider } from "react-router/dom";
import DecksPage from "./pages/DecksPage/DecksPage.tsx";
import DeckPage from "./pages/DeckPage/DeckPage.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";
import { GoogleAuthProvider } from "firebase/auth";
import CardGlobalContextProvider from "./globalContexts/CardGlobalContext/CardGlobalContextProvider.tsx";
import GameSettingGlobalContextProvider from "./globalContexts/GameSettingGlobalContext/GameSettingGlobalContextProvider.tsx";
import AuthGlobalContextProvider from "./globalContexts/AuthGlobalContext/AuthGlobalContextProvider.tsx";
import GamePage from "./pages/GamePage/GamePage.tsx";
import GameContextProvider from "./pages/GamePage/contexts/GameContextProvider.tsx";
import GamesPage from "./pages/GamesPage/GamesPage.tsx";
import DeckGlobalContextProvider from "./globalContexts/DeckGlobalContext/DeckGlobalContextProvider.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuthProvider = new GoogleAuthProvider();

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthGlobalContextProvider>
                <DeckGlobalContextProvider>
                    <CardGlobalContextProvider>
                        <GameSettingGlobalContextProvider>
                            <div className={"App"}>
                                <div className={"App-content"}>
                                    <Outlet />
                                </div>
                                <Navbar />
                            </div>
                        </GameSettingGlobalContextProvider>
                    </CardGlobalContextProvider>
                </DeckGlobalContextProvider>
            </AuthGlobalContextProvider>
        ),
        children: [
            {
                path: "/decks",
                element: <DecksPage />,
            },
            {
                path: "/deck/:id",
                element: <DeckPage />,
            },
            {
                path: "/game/:id",
                element: (
                    <GameContextProvider>
                        <GamePage />
                    </GameContextProvider>
                ),
            },
            {
                path: "/games",
                element: <GamesPage />,
            },
            {
                path: "*",
                element: <HomePage />,
            },
            {
                path: "/",
                element: <HomePage />,
                index: true,
            },
        ],
        errorElement: () => {
            <div>Error :/</div>;
        },
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider
            router={router}
            onError={(e) => {
                alert(JSON.stringify(e));
            }}
        />
    </StrictMode>,
);
