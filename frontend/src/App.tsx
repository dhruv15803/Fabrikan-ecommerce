import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layouts/Layout";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import AppContextProvider from "./Contexts/AppContext";
import AdminProducts from "./Pages/AdminProducts";
import AdminLayout from "./Layouts/AdminLayout";
import AdminCategories from "./Pages/AdminCategories";
import AdminChildCategories from "./Pages/AdminChildCategories";
import AdminProductDetail from "./Pages/AdminProductDetail";
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
              <Route path="admin" element={<AdminLayout/>}>
                <Route index element={<AdminProducts/>}/>
                <Route path="categories" element={<AdminCategories/>}/>
                <Route path="categories/:parentId" element={<AdminChildCategories/>}/>
                <Route path="product/:productId" element={<AdminProductDetail/>}/>
              </Route>
            </Route>
          </Routes>
        </Router>
      </AppContextProvider>
    </>
  );
}

export default App;
