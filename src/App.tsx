import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { theme } from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import { Compras } from "./pages/Compras";
import { Fornecedores } from "./pages/Fornecedores";
import { Limites } from "./pages/Limites";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/fornecedores" element={<PrivateRoute><Fornecedores /></PrivateRoute>} />
          <Route path="/limites" element={<PrivateRoute><Limites /></PrivateRoute>} />
          <Route path="/compras" element={<PrivateRoute><Compras /></PrivateRoute>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
