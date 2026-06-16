import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { MapPin, Clock, CheckCircle, X, Building, ShieldCheck, DollarSign, List, Map as MapIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { MapaVagas } from '../components/MapaVagas';

export const TrabalhadorView: React.FC = () => {
  const { vagas, candidatarVaga, trabalhadorLogado, empresaLogada } = useAppStore();
  const [viewMode, setViewMode] = useState<'lista' | 'mapa'>('lista');

  const vagasDisponiveis = vagas.filter(v => v.status === 'Buscando...' && !v.candidatosRecusadosIds?.includes(trabalhadorLogado.id));
  const vagasFechadas = vagas.filter(v => v.status !== 'Buscando...' && v.trabalhadorId === trabalhadorLogado.id);
  const vagasRecusadas = vagas.filter(v => v.candidatosRecusadosIds?.includes(trabalhadorLogado.id));

  const historico = [
    ...vagasFechadas.map(v => ({ ...v, tipoHistorico: 'concluida' })),
    ...vagasRecusadas.map(v => ({ ...v, tipoHistorico: 'recusada' }))
  ].sort((a, b) => new Date(b.dataHoraInicio).getTime() - new Date(a.dataHoraInicio).getTime());

  const ganhosMensais = vagasFechadas.reduce((total, vaga) => total + vaga.valor, 0);

  // Mock function to resolve address for display
  const getBairroDisplay = (endId: string) => {
    // In a real app we'd fetch all addresses, here we only have the logged-in company's addresses easily available
    const end = empresaLogada.enderecos.find(e => e.id === endId);
    return end ? end.bairro : 'Manaus';
  };

  const iniciais = trabalhadorLogado.nome.split(' ').map(n => n[0]).join('').substring(0, 2);

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-64px)] flex justify-center">
      <div className="w-full max-w-md bg-white min-h-full shadow-xl overflow-hidden flex flex-col">
        
        {/* Dynamic Header with Verification & Earnings */}
        <div className="bg-purple-800 text-white p-5 rounded-b-3xl shadow-md z-10 relative">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold leading-tight">Olá, {trabalhadorLogado.nome.split(' ')[0]}!</h1>
                {trabalhadorLogado.status === 'Aprovado' && (
                  <ShieldCheck size={20} className="text-green-400" />
                )}
              </div>
              <p className="text-purple-200 text-xs mt-1 font-medium flex items-center gap-1.5">
                {trabalhadorLogado.status === 'Aprovado' ? (
                  <><CheckCircle size={12} className="text-green-400" /> Perfil Verificado</>
                ) : (
                  <><Clock size={12} className="text-yellow-400" /> Aguardando Verificação</>
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center border-2 border-purple-400 shadow-inner">
              <span className="font-bold text-lg">{iniciais}</span>
            </div>
          </div>

          {/* Earnings Card */}
          <div className="bg-white/10 rounded-2xl p-4 border border-white/10 flex justify-between items-center backdrop-blur-sm shadow-sm">
            <div>
              <p className="text-purple-200 text-[10px] uppercase font-bold tracking-wider mb-1">Ganhos Acumulados</p>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-purple-200">R$</span>
                <h2 className="text-3xl font-black leading-none">{ganhosMensais.toFixed(2)}</h2>
              </div>
            </div>
            <div className="bg-green-400/20 text-green-300 p-2.5 rounded-xl border border-green-400/30">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          
          <div className="flex justify-between items-center mb-4 mt-2">
            <h2 className="text-base font-bold text-gray-800 px-1">Oportunidades Disponíveis</h2>
            
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('lista')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${viewMode === 'lista' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500'}`}
              >
                <List size={14} /> Lista
              </button>
              <button 
                onClick={() => setViewMode('mapa')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${viewMode === 'mapa' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500'}`}
              >
                <MapIcon size={14} /> Mapa
              </button>
            </div>
          </div>
          
          {vagasDisponiveis.length === 0 ? (
            <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100 mt-2">
              <div className="text-gray-400 mb-2 text-3xl">😴</div>
              <p className="text-gray-500 font-medium text-sm">Nenhuma vaga nova no momento.</p>
            </div>
          ) : (
            viewMode === 'mapa' ? (
              <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <MapaVagas />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {vagasDisponiveis.map(vaga => {
                  const jaCandidatou = vaga.candidatosIds.includes(trabalhadorLogado.id);

                  return (
                  <div key={vaga.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
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
                          className="bg-gray-200 text-gray-500 font-bold py-2.5 px-4 rounded-lg text-sm shadow-sm flex items-center cursor-not-allowed"
                        >
                          Enviada
                        </button>
                      ) : (
                        <button 
                          onClick={() => candidatarVaga(vaga.id, trabalhadorLogado.id)}
                          className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-transform active:scale-95 shadow-md flex items-center"
                        >
                          Candidatar-se
                        </button>
                      )}
                    </div>
                  </div>
                )})}
              </div>
            )
          )}

          {historico.length > 0 && (
            <div className="mt-8 mb-4">
              <h2 className="text-base font-bold text-gray-400 mb-3 px-1">Histórico de Atividades</h2>
              <div className="flex flex-col gap-3 opacity-70">
                {historico.map(vaga => (
                  <div key={`${vaga.id}-${vaga.tipoHistorico}`} className={`bg-gray-50 border rounded-xl p-3 flex justify-between items-center ${vaga.tipoHistorico === 'recusada' ? 'border-red-100 opacity-80' : 'border-gray-200'}`}>
                    <div>
                      <h4 className={`font-bold text-sm leading-tight ${vaga.tipoHistorico === 'recusada' ? 'text-gray-500 line-through' : 'text-gray-700'}`}>{vaga.funcao}</h4>
                      <p className="text-[10px] text-gray-500 font-medium mt-1">{vaga.nomeEmpresa} - {format(parseISO(vaga.dataHoraInicio), "dd/MM/yyyy")}</p>
                    </div>
                    {vaga.tipoHistorico === 'concluida' ? (
                      <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                        <CheckCircle size={14} className="mr-1.5" />
                        <span className="text-xs font-bold flex gap-1">Concluída <span className="text-green-800">(+ R$ {vaga.valor.toFixed(0)})</span></span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500 bg-red-50 px-2 py-1 rounded-lg">
                        <X size={14} className="mr-1.5" />
                        <span className="text-xs font-bold">Recusada</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
