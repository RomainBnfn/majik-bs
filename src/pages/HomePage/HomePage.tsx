import "./HomePage.scss";
import { Link } from "react-router";
import { getAuth, signInWithPopup } from "firebase/auth";
import { firebaseApp, firebaseAuthProvider } from "../../main.tsx";
import {
    getFirebaseValue,
    setFirebaseValue,
} from "../../services/firebase.service.ts";
import { FIREBASE_PATHS } from "../../constants/firebasePaths.ts";
import { useAuth } from "../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";

const HomePage = () => {
    const { setUser, user, isLogged } = useAuth();
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
                    },
                );
                result.operationType;
            })
            .catch((error) => {});
    };
    return (
        <>
            {!isLogged && (
                <button
                    onClick={() => {
                        sign();
                    }}
                >
                    Log
                </button>
            )}
            {isLogged && (
                <>
                    Hello {user?.displayName}
                    <Link to={"/decks"}>Decks</Link>
                    <Link to={"/games"}>Games</Link>
                </>
            )}
        </>
    );
};

export default HomePage;
