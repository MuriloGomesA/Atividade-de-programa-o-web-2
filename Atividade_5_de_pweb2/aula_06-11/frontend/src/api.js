const API = "/api/tarefas";
const API_AUTH = "/api/auth";

export class NaoAutenticado extends Error {
  constructor() {
    super("Não autenticado");
  }
}

export class ErroDeValidacao extends Error {
  constructor(mensagens) {
    super("Erro de validação");
    this.mensagens = mensagens;
  }
}

async function tratar(resposta, exigeSessao = true) {
  if (resposta.status === 204) return null;
  if (exigeSessao && resposta.status === 401) throw new NaoAutenticado();
  const corpo = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    const msgs = Array.isArray(corpo.message)
      ? corpo.message
      : [corpo.message || "Ocorreu um erro."];
    throw new ErroDeValidacao(msgs);
  }
  return corpo;
}

export async function listarTarefas() {
  const resposta = await fetch(API);
  if (resposta.status === 401) throw new NaoAutenticado();
  if (!resposta.ok) throw new Error("Falha ao listar tarefas");
  return resposta.json();
}

export async function criarTarefa(dados) {
  const resposta = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return tratar(resposta);
}

export async function atualizarTarefa(id, campos) {
  const resposta = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(campos),
  });
  return tratar(resposta);
}

export async function removerTarefa(id) {
  const resposta = await fetch(`${API}/${id}`, { method: "DELETE" });
  if (resposta.status === 401) throw new NaoAutenticado();
  if (!resposta.ok) throw new Error("Falha ao remover tarefa");
}

export async function registrar({ email, senha }) {
  const resposta = await fetch(`${API_AUTH}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  return tratar(resposta, false);
}

export async function entrar({ email, senha }) {
  const resposta = await fetch(`${API_AUTH}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  const { user } = await tratar(resposta, false);
  return { userId: user.id, email: user.email };
}

export async function eu() {
  const resposta = await fetch(`${API_AUTH}/me`);
  if (!resposta.ok) throw new NaoAutenticado();
  return resposta.json();
}

export async function sair() {
  await fetch(`${API_AUTH}/logout`, { method: "POST" });
}

export async function anexarArquivo(id, arquivo) {
  const dados = new FormData();
  dados.append("arquivo", arquivo);
  const resposta = await fetch(`${API}/${id}/anexo`, {
    method: "POST",
    body: dados,
  });
  return tratar(resposta);
}
