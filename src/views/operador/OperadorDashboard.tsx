import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, DatePicker } from 'antd';
import { Briefcase, Users, Calendar, CheckCircle } from 'lucide-react';
import { OperadorService } from '../../services/operadorService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import dayjs from 'dayjs';

interface Metrics {
  vagasEmAberto: number;
  vagasPreenchidas: number;
  totalEmpresas: number;
  totalTrabalhadoresAprovados: number;
  totalTrabalhadoresPendentes: number;
  valorDasVagas: number;
}

export const OperadorDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(dayjs());

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await OperadorService.getDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Erro ao carregar métricas", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading || !metrics) {
    return <div className="flex justify-center items-center h-64"><Spin size="large" /></div>;
  }

  // Dados mockados mensais baseados no ano selecionado
  // Numa aplicação real, a API retornaria isso com base no filtro.
  const chartData = [
    { name: 'Jan', emAberto: 12, preenchidas: 45 },
    { name: 'Fev', emAberto: 8, preenchidas: 50 },
    { name: 'Mar', emAberto: 15, preenchidas: 42 },
    { name: 'Abr', emAberto: 22, preenchidas: 38 },
    { name: 'Mai', emAberto: 10, preenchidas: 60 },
    { name: 'Jun', emAberto: 5, preenchidas: 75 },
    { name: 'Jul', emAberto: 18, preenchidas: 55 },
    { name: 'Ago', emAberto: 20, preenchidas: 48 },
    { name: 'Set', emAberto: 14, preenchidas: 52 },
    { name: 'Out', emAberto: 9, preenchidas: 61 },
    { name: 'Nov', emAberto: 25, preenchidas: 80 },
    { name: 'Dez', emAberto: 30, preenchidas: 95 },
  ];

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      <Row gutter={[16, 16]} className="mb-4 flex-none">
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-gray-500 font-medium">Vagas em Aberto</span>}
              value={metrics.vagasEmAberto}
              prefix={<Briefcase className="text-blue-500 mr-2" size={20} />}
              valueStyle={{ fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-gray-500 font-medium">Vagas Preenchidas</span>}
              value={metrics.vagasPreenchidas}
              prefix={<CheckCircle className="text-green-500 mr-2" size={20} />}
              valueStyle={{ fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-gray-500 font-medium">Valor das Vagas</span>}
              value={metrics.valorDasVagas}
              prefix={<span className="text-indigo-500 font-bold mr-1 text-lg">R$</span>}
              precision={2}
              valueStyle={{ fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-gray-500 font-medium">Trabalhadores Aguardando</span>}
              value={metrics.totalTrabalhadoresPendentes}
              prefix={<Users className="text-orange-500 mr-2" size={20} />}
              valueStyle={{ color: metrics.totalTrabalhadoresPendentes > 0 ? '#f97316' : '#1f2937', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        bordered={false} 
        className="shadow-sm rounded-xl flex-1 flex flex-col min-h-0" 
        styles={{ body: { flex: 1, padding: '16px', minHeight: 0, display: 'flex', flexDirection: 'column' } }}
        title={
          <div className="flex justify-between items-center w-full">
            <span className="font-bold text-gray-700 flex items-center gap-2">
              <Calendar size={18} className="text-gray-500" />
              Evolução de Vagas
            </span>
            <DatePicker 
              picker="year" 
              value={selectedYear} 
              onChange={(date) => date && setSelectedYear(date)}
              allowClear={false}
            />
          </div>
        }
      >
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar name="Vagas em Aberto" dataKey="emAberto" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={30} />
              <Bar name="Vagas Preenchidas" dataKey="preenchidas" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
