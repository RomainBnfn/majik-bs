import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./assets/firebaseConfig.ts";

export const firebaseApp = initializeApp(firebaseConfig);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
