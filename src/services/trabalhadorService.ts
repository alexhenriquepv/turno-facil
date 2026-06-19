import { useAppStore } from '../store/useAppStore';

export const TrabalhadorService = {
  
  candidatarVaga: async (vagaId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const state = useAppStore.getState();
    state.candidatarVaga(vagaId, state.trabalhadorLogado.id);
  },

  atualizarFuncoes: async (funcoes: string[]) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const state = useAppStore.getState();
    state.atualizarFuncoesTrabalhador(state.trabalhadorLogado.id, funcoes);
  }
};
