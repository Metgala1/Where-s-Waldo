import { createBrowserRouter } from "react-router-dom";
import GamePage from "../pages/GamePage";

const routes = createBrowserRouter([
    {path: '/' , element: <GamePage />}
])

export default routes