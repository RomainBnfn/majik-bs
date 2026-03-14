import "./index.css";
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

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuthProvider = new GoogleAuthProvider();

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthGlobalContextProvider>
                <CardGlobalContextProvider>
                    <GameSettingGlobalContextProvider>
                        <Outlet />
                    </GameSettingGlobalContextProvider>
                </CardGlobalContextProvider>
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
                path: "/",
                element: <HomePage />,
                index: true,
            },
        ],
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
