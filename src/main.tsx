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

export const firebaseApp = initializeApp(firebaseConfig);

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <>
                <Outlet />
            </>
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
