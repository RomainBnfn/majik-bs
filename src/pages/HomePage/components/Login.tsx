import { Google } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useAuth } from "../../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";

const Login = () => {
    const { signIn } = useAuth();
    return (
        <div className={"Login"}>
            <Button
                onClick={() => {
                    signIn();
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
