import { useState } from 'react';
import { Layout, Menu, Drawer } from 'antd';
import { useAppStore } from '../store/useAppStore';
import { LayoutDashboard, Briefcase, Users, UserCheck, ShieldCheck } from 'lucide-react';
import { OperadorDashboard } from './operador/OperadorDashboard';
import { OperadorDemandas } from './operador/OperadorDemandas';
import { OperadorTrabalhadores } from './operador/OperadorTrabalhadores';
import { OperadorEmpresas } from './operador/OperadorEmpresas';
import { OperadorUsuarios } from './operador/OperadorUsuarios';

const { Sider, Content } = Layout;

type MenuKey = 'dashboard' | 'demandas' | 'trabalhadores' | 'empresas' | 'usuarios';

export const OperadorView: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<MenuKey>('dashboard');
  const { isMobileMenuOpen, setMobileMenuOpen } = useAppStore();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <LayoutDashboard size={18} />,
      label: 'Dashboard',
    },
    {
      key: 'demandas',
      icon: <Briefcase size={18} />,
      label: 'Monitoramento de Vagas',
    },
    {
      key: 'trabalhadores',
      icon: <UserCheck size={18} />,
      label: 'Trabalhadores',
    },
    {
      key: 'empresas',
      icon: <Users size={18} />,
      label: 'Empresas',
    },
    {
      key: 'usuarios',
      icon: <ShieldCheck size={18} />,
      label: 'Usuários (Backoffice)',
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
        return <OperadorDashboard />;
      case 'demandas':
        return <OperadorDemandas />;
      case 'trabalhadores':
        return <OperadorTrabalhadores />;
      case 'empresas':
        return <OperadorEmpresas />;
      case 'usuarios':
        return <OperadorUsuarios />;
      default:
        return <OperadorDashboard />;
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
        trigger={null}
      >
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-gray-500 font-semibold text-xs uppercase tracking-wider">Menu Principal</h3>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={(e) => setSelectedKey(e.key as MenuKey)}
          items={menuItems}
          className="border-r-0 font-medium text-gray-600"
        />
      </Sider>

      <Drawer
        title="Menu Principal"
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        styles={{ body: { padding: 0 } }}
        width={250}
        className="lg:hidden"
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={(e) => {
            setSelectedKey(e.key as MenuKey);
            setMobileMenuOpen(false);
          }}
          items={menuItems}
          className="border-r-0 font-medium text-gray-600 h-full"
        />
      </Drawer>

      <Layout className="w-full">
        <Content className="overflow-y-auto w-full">
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};
