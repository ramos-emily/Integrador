import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import banner from '../assets/banner.png';

export function Login() {
    /*
    Eu crio os estados para guardar o que o usuário digita nos campos de usuário e senha.
    Também pego a função para navegar entre páginas depois do login.
    */
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    /*
    Essa função é chamada quando o formulário é enviado.
    Eu envio os dados para a API para tentar fazer o login.
    Se der certo, salvo os tokens no localStorage e redireciono para a página principal.
    Se der erro, aviso o usuário que algo está errado.
    */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username: user,
                password: password
            });
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            navigate('/home');
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            alert("Usuário ou senha incorretos. Tente novamente.");
        }
    };

    /*
    Aqui é a parte visual do componente, que o usuário vai ver.
    Eu mostro um banner no topo, um formulário com campos para usuário e senha,
    um botão para enviar o login e um link para ir para a página de cadastro.
    */
    return (
        <main aria-label="Página de login" className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
            <section aria-labelledby="login-heading" className="w-full max-w-md space-y-8">
                {/* Banner da aplicação no topo */}
                <figure className="flex justify-center">
                    <img
                        src={banner}
                        alt="Banner da aplicação - Logo da empresa"
                        className="w-100 h-auto object-contain"
                        aria-describedby="banner-desc"
                    />
                    <figcaption id="banner-desc" className="sr-only">
                        Imagem decorativa do cabeçalho do sistema
                    </figcaption>
                </figure>

                {/* Formulário de login */}
                <article aria-labelledby="login-form-heading">
                    <header>
                        <h1 id="login-heading" className="flex justify-center text-2xl text-gray-800 mb-6">
                            Login
                        </h1>
                    </header>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-8" aria-label="Formulário de login">
                        {/* Campo para usuário */}
                        <fieldset aria-labelledby="usuario-label">
                            <label id="usuario-label" htmlFor="usuario" className="sr-only">
                                Usuário
                            </label>
                            <input
                                id="usuario"
                                type="text"
                                className="w-full px-4 py-4 bg-[#E5E5E5] border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 placeholder-gray-700 text-lg"
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                                placeholder="Usuário"
                                required
                                aria-required="true"
                                aria-label="Campo para inserir nome de usuário"
                            />
                        </fieldset>

                        {/* Campo para senha */}
                        <fieldset aria-labelledby="senha-label">
                            <label id="senha-label" htmlFor="senha" className="sr-only">
                                Senha
                            </label>
                            <input
                                id="senha"
                                type="password"
                                className="w-full px-4 py-4 bg-[#E5E5E5] border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 placeholder-gray-700 text-lg"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Senha"
                                required
                                aria-required="true"
                                aria-label="Campo para inserir senha"
                            />
                        </fieldset>

                        {/* Botão para enviar o formulário */}
                        <fieldset className="flex justify-center" aria-label="Ações do formulário">
                            <button
                                type="submit"
                                className="w-1/2 py-3 px-4 rounded-md text-lg font-medium text-white hover:bg-blue-700 transition-colors"
                                style={{ backgroundColor: '#003376' }}
                                aria-label="Botão para realizar login"
                            >
                                Entrar
                            </button>
                        </fieldset>
                    </form>

                    {/* Link para a página de cadastro */}
                    <footer className="mt-10 text-center" aria-label="Rodapé de navegação">
                        <p className="text-gray-600">
                            Não tem uma conta?{' '}
                            <Link
                                to="/cadastro"
                                className="font-semibold hover:underline"
                                style={{ color: '#003376' }}
                                aria-label="Link para página de cadastro"
                            >
                                FAÇA CADASTRO AQUI
                            </Link>
                        </p>
                    </footer>
                </article>
            </section>
        </main>
    );
}
