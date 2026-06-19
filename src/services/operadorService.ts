import { useAppStore } from '../store/useAppStore';
import type { Empresa, Usuario, Trabalhador, Vaga } from '../store/useAppStore';

/**
 * OperadorService
 * 
 * Camada de abstração para chamadas da API do Backoffice Operacional.
 * Atualmente, esta camada simula chamadas assíncronas usando o estado local (Zustand).
 * No futuro, basta substituir o interior destas funções por chamadas reais (ex: fetch, axios).
 */
export const OperadorService = {
  
  // ==========================
  // DASHBOARD
  // ==========================
  getDashboardMetrics: async () => {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const state = useAppStore.getState();
    const vagasEmAberto = state.vagas.filter(v => v.status === 'Buscando...').length;
    const vagasPreenchidas = state.vagas.filter(v => v.status === 'Preenchida' || v.status === 'Preenchida por Operador').length;
    const totalEmpresas = state.empresas.length;
    const totalTrabalhadoresAprovados = state.trabalhadoresPendentes.filter(t => t.status === 'Aprovado').length;
    const totalTrabalhadoresPendentes = state.trabalhadoresPendentes.filter(t => t.status === 'Pendente').length;
    const valorDasVagas = state.vagas.reduce((acc, vaga) => acc + (vaga.valor * vaga.quantidade), 0);

    return {
      vagasEmAberto,
      vagasPreenchidas,
      totalEmpresas,
      totalTrabalhadoresAprovados,
      totalTrabalhadoresPendentes,
      valorDasVagas
    };
  },

  // ==========================
  // EMPRESAS
  // ==========================
  listarEmpresas: async (): Promise<Empresa[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return useAppStore.getState().empresas;
  },

  cadastrarEmpresa: async (empresa: Omit<Empresa, 'id' | 'enderecos'>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    useAppStore.getState().adicionarEmpresa(empresa);
  },

  alterarStatusEmpresa: async (empresaId: string, status: Empresa['status']): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    useAppStore.getState().alterarStatusEmpresa(empresaId, status);
  },

  // ==========================
  // USUÁRIOS (OPERADORES)
  // ==========================
  listarUsuarios: async (): Promise<Usuario[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return useAppStore.getState().usuarios;
  },

  cadastrarUsuario: async (usuario: Omit<Usuario, 'id'>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    useAppStore.getState().adicionarUsuario(usuario);
  },

  alterarStatusUsuario: async (usuarioId: string, status: Usuario['status']): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    useAppStore.getState().alterarStatusUsuario(usuarioId, status);
  },

  // ==========================
  // TRABALHADORES
  // ==========================
  listarTrabalhadores: async (): Promise<Trabalhador[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return useAppStore.getState().trabalhadoresPendentes; // no store atual guarda todos
  },

  aprovarTrabalhador: async (trabalhadorId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    useAppStore.getState().aprovarTrabalhador(trabalhadorId);
  },

  rejeitarTrabalhador: async (trabalhadorId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    useAppStore.getState().rejeitarTrabalhador(trabalhadorId);
  },

  // ==========================
  // VAGAS / DEMANDAS
  // ==========================
  listarVagas: async (): Promise<Vaga[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return useAppStore.getState().vagas;
  },
  
  aprovarCandidato: async (vagaId: string, trabalhadorId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    useAppStore.getState().aprovarCandidato(vagaId, trabalhadorId);
  },

  recusarCandidato: async (vagaId: string, trabalhadorId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    useAppStore.getState().recusarCandidato(vagaId, trabalhadorId);
  },

  forcarAlocacao: async (vagaId: string, trabalhadorId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    useAppStore.getState().forcarAlocacao(vagaId, trabalhadorId);
  },

  desvincularTrabalhador: async (vagaId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    useAppStore.getState().desvincularTrabalhador(vagaId);
  }
};
