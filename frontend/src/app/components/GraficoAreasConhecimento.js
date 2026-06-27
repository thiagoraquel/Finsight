'use client';

import { useEffect, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function GraficoAreasConhecimento() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/docentes/areas')
      .then(res => res.json())
      .then(data => setDados(data))
      .catch(err => console.error("Erro ao buscar dados de docentes:", err));
  }, []);

  return (
    <div style={{ width: '100%', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eaeaea', marginTop: '30px' }}>
      <h2 style={{ textAlign: 'center', fontFamily: 'sans-serif', color: '#333', marginBottom: '20px' }}>
        Top 8 Áreas de Conhecimento (CAPES)
      </h2>
      
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dados}>
          <PolarGrid />
          <PolarAngleAxis dataKey="area" tick={{fontSize: 10, fill: '#666'}} />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
          <Radar 
            name="Docentes" 
            dataKey="quantidade" 
            stroke="#ff7300" 
            fill="#ff7300" 
            fillOpacity={0.6} 
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}