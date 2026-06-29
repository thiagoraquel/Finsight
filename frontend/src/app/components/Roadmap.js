'use client';

import React, { useState, useEffect } from 'react';

export default function Roadmap({ accountId, readOnly = false }) {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [novaAtividade, setNovaAtividade] = useState({
        referenceYear: new Date().getFullYear(),
        category: 'Aporte Inicial',
        title: '',
        description: ''
    });

    const carregarRoadmap = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/core/milestones/${accountId}`);
            if (response.ok) {
                const data = await response.json();
                setEventos(data);
            }
        } catch (error) {
            console.error("Erro ao buscar histórico de investimentos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (accountId) carregarRoadmap();
    }, [accountId]);

    const handleSalvarAtividade = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/api/core/milestones/${accountId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaAtividade)
            });

            if (response.ok) {
                setNovaAtividade({ ...novaAtividade, title: '', description: '' });
                carregarRoadmap();
            } else {
                alert("Erro ao registrar o marco financeiro.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-10">
            { !readOnly && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
                    <h2 className="text-xl font-extrabold text-black mb-4">Registrar Novo Marco Financeiro</h2>
                    <form onSubmit={handleSalvarAtividade} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        
                        <div className="col-span-1">
                            <label className="block text-sm font-bold text-black">Ano</label>
                            <input type="number" required
                                className="mt-1 w-full p-2 border border-gray-400 rounded-md text-black bg-white font-medium"
                                value={novaAtividade.referenceYear}
                                onChange={(e) => setNovaAtividade({ ...novaAtividade, referenceYear: Number(e.target.value) })}
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="block text-sm font-bold text-black">Categoria</label>
                            <select 
                                className="mt-1 w-full p-2 border border-gray-400 rounded-md text-black bg-white font-medium"
                                value={novaAtividade.category}
                                onChange={(e) => setNovaAtividade({ ...novaAtividade, category: e.target.value })}
                            >
                                <option value="Aporte Inicial">Aporte Inicial</option>
                                <option value="Meta de Rentabilidade">Meta de Rentabilidade</option>
                                <option value="Acúmulo de Satoshis">Acúmulo de Satoshis</option>
                                <option value="Reserva de Emergência">Reserva de Emergência</option>
                                <option value="Rebalanceamento">Rebalanceamento</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-black">Título</label>
                            <input type="text" required placeholder="Ex: Primeiro milhão de Satoshis"
                                className="mt-1 w-full p-2 border border-gray-400 rounded-md text-black bg-white font-medium placeholder-gray-500"
                                value={novaAtividade.title}
                                onChange={(e) => setNovaAtividade({ ...novaAtividade, title: e.target.value })}
                            />
                        </div>

                        <div className="col-span-1 md:col-span-4">
                            <label className="block text-sm font-bold text-black">Descrição (Opcional)</label>
                            <textarea rows="2" placeholder="Detalhes sobre a alocação ou meta atingida..."
                                className="mt-1 w-full p-2 border border-gray-400 rounded-md text-black bg-white font-medium placeholder-gray-500"
                                value={novaAtividade.description}
                                onChange={(e) => setNovaAtividade({ ...novaAtividade, description: e.target.value })}
                            />
                        </div>

                        <div className="col-span-1 md:col-span-4 flex justify-end mt-2">
                            <button type="submit" className="bg-emerald-600 text-white font-bold px-6 py-2 rounded shadow hover:bg-emerald-700 transition">
                                Adicionar ao Histórico
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div>
                <h2 className="text-2xl font-extrabold text-black mb-6">Minha Trajetória de Investimentos</h2>
                
                {loading ? (
                    <p className="text-black font-semibold text-lg">Processando seu histórico...</p>
                ) : eventos.length === 0 ? (
                    <p className="text-black font-semibold text-lg">Nenhum marco registrado ainda.</p>
                ) : (
                    <div className="relative border-l-4 border-emerald-500 ml-3 md:ml-6 pl-6 space-y-8">
                        {eventos.map((evento, index) => (
                            <div key={index} className="relative">
                                <span className="absolute -left-[37px] bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center border-4 border-white shadow-md"></span>
                                
                                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-extrabold text-white bg-emerald-600 px-3 py-1 rounded">
                                            {evento.referenceYear}
                                        </span>
                                        <span className="text-xs font-bold text-gray-800 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded border border-gray-200">
                                            {evento.category}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-extrabold text-black">{evento.title}</h3>
                                    {evento.description && (
                                        <p className="text-black mt-3 text-base leading-relaxed">{evento.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}