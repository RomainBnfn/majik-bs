import { createContext, useContext } from "react";
import type { UserModel } from "../../models/user.model.ts";

type AuthGlobalContextValue = {
    user: UserModel | undefined;
    setUser(u: UserModel | undefined): void;
    isLogged: boolean;
};

export const AuthGlobalContext = createContext<AuthGlobalContextValue>({
    user: undefined,
    setUser(u: UserModel | undefined) {
        //
    },
    isLogged: false,
});

export const useAuth = () => {
    return useContext(AuthGlobalContext);
};
