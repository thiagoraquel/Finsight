'use client';

import GraficoGenero from './GraficoGenero';
import GraficoTopInstituicoes from './GraficoTopInstituicoes';
import GraficoTiposArtigo from './GraficoTiposArtigo';
import GraficoAreasConhecimento from './GraficoAreasConhecimento';

export default function DashboardGraficos() {
  return (
    <div>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Visão Geral dos Dados</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '30px' 
      }}>
        <GraficoGenero />
        <GraficoTopInstituicoes />
        <GraficoTiposArtigo />
        <GraficoAreasConhecimento />
      </div>
    </div>
  );
}