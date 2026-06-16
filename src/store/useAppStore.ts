import { create } from 'zustand'

export type Persona = 'empresa' | 'trabalhador' | 'operador'

export type StatusVaga = 'Buscando...' | 'Preenchida' | 'Preenchida por Operador'

export interface Endereco {
  id: string
  nome: string
  bairro: string
  rua: string
  lat: number
  lng: number
}

export interface Empresa {
  id: string
  nome: string
  enderecos: Endereco[]
}

export interface Vaga {
  id: string
  funcao: string
  dataHoraInicio: string
  dataHoraFim: string
  quantidade: number
  valor: number
  status: StatusVaga
  enderecoId: string
  empresaId: string
  nomeEmpresa: string
  trabalhadorId?: string
  candidatosIds: string[]
  avaliacaoTrabalhador?: number
}

export interface Trabalhador {
  id: string
  nome: string
  funcoes: string[]
  status: 'Pendente' | 'Aprovado' | 'Rejeitado'
  lat: number
  lng: number
  score: number
}

interface AppState {
  personaAtual: Persona
  empresaLogada: Empresa
  trabalhadorLogado: Trabalhador
  vagas: Vaga[]
  trabalhadoresPendentes: Trabalhador[]
  
  // Ações
  mudarPersona: (persona: Persona) => void
  adicionarVaga: (vaga: Omit<Vaga, 'id' | 'status' | 'empresaId' | 'nomeEmpresa' | 'candidatosIds'>) => void
  candidatarVaga: (vagaId: string, trabalhadorId: string) => void
  aprovarCandidato: (vagaId: string, trabalhadorId: string) => void
  forcarAlocacao: (vagaId: string, trabalhadorId: string) => void
  desvincularTrabalhador: (vagaId: string) => void
  aprovarTrabalhador: (trabalhadorId: string) => void
  rejeitarTrabalhador: (trabalhadorId: string) => void
}

const mockEmpresa: Empresa = {
  id: 'emp1',
  nome: 'Restaurantes Manaus',
  enderecos: [
    { id: 'end1', nome: 'Filial Centro', bairro: 'Centro', rua: 'Av. Eduardo Ribeiro, 100', lat: -3.1311, lng: -60.0232 },
    { id: 'end2', nome: 'Filial Distrito', bairro: 'Distrito Industrial', rua: 'Av. Buriti, 500', lat: -3.1118, lng: -59.9701 },
    { id: 'end3', nome: 'Filial Ponta Negra', bairro: 'Ponta Negra', rua: 'Av. Coronel Teixeira, 200', lat: -3.0763, lng: -60.0933 },
  ]
};

const mockTrabalhadoresIniciais: Trabalhador[] = [
  { id: '101', nome: 'João Silva', funcoes: ['Garçom', 'Barman'], status: 'Pendente', lat: -3.1250, lng: -60.0150, score: 95 },
  { id: '102', nome: 'Maria Souza', funcoes: ['Recepcionista'], status: 'Pendente', lat: -3.0850, lng: -60.0800, score: 82 },
  { id: '103', nome: 'Carlos Mendes', funcoes: ['Vigilante'], status: 'Aprovado', lat: -3.1000, lng: -59.9800, score: 65 },
  { id: '104', nome: 'Ana Costa', funcoes: ['Garçom'], status: 'Aprovado', lat: -3.1200, lng: -60.0200, score: 98 },
  { id: '105', nome: 'Pedro Álvares', funcoes: ['Garçom'], status: 'Aprovado', lat: -3.1100, lng: -60.0300, score: 75 },
]

