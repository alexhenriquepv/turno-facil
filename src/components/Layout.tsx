
import { useAppStore } from '../store/useAppStore';
import type { Persona } from '../store/useAppStore';
import { Dropdown, Typography, Layout as AntLayout } from 'antd';
import type { MenuProps } from 'antd';
import { Briefcase, User, ShieldCheck, ChevronDown } from 'lucide-react';

const { Header, Content } = AntLayout;
const { Title } = Typography;

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { personaAtual, mudarPersona } = useAppStore();

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    mudarPersona(e.key as Persona);
  };

  const items: MenuProps['items'] = [
    {
      label: 'Empresa',
      key: 'empresa',
      icon: <Briefcase size={16} />,
    },
    {
      label: 'Trabalhador',
      key: 'trabalhador',
      icon: <User size={16} />,
    },
    {
      label: 'Operador (Plataforma)',
      key: 'operador',
      icon: <ShieldCheck size={16} />,
    },
  ];

  const getPersonaLabel = () => {
    switch (personaAtual) {
      case 'empresa': return 'Empresa';
      case 'trabalhador': return 'Trabalhador';
      case 'operador': return 'Operador (Plataforma)';
      default: return 'Selecione';
    }
  };

  const getPageTitle = () => {
    switch (personaAtual) {
      case 'empresa': return 'Portal da Empresa';
      case 'trabalhador': return 'Turno Fácil';
      case 'operador': return 'Backoffice Operacional (Plataforma)';
      default: return 'Turno Fácil';
    }
  };

  return (
    <AntLayout className="min-h-screen bg-gray-50">
      <Header className="bg-white px-6 flex items-center justify-between border-b border-gray-200 sticky top-0 z-50 shadow-sm h-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <Title level={4} style={{ margin: 0, color: '#6b21a8' }} className="tracking-tight hidden sm:block">
            {getPageTitle()}
          </Title>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm hidden sm:inline-block">Visualizar como:</span>
          <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={['click']}>
            <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border-none cursor-pointer">
              {getPersonaLabel()} <ChevronDown size={14} />
            </button>
          </Dropdown>
        </div>
      </Header>
      <Content className="p-0 m-0 w-full overflow-x-hidden">
        {children}
      </Content>
    </AntLayout>
  );
};
