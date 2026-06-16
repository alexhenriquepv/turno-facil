import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useAppStore } from '../store/useAppStore';
import L from 'leaflet';
import { Briefcase, Building, Clock } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import { format, parseISO } from 'date-fns';

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

const vagaIconHtml = renderToString(
  <div className="bg-purple-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white flex items-center justify-center" style={{ width: '32px', height: '32px' }}>
    <Briefcase size={16} />
  </div>
);

const vagaIcon = L.divIcon({
  html: vagaIconHtml,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

export const MapaVagas: React.FC = () => {
  const { vagas, empresaLogada, candidatarVaga, trabalhadorLogado } = useAppStore();

  const vagasDisponiveis = vagas.filter(v => v.status === 'Buscando...' && !v.candidatosRecusadosIds?.includes(trabalhadorLogado.id));
  
  // Foco inicial em Manaus
  const position: [number, number] = [-3.1190, -60.0217];

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
      <MapContainer center={position} zoom={12} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {vagasDisponiveis.map(vaga => {
          const endereco = empresaLogada.enderecos.find(e => e.id === vaga.enderecoId);
          if (!endereco) return null;

          const jaCandidatou = vaga.candidatosIds.includes(trabalhadorLogado.id);

          return (
            <Marker key={vaga.id} position={[endereco.lat, endereco.lng]} icon={vagaIcon}>
              <Popup className="vaga-popup">
                <div className="p-1 w-[200px]">
                  <strong className="block text-gray-800 text-lg leading-tight mb-1">{vaga.funcao}</strong>
                  <div className="flex items-center text-gray-500 text-xs mb-1">
                    <Building size={12} className="mr-1 text-purple-500" />
                    {vaga.nomeEmpresa}
                  </div>
                  <div className="flex items-center text-gray-500 text-xs mb-2">
                    <Clock size={12} className="mr-1 text-purple-500" />
                    {format(parseISO(vaga.dataHoraInicio), "dd/MM HH:mm")}
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Diária</span>
                    <span className="text-sm font-black text-gray-900 leading-none">R$ {vaga.valor.toFixed(2)}</span>
                  </div>

                  {jaCandidatou ? (
                    <button 
                      disabled
                      className="w-full bg-gray-200 text-gray-500 font-bold py-1.5 px-3 rounded text-xs shadow-sm flex items-center justify-center cursor-not-allowed"
                    >
                      Candidatura Enviada
                    </button>
                  ) : (
                    <button 
                      onClick={() => candidatarVaga(vaga.id, trabalhadorLogado.id)}
                      className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold py-1.5 px-3 rounded text-xs transition-transform active:scale-95 shadow-md flex items-center justify-center"
                    >
                      Candidatar-se
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
