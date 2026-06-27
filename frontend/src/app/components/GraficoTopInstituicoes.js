'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function GraficoTopInstituicoes() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/instituicoes/top-publicacoes')
      .then(res => res.json())
      .then(data => setDados(data))
      .catch(err => console.error("Erro ao buscar dados das instituições:", err));
  }, []);

  return (
    <div style={{ width: '100%', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eaeaea', marginTop: '30px' }}>
      <h2 style={{ textAlign: 'center', fontFamily: 'sans-serif', color: '#333', marginBottom: '20px' }}>
        Top 10 Instituições por Volume de Publicações
      </h2>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          layout="vertical"
          data={dados}
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }} 
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="nome" type="category" width={150} tick={{fontSize: 12}} />
          <Tooltip cursor={{fill: '#f5f5f5'}} />
          <Bar dataKey="publicacoes" fill="#4f46e5" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}