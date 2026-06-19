import { useState } from 'react';
import { Table, Button, Card, Modal, Form, Input } from 'antd';
import { MapPin, Plus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { EmpresaService } from '../../services/empresaService';

export const EmpresaEnderecos: React.FC = () => {
  const { empresaLogada } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      await EmpresaService.cadastrarEndereco({
        nome: values.nome,
        bairro: values.bairro,
        rua: values.rua,
        // Mocking coordinates for the new address
        lat: -3.1 + (Math.random() * 0.1),
        lng: -60.0 + (Math.random() * 0.1),
      });
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const columns = [
    { title: 'Nome / Identificação', dataIndex: 'nome', key: 'nome', render: (text: string) => <strong className="text-gray-800">{text}</strong> },
    { title: 'Bairro', dataIndex: 'bairro', key: 'bairro' },
    { title: 'Endereço Completo (Rua)', dataIndex: 'rua', key: 'rua' },
  ];

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      <Card 
        bordered={false} 
        className="shadow-sm border border-gray-200 rounded-xl flex-1 flex flex-col min-h-0"
        styles={{ body: { flex: 1, padding: '16px', minHeight: 0, display: 'flex', flexDirection: 'column' } }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 flex-none">
          <div className="flex items-center gap-2 text-gray-800">
            <MapPin className="text-blue-500" size={20} />
            <span className="font-bold text-lg">Meus Endereços e Filiais</span>
          </div>

          <Button
            type="primary"
            icon={<Plus size={16} />}
            className="bg-blue-600 hover:bg-blue-700 flex items-center"
            onClick={() => setIsModalOpen(true)}
          >
            Novo Endereço
          </Button>
        </div>
        <div className="flex-1 w-full min-h-0 overflow-auto">
          <Table dataSource={empresaLogada.enderecos} columns={columns} rowKey="id" pagination={{ pageSize: 8 }} scroll={{ x: 'max-content' }} />
        </div>
      </Card>

      <Modal
        title={<div className="flex items-center gap-2"><MapPin size={20} className="text-blue-600" /> Cadastrar Novo Endereço</div>}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Salvar Endereço"
        cancelText="Cancelar"
        okButtonProps={{ className: 'bg-blue-600 hover:bg-blue-700' }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="nome" label="Identificação (Ex: Matriz, Galpão A, Filial Zona Sul)" rules={[{ required: true, message: 'Obrigatório' }]}>
            <Input placeholder="Identificação do local" />
          </Form.Item>
          <Form.Item name="bairro" label="Bairro" rules={[{ required: true, message: 'Obrigatório' }]}>
            <Input placeholder="Ex: Centro" />
          </Form.Item>
          <Form.Item name="rua" label="Endereço Completo" rules={[{ required: true, message: 'Obrigatório' }]}>
            <Input placeholder="Ex: Rua das Flores, 123" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
