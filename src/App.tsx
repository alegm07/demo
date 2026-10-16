/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PassProvider, usePass } from './context/PassContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingScreen } from './components/screens/LandingScreen';
import { PassDesignerScreen } from './components/screens/PassDesignerScreen';
import { PosTerminalScreen } from './components/screens/PosTerminalScreen';
import { PushCampaignsScreen } from './components/screens/PushCampaignsScreen';
import { MetricsClientsScreen } from './components/screens/MetricsClientsScreen';
import { SettingsCertificatesScreen } from './components/screens/SettingsCertificatesScreen';

const AppContent: React.FC = () => {
  const { currentScreen, setCurrentScreen } = usePass();

  return (
    <>
      {/* Floating Demo Navigation Bar for Instant Multi-Screen Preview */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 bg-primary/95 text-on-primary px-3 py-1.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-1.5 border border-white/20 text-xs font-semibold">
        <span className="font-label-code text-[11px] text-tertiary-fixed mr-1 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed animate-ping"></span>
          Vistas:
        </span>
        <button
          onClick={() => setCurrentScreen('landing')}
          className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
            currentScreen === 'landing' ? 'bg-secondary text-white shadow' : 'text-white/80 hover:text-white'
          }`}
          title="Ver Landing Page y Simulador ROI"
        >
          1. Landing & ROI
        </button>
        <button
          onClick={() => setCurrentScreen('disenador-de-pases')}
          className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
            currentScreen === 'disenador-de-pases' ? 'bg-secondary text-white shadow' : 'text-white/80 hover:text-white'
          }`}
          title="Ver Diseñador de Pases con Simulador iPhone"
        >
          2. Diseñador .pkpass
        </button>
        <button
          onClick={() => setCurrentScreen('terminal-de-caja')}
          className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
            currentScreen === 'terminal-de-caja' ? 'bg-secondary text-white shadow' : 'text-white/80 hover:text-white'
          }`}
          title="Ver Terminal POS de Caja"
        >
          3. Terminal POS
        </button>
        <button
          onClick={() => setCurrentScreen('campanas-y-push')}
          className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
            currentScreen === 'campanas-y-push' ? 'bg-secondary text-white shadow' : 'text-white/80 hover:text-white'
          }`}
          title="Ver Campañas Push APNs"
        >
          4. Campañas Push
        </button>
        <button
          onClick={() => setCurrentScreen('metricas-y-clientes')}
          className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
            currentScreen === 'metricas-y-clientes' ? 'bg-secondary text-white shadow' : 'text-white/80 hover:text-white'
          }`}
          title="Ver Métricas y Directorio de Clientes"
        >
          5. Métricas & Clientes
        </button>
      </div>

      {currentScreen === 'landing' ? (
        <LandingScreen />
      ) : (
        <AppLayout>
          {currentScreen === 'disenador-de-pases' && <PassDesignerScreen />}
          {currentScreen === 'terminal-de-caja' && <PosTerminalScreen />}
          {currentScreen === 'campanas-y-push' && <PushCampaignsScreen />}
          {currentScreen === 'metricas-y-clientes' && <MetricsClientsScreen />}
          {currentScreen === 'ajustes-y-certificados' && <SettingsCertificatesScreen />}
        </AppLayout>
      )}
    </>
  );
};

export default function App() {
  return (
    <PassProvider>
      <AppContent />
    </PassProvider>
  );
}
