import { AuthGlobalContext } from "./AuthGlobalContext.tsx";
import { useEffect, useMemo, useState } from "react";
import type { UserModel } from "../../models/user.model.ts";
import { getAuth, onAuthStateChanged, signInWithPopup, type User } from "firebase/auth";
import { firebaseApp, firebaseAuthProvider } from "../../main.tsx";
import { getFirebaseValue, setFirebaseValue } from "../../services/firebase.service.ts";
import { FIREBASE_PATHS } from "../../constants/firebasePaths.ts";
import { useLocation, useNavigate } from "react-router";

const AuthGlobalContextProvider = ({ children }) => {
    const [loggedUser, setLoggedUser] = useState<UserModel | undefined>(
        undefined,
    );
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const auth = useMemo(() => getAuth(firebaseApp), []);

    const defineUserFromFirebaseUser = (u: User) => {
        setLoggedUser({
            uid: u.uid,
            displayName: u.displayName ?? "",
            email: u.email ?? "",
        });
    };

    useEffect(() => {
        if (loggedUser) {
            localStorage.setItem("path", pathname ?? "");
        }
    }, [pathname, loggedUser]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const aa = localStorage.getItem("path");
                defineUserFromFirebaseUser(user);
                if (aa) {
                    navigate(aa);
                }
            } else {
                setLoggedUser(undefined);
            }
        });
        return () => {
            unsubscribe();
        };
    }, [auth, navigate]);

    const signIn = () => {
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
                    },
                );
            })
            .catch((error) => {});
    };

    return (
        <AuthGlobalContext.Provider
            value={{
                user: loggedUser,
                signIn,
                isLogged: !!loggedUser,
            }}
        >
            {children}
        </AuthGlobalContext.Provider>
    );
};

export default AuthGlobalContextProvider;
