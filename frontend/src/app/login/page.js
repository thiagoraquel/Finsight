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
  
  // Campos do AcademixProfile (Ponto Variável / Específicos da Instância 1)
  const [lattesId, setLattesId] = useState('');
  const [academicLevel, setAcademicLevel] = useState('Graduação'); // Valor padrão

  const handleAutenticacao = async (e) => {
    e.preventDefault();
    
    // Atualizado para os novos endpoints do AcademixProfileController
    const url = isLogin 
        ? 'http://localhost:8080/api/profiles/login' 
        : 'http://localhost:8080/api/profiles/registro';
    
    // O payload de registro agora engloba as necessidades do Framework e da Aplicação
    const payload = isLogin 
        ? { email, senha } 
        : { nome, email, senha, lattesId, academicLevel };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const dadosUsuario = await response.json();
        // Nota: dadosUsuario agora tem um .id (UUID) e um .account aninhado
        localStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario));
        alert(isLogin ? "Bem-vindo de volta!" : "Conta criada com sucesso!");
        router.push('/'); 
      } else {
        const erroMsg = await response.text();
        alert(`Erro: ${erroMsg || "Credenciais inválidas ou e-mail já existe."}`);
      }
    } catch (error) {
      console.error("Erro ao conectar com servidor:", error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ padding: '40px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        
        <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>
          {isLogin ? 'Entrar no Academix' : 'Criar Conta'}
        </h2>
        
        <form onSubmit={handleAutenticacao} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {!isLogin && (
            <>
              {/* Campo de Nome */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontWeight: 'bold', color: '#555', fontSize: '14px' }}>Nome Completo</label>
                <input 
                  type="text" 
                  placeholder="Ex: João Silva" 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  required 
                  style={estiloInput}
                />
              </div>

              {/* ID do Lattes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontWeight: 'bold', color: '#555', fontSize: '14px' }}>ID do Lattes (16 dígitos)</label>
                <input 
                  type="text" 
                  placeholder="Ex: 1234567890123456" 
                  value={lattesId} 
                  onChange={(e) => setLattesId(e.target.value)} 
                  required 
                  style={estiloInput}
                />
              </div>

              {/* Nível Acadêmico */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontWeight: 'bold', color: '#555', fontSize: '14px' }}>Nível Acadêmico</label>
                <select 
                  value={academicLevel} 
                  onChange={(e) => setAcademicLevel(e.target.value)}
                  style={estiloInput}
                >
                  <option value="Graduação">Graduação</option>
                  <option value="Mestrado">Mestrado</option>
                  <option value="Doutorado">Doutorado</option>
                  <option value="Pós-Doutorado">Pós-Doutorado</option>
                  <option value="Pesquisador Independente">Pesquisador Independente</option>
                </select>
              </div>
            </>
          )}
          
          {/* Campo de E-mail */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontWeight: 'bold', color: '#555', fontSize: '14px' }}>E-mail</label>
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
            <label style={{ fontWeight: 'bold', color: '#555', fontSize: '14px' }}>Senha</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              required 
              style={estiloInput}
            />
          </div>
          
          <button type="submit" style={{ marginTop: '10px', padding: '12px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
            {isLogin ? 'Entrar' : 'Registrar'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' }}>
            {isLogin ? 'Não tem conta? Registre-se aqui' : 'Já tem conta? Faça Login'}
          </button>
        </div>

      </div>
    </div>
  );
}

const estiloInput = {
  padding: '10px', 
  borderRadius: '4px', 
  border: '1px solid #ccc', 
  color: '#333', 
  backgroundColor: '#fff'
};