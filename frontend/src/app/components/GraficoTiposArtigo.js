'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function GraficoTiposArtigo() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/artigos/tipos')
      .then(res => res.json())
      .then(data => setDados(data))
      .catch(err => console.error("Erro ao buscar dados de artigos:", err));
  }, []);

  const CORES = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  return (
    <div style={{ width: '100%', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eaeaea', marginTop: '30px' }}>
      <h2 style={{ textAlign: 'center', fontFamily: 'sans-serif', color: '#333', marginBottom: '20px' }}>
        Distribuição por Tipo de Publicação
      </h2>
      
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={dados}
            dataKey="quantidade"
            nameKey="tipo"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            fill="#8884d8"
            paddingAngle={5}
            label
          >
            {dados.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}