const mockVagasIniciais: Vaga[] = [
  // Vagas Ativas e Recentes
  { id: '1', empresaId: 'emp1', nomeEmpresa: 'Restaurantes Manaus', funcao: 'Garçom', dataHoraInicio: '2023-11-20T19:00', dataHoraFim: '2023-11-21T02:00', quantidade: 3, valor: 150.00, status: 'Buscando...', enderecoId: 'end1', candidatosIds: ['104', '105'] },
  { id: '2', empresaId: 'emp1', nomeEmpresa: 'Restaurantes Manaus', funcao: 'Vigilante', dataHoraInicio: '2023-11-21T22:00', dataHoraFim: '2023-11-22T06:00', quantidade: 1, valor: 200.00, status: 'Buscando...', enderecoId: 'end2', candidatosIds: ['101'] },
  { id: '3', empresaId: 'emp1', nomeEmpresa: 'Restaurantes Manaus', funcao: 'Recepcionista', dataHoraInicio: '2023-11-22T08:00', dataHoraFim: '2023-11-22T18:00', quantidade: 2, valor: 120.00, status: 'Buscando...', enderecoId: 'end3', candidatosIds: [] },
  
  // Histórico Passado (Para preencher perfil dos candidatos com avaliações)
  { id: 'h1', empresaId: 'emp1', nomeEmpresa: 'Restaurantes Manaus', funcao: 'Garçom', dataHoraInicio: '2023-10-10T19:00', dataHoraFim: '2023-10-11T02:00', quantidade: 1, valor: 150.00, status: 'Preenchida', enderecoId: 'end1', candidatosIds: ['101'], trabalhadorId: '101', avaliacaoTrabalhador: 5 },
  { id: 'h2', empresaId: 'emp1', nomeEmpresa: 'Restaurantes Manaus', funcao: 'Barman', dataHoraInicio: '2023-10-15T20:00', dataHoraFim: '2023-10-16T04:00', quantidade: 1, valor: 180.00, status: 'Preenchida', enderecoId: 'end3', candidatosIds: ['101'], trabalhadorId: '101', avaliacaoTrabalhador: 4 },
  { id: 'h3', empresaId: 'emp2', nomeEmpresa: 'Eventos Amazônia (Parceiro)', funcao: 'Recepcionista', dataHoraInicio: '2023-10-05T08:00', dataHoraFim: '2023-10-05T18:00', quantidade: 1, valor: 130.00, status: 'Preenchida', enderecoId: 'end2', candidatosIds: ['102'], trabalhadorId: '102', avaliacaoTrabalhador: 5 },
  { id: 'h4', empresaId: 'emp1', nomeEmpresa: 'Restaurantes Manaus', funcao: 'Garçom', dataHoraInicio: '2023-11-01T18:00', dataHoraFim: '2023-11-02T01:00', quantidade: 1, valor: 160.00, status: 'Preenchida', enderecoId: 'end1', candidatosIds: ['104'], trabalhadorId: '104', avaliacaoTrabalhador: 5 },
  { id: 'h5', empresaId: 'emp3', nomeEmpresa: 'Buffet Festas Finas', funcao: 'Garçom', dataHoraInicio: '2023-11-10T19:00', dataHoraFim: '2023-11-11T02:00', quantidade: 1, valor: 150.00, status: 'Preenchida', enderecoId: 'end1', candidatosIds: ['104'], trabalhadorId: '104', avaliacaoTrabalhador: 5 },
  { id: 'h6', empresaId: 'emp1', nomeEmpresa: 'Restaurantes Manaus', funcao: 'Vigilante', dataHoraInicio: '2023-11-12T22:00', dataHoraFim: '2023-11-13T06:00', quantidade: 1, valor: 220.00, status: 'Preenchida', enderecoId: 'end2', candidatosIds: ['103'], trabalhadorId: '103', avaliacaoTrabalhador: 3 },
]

export const useAppStore = create<AppState>((set) => ({
  personaAtual: 'empresa',
  empresaLogada: mockEmpresa,
  trabalhadorLogado: mockTrabalhadoresIniciais[0], // João Silva (id: 101)
  vagas: mockVagasIniciais,
  trabalhadoresPendentes: mockTrabalhadoresIniciais,

  mudarPersona: (persona) => set({ personaAtual: persona }),

  adicionarVaga: (vagaOmitida) => set((state) => ({
    vagas: [
      ...state.vagas,
      {
        ...vagaOmitida,
        id: Math.random().toString(36).substr(2, 9),
        status: 'Buscando...',
        empresaId: state.empresaLogada.id,
        nomeEmpresa: state.empresaLogada.nome,
        candidatosIds: []
      }
    ]
  })),

  candidatarVaga: (vagaId, trabalhadorId) => set((state) => ({
    vagas: state.vagas.map(vaga => 
      vaga.id === vagaId && !vaga.candidatosIds.includes(trabalhadorId) 
        ? { ...vaga, candidatosIds: [...vaga.candidatosIds, trabalhadorId] } 
        : vaga
    )
  })),

  aprovarCandidato: (vagaId, trabalhadorId) => set((state) => ({
    vagas: state.vagas.map(vaga => 
      vaga.id === vagaId ? { ...vaga, status: 'Preenchida', trabalhadorId } : vaga
    )
  })),

  forcarAlocacao: (vagaId, trabalhadorId) => set((state) => ({
    vagas: state.vagas.map(vaga => 
      vaga.id === vagaId ? { ...vaga, status: 'Preenchida por Operador', trabalhadorId } : vaga
    )
  })),

  desvincularTrabalhador: (vagaId) => set((state) => ({
    vagas: state.vagas.map(vaga => 
      vaga.id === vagaId ? { ...vaga, status: 'Buscando...', trabalhadorId: undefined } : vaga
    )
  })),

  aprovarTrabalhador: (trabalhadorId) => set((state) => ({
    trabalhadoresPendentes: state.trabalhadoresPendentes.map(t =>
      t.id === trabalhadorId ? { ...t, status: 'Aprovado' } : t
    )
  })),

  rejeitarTrabalhador: (trabalhadorId) => set((state) => ({
    trabalhadoresPendentes: state.trabalhadoresPendentes.map(t =>
      t.id === trabalhadorId ? { ...t, status: 'Rejeitado' } : t
    )
  })),
}))
