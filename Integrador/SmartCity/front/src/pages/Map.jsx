import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import banner from '../assets/banner.png';

// Componente de cadastro
export function Cadastro() {
    // Estados para armazenar os dados do formulário
    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook para navegação

    // Função que faz a requisição de cadastro para a API
    const cadastrar = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/register/', {
                username: user,
                email: email,
                password: password
            });
            alert("Cadastro realizado com sucesso! Faça login para continuar.");
            navigate('/'); // Redireciona para a tela de login
        } catch (error) {
            if (error.response && error.response.data.error) {
                alert(error.response.data.error);
            } else {
                alert("Erro ao realizar cadastro. Tente novamente.");
            }
        }
    };

    // Estrutura da interface
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
            <section className="w-full max-w-md space-y-8">
                {/* Banner superior */}
                <figure className="flex justify-center">
                    <img src={banner} alt="Banner da aplicação" className="w-100 h-auto object-contain" />
                </figure>

                {/* Conteúdo do formulário */}
                <article className="text-center space-y-8">
                    {/* Título da página */}
                    <header>
                        <h1 className="text-2xl text-gray-800 mb-6">Cadastro</h1>
                    </header>

                    {/* Formulário com campos controlados */}
                    <form className="flex flex-col gap-8" onSubmit={(e) => { e.preventDefault(); cadastrar(); }}>
                        {/* Campo de usuário */}
                        <fieldset>
                            <label htmlFor="usuario" className="sr-only">Usuário</label>
                            <input
                                id="usuario"
                                type="text"
                                className="w-full px-4 py-4 bg-[#E5E5E5] border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 placeholder-gray-700 text-lg"
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                                placeholder="Usuário"
                                required
                            />
                        </fieldset>

                        {/* Campo de e-mail */}
                        <fieldset>
                            <label htmlFor="email" className="sr-only">E-mail</label>
                            <input
                                id="email"
                                type="email"
                                className="w-full px-4 py-4 bg-[#E5E5E5] border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 placeholder-gray-700 text-lg"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="E-mail"
                                required
                            />
                        </fieldset>

                        {/* Campo de senha */}
                        <fieldset>
                            <label htmlFor="senha" className="sr-only">Senha</label>
                            <input
                                id="senha"
                                type="password"
                                className="w-full px-4 py-4 bg-[#E5E5E5] border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 placeholder-gray-700 text-lg"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Senha"
                                required
                            />
                        </fieldset>

                        {/* Botão de envio */}
                        <fieldset className="flex justify-center">
                            <button
                                type="submit"
                                className="w-1/2 py-3 px-4 rounded-md text-lg font-medium text-white hover:bg-blue-700 transition-colors"
                                style={{ backgroundColor: '#003376' }}
                            >
                                Cadastrar
                            </button>
                        </fieldset>
                    </form>

                    {/* Link para login */}
                    <footer className="mt-10 text-center">
                        <p className="text-gray-600">
                            Já tem uma conta?{' '}
                            <Link to="/" className="font-semibold hover:underline" style={{ color: '#003376' }}>
                                FAÇA LOGIN AQUI
                            </Link>
                        </p>
                    </footer>
                </article>
            </section>
        </main>
    );
}
