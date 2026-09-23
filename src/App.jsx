import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import Overview from './pages/Overview/Overview';
import Inventory from './pages/Inventory/Inventory';
import Settings from './pages/Settings/Settings';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Layout />}
      >
        <Route
          index
          element={
            <Navigate
              to="/overview"
              replace
            />
          }
        />
        <Route
          path="overview"
          element={<Overview />}
        />
        <Route
          path="inventory"
          element={<Inventory />}
        />
        <Route
          path="settings"
          element={<Settings />}
        />
      </Route>
    </Routes>
  );
}

export default App;
