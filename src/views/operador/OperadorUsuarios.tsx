import { useState } from 'react';
import { Table, Button, Card, Tag, Modal, Form, Input, Select, Space } from 'antd';
import { Plus, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { OperadorService } from '../../services/operadorService';
import type { Usuario } from '../../store/useAppStore';

export const OperadorUsuarios: React.FC = () => {
  const { usuarios } = useAppStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleStatusChange = async (id: string, novoStatus: Usuario['status']) => {
    await OperadorService.alterarStatusUsuario(id, novoStatus);
  };

  const handleAddUsuario = async (values: any) => {
    await OperadorService.cadastrarUsuario({
      nome: values.nome,
      email: values.email,
      perfil: values.perfil,
      status: 'Ativo',
    });
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nome', dataIndex: 'nome', key: 'nome', render: (text: string) => <strong className="text-gray-800">{text}</strong> },
    { title: 'E-mail', dataIndex: 'email', key: 'email' },
    {
      title: 'Perfil',
      dataIndex: 'perfil',
      key: 'perfil',
      render: (perfil: string) => {
        let color = 'default';
        if (perfil === 'Admin') color = 'purple';
        if (perfil === 'Operador') color = 'blue';
        if (perfil === 'Financeiro') color = 'green';
        return <Tag color={color}>{perfil}</Tag>;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = status === 'Ativo' ? 'green' : 'red';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Ações',
      key: 'action',
      render: (_: any, record: Usuario) => (
        <Space>
          <Select 
            value={record.status} 
            size="small" 
            onChange={(val) => handleStatusChange(record.id, val as Usuario['status'])}
            options={[
              { value: 'Ativo', label: 'Ativo' },
              { value: 'Inativo', label: 'Inativo' },
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
            <ShieldCheck className="text-purple-500" size={20} />
            <span className="font-bold text-lg">Usuários do Backoffice</span>
          </div>
        }
        extra={
          <Button type="primary" icon={<Plus size={16} />} onClick={() => setIsModalVisible(true)}>
            Novo Usuário
          </Button>
        }
      >
        <div className="flex-1 w-full min-h-0 overflow-auto">
          <Table dataSource={usuarios} columns={columns} rowKey="id" pagination={{ pageSize: 8 }} />
        </div>
      </Card>

      <Modal
        title="Cadastrar Novo Usuário (Operador)"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Cadastrar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" onFinish={handleAddUsuario}>
          <Form.Item name="nome" label="Nome Completo" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="E-mail" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="perfil" label="Perfil de Acesso" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'Operador', label: 'Operador' },
                { value: 'Financeiro', label: 'Financeiro' },
                { value: 'Admin', label: 'Administrador' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
