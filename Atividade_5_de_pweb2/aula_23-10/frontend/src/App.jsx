import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { eu, sair } from "./api.js";
import Login from "./Login.jsx";
import Cadastro from "./Cadastro.jsx";
import Tarefas from "./Tarefas.jsx";

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    eu()
      .then(setUsuario)
      .catch(() => setUsuario(null))
      .finally(() => setCarregando(false));
  }, []);

  async function aoSair() {
    try {
      await sair();
    } finally {
      setUsuario(null);
      navigate("/login");
    }
  }

  if (carregando) {
    return (
      <main className="card">
        <p className="sub">Carregando...</p>
      </main>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={usuario ? <Navigate to="/" replace /> : <Login onEntrar={setUsuario} />}
      />
      <Route
        path="/cadastro"
        element={usuario ? <Navigate to="/" replace /> : <Cadastro onEntrar={setUsuario} />}
      />
      <Route
        path="/"
        element={
          usuario ? (
            <Tarefas
              usuario={usuario}
              onSair={aoSair}
              onSessaoExpirada={() => setUsuario(null)}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
