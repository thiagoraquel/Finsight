'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('usuarioLogado');
    if (dadosSalvos) {
      setUsuario(JSON.parse(dadosSalvos));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado'); 
    setUsuario(null);
    router.push('/login'); 
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '15px 30px', 
      backgroundColor: '#fff', 
      borderBottom: '1px solid #eaeaea',
      marginBottom: '30px' 
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '20px', color: '#0070f3' }}>
        Academix AI
      </div>

      <div>
        {usuario ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: '#333', fontWeight: '500' }}>
              {/* Ajuste para o JSON retornado pelo novo AcademixProfile */}
              Olá, <strong>{usuario.account?.name || usuario.nome}</strong>
            </span>
            <button 
              onClick={handleLogout}
              style={{ 
                padding: '6px 12px', 
                backgroundColor: '#ff4d4f', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              Sair
            </button>
          </div>
        ) : (
          <Link href="/login" style={{ 
            padding: '8px 16px', 
            backgroundColor: '#0070f3', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px' 
          }}>
            Entrar / Criar Conta
          </Link>
        )}
      </div>
    </nav>
  );
}