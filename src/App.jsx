import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import Overview from "./pages/Overview";
import Purchases from "./pages/Purchases/Purchases";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/purchases" replace />} />
                <Route path="overview" element={<Overview />} />
                <Route path="purchases" element={<Purchases />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    );
}

export default App;
