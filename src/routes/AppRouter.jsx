import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../components/Login";
import AdminPanel from "../components/AdminPanel";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

function AppRouter() {
  const [user] = useAuthState(auth); // Detecta si hay sesión activa

  return (
    <Router>
      {/* Navbar visible solo si no estás en el panel admin */}
      {!window.location.pathname.startsWith("/admin") && <Navbar />}

      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Home />} />

        {/* Login administrador */}
        <Route path="/login" element={<Login />} />

        {/* Panel de administración (solo si está logueado) */}
        <Route
          path="/admin"
          element={user ? <AdminPanel /> : <Navigate to="/login" />}
        />

        {/* Cualquier otra ruta redirige a inicio */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Footer visible solo en el sitio público */}
      {!window.location.pathname.startsWith("/admin") && <Footer />}
    </Router>
  );
}

export default AppRouter;
