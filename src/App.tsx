
import { Layout } from './components/Layout';
import { useAppStore } from './store/useAppStore';
import { EmpresaView } from './views/EmpresaView';
import { TrabalhadorView } from './views/TrabalhadorView';
import { OperadorView } from './views/OperadorView';

function App() {
  const personaAtual = useAppStore(state => state.personaAtual);

  const renderView = () => {
    switch (personaAtual) {
      case 'empresa': return <EmpresaView />;
      case 'trabalhador': return <TrabalhadorView />;
      case 'operador': return <OperadorView />;
      default: return <EmpresaView />;
    }
  };

  return (
    <Layout>
      {renderView()}
    </Layout>
  );
}

export default App;
