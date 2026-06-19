
import { Layout } from './components/Layout';
import { useAppStore } from './store/useAppStore';
import { EmpresaView } from './views/EmpresaView';
import { TrabalhadorView } from './views/TrabalhadorView';
import { OperadorView } from './views/OperadorView';
import { LandingPage } from './views/LandingPage';

function App() {
  const { personaAtual, showLanding } = useAppStore();

  const renderView = () => {
    switch (personaAtual) {
      case 'empresa': return <EmpresaView />;
      case 'trabalhador': return <TrabalhadorView />;
      case 'operador': return <OperadorView />;
      default: return <EmpresaView />;
    }
  };

  if (showLanding) {
    return <LandingPage />;
  }

  return (
    <Layout>
      {renderView()}
    </Layout>
  );
}

export default App;
