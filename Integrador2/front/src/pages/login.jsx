import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import banner from '../assets/banner.png';

export function Login() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const logar = async () => {
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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
            <div className="w-full max-w-md space-y-8">
                <div className="flex justify-center">
                    <img src={banner} alt="Banner" className="w-100 h-auto object-contain"/>
                </div>
                <div className="text-center space-y-8">
                    <h1 className="text-2xl text-gray-800 mb-6">Login</h1>
                    <div className="flex flex-col gap-8">
                        <div>
                            <input
                                id="usuario"
                                type="text"
                                className="w-full px-4 py-4 bg-[#E5E5E5] border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 placeholder-gray-700 text-lg"
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                                placeholder="Usuario"
                            />
                        </div>
                        <div>
                            <input
                                id="senha"
                                type="password"
                                className="w-full px-4 py-4 bg-[#E5E5E5] border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 placeholder-gray-700 text-lg"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Senha"
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                className="w-1/2 py-3 px-4 rounded-md text-lg font-medium text-white hover:bg-blue-700 transition-colors"
                                style={{ backgroundColor: '#003376' }}
                                onClick={logar}
                            >
                                Entrar
                            </button>
                        </div>
                    </div>
                    <div className="mt-10 text-center">
                        <p className="text-gray-600">
                            Não tem uma conta? {' '}
                            <Link to="/cadastro" className="font-semibold hover:underline" style={{ color: '#003376' }}>
                                FAÇA CADASTRO AQUI
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}