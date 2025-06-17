import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import banner from '../assets/banner.png';

export function Cadastro() {
    /*
    Eu crio os estados para guardar os valores que o usuário digita nos campos de usuário, email e senha.
    Também uso a função para navegar entre páginas após o cadastro.
    */
    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    /*
    Essa função é responsável por enviar os dados para a API e tentar cadastrar o usuário.
    Se o cadastro for bem-sucedido, eu aviso o usuário e redireciono para a página de login.
    Se ocorrer algum erro, eu exibo uma mensagem apropriada.
    */
    const cadastrar = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/register/', {
                username: user,
                email: email,
                password: password
            });
            alert("Cadastro realizado com sucesso! Faça login para continuar.");
            navigate('/');
        } catch (error) {
            if (error.response && error.response.data.error) {
                alert(error.response.data.error);
            } else {
                alert("Erro ao realizar cadastro. Tente novamente.");
            }
        }
    };

    /*
    Essa é a parte visual do componente.
    Eu mostro um banner no topo, um formulário para o usuário preencher os dados,
    um botão para enviar o cadastro e um link para ir para a página de login.
    */
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
            <section className="w-full max-w-md space-y-8">
                {/* Banner da aplicação */}
                <figure className="flex justify-center">
                    <img src={banner} alt="Banner da aplicação" className="w-100 h-auto object-contain"/>
                </figure>
                <article className="text-center space-y-8">
                    <header>
                        <h1 className="text-2xl text-gray-800 mb-6">Cadastro</h1>
                    </header>
                    <form className="flex flex-col gap-8" onSubmit={(e) => { e.preventDefault(); cadastrar(); }}>
                        {/* Campo para usuário */}
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
                        {/* Campo para e-mail */}
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
                        {/* Campo para senha */}
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
                        {/* Botão para enviar o formulário */}
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
                    {/* Link para a página de login */}
                    <footer className="mt-10 text-center">
                        <p className="text-gray-600">
                            Já tem uma conta? {' '}
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
