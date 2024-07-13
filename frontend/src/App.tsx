import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layouts/Layout";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import AppContextProvider from "./Contexts/AppContext";
export const backendUrl = "http://localhost:5000";

function App() {
  return (
    <>
      <AppContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<>Home page</>} />
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
            </Route>
          </Routes>
        </Router>
      </AppContextProvider>
    </>
  );
}

export default App;
