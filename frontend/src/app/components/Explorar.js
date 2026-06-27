import React, { useState, useEffect } from 'react';

export default function Explorar({ onVerPerfil }) {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const buscarUsuarios = async () => {
            try {
                // Endpoint atualizado para a rota de profiles
                const res = await fetch('http://localhost:8080/api/profiles/explorar');
                if (res.ok) {
                    const data = await res.json();
                    setUsuarios(data);
                }
            } catch (err) {
                console.error("Erro ao buscar pesquisadores:", err);
            } finally {
                setLoading(false);
            }
        };
        buscarUsuarios();
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-8">
            <header className="mb-10">
                <h1 className="text-3xl font-extrabold text-black">Explorar Pesquisadores</h1>
                <p className="text-gray-700 mt-2 text-lg">Conheça a trajetória de outros membros da rede Academix AI.</p>
            </header>

            {loading ? (
                <p className="text-black text-center font-bold text-xl">Carregando mentes brilhantes...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {usuarios.map((u) => (
                        <div key={u.id} className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                            <div>
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 border border-blue-200">
                                    <span className="text-blue-600 font-bold text-xl">
                                        {u.nome.charAt(0)}
                                    </span>
                                </div>
                                
                                <h3 className="text-xl font-bold text-black mb-2">{u.nome}</h3>
                                
                                <p className="text-gray-700 text-sm italic leading-relaxed mb-4">
                                    "{u.descricaoCurta}"
                                </p>
                            </div>

                            <button 
                                // Modificado para enviar u.id e u.accountId
                                onClick={() => onVerPerfil(u.id, u.accountId)} 
                                className="block w-full text-center bg-black text-white font-bold py-2 rounded-lg hover:bg-gray-800 transition text-sm"
                            >
                                Ver Trajetória
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}