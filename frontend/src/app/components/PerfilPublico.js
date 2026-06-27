'use client';
import { useState, useEffect } from 'react';
import Roadmap from './Roadmap'; 

// Adicionado o accountId nas props
export default function PerfilPublico({ usuarioId, accountId, onVoltar }) {
    const [nome, setNome] = useState('');
    const [curriculo, setCurriculo] = useState('');

    useEffect(() => {
        if (!usuarioId) return;
        
        fetch(`http://localhost:8080/api/profiles/${usuarioId}/nome`)
            .then(res => res.text()).then(setNome);

        fetch(`http://localhost:8080/api/profiles/${usuarioId}/curriculo`)
            .then(res => res.text()).then(setCurriculo);
    }, [usuarioId]);

    return (
        <div className="bg-gray-50 p-6 md:p-8 text-black rounded-lg">
            <button 
                onClick={onVoltar} 
                className="mb-6 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded font-bold transition flex items-center gap-2"
            >
                ← Voltar para Explorar
            </button>

            <div className="max-w-5xl mx-auto space-y-8">
                <header>
                    <h1 className="text-4xl font-extrabold">{nome}</h1>
                    <p className="text-gray-600 mt-2">Perfil Público Acadêmico</p>
                </header>

                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Sobre o Pesquisador</h2>
                    <div className="bg-gray-50 p-4 rounded border font-mono text-sm leading-relaxed max-h-60 overflow-y-auto">
                        {curriculo || "Nenhum dado biográfico disponível."}
                    </div>
                </section>

                {/* Agora repassamos o accountId correto da Conta Base para o componente do Framework! */}
                <Roadmap accountId={accountId} readOnly={true} />
            </div>
        </div>
    );
}