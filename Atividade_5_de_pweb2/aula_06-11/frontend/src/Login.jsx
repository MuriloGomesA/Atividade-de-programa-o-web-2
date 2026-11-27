import { useState } from "react";
import { Link } from "react-router-dom";
import { entrar, ErroDeValidacao } from "./api.js";

export default function Login({ onEntrar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState([]);
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErros([]);
    setEnviando(true);
    try {
      onEntrar(await entrar({ email, senha }));
    } catch (err) {
      if (err instanceof ErroDeValidacao) setErros(err.mensagens);
      else setErros(["Não foi possível entrar."]);
      setEnviando(false);
    }
  }

  return (
    <main className="card">
      <h1>🔐 Entrar</h1>
      <p className="sub">Acesse sua lista de tarefas.</p>

      <form className="form-nova" onSubmit={enviar}>
        <input
          type="text"
          placeholder="E-mail"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button type="submit" disabled={enviando}>
          Entrar
        </button>

        {erros.length > 0 && (
          <ul className="erros">
            {erros.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        )}
      </form>

      <p className="troca">
        Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </main>
  );
}
