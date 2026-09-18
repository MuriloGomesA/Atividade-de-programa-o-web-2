@extends('layouts.app')

@section('titulo', $categoria->nome . ' — Laravel MVC')

@section('conteudo')

<span class="badge">Projeto 2 · Laravel MVC</span>

<a class="voltar" href="/categorias">← Voltar para categorias</a>

<h1>{{ $categoria->nome }}</h1>

<p class="sub">{{ $categoria->descricao }}</p>

<h2>Produtos da categoria</h2>

<div class="grid">

    @foreach ($produtos as $produto)

        <a class="card" href="/produtos/{{ $produto->id }}">

            <div class="emoji">{{ $produto->emoji }}</div>

            <p class="nome">{{ $produto->nome }}</p>

            <p class="preco">
                R$ {{ number_format($produto->preco, 2, ',', '.') }}
            </p>

        </a>

    @endforeach

</div>

@endsection