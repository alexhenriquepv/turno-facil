import { useState } from 'react';
import { Table, Button, Card, Tag, Badge, Modal, Form, Select, DatePicker, InputNumber } from 'antd';
import { Briefcase, UserCheck, Plus, Star } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useAppStore } from '../../store/useAppStore';
import { EmpresaService } from '../../services/empresaService';

const { RangePicker } = DatePicker;

export const EmpresaDemandas: React.FC = () => {
  const { vagas, empresaLogada, trabalhadoresPendentes } = useAppStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCandidatosModalOpen, setIsCandidatosModalOpen] = useState(false);
  const [selectedVagaId, setSelectedVagaId] = useState<string | null>(null);
  
  const [isPerfilModalOpen, setIsPerfilModalOpen] = useState(false);
  const [trabalhadorPerfilId, setTrabalhadorPerfilId] = useState<string | null>(null);

  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      await EmpresaService.criarVaga({
        funcao: values.funcao,
        dataHoraInicio: values.dataHora[0].toISOString(),
        dataHoraFim: values.dataHora[1].toISOString(),
        quantidade: values.quantidade,
        valor: values.valor,
        enderecoId: values.enderecoId,
      });
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const getEnderecoDisplay = (endId: string) => {
    const end = empresaLogada.enderecos.find(e => e.id === endId);
    return end ? `${end.nome} (${end.bairro})` : endId;
  };

  const abrirModalCandidatos = (vagaId: string) => {
    setSelectedVagaId(vagaId);
    setIsCandidatosModalOpen(true);
  };

  const abrirPerfil = (id: string) => {
    setTrabalhadorPerfilId(id);
    setIsPerfilModalOpen(true);
  };

  const columns = [
    {
      title: 'Função',
      dataIndex: 'funcao',
      key: 'funcao',
      render: (text: string) => <strong className="text-gray-800">{text}</strong>,
    },
    {
      title: 'Período',
      key: 'periodo',
      render: (_: any, record: any) => (
        <span className="text-xs">
          {format(parseISO(record.dataHoraInicio), "dd/MM/yyyy HH:mm")} até<br />
          {format(parseISO(record.dataHoraFim), "dd/MM/yyyy HH:mm")}
        </span>
      ),
    },
    {
      title: 'Endereço',
      dataIndex: 'enderecoId',
      key: 'enderecoId',
      render: (endId: string) => getEnderecoDisplay(endId),
    },
    {
      title: 'Vagas',
      dataIndex: 'quantidade',
      key: 'quantidade',
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
      },
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (_: any, record: any) => {
        if (record.status === 'Buscando...' && record.candidatosIds?.length > 0) {
          return (
            <Button
              type="primary"
              size="small"
              icon={<UserCheck size={14} />}
              onClick={() => abrirModalCandidatos(record.id)}
              className="bg-indigo-600 hover:bg-indigo-700 text-xs flex items-center"
            >
              Analisar Candidatos
            </Button>
          );
        }
        return null;
      }
    }
  ];

  const vagasDaEmpresa = vagas.filter(v => v.empresaId === empresaLogada.id);

  const vagaSelecionada = vagas.find(v => v.id === selectedVagaId);
  const candidatos = vagaSelecionada
    ? trabalhadoresPendentes
      .filter(t => vagaSelecionada.candidatosIds.includes(t.id))
      .sort((a, b) => b.score - a.score)
    : [];

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      <Card 
        bordered={false} 
        className="shadow-sm border border-gray-200 rounded-xl flex-1 flex flex-col min-h-0"
        styles={{ body: { flex: 1, padding: '16px', minHeight: 0, display: 'flex', flexDirection: 'column' } }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 flex-none">
          <div className="flex items-center gap-2 text-gray-800">
            <Briefcase className="text-purple-600" size={20} />
            <span className="font-bold text-lg">Minhas Solicitações de Mão de Obra</span>
          </div>

          <Button
            type="primary"
            icon={<Plus size={16} />}
            className="bg-purple-600 hover:bg-purple-700 flex items-center"
            onClick={() => setIsModalOpen(true)}
          >
            Publicar Vaga
          </Button>
        </div>
        <div className="flex-1 w-full min-h-0 overflow-auto">
          <Table dataSource={vagasDaEmpresa} columns={columns} rowKey="id" pagination={{ pageSize: 8 }} />
        </div>
      </Card>

      <Modal
        title={<div className="flex items-center gap-2"><Briefcase size={20} className="text-purple-600" /> Nova Solicitação de Profissional</div>}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Publicar Vaga"
        cancelText="Cancelar"
        width={600}
        okButtonProps={{ className: 'bg-purple-600 hover:bg-purple-700' }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="funcao" label="Função Necessária" rules={[{ required: true, message: 'Insira a função' }]}>
            <Select placeholder="Ex: Garçom, Vigilante...">
              <Select.Option value="Garçom">Garçom</Select.Option>
              <Select.Option value="Vigilante">Vigilante</Select.Option>
              <Select.Option value="Recepcionista">Recepcionista</Select.Option>
              <Select.Option value="Auxiliar de Limpeza">Auxiliar de Limpeza</Select.Option>
              <Select.Option value="Barman">Barman</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="dataHora" label="Data/Hora de Início e Fim do Turno" rules={[{ required: true, message: 'Selecione o período' }]}>
            <RangePicker showTime format="DD/MM/YYYY HH:mm" className="w-full" />
          </Form.Item>

          <div className="flex gap-4">
            <Form.Item name="quantidade" label="Qtd. de Vagas" className="w-1/3" rules={[{ required: true, message: 'Obrigatório' }]}>
              <InputNumber min={1} max={50} className="w-full" />
            </Form.Item>
            <Form.Item name="valor" label="Valor da Diária (R$)" className="w-2/3" rules={[{ required: true, message: 'Insira o valor' }]}>
              <InputNumber min={1} step={10} className="w-full" prefix="R$" />
            </Form.Item>
          </div>

          <Form.Item name="enderecoId" label="Endereço de Atuação" rules={[{ required: true, message: 'Selecione o endereço' }]}>
            <Select placeholder="Selecione um endereço cadastrado">
              {empresaLogada.enderecos.map(end => (
                <Select.Option key={end.id} value={end.id}>
                  {end.nome} ({end.bairro}) - {end.rua}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
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
                      <Button type="default" onClick={() => abrirPerfil(c.id)}>Ver Perfil</Button>
                      <Button danger onClick={() => EmpresaService.recusarCandidato(vagaSelecionada!.id, c.id)}>Recusar</Button>
                      <Button
                        type="primary"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={async () => {
                          await EmpresaService.aprovarCandidato(vagaSelecionada!.id, c.id);
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
        footer={[<Button key="close" onClick={() => setIsPerfilModalOpen(false)}>Fechar Perfil</Button>]}
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
