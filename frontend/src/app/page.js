'use client';

import { useState } from 'react';
import Navbar from './components/Navbar';
import CurriculoManager from './components/CurriculoManager';
import DashboardGraficos from './components/DashboardGraficos';
import ConselheiroIA from './components/ConselheiroIA';
import ComparacaoUniversidades from './components/ComparacaoUniversidades';
import Explorar from './components/Explorar';
import PerfilPublico from './components/PerfilPublico';

export default function Home() {
  const [abaAtiva, setAbaAtiva] = useState('perfil');
  const [perfilSelecionadoId, setPerfilSelecionadoId] = useState(null);
  const [contaSelecionadaId, setContaSelecionadaId] = useState(null); // <-- NOVO ESTADO

  const renderizarConteudo = () => {
    switch (abaAtiva) {
      case 'perfil':
        return <CurriculoManager />;
        
      case 'explorar':
        // Agora recebemos os dois IDs do clique
        return <Explorar onVerPerfil={(idPerfil, idConta) => {
            setPerfilSelecionadoId(idPerfil);
            setContaSelecionadaId(idConta); // Guarda o ID do framework
            setAbaAtiva('perfil-publico'); 
        }} />;
        
      case 'perfil-publico':
        return <PerfilPublico 
            usuarioId={perfilSelecionadoId} 
            accountId={contaSelecionadaId} // <-- Repassa o ID para a página
            onVoltar={() => setAbaAtiva('explorar')}
        />;

      case 'graficos':
        return <DashboardGraficos />;
      case 'comparacao':
        return <ComparacaoUniversidades />;
      case 'ia':
        return <ConselheiroIA />;
      default:
        return <CurriculoManager />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
      
      {/* ================= BARRA LATERAL (SIDEBAR) ================= */}
      <aside style={{ 
        width: '250px', 
        backgroundColor: '#1a1c23', 
        color: '#fff', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <div style={{ padding: '20px', fontSize: '22px', fontWeight: 'bold', borderBottom: '1px solid #2d313c', textAlign: 'center' }}>
          🎓 Academix AI
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', padding: '20px 0' }}>
          
          <button 
            onClick={() => setAbaAtiva('perfil')}
            style={estiloBotaoSidebar(abaAtiva === 'perfil')}
          >
            👤 Meu Perfil
          </button>

          <button 
            onClick={() => setAbaAtiva('explorar')}
            style={estiloBotaoSidebar(abaAtiva === 'explorar')}
          >
            🌍 Explorar Rede
          </button>
          
          <button 
            onClick={() => setAbaAtiva('graficos')}
            style={estiloBotaoSidebar(abaAtiva === 'graficos')}
          >
            📊 Dados Básicos
          </button>

          <button 
            onClick={() => setAbaAtiva('comparacao')}
            style={estiloBotaoSidebar(abaAtiva === 'comparacao')}
          >
            ⚖️ Comparar Instituições
          </button>
          
          <button 
            onClick={() => setAbaAtiva('ia')}
            style={estiloBotaoSidebar(abaAtiva === 'ia')}
          >
            🤖 Conselheiro IA
          </button>

        </nav>
      </aside>

      {/* ================= ÁREA DE CONTEÚDO PRINCIPAL ================= */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        <Navbar /> 
        
        <div style={{ padding: '30px', overflowY: 'auto' }}>
          {renderizarConteudo()}
        </div>
        
      </main>
    </div>
  );
}

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