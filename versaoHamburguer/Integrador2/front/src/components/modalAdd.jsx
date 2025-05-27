import React, { useState, useEffect } from "react";
import axios from "axios";

export function ModalAdd({ isOpen, onClose, titulo, url, campos = []}) {
    if (!isOpen) return null;

    const [formData, setFormData] = useState(() =>
        campos.reduce((acc, campo) => {
            acc[campo] = '';
            return acc;
        }, {})
    );

    const [opcoesFK, setOpcoesFK] = useState({});
    const token = localStorage.getItem('token');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        const initialFormData = campos.reduce((acc, campo) => {
            acc[campo] = '';
            return acc;
        }, {});
        setFormData(initialFormData);
    }, [campos]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            alert("Token não encontrado. Faça login novamente.");
            return;
        }

        try {
            await axios.post(`http://127.0.0.1:8000/${url}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Cadastro realizado com sucesso!");
            onClose();
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            alert("Erro ao cadastrar.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500/30 z-50">
            <div className="bg-white rounded-lg !p-6 lg:!p-8 w-[400px] sm:w-[510px] lg:w-[640px] xl:w-[800px] shadow-lg">
                <h2 className="text-xl font-bold !mb-4 text-gray-800">Adicionar novo {titulo}</h2>

                <form onSubmit={handleSubmit}>
                    {campos.map((campo) => (
                        <div key={`campo-${campo}`} className="mb-4">
                            <label htmlFor={campo} className="block text-gray-700 capitalize">
                                {campo.replace("_id", "").replace("_", " ")}
                            </label>

                            <input
                                type={(campo === "latitude" || campo === "longitude" || campo === "sig" || campo === "valor") ? "number" : 
                                    (campo === "timestamp") ? "date" : 
                                    (campo === "status") ? "boolean" :"text"}
                                id={campo}
                                name={campo}
                                placeholder={campo}
                                value={formData[campo] ?? ''}
                                onChange={handleChange}
                                className="w-full !p-2 border border-gray-300 rounded-md !mb-2"
                                required
                            />

                        </div>
                    ))}

                    <div className="flex justify-end gap-4">
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md !p-2">Salvar</button>
                        <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md !p-2">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
