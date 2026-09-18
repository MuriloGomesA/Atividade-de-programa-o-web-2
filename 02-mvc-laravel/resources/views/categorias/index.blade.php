@extends('layouts.app')

@section('titulo', 'Categorias — Laravel MVC')

@section('conteudo')

<span class="badge">Projeto 2 · Laravel MVC</span>

<h1>📂 Categorias</h1>

<p class="sub">Categorias disponíveis na loja.</p>

<div class="grid">

    @foreach ($categorias as $categoria)

        <a class="card" href="/categorias/{{ $categoria->id }}">

            <h2>{{ $categoria->nome }}</h2>

            <p>{{ $categoria->descricao }}</p>

        </a>

    @endforeach

</div>

@endsection