import { Table, Button, Card, Badge, Tag, Tabs } from 'antd';
import { Check, X, Star, Map as MapIcon } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { OperadorService } from '../../services/operadorService';
import { MapaTrabalhadores } from '../../components/MapaTrabalhadores';

export const OperadorTrabalhadores: React.FC = () => {
  const { trabalhadoresPendentes } = useAppStore();

  const handleAprovar = async (id: string) => {
    await OperadorService.aprovarTrabalhador(id);
  };

  const handleRejeitar = async (id: string) => {
    await OperadorService.rejeitarTrabalhador(id);
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
              onClick={() => handleAprovar(record.id)}
            >
              Aprovar
            </Button>
            <Button
              danger
              size="small"
              icon={<X size={14} />}
              onClick={() => handleRejeitar(record.id)}
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

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-auto">
        <Tabs
          defaultActiveKey="1"
          type="card"
          items={[
            {
              key: '1',
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
              key: '2',
              label: <span className="font-semibold px-4 flex items-center gap-2"><MapIcon size={16} /> Radar Geográfico</span>,
              children: (
                <Card bordered={false} className="shadow-sm border border-gray-200 mt-2 rounded-xl p-2">
                  <MapaTrabalhadores />
                </Card>
              )
            }
          ]}
        />
      </div>
    </div>
  );
};
