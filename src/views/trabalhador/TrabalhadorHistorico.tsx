import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { format, parseISO } from 'date-fns';
import { Clock } from 'lucide-react';

export const TrabalhadorHistorico: React.FC = () => {
  const { vagas, trabalhadorLogado } = useAppStore();

  const vagasFechadas = vagas.filter(v => v.status !== 'Buscando...' && v.trabalhadorId === trabalhadorLogado.id);
  const vagasRecusadas = vagas.filter(v => v.candidatosRecusadosIds?.includes(trabalhadorLogado.id));

  const historico = [
    ...vagasFechadas.map(v => ({ ...v, tipoHistorico: 'concluida' })),
    ...vagasRecusadas.map(v => ({ ...v, tipoHistorico: 'recusada' }))
  ].sort((a, b) => new Date(b.dataHoraInicio).getTime() - new Date(a.dataHoraInicio).getTime());

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto pb-20">
      <div className="bg-white p-5 shadow-sm sticky top-0 z-10 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800">Histórico de Atividades</h1>
        <p className="text-sm text-gray-500 mt-1">Veja as vagas concluídas e recusadas.</p>
      </div>

      <div className="p-4">
        {historico.length === 0 ? (
          <div className="text-center p-6 bg-white rounded-xl border border-gray-100 mt-4 shadow-sm">
            <div className="text-gray-400 mb-2 text-3xl">📝</div>
            <p className="text-gray-500 font-medium text-sm">Seu histórico está vazio.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {historico.map(vaga => (
              <div 
                key={`${vaga.id}-${vaga.tipoHistorico}`} 
                className={`bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-2 relative overflow-hidden ${vaga.tipoHistorico === 'recusada' ? 'border-red-100 opacity-80' : 'border-green-100'}`}
              >
                <div className={`absolute top-0 left-0 w-1.5 h-full ${vaga.tipoHistorico === 'recusada' ? 'bg-red-400' : 'bg-green-500'}`}></div>
                
                <div className="flex justify-between items-start pl-2">
                  <div>
                    <h4 className={`font-bold leading-tight ${vaga.tipoHistorico === 'recusada' ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                      {vaga.funcao}
                    </h4>
                    <p className="text-xs text-gray-500 font-medium mt-1">{vaga.nomeEmpresa}</p>
                  </div>
                  
                  {vaga.tipoHistorico === 'concluida' ? (
                    <div className="text-right">
                      <span className="block text-xs text-green-600 font-bold uppercase">Concluída</span>
                      <span className="block font-black text-green-700">R$ {vaga.valor.toFixed(0)}</span>
                    </div>
                  ) : (
                    <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Recusada</span>
                  )}
                </div>

                <div className="pl-2 pt-2 border-t border-gray-50 flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Clock size={12} /> {format(parseISO(vaga.dataHoraInicio), "dd/MM/yyyy")}</span>
                  {vaga.tipoHistorico === 'concluida' && vaga.avaliacaoTrabalhador && (
                    <span className="flex items-center gap-1 font-bold text-yellow-500"><span className="text-lg leading-none">★</span> {vaga.avaliacaoTrabalhador}.0</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
