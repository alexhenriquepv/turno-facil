import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ShieldCheck, Star, Briefcase, ChevronRight, User } from 'lucide-react';
import { Select, Button, message } from 'antd';
import { TrabalhadorService } from '../../services/trabalhadorService';

const funcoesDisponiveis = [
  'Garçom', 'Barman', 'Recepcionista', 'Vigilante', 'Auxiliar de Limpeza', 'Cozinheiro'
];

export const TrabalhadorPerfil: React.FC = () => {
  const { trabalhadorLogado } = useAppStore();
  const [funcoes, setFuncoes] = useState<string[]>(trabalhadorLogado.funcoes);
  const [loading, setLoading] = useState(false);

  const handleSalvarFuncoes = async () => {
    setLoading(true);
    await TrabalhadorService.atualizarFuncoes(funcoes);
    setLoading(false);
    message.success('Suas funções foram atualizadas com sucesso!');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto pb-20">
      
      {/* Header Profile */}
      <div className="bg-purple-800 text-white p-6 pt-8 pb-10 rounded-b-3xl relative">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center border-4 border-purple-400 shadow-md mb-3">
            <User size={36} className="text-purple-200" />
          </div>
          <h2 className="text-xl font-bold">{trabalhadorLogado.nome}</h2>
          <div className="flex items-center gap-1.5 mt-1 text-purple-200 text-sm">
            {trabalhadorLogado.status === 'Aprovado' ? (
              <><ShieldCheck size={16} className="text-green-400" /> Conta Verificada</>
            ) : (
              <span className="text-yellow-400 font-medium">Aguardando Verificação</span>
            )}
          </div>
        </div>
      </div>

      {/* Score Card (Float over border) */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2.5 rounded-full">
              <Star className="text-yellow-500 fill-yellow-500" size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Score de Confiabilidade</p>
              <h3 className="text-xl font-black text-gray-800 leading-none mt-1">{trabalhadorLogado.score} <span className="text-sm font-medium text-gray-400">/100</span></h3>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 mt-2 flex flex-col gap-4">
        {/* Settings Block */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Briefcase size={18} className="text-purple-500" /> Meus Perfis de Atuação
            </h3>
          </div>
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            Selecione em quais funções você tem experiência para atuar. Você receberá vagas direcionadas a esses perfis.
          </p>
          
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Selecione as funções"
            value={funcoes}
            onChange={setFuncoes}
            options={funcoesDisponiveis.map(f => ({ value: f, label: f }))}
            size="large"
            className="mb-4"
          />

          <Button 
            type="primary" 
            block 
            size="large"
            loading={loading}
            onClick={handleSalvarFuncoes}
            className="bg-purple-600 hover:bg-purple-700 font-bold h-12"
          >
            Salvar Perfis
          </Button>
        </div>

        {/* Informações Extras */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-left border-b border-gray-50">
            <span className="font-medium text-gray-700">Dados Pessoais e Bancários</span>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
          <button className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-left border-b border-gray-50">
            <span className="font-medium text-gray-700">Ajuda e Suporte</span>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
          <button className="w-full p-4 flex justify-between items-center hover:bg-red-50 transition-colors text-left">
            <span className="font-medium text-red-600">Sair da Conta</span>
          </button>
        </div>
      </div>

    </div>
  );
};
