import { useState } from 'react';
import { Table, Button, Card, Tag, Badge, Modal, Form, Select, DatePicker, InputNumber, Rate, Input } from 'antd';
import { Briefcase, UserCheck, Plus, Star, MessageSquare } from 'lucide-react';
import { format, parseISO, isBefore } from 'date-fns';
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

  const [isAvaliacaoModalOpen, setIsAvaliacaoModalOpen] = useState(false);
  const [vagaParaAvaliar, setVagaParaAvaliar] = useState<string | null>(null);

  const [isDetalhesModalOpen, setIsDetalhesModalOpen] = useState(false);
  const [vagaDetalhesId, setVagaDetalhesId] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState<'ativas' | 'encerradas' | 'todas'>('ativas');

  const [form] = Form.useForm();
  const [formAvaliacao] = Form.useForm();

  const handleAvaliar = () => {
    formAvaliacao.validateFields().then(async (values) => {
      if (vagaParaAvaliar) {
        await EmpresaService.avaliarTrabalhador(vagaParaAvaliar, values.nota, values.comentario);
        setIsAvaliacaoModalOpen(false);
        formAvaliacao.resetFields();
      }
    });
  };

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

  const abrirModalCandidatos = (e: React.MouseEvent, vagaId: string) => {
    e.stopPropagation();
    setSelectedVagaId(vagaId);
    setIsCandidatosModalOpen(true);
  };

  const abrirPerfil = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setTrabalhadorPerfilId(id);
    setIsPerfilModalOpen(true);
  };

  const abrirDetalhes = (vagaId: string) => {
    setVagaDetalhesId(vagaId);
    setIsDetalhesModalOpen(true);
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
              onClick={(e) => abrirModalCandidatos(e, record.id)}
              className="bg-indigo-600 hover:bg-indigo-700 text-xs flex items-center"
            >
              Analisar Candidatos
            </Button>
          );
        }
        if (record.status === 'Preenchida' && isBefore(parseISO(record.dataHoraFim), new Date()) && !record.avaliacaoTrabalhador) {
          return (
            <Button
              type="primary"
              size="small"
              icon={<Star size={14} />}
              onClick={(e) => { e.stopPropagation(); setVagaParaAvaliar(record.id); setIsAvaliacaoModalOpen(true); }}
              className="bg-yellow-500 hover:bg-yellow-600 border-none text-xs flex items-center"
            >
              Avaliar Serviço
            </Button>
          );
        }
        if (record.avaliacaoTrabalhador) {
          return <span className="text-xs text-gray-500 font-bold flex items-center gap-1"><Star size={12} className="fill-yellow-500 text-yellow-500" /> Avaliado</span>;
        }
        return null;
      }
    }
  ];

  const vagasDaEmpresaBase = vagas.filter(v => v.empresaId === empresaLogada.id);
  const vagasDaEmpresa = vagasDaEmpresaBase.filter(v => {
    const isAvaliada = !!v.avaliacaoTrabalhador;
    const isConcluida = v.status === 'Preenchida' || v.status === 'Preenchida por Operador';

    if (filterStatus === 'ativas') {
      return v.status === 'Buscando...' || (isConcluida && !isAvaliada);
    }
    if (filterStatus === 'encerradas') {
      return isConcluida && isAvaliada;
    }
    return true;
  });

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
            <span className="font-bold text-lg">Minhas Vagas</span>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { value: 'ativas', label: 'Vagas Ativas' },
                { value: 'encerradas', label: 'Vagas Encerradas' },
                { value: 'todas', label: 'Todas as Vagas' },
              ]}
              className="w-full sm:w-64"
            />
            <Button
              type="primary"
              icon={<Plus size={16} />}
              className="bg-purple-600 hover:bg-purple-700 flex items-center"
              onClick={() => setIsModalOpen(true)}
            >
              Publicar Vaga
            </Button>
          </div>
        </div>
        <div className="flex-1 w-full min-h-0 overflow-auto">
          <Table 
            dataSource={vagasDaEmpresa} 
            columns={columns} 
            rowKey="id" 
            pagination={{ pageSize: 8 }} 
            rowClassName="cursor-pointer hover:bg-gray-50 transition-colors"
            onRow={(record) => ({
              onClick: () => abrirDetalhes(record.id),
            })}
          />
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
                      <Button type="default" onClick={(e) => abrirPerfil(e, c.id)}>Ver Perfil</Button>
                      <Button danger onClick={(e) => { e.stopPropagation(); EmpresaService.recusarCandidato(vagaSelecionada!.id, c.id); }}>Recusar</Button>
                      <Button
                        type="primary"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={async (e) => {
                          e.stopPropagation();
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

      {/* Modal de Avaliação */}
      <Modal
        title={<div className="flex items-center gap-2"><Star size={20} className="text-yellow-500 fill-yellow-500" /> Avaliar Profissional</div>}
        open={isAvaliacaoModalOpen}
        onOk={handleAvaliar}
        onCancel={() => setIsAvaliacaoModalOpen(false)}
        okText="Enviar Avaliação"
        cancelText="Cancelar"
        okButtonProps={{ className: 'bg-yellow-500 hover:bg-yellow-600 border-none text-white' }}
      >
        <Form form={formAvaliacao} layout="vertical" className="mt-4">
          <Form.Item name="nota" label="Nota do Serviço" rules={[{ required: true, message: 'Por favor, dê uma nota' }]}>
            <Rate className="text-yellow-500" />
          </Form.Item>
          <Form.Item name="comentario" label="Comentário (Público)" rules={[{ required: true, message: 'Deixe um breve comentário' }]}>
            <Input.TextArea rows={4} placeholder="Como foi o desempenho do profissional? Ele chegou no horário? Foi educado?" />
          </Form.Item>
        </Form>
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
                        <div className="flex justify-between items-center mb-1">
                          <strong className="text-gray-800">{v.funcao}</strong>
                          {v.avaliacaoTrabalhador && (
                            <span className="flex items-center text-yellow-500 font-bold text-xs bg-yellow-50 px-2 py-1 rounded">
                              <Star size={12} className="fill-yellow-500 mr-1" /> {v.avaliacaoTrabalhador}.0
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{v.nomeEmpresa} • {format(parseISO(v.dataHoraInicio), "dd/MM/yyyy")}</p>

                        {v.comentarioAvaliacao && (
                          <div className="bg-gray-50 p-2 rounded text-sm text-gray-600 border-l-2 border-yellow-400 italic flex gap-2 items-start mt-2">
                            <MessageSquare size={14} className="mt-0.5 text-gray-400 flex-none" />
                            <span>"{v.comentarioAvaliacao}"</span>
                          </div>
                        )}
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

      {/* Modal de Detalhes da Vaga */}
      <Modal
        title={<div className="flex items-center gap-2"><Briefcase size={20} className="text-purple-600" /> Detalhes da Vaga</div>}
        open={isDetalhesModalOpen}
        onCancel={() => setIsDetalhesModalOpen(false)}
        footer={[<Button key="close" onClick={() => setIsDetalhesModalOpen(false)}>Fechar</Button>]}
      >
        {(() => {
          const v = vagas.find(x => x.id === vagaDetalhesId);
          if (!v) return null;
          
          const alocado = v.trabalhadorId ? trabalhadoresPendentes.find(t => t.id === v.trabalhadorId) : null;

          return (
            <div className="mt-4 flex flex-col gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{v.funcao}</h3>
                  <Tag color={v.status === 'Preenchida' ? 'green' : v.status === 'Buscando...' ? 'orange' : 'purple'}>{v.status}</Tag>
                </div>
                
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Início:</strong> {format(parseISO(v.dataHoraInicio), "dd/MM/yyyy HH:mm")}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Término:</strong> {format(parseISO(v.dataHoraFim), "dd/MM/yyyy HH:mm")}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Valor da Diária:</strong> R$ {v.valor.toFixed(2)}
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Endereço:</strong> {getEnderecoDisplay(v.enderecoId)}
                </p>
              </div>

              {alocado && (
                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <h4 className="font-bold text-green-800 flex items-center gap-2 mb-2">
                    <UserCheck size={16} /> Profissional Alocado
                  </h4>
                  <p className="text-gray-800 font-medium">{alocado.nome}</p>
                  <p className="text-sm text-gray-500 mt-1">Score: {alocado.score}/100</p>
                </div>
              )}

              {v.avaliacaoTrabalhador && (
                <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-800 flex items-center gap-2 mb-2">
                    <Star size={16} className="fill-yellow-600" /> Avaliação Concluída
                  </h4>
                  <div className="flex gap-1 mb-2">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} size={14} className={star <= v.avaliacaoTrabalhador! ? "fill-yellow-500 text-yellow-500" : "text-gray-300"} />
                    ))}
                  </div>
                  {v.comentarioAvaliacao && (
                    <div className="bg-white p-2.5 rounded text-sm text-gray-600 border border-yellow-100 italic flex gap-2 items-start mt-2 shadow-sm">
                      <MessageSquare size={14} className="mt-0.5 text-yellow-500 flex-none" />
                      <span>"{v.comentarioAvaliacao}"</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};
