import { useState } from "react";
import { Link } from "react-router-dom";
import { registrar, entrar, ErroDeValidacao } from "./api.js";

export default function Cadastro({ onEntrar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState([]);
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErros([]);
    setEnviando(true);
    try {
      await registrar({ email, senha });
      onEntrar(await entrar({ email, senha }));
    } catch (err) {
      if (err instanceof ErroDeValidacao) setErros(err.mensagens);
      else setErros(["Não foi possível concluir o cadastro."]);
      setEnviando(false);
    }
  }

  return (
    <main className="card">
      <h1>📝 Cadastro</h1>
      <p className="sub">Crie sua conta para organizar suas tarefas.</p>

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
          placeholder="Senha (mínimo 6 caracteres)"
          autoComplete="new-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button type="submit" disabled={enviando}>
          Cadastrar
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
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </main>
  );
}
