import { useEffect, useState } from "react";
import {
  listarTarefas,
  criarTarefa,
  atualizarTarefa,
  removerTarefa,
  anexarArquivo,
  ErroDeValidacao,
  NaoAutenticado,
} from "./api.js";

export default function Tarefas({ usuario, onSair, onSessaoExpirada }) {
  const [tarefas, setTarefas] = useState([]);
  const [erroLista, setErroLista] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erros, setErros] = useState([]);

  const [editandoId, setEditandoId] = useState(null);
  const [textoEdicao, setTextoEdicao] = useState("");

  const [enviandoId, setEnviandoId] = useState(null);

  async function carregar() {
    try {
      setErroLista(false);
      setTarefas(await listarTarefas());
    } catch (err) {
      if (err instanceof NaoAutenticado) {
        onSessaoExpirada();
        return;
      }
      setErroLista(true);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function adicionar(e) {
    e.preventDefault();
    setErros([]);
    try {
      await criarTarefa({ titulo, descricao: descricao || undefined });
      setTitulo("");
      setDescricao("");
      carregar();
    } catch (err) {
      if (err instanceof NaoAutenticado) onSessaoExpirada();
      else if (err instanceof ErroDeValidacao) setErros(err.mensagens);
      else setErros(["Não foi possível criar a tarefa."]);
    }
  }

  async function alternarConcluida(t) {
    try {
      await atualizarTarefa(t.id, { concluida: !t.concluida });
      carregar();
    } catch {}
  }

  function iniciarEdicao(t) {
    setEditandoId(t.id);
    setTextoEdicao(t.titulo);
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setTextoEdicao("");
  }

  async function salvarEdicao(id) {
    try {
      await atualizarTarefa(id, { titulo: textoEdicao });
      cancelarEdicao();
      carregar();
    } catch (err) {
      const msg =
        err instanceof ErroDeValidacao ? err.mensagens.join(" ") : "Erro ao salvar.";
      alert(msg);
    }
  }

  async function anexar(id, e) {
    const arquivo = e.target.files[0];
    e.target.value = "";
    if (!arquivo) return;
    setEnviandoId(id);
    try {
      await anexarArquivo(id, arquivo);
      await carregar();
    } catch (err) {
      if (err instanceof NaoAutenticado) onSessaoExpirada();
      else {
        const msg =
          err instanceof ErroDeValidacao
            ? err.mensagens.join(" ")
            : "Erro ao enviar o arquivo.";
        alert(msg);
      }
    } finally {
      setEnviandoId(null);
    }
  }

  async function excluir(id) {
    try {
      await removerTarefa(id);
      carregar();
    } catch {}
  }

  return (
    <main className="card">
      <div className="topo">
        <span className="usuario">{usuario.email}</span>
        <button className="btn-sair" onClick={onSair}>
          Sair
        </button>
      </div>
      <h1>✅ Minhas Tarefas</h1>
      <p className="sub">To-Do List em React consumindo a nossa API NestJS.</p>

      <form className="form-nova" onSubmit={adicionar}>
        <input
          type="text"
          placeholder="Título da tarefa"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <textarea
          placeholder="Descrição (opcional)"
          rows={2}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <button type="submit">Adicionar</button>

        {erros.length > 0 && (
          <ul className="erros">
            {erros.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        )}
      </form>

      {erroLista && (
        <div className="aviso">
          Não foi possível carregar as tarefas. Você já implementou{" "}
          <code>GET /api/tarefas</code> no NestJS?
        </div>
      )}

      {!erroLista && tarefas.length === 0 && (
        <div className="aviso">Nenhuma tarefa ainda. Adicione a primeira!</div>
      )}

      <ul className="lista">
        {tarefas.map((t) =>
          editandoId === t.id ? (
            <li key={t.id} className="item editando">
              <input
                className="edit-input"
                type="text"
                autoFocus
                value={textoEdicao}
                onChange={(e) => setTextoEdicao(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") salvarEdicao(t.id);
                  if (e.key === "Escape") cancelarEdicao();
                }}
              />
              <button className="btn-ok" title="Salvar" onClick={() => salvarEdicao(t.id)}>
                ✓
              </button>
              <button className="btn-cancel" title="Cancelar" onClick={cancelarEdicao}>
                ✗
              </button>
            </li>
          ) : (
            <li key={t.id} className={"item" + (t.concluida ? " concluida" : "")}>
              <input
                type="checkbox"
                checked={t.concluida}
                title="Marcar como concluída"
                onChange={() => alternarConcluida(t)}
              />
              <div className="conteudo">
                <span className="titulo" title="Clique para editar" onClick={() => iniciarEdicao(t)}>
                  {t.titulo}
                </span>
                {t.descricao && <span className="descricao">{t.descricao}</span>}
                {enviandoId === t.id && <span className="descricao">Enviando arquivo...</span>}
                {t.anexoUrl && (
                  <a className="anexo" href={t.anexoUrl} target="_blank" rel="noreferrer">
                    ver anexo
                  </a>
                )}
              </div>
              <label className="btn-clipe" title="Anexar arquivo">
                📎
                <input
                  type="file"
                  hidden
                  accept="image/png,image/jpeg,image/webp,image/gif,application/pdf"
                  disabled={enviandoId === t.id}
                  onChange={(e) => anexar(t.id, e)}
                />
              </label>
              <button className="btn-del" title="Excluir" onClick={() => excluir(t.id)}>
                🗑
              </button>
            </li>
          )
        )}
      </ul>
    </main>
  );
}
