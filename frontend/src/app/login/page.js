'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  
  const [isLogin, setIsLogin] = useState(true);
  
  // Campos do FrameworkAccount (Ponto Fixo)
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  
  // Campos do FinsightProfile (Ponto Variável / Específicos do FinSight)
  const [investorId, setInvestorId] = useState('');
  const [riskProfile, setRiskProfile] = useState('Moderado'); // Valor padrão

  const handleAutenticacao = async (e) => {
    e.preventDefault();
    
    // Aponta para os novos endpoints do FinsightProfileController
    const url = isLogin 
        ? 'http://localhost:8080/api/profiles/login' 
        : 'http://localhost:8080/api/profiles/registro';
    
    // O payload mapeia exatamente o RegistroFinsightDTO do backend
    const payload = isLogin 
        ? { email, senha } 
        : { nome, email, senha, investorId, riskProfile };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const dadosUsuario = await response.json();
        // Armazena a sessão (contém .id do perfil e .account aninhado)
        localStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario));
        alert(isLogin ? "Bem-vindo de volta ao FinSight!" : "Sua conta de investidor foi criada com sucesso!");
        router.push('/'); 
      } else {
        const erroMsg = await response.text();
        alert(`Erro: ${erroMsg || "Credenciais inválidas ou e-mail já cadastrado."}`);
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor do FinSight:", error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
      <div style={{ padding: '40px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px', border: '1px solid #e5e7eb' }}>
        
        <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#000000', fontWeight: 'extrabold' }}>
          {isLogin ? 'Entrar no FinSight' : 'Criar Conta de Investidor'}
        </h2>
        
        <form onSubmit={handleAutenticacao} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {!isLogin && (
            <>
              {/* Campo de Nome */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontWeight: 'bold', color: '#000000', fontSize: '14px' }}>Nome Completo</label>
                <input 
                  type="text" 
                  placeholder="Ex: Thiago Raquel" 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  required 
                  style={estiloInput}
                />
              </div>

              {/* ID de Investidor */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontWeight: 'bold', color: '#000000', fontSize: '14px' }}>Código de Investidor (CVM / B3)</label>
                <input 
                  type="text" 
                  placeholder="Ex: INV-987654" 
                  value={investorId} 
                  onChange={(e) => setInvestorId(e.target.value)} 
                  required 
                  style={estiloInput}
                />
              </div>

              {/* Perfil de Risco */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontWeight: 'bold', color: '#000000', fontSize: '14px' }}>Perfil de Risco</label>
                <select 
                  value={riskProfile} 
                  onChange={(e) => setRiskProfile(e.target.value)}
                  style={estiloInput}
                >
                  <option value="Conservador">Conservador</option>
                  <option value="Moderado">Moderado</option>
                  <option value="Arrojado">Arrojado</option>
                </select>
              </div>
            </>
          )}
          
          {/* Campo de E-mail */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontWeight: 'bold', color: '#000000', fontSize: '14px' }}>E-mail</label>
            <input 
              type="email" 
              placeholder="seu@email.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={estiloInput}
            />
          </div>

          {/* Campo de Senha */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontWeight: 'bold', color: '#000000', fontSize: '14px' }}>Senha</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              required 
              style={estiloInput}
            />
          </div>
          
          <button 
            type="submit" 
            style={{ 
              marginTop: '10px', 
              padding: '12px', 
              background: '#10b981', // Verde de sucesso/dinheiro
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer', 
              fontWeight: 'bold', 
              fontSize: '16px',
              boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
            }}
          >
            {isLogin ? 'Entrar' : 'Registrar Carteira'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#0f766e', // Teal escuro para contraste
              cursor: 'pointer', 
              textDecoration: 'underline', 
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {isLogin ? 'Não tem conta? Registre-se aqui' : 'Já possui cadastro? Faça Login'}
          </button>
        </div>

      </div>
    </div>
  );
}

const estiloInput = {
  padding: '10px', 
  borderRadius: '4px', 
  border: '1px solid #9ca3af', // Borda mais escura para acessibilidade
  color: '#000000', // Texto puramente preto
  backgroundColor: '#fff',
  fontWeight: '600'
};