"use client";

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BookOpen, Users, GraduationCap, Award, Search, Globe, Trophy, Library, Building2, PlaneTakeoff } from 'lucide-react'; 

const BuscadorUniversidade = ({ label, corHex, valor, setValor }) => {
  const [termo, setTermo] = useState(valor);
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarLista, setMostrarLista] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (termo.length >= 3 && termo !== valor) {
        try {
          const res = await fetch(`http://localhost:8080/api/comparacao/sugestoes?termo=${encodeURIComponent(termo)}`);
          if (res.ok) {
            const data = await res.json();
            setSugestoes(data);
            setMostrarLista(true);
          }
        } catch (err) {
          console.error("Erro ao buscar sugestões", err);
        }
      } else {
        setSugestoes([]);
        setMostrarLista(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [termo, valor]);

  const selecionarSugestao = (nome) => {
    setTermo(nome);
    setValor(nome); 
    setMostrarLista(false);
  };

  return (
    <div className="relative w-full">
      <label className="block text-sm font-semibold mb-2" style={{ color: corHex }}>{label}</label>
      <div className="relative">
        <input
          type="text"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          onFocus={() => termo.length >= 3 && setMostrarLista(true)}
          placeholder="Digite o nome da instituição..."
          className="w-full p-3 pl-10 rounded-lg border border-slate-200 focus:ring-2 outline-none transition-all"
        />
        <Search className="absolute left-3 top-3 text-slate-400" size={20} />
      </div>

      {mostrarLista && sugestoes.length > 0 && (
        <ul className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {sugestoes.map((sugestao, idx) => (
            <li 
              key={idx} 
              onClick={() => selecionarSugestao(sugestao)}
              className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 text-sm text-slate-700"
            >
              {sugestao}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ListaTop = ({ titulo, icone: Icon, dadosA, dadosB, nomeA, nomeB }) => {
  const top5A = dadosA?.slice(0, 5) || [];
  const top5B = dadosB?.slice(0, 5) || [];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm col-span-1 lg:col-span-2">
      <div className="flex items-center justify-center gap-3 mb-6">
        <Icon size={24} className="text-slate-700" />
        <h3 className="text-lg font-bold text-slate-800">{titulo}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-md font-bold text-indigo-600 mb-4 pb-2 border-b-2 border-indigo-100">{nomeA}</h4>
          <ul className="space-y-3">
            {top5A.length > 0 ? top5A.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-indigo-50 transition-colors">
                <span className="text-sm font-medium text-slate-700 truncate pr-4">{idx + 1}º {item.rotulo}</span>
                <span className="text-sm font-black text-indigo-600">{item.contagem.toLocaleString('pt-BR')}</span>
              </li>
            )) : <p className="text-sm text-slate-400 italic">Sem dados disponíveis</p>}
          </ul>
        </div>

        <div>
          <h4 className="text-md font-bold text-emerald-600 mb-4 pb-2 border-b-2 border-emerald-100">{nomeB}</h4>
          <ul className="space-y-3">
            {top5B.length > 0 ? top5B.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-emerald-50 transition-colors">
                <span className="text-sm font-medium text-slate-700 truncate pr-4">{idx + 1}º {item.rotulo}</span>
                <span className="text-sm font-black text-emerald-600">{item.contagem.toLocaleString('pt-BR')}</span>
              </li>
            )) : <p className="text-sm text-slate-400 italic">Sem dados disponíveis</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default function ComparacaoUniversidades() {
  const [univA, setUnivA] = useState('Universidade Federal do Rio de Janeiro');
  const [univB, setUnivB] = useState('Universidade Federal de São Paulo');
  const [dadosA, setDadosA] = useState(null);
  const [dadosB, setDadosB] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const buscarDados = async () => {
    setLoading(true);
    setErro(null);
    try {
      const [resA, resB] = await Promise.all([
        fetch(`http://localhost:8080/api/comparacao?universidade=${encodeURIComponent(univA)}`),
        fetch(`http://localhost:8080/api/comparacao?universidade=${encodeURIComponent(univB)}`)
      ]);

      if (!resA.ok || !resB.ok) throw new Error("Erro ao buscar dados na API.");

      const dataA = resA.status === 204 ? null : await resA.json();
      const dataB = resB.status === 204 ? null : await resB.json();

      setDadosA(dataA);
      setDadosB(dataB);
    } catch (err) {
      setErro("Falha de comunicação com o servidor. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  const mesclarDadosDemografia = (listaA, listaB) => {
    const mapa = new Map();
    listaA?.forEach(item => mapa.set(item.categoria, { nome: item.categoria, valorA: item.porcentagem }));
    listaB?.forEach(item => {
      const existente = mapa.get(item.categoria) || { nome: item.categoria };
      existente.valorB = item.porcentagem;
      mapa.set(item.categoria, existente);
    });
    return Array.from(mapa.values());
  };

  const mesclarDadosContagem = (listaA, listaB) => {
    const mapa = new Map();
    listaA?.forEach(item => mapa.set(item.rotulo, { nome: item.rotulo, valorA: item.contagem }));
    listaB?.forEach(item => {
      const existente = mapa.get(item.rotulo) || { nome: item.rotulo };
      existente.valorB = item.contagem;
      mapa.set(item.rotulo, existente);
    });
    return Array.from(mapa.values());
  };

  return (
    <div className="p-8 min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-6 text-center">Painel Comparativo de Instituições</h1>
          
          <div className="flex flex-col md:flex-row gap-6 items-end justify-center">
            <div className="w-full md:w-2/5">
              <BuscadorUniversidade label="Instituição A (Azul)" corHex="#6366f1" valor={univA} setValor={setUnivA} />
            </div>
            <div className="w-full md:w-2/5">
              <BuscadorUniversidade label="Instituição B (Verde)" corHex="#10b981" valor={univB} setValor={setUnivB} />
            </div>
            <button 
              onClick={buscarDados} disabled={loading}
              className="w-full md:w-1/5 px-8 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50 h-[48px]"
            >
              {loading ? "Processando..." : "Comparar"}
            </button>
          </div>
          {erro && <p className="text-red-500 text-center mt-4 font-medium">{erro}</p>}
        </div>

        {dadosA && dadosB && (
          <div className="space-y-8 animate-in fade-in duration-500">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-t-indigo-500">
                <h2 className="text-xl font-bold text-slate-800 mb-4">{dadosA.nomeUniversidade}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-indigo-50 rounded-xl">
                    <div className="flex items-center gap-2 text-indigo-600 mb-1"><BookOpen size={18}/> Artigos</div>
                    <p className="text-2xl font-black">{dadosA.totalArtigos?.toLocaleString('pt-BR') || 0}</p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-xl">
                    <div className="flex items-center gap-2 text-indigo-600 mb-1"><Award size={18}/> Citações</div>
                    <p className="text-2xl font-black">{dadosA.totalCitacoes?.toLocaleString('pt-BR') || 0}</p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-xl">
                    <div className="flex items-center gap-2 text-indigo-600 mb-1"><Users size={18}/> Docentes</div>
                    <p className="text-2xl font-black">{dadosA.totalDocentes?.toLocaleString('pt-BR') || 0}</p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-xl">
                    <div className="flex items-center gap-2 text-indigo-600 mb-1"><GraduationCap size={18}/> Egressos</div>
                    <p className="text-2xl font-black">{dadosA.totalFormados?.toLocaleString('pt-BR') || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-t-emerald-500">
                <h2 className="text-xl font-bold text-slate-800 mb-4">{dadosB.nomeUniversidade}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <div className="flex items-center gap-2 text-emerald-600 mb-1"><BookOpen size={18}/> Artigos</div>
                    <p className="text-2xl font-black">{dadosB.totalArtigos?.toLocaleString('pt-BR') || 0}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <div className="flex items-center gap-2 text-emerald-600 mb-1"><Award size={18}/> Citações</div>
                    <p className="text-2xl font-black">{dadosB.totalCitacoes?.toLocaleString('pt-BR') || 0}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <div className="flex items-center gap-2 text-emerald-600 mb-1"><Users size={18}/> Docentes</div>
                    <p className="text-2xl font-black">{dadosB.totalDocentes?.toLocaleString('pt-BR') || 0}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <div className="flex items-center gap-2 text-emerald-600 mb-1"><GraduationCap size={18}/> Egressos</div>
                    <p className="text-2xl font-black">{dadosB.totalFormados?.toLocaleString('pt-BR') || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Distribuição por Sexo (%)</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mesclarDadosDemografia(dadosA.distribuicaoSexo, dadosB.distribuicaoSexo)} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                      <XAxis dataKey="nome" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
                      <Tooltip cursor={{fill: '#f1f5f9'}} formatter={(value) => `${value}%`} />
                      <Legend iconType="circle" />
                      <Bar dataKey="valorA" name={dadosA.nomeUniversidade} fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="valorB" name={dadosB.nomeUniversidade} fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Distribuição por Raça/Cor (%)</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mesclarDadosDemografia(dadosA.distribuicaoRaca, dadosB.distribuicaoRaca)} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                      <XAxis dataKey="nome" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
                      <Tooltip cursor={{fill: '#f1f5f9'}} formatter={(value) => `${value}%`} />
                      <Legend iconType="circle" />
                      <Bar dataKey="valorA" name={dadosA.nomeUniversidade} fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="valorB" name={dadosB.nomeUniversidade} fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm col-span-1 lg:col-span-2">
                <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Faixa Etária dos Docentes</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mesclarDadosContagem(dadosA.distribuicaoFaixaEtaria, dadosB.distribuicaoFaixaEtaria)} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                      <XAxis dataKey="nome" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: '#f1f5f9'}} />
                      <Legend iconType="circle" />
                      <Bar dataKey="valorA" name={dadosA.nomeUniversidade} fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="valorB" name={dadosB.nomeUniversidade} fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <ListaTop 
                titulo="Top 5 Áreas de Avaliação (CAPES)" 
                icone={Trophy}
                dadosA={dadosA.topAreasAvaliacao} 
                dadosB={dadosB.topAreasAvaliacao}
                nomeA={dadosA.nomeUniversidade}
                nomeB={dadosB.nomeUniversidade}
              />

              <ListaTop 
                titulo="Top 5 Países de Nascimento (Comunidade Lattes)" 
                icone={Globe}
                dadosA={dadosA.topPaisesNascimento} 
                dadosB={dadosB.topPaisesNascimento}
                nomeA={dadosA.nomeUniversidade}
                nomeB={dadosB.nomeUniversidade}
              />

              <ListaTop 
                titulo="Top 5 Grandes Áreas do Conhecimento" 
                icone={Library}
                dadosA={dadosA.topGrandesAreasConhecimento} 
                dadosB={dadosB.topGrandesAreasConhecimento}
                nomeA={dadosA.nomeUniversidade}
                nomeB={dadosB.nomeUniversidade}
              />

              <div className="bg-white p-6 rounded-2xl shadow-sm col-span-1 lg:col-span-2">
                <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Notas dos Programas (Conceito CAPES)</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mesclarDadosContagem(dadosA.distribuicaoConceitoPrograma, dadosB.distribuicaoConceitoPrograma)} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                      <XAxis dataKey="nome" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: '#f1f5f9'}} />
                      <Legend iconType="circle" />
                      <Bar dataKey="valorA" name={dadosA.nomeUniversidade} fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="valorB" name={dadosB.nomeUniversidade} fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <ListaTop 
                titulo="Top 5 Instituições Empregadoras (Onde atuam hoje?)" 
                icone={Building2}
                dadosA={dadosA.topInstituicoesAtuacao} 
                dadosB={dadosB.topInstituicoesAtuacao}
                nomeA={dadosA.nomeUniversidade}
                nomeB={dadosB.nomeUniversidade}
              />

              <ListaTop 
                titulo="Top 5 Países de Atuação (Egressos/Pesquisadores)" 
                icone={PlaneTakeoff}
                dadosA={dadosA.topPaisesAtuacao} 
                dadosB={dadosB.topPaisesAtuacao}
                nomeA={dadosA.nomeUniversidade}
                nomeB={dadosB.nomeUniversidade}
              />

            </div>
          </div>
        )}
      </div>
    </div>
  );
}