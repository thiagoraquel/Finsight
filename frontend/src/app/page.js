'use client';

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardFinanceiro from './components/DashboardFinanceiro'; // Novo componente
import ConselheiroIA from './components/ConselheiroIA';

export default function Home() {
  const [abaAtiva, setAbaAtiva] = useState('dashboard');
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const dados = localStorage.getItem('usuarioLogado');
    if (dados) setUsuario(JSON.parse(dados));
  }, []);

  const renderizarConteudo = () => {
    switch (abaAtiva) {
      case 'dashboard':
        return <DashboardFinanceiro usuario={usuario} />;
      case 'ia':
        return <ConselheiroIA usuario={usuario} />;
      default:
        return <DashboardFinanceiro usuario={usuario} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
      <aside style={{ width: '250px', backgroundColor: '#1a1c23', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', fontSize: '22px', fontWeight: 'bold', borderBottom: '1px solid #2d313c', textAlign: 'center' }}>
          💰 FinSight
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', padding: '20px 0' }}>
          <button onClick={() => setAbaAtiva('dashboard')} style={estiloBotaoSidebar(abaAtiva === 'dashboard')}>
            📊 Dashboard
          </button>
          <button onClick={() => setAbaAtiva('ia')} style={estiloBotaoSidebar(abaAtiva === 'ia')}>
            🤖 Conselheiro IA
          </button>
        </nav>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar /> 
        <div style={{ padding: '30px', overflowY: 'auto' }}>
          {renderizarConteudo()}
        </div>
      </main>
    </div>
  );
}

// O estiloBotaoSidebar permanece o mesmo

const estiloBotaoSidebar = (ativo) => ({
  padding: '15px 25px',
  backgroundColor: ativo ? '#0070f3' : 'transparent',
  color: ativo ? '#fff' : '#a0a5b1',
  border: 'none',
  textAlign: 'left',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background 0.2s',
  borderLeft: ativo ? '4px solid #fff' : '4px solid transparent',
  marginBottom: '5px'
});