'use client';

import { useState, useEffect } from 'react';

export default function ConselheiroIA() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(false);
  
  const [mensagem, setMensagem] = useState('');
  const [arquivoPdf, setArquivoPdf] = useState(null);
  
  const [historico, setHistorico] = useState([
    { role: 'assistant', content: 'Olá! Sou o Conselheiro do Academix AI. Quer um conselho geral sobre sua trajetória ou prefere me anexar um edital para analisarmos as suas chances de aprovação?' }
  ]);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('usuarioLogado');
    if (dadosSalvos) {
      setUsuario(JSON.parse(dadosSalvos));
    }
  }, []);

  const solicitarConselhoGeral = async () => {
    if (!usuario) return;
    
    setCarregando(true);
    const novaMensagemUsuario = { role: 'user', content: 'Analise meu currículo e minha trajetória e me dê um conselho de próximos passos para o mestrado.' };
    setHistorico(prev => [...prev, novaMensagemUsuario]);

    try {
      // Como a IA agora pega o currículo e os marcos automaticamente via Template Method, só precisamos bater no endpoint
      const res = await fetch(`http://localhost:8080/api/ai/conselho/rapido/${usuario.account.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: novaMensagemUsuario.content }) 
      });
      
      const texto = await res.text();
      setHistorico(prev => [...prev, { role: 'assistant', content: texto }]);
    } catch (erro) {
      setHistorico(prev => [...prev, { role: 'assistant', content: "Erro de conexão com o motor de Inteligência Artificial." }]);
    } finally {
      setCarregando(false);
    }
  };

  const enviarMensagem = async (e) => {
    e.preventDefault();
    if (!mensagem.trim() && !arquivoPdf) return;

    setCarregando(true);
    
    const textoUsuario = arquivoPdf 
      ? `[Analisando Arquivo: ${arquivoPdf.name}] ${mensagem}` 
      : mensagem;

    const novaMensagemUsuario = { role: 'user', content: textoUsuario };
    setHistorico(prev => [...prev, novaMensagemUsuario]);
    
    setMensagem('');

    try {
      const formData = new FormData();
      formData.append('mensagem', novaMensagemUsuario.content);
      if (arquivoPdf) {
        formData.append('file', arquivoPdf);
      }

      // Rota unificada para o AiTaskTemplate
      const res = await fetch(`http://localhost:8080/api/ai/conselho/${usuario.account.id}`, {
        method: 'POST',
        body: formData 
      });
      
      const texto = await res.text();
      setHistorico(prev => [...prev, { role: 'assistant', content: texto }]);
      setArquivoPdf(null); 
    } catch (erro) {
      setHistorico(prev => [...prev, { role: 'assistant', content: "Erro ao processar sua requisição no motor de IA." }]);
    } finally {
      setCarregando(false);
    }
  };

  if (!usuario) {
    return <div style={{ color: '#000', padding: '20px' }}>Faça login para acessar a IA.</div>;
  }

  return (
    <div style={{ padding: '30px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column', height: '80vh' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#0070f3', margin: 0 }}>🤖 Conselheiro Acadêmico (IA)</h2>
        
        <button 
          onClick={solicitarConselhoGeral} 
          disabled={carregando}
          style={{
            padding: '10px 20px', backgroundColor: carregando ? '#ccc' : '#10b981', color: '#fff',
            border: 'none', borderRadius: '5px', cursor: carregando ? 'not-allowed' : 'pointer', fontWeight: 'bold'
          }}
        >
          ✨ Conselho Rápido
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '15px', backgroundColor: '#f4f7f6', borderRadius: '8px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {historico.map((msg, index) => (
          <div key={index} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.role === 'user' ? '#0070f3' : '#fff',
            color: msg.role === 'user' ? '#fff' : '#333',
            padding: '15px', borderRadius: '8px', maxWidth: '80%',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)', whiteSpace: 'pre-wrap', lineHeight: '1.5'
          }}>
            {msg.content}
          </div>
        ))}
        {carregando && <div style={{ alignSelf: 'flex-start', color: '#888', fontStyle: 'italic' }}>A IA está lendo seu histórico e pensando...</div>}
      </div>

      <form onSubmit={enviarMensagem} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        
        <label style={{ cursor: 'pointer', padding: '10px', backgroundColor: arquivoPdf ? '#e0f2fe' : '#f1f5f9', borderRadius: '5px', border: '1px solid #cbd5e1' }}>
          📄 {arquivoPdf ? arquivoPdf.name : 'Anexar Documento'}
          <input 
            type="file" 
            accept=".pdf,.txt,.xml" 
            style={{ display: 'none' }} 
            onChange={(e) => setArquivoPdf(e.target.files[0])} 
          />
        </label>

        <input 
          type="text" 
          value={mensagem} 
          onChange={(e) => setMensagem(e.target.value)} 
          placeholder="Digite sua dúvida ou peça análise do documento anexado..." 
          style={{ 
            flex: 1, 
            padding: '12px', 
            border: '1px solid #ccc', 
            borderRadius: '5px', 
            outline: 'none',
            color: '#333',
            backgroundColor: '#fff'
          }}
        />
        
        <button 
          type="submit" 
          disabled={carregando || (!mensagem.trim() && !arquivoPdf)}
          style={{ padding: '12px 24px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Enviar
        </button>
      </form>

    </div>
  );
}