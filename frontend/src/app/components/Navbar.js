'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [nomeUsuario, setNomeUsuario] = useState('Investidor');

  // O useEffect roda APENAS no navegador, após o HTML ser hidratado
  useEffect(() => {
    const usuarioTexto = localStorage.getItem('usuarioLogado');
    if (usuarioTexto) {
      try {
        const usuario = JSON.parse(usuarioTexto);
        if (usuario?.account?.name) {
          setNomeUsuario(usuario.account.name);
        }
      } catch (error) {
        console.error("Erro ao processar dados do usuário:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    router.push('/login');
  };

  return (
    <header style={{ 
      backgroundColor: '#0f766e', 
      color: 'white', 
      padding: '15px 30px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
        Visão Geral da Carteira
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Agora o texto inicial no Servidor E no Cliente será "Investidor", 
            e logo em seguida mudará para seu nome de forma segura! */}
        <span>Olá, <strong>{nomeUsuario}</strong></span>
        <button 
          onClick={handleLogout}
          style={{ 
            backgroundColor: 'transparent', 
            border: '1px solid white', 
            color: 'white', 
            padding: '8px 16px', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          Sair
        </button>
      </div>
    </header>
  );
}