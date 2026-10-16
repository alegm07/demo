import React, { useState } from 'react';
import { usePass } from '../../context/PassContext';
import { Customer } from '../../types';

export const MetricsClientsScreen: React.FC = () => {
  const { customers, addCustomer, showToast, passConfig, setActiveCustomer, setCurrentScreen } = usePass();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'reward'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('Últimos 60 días');

  // New Pass Form state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [welcomeStamp, setWelcomeStamp] = useState(true);
  const [consent, setConsent] = useState(true);
  const [generatedPass, setGeneratedPass] = useState<Customer | null>(null);

  const handleCreatePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const created = addCustomer({
      name: newName,
      phone: newPhone,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      stamps: welcomeStamp ? 1 : 0,
      totalSpent: 0,
      visits: 1,
      registeredOrigin: 'Alta Express Mostrador',
      lastVisit: 'Hoy, 09:00',
      lastBranch: 'Sucursal Centro',
      lastCashier: 'Carlos Méndez',
    });

    setGeneratedPass(created);
    showToast('Pase Generado', `Pase .pkpass emitido y enviado por SMS a ${newName}`);
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.passId.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'reward') return c.stamps >= passConfig.totalStamps;
    if (filterType === 'active') return c.stamps > 0;
    return true;
  });

  return (
    <div className="flex flex-col w-full">
      {/* Sub-header / Context Bar */}
      <section className="px-space-lg py-space-md bg-surface-container-lowest shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-space-md border-b border-outline-variant/20">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs">
            <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold">PassKit Enterprise Analytics</span>
            <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container animate-pulse"></span>
            <span className="font-label-code text-label-code text-on-surface-variant">Sincronizado vía APNs</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-0.5 font-bold">
            Métricas, Clientes & Pases Apple Wallet
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Supervisa la adopción de pases digitales, retención de clientes y atribución directa en punto de venta.
          </p>
        </div>

        <div className="flex items-center gap-space-sm flex-wrap relative">
          <div className="relative">
            <button
              onClick={() => setDateRangeOpen(!dateRangeOpen)}
              className="bg-surface-container-low px-space-sm py-1.5 rounded-lg flex items-center gap-space-xs cursor-pointer hover:bg-surface-container transition-colors border border-outline-variant/20"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">calendar_today</span>
              <span className="font-body-sm text-body-sm font-semibold text-on-surface">{selectedRange}</span>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
            </button>
            {dateRangeOpen && (
              <div className="absolute right-0 top-full mt-1 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-1 w-44 z-30">
                {['Últimos 7 días', 'Últimos 30 días', 'Últimos 60 días', 'Año en curso'].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setSelectedRange(r);
                      setDateRangeOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => showToast('Exportación Exitosa', 'Descargando base de datos completa de pases y métricas')}
            className="px-space-md py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold flex items-center gap-space-xs transition-colors border border-outline-variant/20 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => {
              setGeneratedPass(null);
              setIsModalOpen(true);
            }}
            className="px-space-md py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-body-sm text-body-sm font-semibold flex items-center gap-space-xs transition-colors shadow-sm cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Nuevo Pase Rápido</span>
          </button>
        </div>
      </section>

      <div className="p-space-lg flex flex-col gap-space-xl max-w-[1520px] mx-auto w-full">
        {/* 1. Tarjetas de KPIs Principales */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
          {/* KPI 1 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-outline-variant/20">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-secondary-fixed/30 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-space-sm">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Total Pases Instalados</span>
              <span className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">wallet</span>
              </span>
            </div>
            <div className="flex items-baseline gap-space-sm mb-space-xs">
              <span className="font-display text-display font-bold text-on-surface">3,420</span>
              <span className="px-space-xs py-0.5 rounded bg-surface-container-highest text-on-tertiary-container font-label-code text-label-code font-bold flex items-center">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> +14%
              </span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant pt-space-xs">
              <span className="font-body-sm text-body-sm">Crecimiento vs mes previo</span>
              <span className="font-label-code text-label-code text-secondary font-medium">98.4% retención</span>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-outline-variant/20">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-tertiary-fixed/30 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-space-sm">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Sellos Otorgados</span>
              <span className="w-8 h-8 rounded-lg bg-tertiary-fixed-dim/20 text-on-tertiary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">verified</span>
              </span>
            </div>
            <div className="flex items-baseline gap-space-sm mb-space-xs">
              <span className="font-display text-display font-bold text-on-surface">28,490</span>
              <span className="px-space-xs py-0.5 rounded bg-surface-container-low text-on-surface-variant font-label-code text-label-code font-semibold">
                4.2 / cliente
              </span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant pt-space-xs">
              <span className="font-body-sm text-body-sm">Frecuencia de visita</span>
              <span className="font-label-code text-label-code text-on-surface font-semibold">~1.8 visitas/semana</span>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-outline-variant/20">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-secondary-fixed/20 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-space-sm">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Recompensas Canjeadas</span>
              <span className="w-8 h-8 rounded-lg bg-secondary-fixed/60 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">redeem</span>
              </span>
            </div>
            <div className="flex items-baseline gap-space-sm mb-space-xs">
              <span className="font-display text-display font-bold text-on-surface">1,840</span>
              <span className="px-space-xs py-0.5 rounded bg-surface-container-low text-secondary font-label-code text-label-code font-bold">
                64.5% tasa
              </span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant pt-space-xs">
              <span className="font-body-sm text-body-sm">Canjes en mostrador POS</span>
              <span className="font-label-code text-label-code text-on-surface font-semibold">Ticket +18% al canjear</span>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-outline-variant/20">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-surface-variant/40 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-space-sm">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Ventas Atribuidas</span>
              <span className="w-8 h-8 rounded-lg bg-surface-container-highest text-on-surface flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">payments</span>
              </span>
            </div>
            <div className="flex items-baseline gap-space-sm mb-space-xs">
              <span className="font-display text-display font-bold text-on-surface">€84,200</span>
              <span className="px-space-xs py-0.5 rounded bg-surface-container-highest text-on-surface font-label-code text-label-code font-bold">
                +32% ticket
              </span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant pt-space-xs">
              <span className="font-body-sm text-body-sm">Ticket medio fidelizado</span>
              <span className="font-label-code text-label-code text-on-surface font-semibold">€24.80 vs €18.70</span>
            </div>
          </div>
        </section>

        {/* 2. Gráficos de Rendimiento (Bento Grid) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Evolución de Altas vs Canjes (8 Cols) */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
              <div className="flex flex-col">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Adopción y Ciclo de Canjes (8 Semanas)</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Nuevos pases agregados al Wallet versus recompensas liberadas y consumidas.</p>
              </div>
              <div className="flex items-center gap-space-md">
                <div className="flex items-center gap-space-xs">
                  <span className="w-3 h-3 rounded-full bg-secondary"></span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Altas Apple Wallet</span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="w-3 h-3 rounded-full bg-on-tertiary-container"></span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Recompensas</span>
                </div>
              </div>
            </div>

            {/* SVG Line/Area Chart */}
            <div className="w-full h-64 relative flex flex-col justify-end">
              <svg className="w-full h-52 overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 200">
                <defs>
                  <linearGradient id="gradientWallet" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#4b41e1" stopOpacity="0.25"></stop>
                    <stop offset="100%" stopColor="#4b41e1" stopOpacity="0.0"></stop>
                  </linearGradient>
                  <linearGradient id="gradientRedeem" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#009668" stopOpacity="0.20"></stop>
                    <stop offset="100%" stopColor="#009668" stopOpacity="0.0"></stop>
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line stroke="#e5eeff" strokeDasharray="4,4" strokeWidth="1" x1="0" x2="700" y1="40" y2="40"></line>
                <line stroke="#e5eeff" strokeDasharray="4,4" strokeWidth="1" x1="0" x2="700" y1="90" y2="90"></line>
                <line stroke="#e5eeff" strokeDasharray="4,4" strokeWidth="1" x1="0" x2="700" y1="140" y2="140"></line>
                <line stroke="#dce9ff" strokeWidth="1" x1="0" x2="700" y1="190" y2="190"></line>

                {/* Area Wallet Altas */}
                <path d="M0,160 Q 90,135 180,120 T 360,70 T 540,45 T 700,25 L 700,190 L 0,190 Z" fill="url(#gradientWallet)"></path>
                {/* Line Wallet Altas */}
                <path d="M0,160 Q 90,135 180,120 T 360,70 T 540,45 T 700,25" fill="none" stroke="#4b41e1" strokeLinecap="round" strokeWidth="3"></path>

                {/* Area Recompensas */}
                <path d="M0,180 Q 90,170 180,150 T 360,115 T 540,90 T 700,60 L 700,190 L 0,190 Z" fill="url(#gradientRedeem)"></path>
                {/* Line Recompensas */}
                <path d="M0,180 Q 90,170 180,150 T 360,115 T 540,90 T 700,60" fill="none" stroke="#009668" strokeLinecap="round" strokeWidth="2.5"></path>

                {/* Key Metric Nodes */}
                <circle cx="360" cy="70" fill="#ffffff" r="4" stroke="#4b41e1" strokeWidth="3"></circle>
                <circle cx="700" cy="25" fill="#4b41e1" r="5"></circle>
                <circle cx="700" cy="60" fill="#009668" r="4"></circle>
              </svg>

              {/* X-Axis Labels */}
              <div className="flex justify-between items-center text-on-surface-variant font-label-code text-label-code pt-space-xs">
                <span>Sem 1</span>
                <span>Sem 2</span>
                <span>Sem 3</span>
                <span>Sem 4 (Lanzamiento)</span>
                <span>Sem 5</span>
                <span>Sem 6</span>
                <span>Sem 7</span>
                <span className="font-bold text-on-surface">Sem 8 (Actual)</span>
              </div>
            </div>

            <div className="mt-space-md p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between text-body-sm text-body-sm">
              <div className="flex items-center gap-space-xs text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[18px]">bolt</span>
                <span className="font-medium">
                  Pico de instalación alcanzado en la Semana 8 con <strong>+610 pases/semana</strong> tras campaña QR de mostrador.
                </span>
              </div>
              <button 
                onClick={() => showToast('Reporte de Cohortes', 'Generando desglose semanal de retención a 90 días')}
                className="font-label-code text-label-code text-secondary font-semibold hover:underline cursor-pointer"
              >
                Ver reporte de cohortes →
              </button>
            </div>
          </div>

          {/* Rendimiento por Sucursal y Cajero (4 Cols) */}
          <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Rendimiento por Sucursal</span>
                <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface font-label-code text-label-code font-bold">
                  2 Sucursales
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">Sellos registrados y actividad en POS</p>

              {/* Branch 1: Sucursal Centro */}
              <div className="flex flex-col gap-space-xs mb-space-md">
                <div className="flex justify-between items-baseline">
                  <span className="font-body-md text-body-md font-semibold text-on-surface">Sucursal Centro</span>
                  <div className="flex items-baseline gap-space-xs">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">18,200</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">sellos (63.9%)</span>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-container-low overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '64%' }}></div>
                </div>
                <div className="flex items-center justify-between text-body-sm text-body-sm text-on-surface-variant pt-0.5">
                  <span>Cajero líder: <strong>Marcos V.</strong> (9,410 sellos)</span>
                  <span className="font-label-code text-label-code text-on-tertiary-container font-semibold">€54.1k fact.</span>
                </div>
              </div>

              {/* Branch 2: Sucursal Norte */}
              <div className="flex flex-col gap-space-xs mb-space-md">
                <div className="flex justify-between items-baseline">
                  <span className="font-body-md text-body-md font-semibold text-on-surface">Sucursal Norte</span>
                  <div className="flex items-baseline gap-space-xs">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">10,290</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">sellos (36.1%)</span>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-container-low overflow-hidden">
                  <div className="h-full bg-secondary-container rounded-full" style={{ width: '36.1%' }}></div>
                </div>
                <div className="flex items-center justify-between text-body-sm text-body-sm text-on-surface-variant pt-0.5">
                  <span>Cajera líder: <strong>Elena R.</strong> (6,120 sellos)</span>
                  <span className="font-label-code text-label-code text-on-tertiary-container font-semibold">€30.1k fact.</span>
                </div>
              </div>
            </div>

            {/* Metric pill summary */}
            <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/10">
              <div className="flex items-center justify-between font-label-code text-label-code">
                <span className="text-on-surface-variant font-medium">Velocidad Escaneo POS</span>
                <span className="text-on-surface font-bold">1.4 segundos / pase</span>
              </div>
              <div className="flex items-center justify-between font-label-code text-label-code">
                <span className="text-on-surface-variant font-medium">Efectividad Escáner NFC/QR</span>
                <span className="text-on-tertiary-container font-bold">99.8% éxito</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Directorio de Clientes & Pases Registrados (HU-02, HU-03) */}
        <section className="bg-surface-container-lowest rounded-xl shadow-sm flex flex-col border border-outline-variant/20">
          {/* Table Header & Controls */}
          <div className="p-space-lg flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div className="flex flex-col">
              <div className="flex items-center gap-space-sm">
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Directorio de Clientes & Pases Registrados</h2>
                <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-code text-label-code font-bold">
                  {customers.length} Registros
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Gestión de cartera, estado de credenciales PassKit y balance de sellos en tiempo real.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex items-center gap-space-sm flex-wrap">
              <div className="relative flex items-center min-w-[280px]">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">search</span>
                <input
                  className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg pl-9 pr-3 py-2 outline-none focus:bg-surface-container transition-colors border border-outline-variant/20"
                  placeholder="Buscar por Nombre, Teléfono o Pass ID..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Quick Filters Buttons */}
              <div className="flex items-center gap-space-xs bg-surface-container-low p-1 rounded-lg border border-outline-variant/20">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-space-sm py-1 rounded font-body-sm text-body-sm font-semibold transition-all cursor-pointer ${
                    filterType === 'all' ? 'bg-surface-container-lowest text-on-surface shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  Todos ({customers.length})
                </button>
                <button
                  onClick={() => setFilterType('active')}
                  className={`px-space-sm py-1 rounded font-body-sm text-body-sm font-medium transition-all cursor-pointer ${
                    filterType === 'active' ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  Activos
                </button>
                <button
                  onClick={() => setFilterType('reward')}
                  className={`px-space-sm py-1 rounded font-body-sm text-body-sm font-medium flex items-center gap-1 transition-all cursor-pointer ${
                    filterType === 'reward' ? 'bg-surface-container-lowest text-secondary shadow-xs font-semibold' : 'text-secondary hover:text-secondary-container'
                  }`}
                  type="button"
                >
                  <span className="w-2 h-2 rounded-full bg-secondary"></span> Recompensa Lista
                </button>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                  <th className="py-space-sm px-space-lg font-semibold">Cliente</th>
                  <th className="py-space-sm px-space-md font-semibold">Registro & Origen</th>
                  <th className="py-space-sm px-space-md font-semibold">Apple Wallet Pass</th>
                  <th className="py-space-sm px-space-md font-semibold">Sellos Actuales</th>
                  <th className="py-space-sm px-space-md font-semibold">Gasto & Visitas</th>
                  <th className="py-space-sm px-space-md font-semibold">Última Atención</th>
                  <th className="py-space-sm px-space-lg text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low text-body-md text-body-md text-on-surface">
                {filteredCustomers.map((cust) => {
                  const isReady = cust.stamps >= passConfig.totalStamps;
                  return (
                    <tr key={cust.id} className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="py-space-md px-space-lg">
                        <div className="flex items-center gap-space-sm">
                          {cust.avatarUrl ? (
                            <img
                              src={cust.avatarUrl}
                              alt={cust.name}
                              className="w-10 h-10 rounded-full object-cover shadow-sm"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary font-bold flex items-center justify-center font-headline-sm text-headline-sm">
                              {cust.initials}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">{cust.name}</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                              {cust.phone} • {cust.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-space-md px-space-md">
                        <div className="flex flex-col">
                          <span className="font-body-sm text-body-sm font-medium text-on-surface">{cust.registeredDate}</span>
                          <span className="font-label-code text-label-code text-on-surface-variant">{cust.registeredOrigin}</span>
                        </div>
                      </td>

                      <td className="py-space-md px-space-md">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-space-xs">
                            <span className="material-symbols-outlined text-[16px] text-on-surface">file_download</span>
                            <span className="font-body-sm text-body-sm font-semibold text-on-surface">{cust.iosVersion}</span>
                          </div>
                          <span className="font-label-code text-label-code text-on-surface-variant truncate max-w-[140px]">{cust.passId}</span>
                        </div>
                      </td>

                      <td className="py-space-md px-space-md">
                        <div className="flex flex-col gap-1 min-w-[130px]">
                          {isReady ? (
                            <span className="px-space-xs py-0.5 rounded-full bg-secondary-fixed text-secondary font-label-code text-label-code font-bold inline-flex items-center gap-1 w-fit">
                              <span className="material-symbols-outlined text-[14px]">stars</span> ¡Recompensa Lista!
                            </span>
                          ) : (
                            <span className="px-space-xs py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-code text-label-code font-medium inline-flex items-center gap-1 w-fit">
                              Faltan {passConfig.totalStamps - cust.stamps} sellos
                            </span>
                          )}

                          <div className="flex items-center gap-space-xs">
                            <div className="w-20 h-2 bg-surface-container-high rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${isReady ? 'bg-secondary' : 'bg-on-tertiary-container'}`}
                                style={{ width: `${Math.min(100, (cust.stamps / passConfig.totalStamps) * 100)}%` }}
                              ></div>
                            </div>
                            <span className="font-label-code text-label-code font-bold text-on-surface">
                              {cust.stamps}/{passConfig.totalStamps}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-space-md px-space-md">
                        <div className="flex flex-col">
                          <span className="font-body-sm text-body-sm font-bold text-on-surface">€{cust.totalSpent.toFixed(2)}</span>
                          <span className="font-label-code text-label-code text-on-surface-variant">{cust.visits} visitas registradas</span>
                        </div>
                      </td>

                      <td className="py-space-md px-space-md">
                        <div className="flex flex-col">
                          <span className="font-body-sm text-body-sm font-medium text-on-surface">{cust.lastBranch}</span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">Cajero {cust.lastCashier}</span>
                        </div>
                      </td>

                      <td className="py-space-md px-space-lg text-right">
                        <div className="flex items-center justify-end gap-space-xs">
                          <button
                            onClick={() => {
                              setActiveCustomer(cust);
                              setCurrentScreen('terminal-de-caja');
                              showToast('Cliente Cargado en POS', `${cust.name} listo para escanear en caja`);
                            }}
                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                            title="Atender en Terminal POS"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">credit_card</span>
                          </button>
                          <button
                            onClick={() => {
                              showToast('Push Individual Enviado', `Aviso instantáneo transmitido al Apple Wallet de ${cust.name}`);
                            }}
                            className="p-1.5 rounded-lg text-secondary hover:text-secondary-container hover:bg-surface-container-high transition-colors cursor-pointer"
                            title="Enviar Notificación Push individual"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">send_to_mobile</span>
                          </button>
                          <button
                            onClick={() => {
                              showToast('Historial de Cliente', `Mostrando auditoría histórica de ${cust.name}`);
                            }}
                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                            title="Historial de Sellos"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">history</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-space-md bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-space-sm rounded-b-xl border-t border-outline-variant/10">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Mostrando {filteredCustomers.length} de {customers.length} pases registrados
            </span>
            <div className="flex items-center gap-space-xs">
              <button className="px-space-sm py-1 rounded bg-surface-container-low font-body-sm text-body-sm font-medium text-on-surface disabled:opacity-50" disabled type="button">
                Anterior
              </button>
              <button className="w-8 h-8 rounded bg-primary text-on-primary font-body-sm text-body-sm font-bold flex items-center justify-center" type="button">
                1
              </button>
              <button className="w-8 h-8 rounded bg-surface-container-low hover:bg-surface-container font-body-sm text-body-sm font-medium text-on-surface flex items-center justify-center cursor-pointer" type="button">
                2
              </button>
              <button className="w-8 h-8 rounded bg-surface-container-low hover:bg-surface-container font-body-sm text-body-sm font-medium text-on-surface flex items-center justify-center cursor-pointer" type="button">
                3
              </button>
              <span className="text-on-surface-variant px-1 font-label-code text-label-code">...</span>
              <button className="w-8 h-8 rounded bg-surface-container-low hover:bg-surface-container font-body-sm text-body-sm font-medium text-on-surface flex items-center justify-center cursor-pointer" type="button">
                114
              </button>
              <button className="px-space-sm py-1 rounded bg-surface-container-low hover:bg-surface-container font-body-sm text-body-sm font-medium text-on-surface cursor-pointer" type="button">
                Siguiente
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* 4. Panel Lateral / Modal de Registro Rápido (HU-02) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-inverse-surface/40 backdrop-blur-sm transition-opacity">
          <div className="bg-surface-container-lowest w-full max-w-lg h-full shadow-2xl p-space-xl flex flex-col justify-between overflow-y-auto border-l border-outline-variant/30">
            <div className="flex flex-col gap-space-lg">
              {/* Drawer Header */}
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold">HU-02 Alta Express de Cliente</span>
                  <h2 className="font-headline-md text-headline-md text-on-surface mt-1 font-bold">Nuevo Pase Apple Wallet</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Genera un pase de fidelización en 30 segundos en caja o muestra el QR dinámico al cliente.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[24px]">close</span>
                </button>
              </div>

              {/* Mode Toggle */}
              <div className="grid grid-cols-2 gap-space-xs p-1 bg-surface-container-low rounded-lg border border-outline-variant/20">
                <button className="py-1.5 rounded-md bg-surface-container-lowest shadow-sm font-body-sm text-body-sm font-semibold text-on-surface flex items-center justify-center gap-1" type="button">
                  <span className="material-symbols-outlined text-[18px]">edit_note</span> Registro Manual
                </button>
                <button
                  onClick={() => showToast('Modo QR de Mostrador', 'Muestra el código QR al cliente para captura sin contacto')}
                  className="py-1.5 rounded-md font-body-sm text-body-sm font-medium text-on-surface-variant hover:text-on-surface flex items-center justify-center gap-1 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span> QR para Mesa / POS
                </button>
              </div>

              {/* Quick Form */}
              <form className="flex flex-col gap-space-md" onSubmit={handleCreatePass}>
                <div className="flex flex-col gap-1">
                  <label className="font-body-sm text-body-sm font-medium text-on-surface">Nombre y Apellidos *</label>
                  <input
                    className="bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-secondary/20 border border-outline-variant/20"
                    placeholder="Ej. Camila Navarro"
                    required
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-body-sm text-body-sm font-medium text-on-surface">
                    Teléfono Móvil (Recibe el Pase por SMS/WhatsApp) *
                  </label>
                  <input
                    className="bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-secondary/20 border border-outline-variant/20"
                    placeholder="+34 600 000 000"
                    required
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-body-sm text-body-sm font-medium text-on-surface">Correo Electrónico (Opcional)</label>
                  <input
                    className="bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-secondary/20 border border-outline-variant/20"
                    placeholder="cliente@icloud.com"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>

                {/* Sellos de bienvenida */}
                <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/20">
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm font-semibold text-on-surface">Sellos de Bienvenida</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Otorga el 1er sello automáticamente</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-headline-sm text-headline-sm font-bold text-secondary">+1 Sello</span>
                    <input
                      checked={welcomeStamp}
                      onChange={(e) => setWelcomeStamp(e.target.checked)}
                      className="w-4 h-4 rounded text-secondary focus:ring-0 cursor-pointer accent-secondary"
                      type="checkbox"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 rounded text-secondary focus:ring-0 cursor-pointer accent-secondary"
                    id="privacyConsent"
                    required
                    type="checkbox"
                  />
                  <label className="font-body-sm text-[12px] text-on-surface-variant cursor-pointer" htmlFor="privacyConsent">
                    El cliente autoriza el alta en el programa de recompensas y recepción de avisos de saldo en Apple Wallet conforme a la RGPD.
                  </label>
                </div>

                <button
                  className="w-full py-2.5 rounded-lg bg-primary text-on-primary font-body-md text-body-md font-semibold hover:bg-primary-container transition-colors shadow-sm mt-2 flex items-center justify-center gap-space-xs cursor-pointer"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-[20px]">send_to_mobile</span>
                  <span>Generar y Enviar Pase Apple Wallet</span>
                </button>
              </form>

              {/* Simulated Generated .pkpass Preview Card */}
              {generatedPass && (
                <div className="flex flex-col gap-space-sm p-space-md rounded-xl bg-surface-container-low transition-all border border-secondary/30">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-tertiary-container font-bold uppercase flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-on-tertiary-container"></span> Pase .pkpass Listo
                    </span>
                    <span className="font-label-code text-label-code text-on-surface-variant font-semibold">
                      ID: {generatedPass.passId}
                    </span>
                  </div>

                  <div className="rounded-xl p-space-md bg-primary text-on-primary shadow-lg flex flex-col justify-between h-44 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-[20px]">store</span>
                        <span className="font-headline-sm text-headline-sm font-bold tracking-tight">PassLoyalty Store</span>
                      </div>
                      <span className="font-label-sm text-[10px] uppercase bg-white/20 px-2 py-0.5 rounded font-semibold">Tarjeta Sellos</span>
                    </div>

                    <div className="flex justify-between items-end z-10">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-inverse-primary uppercase">Titular</span>
                        <span className="font-body-lg text-body-lg font-semibold text-white">{generatedPass.name}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="font-label-sm text-label-sm text-inverse-primary uppercase">Balance</span>
                        <span className="font-headline-sm text-headline-sm font-bold text-tertiary-fixed">
                          {generatedPass.stamps} / {passConfig.totalStamps} Sellos
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/10 text-white/70 font-label-code text-label-code z-10">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">file_download</span> Apple Wallet
                      </span>
                      <span>Actualización en vivo</span>
                    </div>
                  </div>

                  <button
                    onClick={() => showToast('Apple Wallet', `Pase de ${generatedPass.name} añadido a Wallet`)}
                    className="w-full py-2.5 rounded-lg bg-black text-white font-body-md text-body-md font-semibold flex items-center justify-center gap-space-xs hover:bg-neutral-900 shadow-md cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">file_download</span>
                    <span>Añadir a Apple Wallet</span>
                  </button>
                </div>
              )}
            </div>

            <div className="pt-space-md text-center border-t border-outline-variant/20">
              <span className="font-label-code text-label-code text-on-surface-variant">
                Conexión cifrada directa con Apple Push Notification Service
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
