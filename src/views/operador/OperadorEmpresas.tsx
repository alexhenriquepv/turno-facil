import { useState } from 'react';
import { Table, Button, Card, Tag, Modal, Form, Input, Select, Space } from 'antd';
import { Plus, Briefcase } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { OperadorService } from '../../services/operadorService';
import type { Empresa } from '../../store/useAppStore';

export const OperadorEmpresas: React.FC = () => {
  const { empresas } = useAppStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleStatusChange = async (id: string, novoStatus: Empresa['status']) => {
    await OperadorService.alterarStatusEmpresa(id, novoStatus);
  };

  const handleAddEmpresa = async (values: any) => {
    await OperadorService.cadastrarEmpresa({
      nome: values.nome,
      cnpj: values.cnpj,
      status: 'Ativo',
    });
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nome da Empresa', dataIndex: 'nome', key: 'nome', render: (text: string) => <strong className="text-gray-800">{text}</strong> },
    { title: 'CNPJ', dataIndex: 'cnpj', key: 'cnpj', render: (text: string) => text || <span className="text-gray-400">Não informado</span> },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'Ativo') color = 'green';
        if (status === 'Inativo') color = 'orange';
        if (status === 'Bloqueado') color = 'red';
        return <Tag color={color}>{status || 'Ativo'}</Tag>;
      }
    },
    {
      title: 'Ações',
      key: 'action',
      render: (_: any, record: Empresa) => (
        <Space>
          <Select 
            value={record.status || 'Ativo'} 
            size="small" 
            onChange={(val) => handleStatusChange(record.id, val as Empresa['status'])}
            options={[
              { value: 'Ativo', label: 'Ativo' },
              { value: 'Inativo', label: 'Inativo' },
              { value: 'Bloqueado', label: 'Bloqueado' },
            ]}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      <Card 
        bordered={false} 
        className="shadow-sm border border-gray-200 rounded-xl flex-1 flex flex-col min-h-0"
        styles={{ body: { flex: 1, padding: '16px', minHeight: 0, display: 'flex', flexDirection: 'column' } }}
        title={
          <div className="flex items-center gap-2 text-gray-800">
            <Briefcase className="text-blue-500" size={20} />
            <span className="font-bold text-lg">Gestão de Empresas Parceiras</span>
          </div>
        }
        extra={
          <Button type="primary" icon={<Plus size={16} />} onClick={() => setIsModalVisible(true)}>
            Nova Empresa
          </Button>
        }
      >
        <div className="flex-1 w-full min-h-0 overflow-auto">
          <Table dataSource={empresas} columns={columns} rowKey="id" pagination={{ pageSize: 8 }} scroll={{ x: 'max-content' }} />
        </div>
      </Card>

      <Modal
        title="Cadastrar Nova Empresa"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Cadastrar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" onFinish={handleAddEmpresa}>
          <Form.Item name="nome" label="Nome da Empresa (Razão Social ou Fantasia)" rules={[{ required: true, message: 'Obrigatório' }]}>
            <Input placeholder="Ex: Restaurante do João" />
          </Form.Item>
          <Form.Item name="cnpj" label="CNPJ" rules={[{ required: true, message: 'Obrigatório' }]}>
            <Input placeholder="00.000.000/0000-00" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
