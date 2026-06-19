import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, DatePicker } from 'antd';
import { Briefcase, CheckCircle, TrendingUp, Calendar } from 'lucide-react';
import { EmpresaService } from '../../services/empresaService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';

interface Metrics {
  vagasAtivas: number;
  vagasPreenchidas: number;
  totalVagas: number;
  gastoEstimadoMensal: number;
}

export const EmpresaDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(dayjs());

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await EmpresaService.getDashboardMetrics();
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

  // Dados mockados mensais
  const chartData = [
    { name: 'Jan', gasto: 1200 },
    { name: 'Fev', gasto: 1800 },
    { name: 'Mar', gasto: 1500 },
    { name: 'Abr', gasto: 2200 },
    { name: 'Mai', gasto: 1000 },
    { name: 'Jun', gasto: 2500 },
    { name: 'Jul', gasto: 2800 },
    { name: 'Ago', gasto: 2000 },
    { name: 'Set', gasto: 1400 },
    { name: 'Out', gasto: 2900 },
    { name: 'Nov', gasto: 3500 },
    { name: 'Dez', gasto: 4100 },
  ];

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      <Row gutter={[16, 16]} className="mb-4 flex-none">
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-gray-500 font-medium">Gastos no Mês</span>}
              value={metrics.gastoEstimadoMensal}
              prefix={<span className="text-red-500 font-bold mr-1 text-lg">R$</span>}
              precision={2}
              valueStyle={{ fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-gray-500 font-medium">Vagas Ativas (Buscando)</span>}
              value={metrics.vagasAtivas}
              prefix={<TrendingUp className="text-orange-500 mr-2" size={20} />}
              valueStyle={{ fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-gray-500 font-medium">Vagas Concluídas</span>}
              value={metrics.vagasPreenchidas}
              prefix={<CheckCircle className="text-green-500 mr-2" size={20} />}
              valueStyle={{ fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-gray-500 font-medium">Total de Solicitações</span>}
              value={metrics.totalVagas}
              prefix={<Briefcase className="text-indigo-500 mr-2" size={20} />}
              valueStyle={{ fontWeight: 'bold' }}
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
              Evolução de Gastos (R$)
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
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorGasto" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <RechartsTooltip />
              <Area type="monotone" dataKey="gasto" stroke="#ef4444" fillOpacity={1} fill="url(#colorGasto)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
