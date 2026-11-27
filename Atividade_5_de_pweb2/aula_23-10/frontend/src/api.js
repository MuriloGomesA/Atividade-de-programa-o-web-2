// Funções que falam com a NOSSA API REST (NestJS).
// Caminho relativo "/api/tarefas": o container do frontend (Nginx) encaminha
// para o backend que roda na sua máquina (host.docker.internal:3000).
const API = "/api/tarefas";
const API_AUTH = "/api/auth";

export class NaoAutenticado extends Error {
  constructor() {
    super("Não autenticado");
  }
}

// Erro de validação: carrega a lista de mensagens que o NestJS devolve no 400.
export class ErroDeValidacao extends Error {
  constructor(mensagens) {
    super("Erro de validação");
    this.mensagens = mensagens;
  }
}

// Lê a resposta e, se o status não for ok, transforma o corpo do NestJS
// ({ message: string | string[], ... }) em um ErroDeValidacao.
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

// GET /api/tarefas
export async function listarTarefas() {
  const resposta = await fetch(API);
  if (resposta.status === 401) throw new NaoAutenticado();
  if (!resposta.ok) throw new Error("Falha ao listar tarefas");
  return resposta.json();
}

// POST /api/tarefas  (envia { titulo, descricao })
export async function criarTarefa(dados) {
  const resposta = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return tratar(resposta);
}

// PUT /api/tarefas/:id
export async function atualizarTarefa(id, campos) {
  const resposta = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(campos),
  });
  return tratar(resposta);
}

// DELETE /api/tarefas/:id
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
