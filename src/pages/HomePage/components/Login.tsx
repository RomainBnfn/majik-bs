import { Google } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useAuth } from "../../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";
import { getAuth, signInWithPopup } from "firebase/auth";
import { firebaseApp, firebaseAuthProvider } from "../../../main.tsx";
import {
    getFirebaseValue,
    setFirebaseValue,
} from "../../../services/firebase.service.ts";
import { FIREBASE_PATHS } from "../../../constants/firebasePaths.ts";
import { useNavigate } from "react-router";

const Login = () => {
    const { setUser, user, isLogged } = useAuth();
    const navigate = useNavigate();
    const sign = () => {
        const auth = getAuth(firebaseApp);

        signInWithPopup(auth, firebaseAuthProvider)
            .then((result) => {
                const user = result.user;
                getFirebaseValue(`${FIREBASE_PATHS.users}/${user.uid}`).then(
                    async (r) => {
                        if (!r.exists()) {
                            await setFirebaseValue(
                                `${FIREBASE_PATHS.users}/${user.uid}`,
                                {
                                    name: user.displayName,
                                    email: user.email,
                                },
                            );
                        }
                        setUser({
                            uid: user.uid,
                            displayName: user.displayName ?? "",
                            email: user.email ?? "",
                        });
                        navigate("/decks");
                    },
                );
                result.operationType;
            })
            .catch((error) => {});
    };

    return (
        <div className={"Login"}>
            <Button
                onClick={() => {
                    sign();
                }}
            >
                Logging with
                <Google />
                oogle
            </Button>
        </div>
    );
};

export default Login;
