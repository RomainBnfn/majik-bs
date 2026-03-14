import { AuthGlobalContext } from "./AuthGlobalContext.tsx";
import { useState } from "react";
import type { UserModel } from "../../models/user.model.ts";

const AuthGlobalContextProvider = ({ children }) => {
    const [loggedUser, setLoggedUser] = useState<UserModel | undefined>(
        undefined,
    );
    return (
        <AuthGlobalContext.Provider
            value={{
                user: loggedUser,
                setUser(u: UserModel | undefined) {
                    setLoggedUser(u);
                },
                isLogged: !!loggedUser,
            }}
        >
            {children}
        </AuthGlobalContext.Provider>
    );
};

export default AuthGlobalContextProvider;
