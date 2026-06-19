import React, { useState } from 'react';
import { TrabalhadorInicio } from './trabalhador/TrabalhadorInicio';
import { TrabalhadorFeed } from './trabalhador/TrabalhadorFeed';
import { TrabalhadorHistorico } from './trabalhador/TrabalhadorHistorico';
import { TrabalhadorPerfil } from './trabalhador/TrabalhadorPerfil';
import { Home, Briefcase, Clock, User } from 'lucide-react';

type Tab = 'inicio' | 'feed' | 'historico' | 'perfil';

export const TrabalhadorView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('inicio');

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return <TrabalhadorInicio onNavigate={setActiveTab} />;
      case 'feed':
        return <TrabalhadorFeed />;
      case 'historico':
        return <TrabalhadorHistorico />;
      case 'perfil':
        return <TrabalhadorPerfil />;
      default:
        return <TrabalhadorInicio onNavigate={setActiveTab} />;
    }
  };

  const navItems = [
    { id: 'inicio', label: 'Início', icon: <Home size={20} /> },
    { id: 'feed', label: 'Vagas', icon: <Briefcase size={20} /> },
    { id: 'historico', label: 'Histórico', icon: <Clock size={20} /> },
    { id: 'perfil', label: 'Perfil', icon: <User size={20} /> },
  ] as const;

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-64px)] flex justify-center">
      {/* Mobile Container */}
      <div className="w-full max-w-md bg-white min-h-[calc(100vh-64px)] relative flex flex-col shadow-2xl overflow-hidden">
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {renderContent()}
        </div>

        {/* Bottom Navigation Bar */}
        <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-200 px-2 pb-safe pt-2 z-50 flex justify-between">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`flex-1 flex flex-col items-center justify-center py-2 gap-1 transition-colors ${
                  isActive ? 'text-purple-700' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
