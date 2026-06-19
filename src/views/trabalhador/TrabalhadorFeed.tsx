import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { MapPin, Clock, Building, List, Map as MapIcon, Filter } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { MapaVagas } from '../../components/MapaVagas';
import { TrabalhadorService } from '../../services/trabalhadorService';
import { Select, Button } from 'antd';

export const TrabalhadorFeed: React.FC = () => {
  const { vagas, trabalhadorLogado, empresaLogada } = useAppStore();
  const [viewMode, setViewMode] = useState<'lista' | 'mapa'>('lista');
  const [filtroFuncao, setFiltroFuncao] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const vagasAbertas = vagas.filter(v => v.status === 'Buscando...' && !v.candidatosRecusadosIds?.includes(trabalhadorLogado.id));
  
  const vagasDisponiveis = filtroFuncao 
    ? vagasAbertas.filter(v => v.funcao === filtroFuncao)
    : vagasAbertas;

  // Extrair todas as funções únicas disponíveis nas vagas abertas
  const funcoesDisponiveis = Array.from(new Set(vagasAbertas.map(v => v.funcao)));

  const getBairroDisplay = (endId: string) => {
    const end = empresaLogada.enderecos.find(e => e.id === endId);
    return end ? end.bairro : endId;
  };

  const handleCandidatar = async (vagaId: string) => {
    setLoadingId(vagaId);
    await TrabalhadorService.candidatarVaga(vagaId);
    setLoadingId(null);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50 pb-16">
      <div className="bg-white p-4 shadow-sm z-10 flex flex-col gap-3">
        <h1 className="text-xl font-bold text-gray-800">Vagas Disponíveis</h1>
        
        <div className="flex gap-2">
          <Select 
            className="flex-1"
            placeholder="Filtrar por Função"
            allowClear
            value={filtroFuncao}
            onChange={setFiltroFuncao}
            options={funcoesDisponiveis.map(f => ({ value: f, label: f }))}
            suffixIcon={<Filter size={14} className="text-gray-400" />}
          />

          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('lista')}
              className={`flex items-center justify-center p-1.5 rounded-md transition-colors ${viewMode === 'lista' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500'}`}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('mapa')}
              className={`flex items-center justify-center p-1.5 rounded-md transition-colors ${viewMode === 'mapa' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500'}`}
            >
              <MapIcon size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {vagasDisponiveis.length === 0 ? (
          <div className="text-center p-6 bg-white rounded-xl border border-gray-100 mt-4 shadow-sm">
            <div className="text-gray-400 mb-2 text-3xl">😴</div>
            <p className="text-gray-500 font-medium text-sm">Nenhuma vaga encontrada{filtroFuncao ? ' para este filtro' : ''}.</p>
          </div>
        ) : (
          viewMode === 'mapa' ? (
            <div className="h-full rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <MapaVagas />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {vagasDisponiveis.map(vaga => {
                const jaCandidatou = vaga.candidatosIds.includes(trabalhadorLogado.id);

                return (
                <div key={vaga.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${jaCandidatou ? 'bg-purple-500' : 'bg-green-500'}`}></div>
                  
                  <div className="flex justify-between items-start mb-2 pl-2">
                    <h3 className="text-lg font-bold text-gray-800 leading-tight">{vaga.funcao}</h3>
                    {!jaCandidatou && <span className="bg-green-100 text-green-800 text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">Nova</span>}
                  </div>
                  
                  <div className="space-y-2 mb-4 pl-2">
                    <div className="flex items-center text-gray-600 text-xs font-medium">
                      <Building size={14} className="mr-1.5 text-purple-500" />
                      <span>{vaga.nomeEmpresa}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-xs font-medium">
                      <Clock size={14} className="mr-1.5 text-purple-500 min-w-max" />
                      <span>{format(parseISO(vaga.dataHoraInicio), "dd/MM HH:mm")} até {format(parseISO(vaga.dataHoraFim), "HH:mm")}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-xs font-medium">
                      <MapPin size={14} className="mr-1.5 text-purple-500" />
                      <span>{getBairroDisplay(vaga.enderecoId)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-3 pl-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Diária</span>
                      <span className="text-xl font-black text-gray-900 leading-none">R$ {vaga.valor.toFixed(2)}</span>
                    </div>
                    
                    {jaCandidatou ? (
                      <button 
                        disabled
                        className="bg-gray-100 text-gray-400 font-bold py-2 px-4 rounded-lg text-sm border flex items-center cursor-not-allowed"
                      >
                        Aguardando...
                      </button>
                    ) : (
                      <Button 
                        type="primary"
                        loading={loadingId === vaga.id}
                        onClick={() => handleCandidatar(vaga.id)}
                        className="bg-purple-600 hover:bg-purple-700 border-none font-bold py-4 px-6 rounded-lg shadow-md"
                      >
                        Candidatar-se
                      </Button>
                    )}
                  </div>
                </div>
              )})}
            </div>
          )
        )}
      </div>
    </div>
  );
};
