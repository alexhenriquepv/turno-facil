import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Table, Button, Card, Badge, Tag, Tabs, Tooltip, Input, Space, Modal, Select } from 'antd';
import { Check, X, UserPlus, AlertTriangle, Search, UserMinus, Map as MapIcon, UserCheck, Star } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { MapaTrabalhadores } from '../components/MapaTrabalhadores';

export const OperadorView: React.FC = () => {
  const { vagas, trabalhadoresPendentes, aprovarTrabalhador, rejeitarTrabalhador, forcarAlocacao, aprovarCandidato, desvincularTrabalhador, empresaLogada } = useAppStore();

  const [filtroEmpresa, setFiltroEmpresa] = useState('');
  const [filtroFuncao, setFiltroFuncao] = useState('');

  const [modalAlocacaoVisible, setModalAlocacaoVisible] = useState(false);
  const [vagaSelecionadaAlocacao, setVagaSelecionadaAlocacao] = useState<string | null>(null);
  const [trabalhadorSelecionado, setTrabalhadorSelecionado] = useState<string | null>(null);

  const [isCandidatosModalOpen, setIsCandidatosModalOpen] = useState(false);
  const [selectedVagaId, setSelectedVagaId] = useState<string | null>(null);

  const [isPerfilModalOpen, setIsPerfilModalOpen] = useState(false);
  const [trabalhadorPerfilId, setTrabalhadorPerfilId] = useState<string | null>(null);

  const abrirModalAlocacao = (vagaId: string) => {
    setVagaSelecionadaAlocacao(vagaId);
    setTrabalhadorSelecionado(null);
    setModalAlocacaoVisible(true);
  };

  const abrirModalCandidatos = (vagaId: string) => {
    setSelectedVagaId(vagaId);
    setIsCandidatosModalOpen(true);
  };

  const abrirPerfil = (id: string) => {
    setTrabalhadorPerfilId(id);
    setIsPerfilModalOpen(true);
  };

  const confirmarAlocacao = () => {
    if (vagaSelecionadaAlocacao && trabalhadorSelecionado) {
      forcarAlocacao(vagaSelecionadaAlocacao, trabalhadorSelecionado);
      setModalAlocacaoVisible(false);
    }
  };

  // Apply filters
  const vagasFiltradas = vagas.filter(v => {
    const matchEmpresa = v.nomeEmpresa.toLowerCase().includes(filtroEmpresa.toLowerCase());
    const matchFuncao = v.funcao.toLowerCase().includes(filtroFuncao.toLowerCase());
    return matchEmpresa && matchFuncao;
  });

  const getBairroDisplay = (endId: string) => {
    const end = empresaLogada.enderecos.find(e => e.id === endId);
    return end ? end.bairro : endId;
  };

  const workersColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nome', dataIndex: 'nome', key: 'nome', render: (text: string) => <strong className="text-gray-800">{text}</strong> },
    { title: 'Funções', dataIndex: 'funcoes', key: 'funcoes', render: (f: string[]) => f.map(x => <Tag key={x} color="cyan">{x}</Tag>) },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => {
        const color = score >= 90 ? 'green' : score >= 70 ? 'orange' : 'red';
        return <Tag color={color} className="font-bold"><Star size={10} className="inline mr-1" />{score}</Tag>;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'gold';
        if (status === 'Aprovado') color = 'green';
        if (status === 'Rejeitado') color = 'red';
        return <Badge status={color as any} text={status} />;
      }
    },
    {
      title: 'Ações',
      key: 'action',
      render: (_: any, record: any) => (
        record.status === 'Pendente' ? (
          <div className="flex gap-2">
            <Button
              type="primary"
              size="small"
              className="bg-green-600 hover:bg-green-700 border-none"
              icon={<Check size={14} />}
              onClick={() => aprovarTrabalhador(record.id)}
            >
              Aprovar
            </Button>
            <Button
              danger
              size="small"
              icon={<X size={14} />}
              onClick={() => rejeitarTrabalhador(record.id)}
            >
              Rejeitar
            </Button>
          </div>
        ) : (
          <span className="text-gray-400 text-sm font-medium">Avaliado</span>
        )
      ),
    },
  ];

  const demandColumns = [
    { title: 'Empresa', dataIndex: 'nomeEmpresa', key: 'nomeEmpresa', render: (t: string) => <span className="text-gray-600 text-sm">{t}</span> },
    { title: 'Função', dataIndex: 'funcao', key: 'funcao', render: (t: string) => <strong className="text-gray-800">{t}</strong> },
    { title: 'Local', dataIndex: 'enderecoId', key: 'enderecoId', render: (endId: string) => getBairroDisplay(endId) },
    {
      title: 'Período',
      key: 'periodo',
      render: (_: any, record: any) => (
        <span className="text-xs">
          {format(parseISO(record.dataHoraInicio), "dd/MM HH:mm")} às {format(parseISO(record.dataHoraFim), "HH:mm")}
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: any) => {
        let color = 'blue';
        if (status === 'Buscando...') color = 'orange';
        if (status === 'Preenchida') color = 'green';
        if (status === 'Preenchida por Operador') color = 'purple';
        
        return (
          <div className="flex flex-col gap-1 items-start">
            <Tag color={color}>{status}</Tag>
            {status === 'Buscando...' && record.candidatosIds?.length > 0 && (
              <Badge count={record.candidatosIds.length} style={{ backgroundColor: '#52c41a' }} title="Candidatos aguardando" />
            )}
          </div>
        );
      }
    },
    {
      title: 'Ação Operacional',
      key: 'action',
      render: (_: any, record: any) => {
        if (record.status === 'Buscando...') {
          return (
            <div className="flex gap-2">
              {record.candidatosIds?.length > 0 && (
                <Tooltip title="Analisar Candidatos que aplicaram para a vaga">
                  <Button
                    type="primary"
                    icon={<UserCheck size={14} />}
                    onClick={() => abrirModalCandidatos(record.id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-xs flex items-center"
                    size="small"
                  >
                    Analisar
                  </Button>
                </Tooltip>
              )}
              <Tooltip title="Alocar diretamente um trabalhador aprovado na vaga">
                <Button
                  type="default"
                  icon={<UserPlus size={14} />}
                  onClick={() => abrirModalAlocacao(record.id)}
                  className="flex items-center gap-1 text-xs border-blue-400 text-blue-600 hover:text-blue-700 hover:border-blue-500"
                  size="small"
                >
                  {record.candidatosIds?.length > 0 ? '' : 'Alocação Direta'}
                </Button>
              </Tooltip>
            </div>
          );
        } else {
          return (
            <Tooltip title="Desvincular trabalhador e reabrir vaga">
              <Button
                icon={<UserMinus size={14} />}
                onClick={() => desvincularTrabalhador(record.id)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500"
                size="small"
              >
                Desvincular
              </Button>
            </Tooltip>
          );
        }
      },
    },
  ];

  const vagaSelecionada = vagas.find(v => v.id === selectedVagaId);
  const candidatos = vagaSelecionada 
    ? trabalhadoresPendentes
        .filter(t => vagaSelecionada.candidatosIds.includes(t.id))
        .sort((a, b) => b.score - a.score)
    : [];

  return (
    <div className="max-w-7xl mx-auto p-1 mt-4">

      <Tabs
        defaultActiveKey="1"
        type="card"
        items={[
          {
            key: '1',
            label: <span className="font-semibold px-4">Radar de Vagas</span>,
            children: (
              <Card bordered={false} className="shadow-sm border border-gray-200 mt-2 rounded-xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                  <div className="flex items-center gap-2 text-gray-800">
                    <AlertTriangle className="text-orange-500" size={20} />
                    <span className="font-bold text-lg">Painel de Demandas em Tempo Real</span>
                  </div>

                  <Space className="w-full sm:w-auto">
                    <Input
                      placeholder="Filtrar por Empresa..."
                      prefix={<Search size={16} className="text-gray-400" />}
                      value={filtroEmpresa}
                      onChange={e => setFiltroEmpresa(e.target.value)}
                      allowClear
                    />
                    <Input
                      placeholder="Filtrar por Função..."
                      prefix={<Search size={16} className="text-gray-400" />}
                      value={filtroFuncao}
                      onChange={e => setFiltroFuncao(e.target.value)}
                      allowClear
                    />
                  </Space>
                </div>
                <Table dataSource={vagasFiltradas} columns={demandColumns} rowKey="id" pagination={{ pageSize: 8 }} />
              </Card>
            )
          },
          {
            key: '2',
            label: <span className="font-semibold px-4">Validação de Cadastros</span>,
            children: (
              <Card bordered={false} className="shadow-sm border border-gray-200 mt-2 rounded-xl" title={
                <div className="font-bold text-gray-800">Trabalhadores Aguardando Verificação</div>
              }>
                <Table dataSource={trabalhadoresPendentes} columns={workersColumns} rowKey="id" pagination={{ pageSize: 8 }} />
              </Card>
            )
          },
          {
            key: '3',
            label: <span className="font-semibold px-4 flex items-center gap-2"><MapIcon size={16} /> Radar Geográfico (Mapa)</span>,
            children: (
              <Card bordered={false} className="shadow-sm border border-gray-200 mt-2 rounded-xl p-2">
                <MapaTrabalhadores />
              </Card>
            )
          }
        ]}
      />

      <Modal
        title="Alocação Manual de Trabalhador"
        open={modalAlocacaoVisible}
        onOk={confirmarAlocacao}
        onCancel={() => setModalAlocacaoVisible(false)}
        okText="Confirmar Alocação"
        cancelText="Cancelar"
        okButtonProps={{ disabled: !trabalhadorSelecionado, className: 'bg-blue-600 hover:bg-blue-700' }}
      >
        <p className="mb-2 text-gray-600">Selecione um trabalhador para assumir esta vaga:</p>
        <Select
          className="w-full"
          placeholder="Selecione o trabalhador"
          value={trabalhadorSelecionado}
          onChange={setTrabalhadorSelecionado}
          showSearch
          optionFilterProp="children"
        >
          {trabalhadoresPendentes.filter(t => t.status === 'Aprovado').map(t => (
            <Select.Option key={t.id} value={t.id}>{t.nome} - {t.funcoes.join(', ')}</Select.Option>
          ))}
        </Select>
      </Modal>

      {/* Modal de Candidatos */}
      <Modal
        title={`Análise de Candidatos - ${vagaSelecionada?.funcao}`}
        open={isCandidatosModalOpen}
        onCancel={() => setIsCandidatosModalOpen(false)}
        footer={null}
        width={700}
      >
        <div className="mt-4 flex flex-col gap-3">
          {candidatos.length === 0 ? (
            <p className="text-gray-500 text-center">Nenhum candidato aguardando no momento.</p>
          ) : (
            candidatos.map(c => {
              const scoreColor = c.score >= 90 ? 'bg-green-100 text-green-700 border-green-200' : 
                                 c.score >= 70 ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 
                                 'bg-red-100 text-red-700 border-red-200';
              return (
                <div key={c.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50 hover:bg-white transition-colors">
                  <div>
                    <h4 className="font-bold text-gray-800 text-base">{c.nome}</h4>
                    <p className="text-xs text-gray-500 mt-1">Status na Plataforma: <Tag color={c.status === 'Aprovado' ? 'green' : 'default'} className="ml-1">{c.status}</Tag></p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Score</span>
                      <div className={`px-2 py-1 rounded flex items-center gap-1 border font-bold ${scoreColor}`}>
                        <Star size={12} className={c.score >= 90 ? 'fill-green-600 text-green-600' : c.score >= 70 ? 'fill-yellow-600 text-yellow-600' : 'fill-red-600 text-red-600'} />
                        {c.score}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="default" 
                        onClick={() => abrirPerfil(c.id)}
                      >
                        Ver Perfil
                      </Button>
                      <Button 
                        type="primary" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          aprovarCandidato(vagaSelecionada!.id, c.id);
                          setIsCandidatosModalOpen(false);
                        }}
                      >
                        Selecionar
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </Modal>

      {/* Modal de Perfil */}
      <Modal
        title="Perfil do Candidato"
        open={isPerfilModalOpen}
        onCancel={() => setIsPerfilModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsPerfilModalOpen(false)}>Fechar Perfil</Button>
        ]}
      >
        {(() => {
          const t = trabalhadoresPendentes.find(x => x.id === trabalhadorPerfilId);
          if (!t) return null;
          const historico = vagas.filter(v => v.trabalhadorId === t.id && v.status === 'Preenchida');
          return (
            <div className="mt-4">
              <h3 className="text-xl font-bold text-gray-800">{t.nome}</h3>
              <p className="text-gray-500 mb-4">{t.funcoes.join(' • ')}</p>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                <h4 className="font-bold text-gray-700 mb-2">Resumo de Qualidade</h4>
                <div className="flex justify-between items-center">
                  <span>Score de Confiabilidade:</span>
                  <Tag color={t.score >= 90 ? 'green' : t.score >= 70 ? 'orange' : 'red'} className="text-sm font-bold m-0">
                    <Star size={12} className="inline mr-1" />{t.score}/100
                  </Tag>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-700 mb-2">Histórico na Plataforma</h4>
                {historico.length > 0 ? (
                  <ul className="space-y-2">
                    {historico.map(v => (
                      <li key={v.id} className="bg-white p-3 border border-gray-100 rounded-md shadow-sm">
                        <div className="flex justify-between items-center">
                          <strong className="text-gray-800">{v.funcao}</strong>
                          {v.avaliacaoTrabalhador && (
                            <span className="flex items-center text-yellow-500 font-bold text-xs bg-yellow-50 px-2 py-1 rounded">
                              <Star size={12} className="fill-yellow-500 mr-1" /> {v.avaliacaoTrabalhador}.0
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{v.nomeEmpresa} • {format(parseISO(v.dataHoraInicio), "dd/MM/yyyy")}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">Nenhuma diária registrada ou concluída ainda.</p>
                )}
              </div>
            </div>
          );
        })()}
      </Modal>

    </div>
  );
};
