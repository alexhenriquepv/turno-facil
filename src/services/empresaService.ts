import { useAppStore } from '../store/useAppStore';
import type { Endereco, Empresa, Vaga } from '../store/useAppStore';

/**
 * Serviço que simula chamadas assíncronas para a API (Back-end)
 * No futuro, basta substituir o interior destas funções por chamadas reais (ex: fetch, axios).
 */
export const EmpresaService = {
  
  // ==========================
  // DASHBOARD
  // ==========================
  getDashboardMetrics: async () => {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const state = useAppStore.getState();
    const vagasDaEmpresa = state.vagas.filter(v => v.empresaId === state.empresaLogada.id);
    
    const vagasAtivas = vagasDaEmpresa.filter(v => v.status === 'Buscando...').length;
    const vagasPreenchidas = vagasDaEmpresa.filter(v => v.status === 'Preenchida' || v.status === 'Preenchida por Operador').length;
    const totalVagas = vagasDaEmpresa.length;
    const gastoEstimadoMensal = vagasDaEmpresa.reduce((acc, vaga) => acc + (vaga.valor * vaga.quantidade), 0);

    return {
      vagasAtivas,
      vagasPreenchidas,
      totalVagas,
      gastoEstimadoMensal
    };
  },

  // ==========================
  // ENDEREÇOS
  // ==========================
  listarEnderecos: async (): Promise<Endereco[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return useAppStore.getState().empresaLogada.enderecos;
  },

  cadastrarEndereco: async (endereco: Omit<Endereco, 'id'>) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    useAppStore.getState().adicionarEndereco(endereco);
  },

  // ==========================
  // PERFIL
  // ==========================
  atualizarPerfil: async (perfil: Partial<Empresa>) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    useAppStore.getState().atualizarPerfilEmpresa(perfil);
  },

  // ==========================
  // DEMANDAS / VAGAS
  // ==========================
  criarVaga: async (vaga: Omit<Vaga, 'id' | 'status' | 'empresaId' | 'nomeEmpresa' | 'candidatosIds'>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    useAppStore.getState().adicionarVaga(vaga);
  },

  aprovarCandidato: async (vagaId: string, trabalhadorId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    useAppStore.getState().aprovarCandidato(vagaId, trabalhadorId);
  },

  recusarCandidato: async (vagaId: string, trabalhadorId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    useAppStore.getState().recusarCandidato(vagaId, trabalhadorId);
  },

  avaliarTrabalhador: async (vagaId: string, nota: number, comentario: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    useAppStore.getState().avaliarTrabalhador(vagaId, nota, comentario);
  }
};
