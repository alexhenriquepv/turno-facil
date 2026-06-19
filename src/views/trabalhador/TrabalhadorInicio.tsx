import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ShieldCheck, CheckCircle, Clock, Building, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { format, parseISO, isAfter } from 'date-fns';

interface TrabalhadorInicioProps {
  onNavigate: (tab: 'feed') => void;
}

export const TrabalhadorInicio: React.FC<TrabalhadorInicioProps> = ({ onNavigate }) => {
  const { trabalhadorLogado, vagas, empresaLogada } = useAppStore();

  const ganhosMensais = vagas
    .filter(v => v.status === 'Preenchida' && v.trabalhadorId === trabalhadorLogado.id)
    .reduce((total, vaga) => total + vaga.valor, 0);

  const iniciais = trabalhadorLogado.nome.split(' ').map(n => n[0]).join('').substring(0, 2);

  // Próximos serviços (Aprovados mas ainda não aconteceram ou estão rolando)
  const agora = new Date();
  const proximosServicos = vagas
    .filter(v => 
      v.trabalhadorId === trabalhadorLogado.id && 
      (v.status === 'Preenchida' || v.status === 'Preenchida por Operador') &&
      isAfter(parseISO(v.dataHoraFim), agora)
    )
    .sort((a, b) => new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime());

  const getBairroDisplay = (endId: string) => {
    const end = empresaLogada.enderecos.find(e => e.id === endId);
    return end ? end.bairro : endId;
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-20">
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

        {/* Resumo do mês */}
        <div className="bg-white/10 rounded-2xl p-4 border border-white/10 flex justify-between items-center backdrop-blur-sm shadow-sm">
          <div>
            <p className="text-purple-200 text-[10px] uppercase font-bold tracking-wider mb-1">Ganhos neste mês</p>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-purple-200">R$</span>
              <h2 className="text-3xl font-black leading-none">{ganhosMensais.toFixed(2)}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 mt-2">
        <h2 className="text-base font-bold text-gray-800 px-1 mb-3">Seus Próximos Serviços</h2>
        
        {proximosServicos.length > 0 ? (
          <div className="flex flex-col gap-3">
            {proximosServicos.map(vaga => (
              <div key={vaga.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm border-l-4 border-l-green-500">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800">{vaga.funcao}</h3>
                  <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Confirmado</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center text-gray-600 text-xs font-medium">
                    <Building size={14} className="mr-2 text-purple-500" />
                    <span>{vaga.nomeEmpresa}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-xs font-medium">
                    <Calendar size={14} className="mr-2 text-purple-500 min-w-max" />
                    <span>{format(parseISO(vaga.dataHoraInicio), "dd/MM/yyyy")}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-xs font-medium">
                    <Clock size={14} className="mr-2 text-purple-500 min-w-max" />
                    <span>{format(parseISO(vaga.dataHoraInicio), "HH:mm")} às {format(parseISO(vaga.dataHoraFim), "HH:mm")}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-xs font-medium">
                    <MapPin size={14} className="mr-2 text-purple-500" />
                    <span>{getBairroDisplay(vaga.enderecoId)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="text-purple-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Agenda Livre</h3>
            <p className="text-sm text-gray-500 mb-4">Você não tem nenhum serviço agendado para os próximos dias.</p>
            
            <button 
              onClick={() => onNavigate('feed')}
              className="bg-purple-600 text-white font-bold py-2.5 px-6 rounded-lg text-sm shadow-md inline-flex items-center gap-2"
            >
              Procurar Vagas <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
