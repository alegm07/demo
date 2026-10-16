import React, { useState } from 'react';
import { usePass } from '../../context/PassContext';
import { ScreenType } from '../../types';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { currentScreen, setCurrentScreen, activeBranch, setActiveBranch, toast, hideToast } = usePass();
  const [branchMenuOpen, setBranchMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const branches = [
    'Sucursal Principal - Centro',
    'Sucursal Norte',
    'Sucursal Gourmet - Este'
  ];

  const navItems: { id: ScreenType; label: string; icon: string; badge?: string }[] = [
    { id: 'terminal-de-caja', label: 'Terminal de Caja', icon: 'point_of_sale' },
    { id: 'disenador-de-pases', label: 'Diseñador de Pases', icon: 'wallet' },
    { id: 'campanas-y-push', label: 'Campañas & Push', icon: 'campaign' },
    { id: 'metricas-y-clientes', label: 'Métricas & Clientes', icon: 'query_stats' },
    { id: 'ajustes-y-certificados', label: 'Ajustes & Certificados', icon: 'verified_user' },
  ];

  return (
    <div className="bg-background min-h-screen text-on-surface flex">
      {/* SIDEBAR ASIDE */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between border-r border-outline-variant/30">
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="h-16 px-space-lg flex items-center justify-between bg-surface-container-lowest border-b border-outline-variant/20">
            <button 
              onClick={() => setCurrentScreen('landing')} 
              className="flex items-center gap-space-sm text-left hover:opacity-85 transition-opacity"
              title="Ir a Landing Page de PassLoyalty"
            >
              <img
                alt="Logo PassLoyalty"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWLEL3rkl8szOUMqrdJ8HuarUws78up8mAWon0OG6j4sRdJxB0fdZ7QHJEaxfwTLHQCT_Mj7Ubv-oYoPm1Du945juXGNjjFB0fRSze-GkywuRusPg7BfuFEhvhvlnQ-0tZHZRN7tVYjihy-prhUiuDxaJck7QIRfC2LXMmNfOvurHu0VhaKdM_sdt2T_L9Xu6zXB-Va6utAlLmw2EADNzffApkNGAS0IIPyjzWfYZUcUQpzBI9t5Ly"
              />
              <div className="flex flex-col">
                <span className="font-headline-sm text-[16px] text-primary tracking-tight font-bold">PassLoyalty</span>
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Apple Wallet Suite</span>
              </div>
            </button>
          </div>

          {/* Active Branch Switcher */}
          <div className="px-space-md py-space-sm relative">
            <div 
              onClick={() => setBranchMenuOpen(!branchMenuOpen)}
              className="bg-surface-container-low rounded-lg p-space-sm flex items-center justify-between cursor-pointer hover:bg-surface-container transition-colors"
            >
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">store</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-[10px] text-on-surface-variant uppercase font-semibold">Sucursal Activa</span>
                  <span className="font-body-sm text-body-sm font-semibold text-on-surface truncate max-w-[150px]">{activeBranch}</span>
                </div>
              </div>
              <button className="p-space-xs rounded text-on-surface-variant hover:text-on-surface" type="button">
                <span className="material-symbols-outlined text-[18px]">unfold_more</span>
              </button>
            </div>

            {/* Branch dropdown */}
            {branchMenuOpen && (
              <div className="absolute top-full left-space-md right-space-md mt-1 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-1.5 z-50">
                {branches.map(b => (
                  <button
                    key={b}
                    onClick={() => {
                      setActiveBranch(b);
                      setBranchMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-surface-container-low transition-colors ${
                      activeBranch === b ? 'font-semibold text-secondary bg-surface-container-low/50' : 'text-on-surface'
                    }`}
                  >
                    <span>{b}</span>
                    {activeBranch === b && (
                      <span className="material-symbols-outlined text-secondary text-[16px]">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-space-xs px-space-md py-space-sm">
            {navItems.map(item => {
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg transition-all text-left w-full ${
                    isActive
                      ? 'bg-primary text-on-primary font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-on-primary' : ''}`}>
                    {item.icon}
                  </span>
                  <span className="font-body-md text-body-md flex-1">{item.label}</span>
                </button>
              );
            })}

            <div className="my-2 border-t border-outline-variant/20 pt-2">
              <button
                onClick={() => setCurrentScreen('landing')}
                className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all text-left w-full"
              >
                <span className="material-symbols-outlined text-[20px] text-secondary">open_in_new</span>
                <span className="font-body-md text-body-md">Web Pública / SaaS</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Bottom Technical Status */}
        <div className="p-space-md flex flex-col gap-space-sm bg-surface-container-lowest border-t border-outline-variant/20">
          <div className="bg-surface-container-low rounded-lg p-space-sm flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="flex h-2 w-2 rounded-full bg-on-tertiary-container animate-pulse"></span>
              <span className="font-label-code text-label-code text-on-surface font-medium">APNs Apple: Activo</span>
            </div>
            <span className="font-label-code text-label-code text-on-tertiary-container font-semibold">PassKit</span>
          </div>
          <div className="flex items-center justify-between p-space-xs text-on-surface-variant">
            <span className="font-label-sm text-label-sm">PassLoyalty v2.4 Ent</span>
            <span className="material-symbols-outlined text-[16px]">lock</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="pl-72 flex-1 flex flex-col min-h-screen">
        {/* HEADER TOP BAR */}
        <header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-lg border-b border-outline-variant/20">
          <div className="flex items-center gap-space-md">
            <div className="hidden md:flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1.5 rounded-lg text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">hub</span>
              <span className="font-body-sm text-body-sm font-medium">Red Store PassKit:</span>
              <span className="font-body-sm text-body-sm font-semibold text-on-surface">Centro / Norte</span>
            </div>

            <button
              onClick={() => setCurrentScreen('terminal-de-caja')}
              className={`flex items-center gap-space-xs px-space-md py-1.5 rounded-lg transition-all shadow-sm font-body-sm text-body-sm font-semibold ${
                currentScreen === 'terminal-de-caja'
                  ? 'bg-secondary text-on-secondary ring-2 ring-secondary/30'
                  : 'bg-secondary text-on-secondary hover:bg-secondary-container'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
              <span>Acceso Rápido POS</span>
            </button>
          </div>

          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-low">
              <span className="inline-block w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span>
              <span className="font-label-code text-label-code text-on-surface">Apple APNs Conectado</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors relative"
                type="button"
                title="Notificaciones de sistema"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 p-3 z-50 flex flex-col gap-2">
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                    <span className="font-headline-sm text-sm font-bold text-on-surface">Notificaciones Apple APNs</span>
                    <span className="text-[11px] font-label-code text-secondary font-semibold">2 nuevas</span>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-container-low text-xs flex flex-col gap-0.5">
                    <span className="font-semibold text-on-surface">Pase actualizado vía APNs</span>
                    <span className="text-on-surface-variant">Valentina Morales sumó 1 sello en Sucursal Centro.</span>
                    <span className="text-[10px] text-on-surface-variant mt-1 font-label-code">Hace 3 min</span>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-container-low text-xs flex flex-col gap-0.5">
                    <span className="font-semibold text-on-surface">Campaña entregada 100%</span>
                    <span className="text-on-surface-variant">Lote push recibido sin rechazos por Apple gateway.</span>
                    <span className="text-[10px] text-on-surface-variant mt-1 font-label-code">Hace 28 min</span>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-space-sm pl-space-sm border-l border-outline-variant/30">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="font-body-sm text-body-sm font-semibold text-on-surface">Carlos Méndez</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Gerente / Admin</span>
              </div>
              <img
                alt="Profile Carlos Méndez"
                className="w-8 h-8 rounded-full object-cover shadow-sm ring-1 ring-outline-variant/40"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRFEYNuF_acrFeAJtzJ0XGc5Q22HnUiMCCKZ6hLdzFQLHePvqqwhVqMJgOMk1R73FbtTNzp_3bIHBeig7Ze8VNw2b3tDMeXhm8cSMn9cw9Bt7yqFyHw1PtNJokmpNWFZPK9VLlrD3izsT-Zy6tNRWcQC0nW-cGAA45I9J8qjQ_r6l822zAr37obKwMlasafDeNB9y1j1ZG712MzEktymkQaHAxoFNs21b-R5exEYjH7cENPx4ZN8VL"
              />
            </div>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="relative pt-16 bg-background w-full min-h-screen">
          {children}
        </main>
      </div>

      {/* GLOBAL TOAST NOTIFICATION */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-primary text-on-primary px-5 py-3.5 rounded-xl shadow-2xl max-w-md animate-bounce-short">
          <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-bold shrink-0">
            <span className="material-symbols-outlined text-[20px]">check</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-sm font-semibold text-on-primary">{toast.title}</span>
            <span className="font-body-sm text-[12px] text-primary-fixed">{toast.message}</span>
          </div>
          <button 
            onClick={hideToast} 
            className="ml-auto text-primary-fixed hover:text-white p-1"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}
    </div>
  );
};
