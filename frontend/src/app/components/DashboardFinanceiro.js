'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Roadmap from './Roadmap';

export default function DashboardFinanceiro({ usuario }) {
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [arquivoPlanilha, setArquivoPlanilha] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [perfil, setPerfil] = useState(null);

  // Cores institucionais do FinSight para o gráfico de pizza
  const CORES = ['#0f766e', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

  const carregarGrafico = async () => {
    if (!usuario?.id) return;
    try {
      const res = await fetch(`http://localhost:8080/api/profiles/${usuario.id}/grafico`);
      if (res.ok) {
        const dados = await res.json();
        setDadosGrafico(dados);
      } else if (res.status === 204) {
        setDadosGrafico([]);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do gráfico:", error);
    }
  };

  useEffect(() => {
    if (usuario) {
      carregarGrafico();
      
      // Mapeamento local das descrições baseado no perfil de risco do banco
      const tipo = usuario.riskProfile || "Moderado";
      let desc = "Você busca um equilíbrio entre segurança e rentabilidade, mesclando renda fixa com uma exposição controlada a renda variável.";
      
      if (tipo === 'Arrojado') {
        desc = "Você possui alta tolerância a risco e busca rentabilidade acima da média, compreendendo a volatilidade dos mercados de renda variável e ativos digitais soberanos.";
      } else if (tipo === 'Conservador') {
        desc = "Sua prioridade absoluta é a preservação do capital. Seu foco está em liquidez e previsibilidade através de instrumentos de renda fixa estruturados.";
      }

      setPerfil({
        tipoInvestidor: tipo,
        descricao: desc
      });
    }
  }, [usuario]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!arquivoPlanilha) {
      alert("Por favor, selecione uma planilha Excel primeiro.");
      return;
    }

    setCarregando(true);
    const formData = new FormData();
    formData.append('file', arquivoPlanilha);

    try {
      const res = await fetch(`http://localhost:8080/api/profiles/${usuario.id}/upload-carteira`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert("Planilha de investimentos sincronizada com sucesso!");
        carregarGrafico();
      } else {
        const erroMsg = await res.text();
        alert(`Erro: ${erroMsg}`);
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ color: '#000000', spaceY: '30px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'extrabold', color: '#000000', marginBottom: '20px' }}>
        Painel de Controle Financeiro
      </h1>
      
      {/* ================= CARD DE PERFIL DE INVESTIDOR ================= */}
      <div style={{ 
        padding: '20px', 
        background: '#fff', 
        borderRadius: '8px', 
        marginBottom: '30px', 
        borderLeft: '5px solid #10b981', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)' 
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#0f766e', fontWeight: 'bold', fontSize: '20px' }}>
          Seu Perfil: {perfil?.tipoInvestidor || "Carregando..."}
        </h3>
        {/* Alterado de #666 para #1f2937 (Texto escuro) */}
        <p style={{ color: '#1f2937', fontWeight: '500', margin: 0, lineHeight: '1.6' }}>
          {perfil?.descricao}
        </p>
      </div>

      {/* ================= SEÇÃO DE ATIVOS & INTEGRAÇÃO EXCEL ================= */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px', marginBottom: '40px' }}>
         
         {/* Upload Card */}
         <div style={{ padding: '25px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
            <h4 style={{ borderBottom: '2px solid #f3f4f6', paddingBottom: '10px', marginTop: 0, color: '#000000', fontWeight: 'extrabold', fontSize: '18px' }}>
              Atualizar Carteira (Excel)
            </h4>
            {/* Alterado de #666 para #374151 */}
            <p style={{ fontSize: '14px', color: '#374151', fontWeight: '500', marginBottom: '20px', lineHeight: '1.5' }}>
              Insira o arquivo correspondente à sua alocação de ativos (.xlsx) para recalcular a pizza de diversificação.
            </p>
            
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                type="file" 
                accept=".xlsx, .xls"
                onChange={(e) => setArquivoPlanilha(e.target.files[0])}
                style={{ border: '2px dashed #9ca3af', padding: '12px', borderRadius: '6px', color: '#000000', fontWeight: 'bold', backgroundColor: '#fafafa' }}
              />
              <button 
                type="submit" 
                disabled={carregando}
                style={{ 
                  backgroundColor: carregando ? '#6b7280' : '#10b981', 
                  color: 'white', 
                  padding: '12px', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: carregando ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
                }}
              >
                {carregando ? 'Mapeando Planilha...' : 'Sincronizar Posição'}
              </button>
            </form>
         </div>

         {/* Gráfico de Pizza Card */}
         <div style={{ padding: '25px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', minHeight: '350px' }}>
            <h4 style={{ borderBottom: '2px solid #f3f4f6', paddingBottom: '10px', marginTop: 0, color: '#000000', fontWeight: 'extrabold', fontSize: '18px' }}>
              Alocação Percentual por Classe
            </h4>
            
            {dadosGrafico.length > 0 ? (
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={dadosGrafico}
                      dataKey="valorTotal"
                      nameKey="categoria"
                      cx="50%"
                      cy="50%"
                      outerRadius={95}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      style={{ color: '#000000', fontWeight: 'bold' }}
                    >
                      {dadosGrafico.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                    <Legend wrapperStyle={{ color: '#000000', fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              /* Alterado de #9ca3af para #1f2937 */
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#1f2937', fontWeight: 'bold', fontStyle: 'italic' }}>
                Nenhuma planilha de ativos carregada. Utilize o painel lateral para sincronizar.
              </div>
            )}
         </div>

      </div>

      {/* ================= LINHA DO TEMPO / HISTÓRICO DO FRAMEWORK ================= */}
      <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '30px' }}>
        {/* Passamos dinamicamente o ID da conta base para coletar os marcos temporais financeiros do core */}
        <Roadmap accountId={usuario?.account?.id || usuario?.id} />
      </div>

    </div>
  );
}