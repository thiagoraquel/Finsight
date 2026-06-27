"use client";

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function GraficoGenero() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/estatisticas/genero')
      .then(res => res.json())
      .then(data => setDados(data))
      .catch(err => console.error("Erro ao buscar dados da API:", err));
  }, []);

  const CORES = ['#FFBB28', '#0088FE', '#00C49F'];

  return (
    <div style={{ width: '100%', height: 400, backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', fontFamily: 'sans-serif', color: '#333' }}>
        Distribuição de Pesquisadores por Gênero
      </h2>
      
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={dados}
            dataKey="porcentagem"
            nameKey="genero"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label={({ name, value }) => `${name}: ${value}%`}
          >
            {dados.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}