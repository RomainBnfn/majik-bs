import { createContext, useContext } from "react";
import type { UserModel } from "../../models/user.model.ts";

type AuthGlobalContextValue = {
    user: UserModel | undefined;
    signIn(): void;
    isLogged: boolean;
};

export const AuthGlobalContext = createContext<AuthGlobalContextValue>({
    user: undefined,
    signIn() {
        //
    },
    isLogged: false,
});

export const useAuth = () => {
    return useContext(AuthGlobalContext);
};
