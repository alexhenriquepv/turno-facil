import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useAppStore } from '../store/useAppStore';
import L from 'leaflet';
import { Building2, Star } from 'lucide-react';
import { renderToString } from 'react-dom/server';

// Fix Leaflet icons in React with Vite
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const companyIconHtml = renderToString(
  <div className="bg-red-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white flex items-center justify-center" style={{ width: '32px', height: '32px' }}>
    <Building2 size={16} />
  </div>
);

const companyIcon = L.divIcon({
  html: companyIconHtml,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

interface MapaTrabalhadoresProps {
  candidatosFiltradosIds?: string[];
}

export const MapaTrabalhadores: React.FC<MapaTrabalhadoresProps> = ({ candidatosFiltradosIds }) => {
  const { trabalhadoresPendentes, empresaLogada } = useAppStore();

  const trabalhadoresExibidos = candidatosFiltradosIds 
    ? trabalhadoresPendentes.filter(t => candidatosFiltradosIds.includes(t.id))
    : trabalhadoresPendentes;

  // Foco em Manaus
  const position: [number, number] = [-3.1190, -60.0217];

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
      <MapContainer center={position} zoom={12} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Renderiza as unidades da Empresa logada */}
        {empresaLogada.enderecos.map(end => (
          <Marker key={end.id} position={[end.lat, end.lng]} icon={companyIcon}>
            <Popup>
              <div className="text-center p-1">
                <span className="bg-red-100 text-red-800 text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider mb-2 inline-block">Unidade da Empresa</span>
                <strong className="block text-gray-800 text-lg leading-tight">{empresaLogada.nome}</strong>
                <span className="text-sm text-gray-600 block mt-1">{end.nome}</span>
                <span className="text-xs text-gray-500 block">{end.bairro}</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Renderiza os trabalhadores */}
        {trabalhadoresExibidos.map(trabalhador => {
          const scoreColor = trabalhador.score >= 90 ? 'bg-green-100 text-green-700 border-green-200' : 
                             trabalhador.score >= 70 ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 
                             'bg-red-100 text-red-700 border-red-200';
          
          return (
          <Marker key={trabalhador.id} position={[trabalhador.lat, trabalhador.lng]}>
            <Popup>
              <div className="text-center p-1">
                <strong className="block text-gray-800 text-lg mb-1">{trabalhador.nome}</strong>
                <span className="text-sm text-purple-600 font-medium block mb-2">
                  {trabalhador.funcoes.join(', ')}
                </span>
                
                <div className="flex gap-2 justify-center items-center">
                  <span className={`text-xs px-2 py-1 rounded font-bold ${
                    trabalhador.status === 'Aprovado' ? 'bg-indigo-100 text-indigo-700' : 
                    trabalhador.status === 'Rejeitado' ? 'bg-gray-100 text-gray-700' : 
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {trabalhador.status}
                  </span>
                  
                  <span className={`text-xs px-2 py-1 rounded font-bold inline-flex items-center gap-1 border ${scoreColor}`} title="Score de Confiabilidade">
                    <Star size={10} className={trabalhador.score >= 90 ? 'fill-green-600' : trabalhador.score >= 70 ? 'fill-yellow-600' : 'fill-red-600'} />
                    {trabalhador.score}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        )})}
      </MapContainer>
    </div>
  );
};
