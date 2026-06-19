import { Card, Form, Input, Button, message } from 'antd';
import { User, Building2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { EmpresaService } from '../../services/empresaService';

export const EmpresaPerfil: React.FC = () => {
  const { empresaLogada } = useAppStore();
  const [form] = Form.useForm();

  const handleSalvar = async (values: any) => {
    await EmpresaService.atualizarPerfil({
      nome: values.nome,
      cnpj: values.cnpj,
    });
    message.success('Perfil atualizado com sucesso!');
  };

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      <Card 
        bordered={false} 
        className="shadow-sm border border-gray-200 rounded-xl max-w-2xl mx-auto w-full"
      >
        <div className="flex items-center gap-2 text-gray-800 mb-6 pb-4 border-b border-gray-100">
          <User className="text-gray-500" size={24} />
          <span className="font-bold text-xl">Configurações do Perfil</span>
        </div>

        <Form 
          form={form} 
          layout="vertical" 
          initialValues={{ nome: empresaLogada.nome, cnpj: empresaLogada.cnpj }}
          onFinish={handleSalvar}
        >
          <Form.Item name="nome" label="Razão Social / Nome Fantasia" rules={[{ required: true }]}>
            <Input prefix={<Building2 size={16} className="text-gray-400 mr-2" />} />
          </Form.Item>
          
          <Form.Item name="cnpj" label="CNPJ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="bg-purple-600 hover:bg-purple-700 mt-4 w-full h-10 text-base">
              Salvar Alterações
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
