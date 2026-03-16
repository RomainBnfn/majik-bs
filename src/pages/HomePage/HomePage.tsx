import "./HomePage.scss";
import { useAuth } from "../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";
import Login from "./components/Login.tsx";

const HomePage = () => {
    const { user, isLogged } = useAuth();
    return (
        <div className={"HomePage"}>
            <h1 className={"HomePage-title"}>Majik BS</h1>
            {!isLogged && <Login />}
        </div>
    );
};

export default HomePage;
