import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { ArrowRight, ShieldCheck, Clock, MapPin, Briefcase } from 'lucide-react';

import heroImg from '../assets/prints/operador_mapa.png';
import empresaDash from '../assets/prints/empresa_dashboard.png';
import appHome from '../assets/prints/app_home.png';

export const LandingPage: React.FC = () => {
  const { entrarPlataforma } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden font-sans">
      {/* HEADER */}
      <header className="w-full bg-white/80 backdrop-blur-md fixed top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Turno Fácil</span>
          </div>
          <button
            onClick={entrarPlataforma}
            className="hidden sm:flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-full font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Acessar Plataforma <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-8 min-h-[90vh]">
        <div className="flex-1 text-center lg:text-left z-10">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 animate-fade-in-up-delay-1">
            O trabalho temporário, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
              agora sem complicações.
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 animate-fade-in-up-delay-2">
            Conectamos empresas que precisam de força de trabalho imediata a profissionais qualificados buscando renda extra. Tudo em um só lugar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start animate-fade-in-up-delay-2">
            <button
              onClick={entrarPlataforma}
              className="w-full sm:w-auto mb-4 sm:mb-0 sm:mr-4 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-purple-200 hover:-translate-y-1 flex items-center justify-center"
            >
              <span className="mr-2">Começar Agora</span> <ArrowRight size={20} />
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-full font-bold text-lg transition-all border border-gray-200 flex items-center justify-center"
            >
              Conhecer Mais
            </button>
          </div>
        </div>
        <div className="flex-1 relative animate-fade-in-up">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-200 to-blue-100 rounded-full blur-3xl opacity-60 animate-pulse-slow"></div>
          <img
            src={heroImg}
            alt="Dashboard do Operador"
            className="relative z-10 w-full rounded-2xl shadow-2xl border border-gray-200 animate-float"
          />
        </div>
      </section>

      {/* FEATURES - EMPRESA */}
      <section id="features" className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 w-full order-2 lg:order-1 relative">
            <img
              src={empresaDash}
              alt="Dashboard da Empresa"
              className="relative z-10 w-full rounded-2xl shadow-2xl border border-gray-200 animate-float-delayed"
            />
          </div>
          <div className="flex-1 order-1 lg:order-2">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Briefcase size={24} className="text-blue-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Para Empresas</h2>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Gerencie sua equipe sob demanda com dados reais.</h3>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Crie vagas em segundos, acompanhe o status de preenchimento em tempo real e controle seus gastos mensais através de um painel analítico inteligente. Avalie os melhores profissionais para garantir a qualidade do serviço.
            </p>
            <ul className="space-y-4">
              {[
                'Dashboard analítico de custos e vagas.',
                'Alocação automática e gestão de candidatos.',
                'Sistema de avaliação de performance pós-turno.'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={14} className="text-green-600" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURES - TRABALHADOR */}
      <section className="py-24 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
              <Clock size={24} className="text-orange-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Para Trabalhadores</h2>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Liberdade para trabalhar quando e onde quiser.</h3>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Encontre os turnos mais próximos de você. Receba notificações de novas vagas, construa seu histórico profissional com avaliações 5 estrelas e seja o primeiro a ser chamado pelas melhores empresas.
            </p>
            <ul className="space-y-4">
              {[
                'Encontre vagas baseadas na sua geolocalização.',
                'Histórico completo com notas de empresas reais.',
                'Navegação nativa e intuitiva direto do seu celular.'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-green-600" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full relative flex justify-center">
            <img
              src={appHome}
              alt="App do Trabalhador"
              className="relative z-10 w-full max-w-[280px] rounded-[1rem] shadow-2xl border border-gray-200 animate-float"
            />
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24 px-6 bg-gray-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-[100px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Pronto para transformar a gestão de turnos?</h2>
          <p className="text-xl text-gray-300 mb-10">Acesse agora a plataforma. Teste as visões de Empresa, Trabalhador e Operador.</p>
          <button
            onClick={entrarPlataforma}
            className="bg-purple-500 hover:bg-purple-400 text-white px-10 py-5 rounded-full font-bold text-xl transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center mx-auto"
          >
            <span className="mr-3">Acessar Aplicação</span> <ArrowRight size={24} />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 py-8 text-center text-gray-500 text-sm border-t border-gray-800">
        <p>Turno Fácil © 2026. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};
