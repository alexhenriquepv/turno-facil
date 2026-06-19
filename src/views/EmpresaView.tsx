import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { LayoutDashboard, Briefcase, MapPin, User } from 'lucide-react';
import { EmpresaDashboard } from './empresa/EmpresaDashboard';
import { EmpresaDemandas } from './empresa/EmpresaDemandas';
import { EmpresaEnderecos } from './empresa/EmpresaEnderecos';
import { EmpresaPerfil } from './empresa/EmpresaPerfil';

const { Sider, Content } = Layout;

type MenuKey = 'dashboard' | 'demandas' | 'enderecos' | 'perfil';

export const EmpresaView: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<MenuKey>('dashboard');

  const menuItems = [
    {
      key: 'dashboard',
      icon: <LayoutDashboard size={18} />,
      label: 'Dashboard',
    },
    {
      key: 'demandas',
      icon: <Briefcase size={18} />,
      label: 'Minhas Vagas',
    },
    {
      key: 'enderecos',
      icon: <MapPin size={18} />,
      label: 'Locais / Filiais',
    },
    {
      key: 'perfil',
      icon: <User size={18} />,
      label: 'Meu Perfil',
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
        return <EmpresaDashboard />;
      case 'demandas':
        return <EmpresaDemandas />;
      case 'enderecos':
        return <EmpresaEnderecos />;
      case 'perfil':
        return <EmpresaPerfil />;
      default:
        return <EmpresaDashboard />;
    }
  };

  return (
    <Layout className="min-h-[calc(100vh-64px)] bg-gray-50">
      <Sider 
        width={250} 
        theme="light"
        className="border-r border-gray-200"
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-gray-500 font-semibold text-xs uppercase tracking-wider">Menu da Empresa</h3>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={(e) => setSelectedKey(e.key as MenuKey)}
          items={menuItems}
          className="border-r-0 font-medium text-gray-600"
        />
      </Sider>
      <Layout>
        <Content className="overflow-y-auto">
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};
