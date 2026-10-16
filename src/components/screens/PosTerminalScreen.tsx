import React, { useState } from 'react';
import { usePass } from '../../context/PassContext';
import { Customer } from '../../types';

export const PosTerminalScreen: React.FC = () => {
  const {
    activeCustomer,
    setActiveCustomer,
    customers,
    transactions,
    addTransaction,
    updateActiveCustomerStamps,
    redeemActiveCustomerReward,
    passConfig,
    showToast,
  } = usePass();

  const [selectedAddition, setSelectedAddition] = useState<number>(1);
  const [ticketAmount, setTicketAmount] = useState<string>('24.50');
  const [fastMode, setFastMode] = useState<boolean>(true);
  const [manualModalOpen, setManualModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const totalMax = passConfig.totalStamps || 10;
  const currentStamps = activeCustomer.stamps;
  const simulatedNewTotal = Math.min(totalMax, currentStamps + selectedAddition);
  const stampsRemaining = Math.max(0, totalMax - simulatedNewTotal);

  const handleSelectStamps = (amount: number) => {
    setSelectedAddition(amount);
  };

  const handleConfirmTransaction = () => {
    setIsProcessing(true);
    const amountVal = parseFloat(ticketAmount) || 0;

    setTimeout(() => {
      updateActiveCustomerStamps(selectedAddition);
      addTransaction({
        customerName: activeCustomer.name,
        passId: activeCustomer.passId,
        action: `+ ${selectedAddition} Sello${selectedAddition > 1 ? 's' : ''}`,
        stampsDelta: selectedAddition,
        ticketAmount: amountVal,
        cashier: 'Sofía Ramos',
        status: 'Sincronizado APNs',
      });

      setIsProcessing(false);
      showToast(
        '¡Pase Actualizado con Éxito!',
        `Notificación Push enviada al iPhone de ${activeCustomer.name} vía Apple APNs`
      );
    }, 600);
  };

  const handleCanjear = () => {
    if (activeCustomer.stamps < totalMax) return;
    setIsProcessing(true);

    setTimeout(() => {
      redeemActiveCustomerReward();
      addTransaction({
        customerName: activeCustomer.name,
        passId: activeCustomer.passId,
        action: 'Canje Recompensa (10S)',
        stampsDelta: -totalMax,
        ticketAmount: 0.0,
        cashier: 'Sofía Ramos',
        status: 'Sincronizado APNs',
      });

      setIsProcessing(false);
      showToast(
        'Recompensa Canjeada',
        `Pase de ${activeCustomer.name} puesto a cero con ticket bonificado`
      );
    }, 600);
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.passId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full">
      {/* Operator Sub-Header */}
      <div className="px-space-lg py-space-md bg-surface-container-low flex flex-wrap items-center justify-between gap-space-md shadow-sm border-b border-outline-variant/20">
        <div className="flex items-center gap-space-lg">
          <div className="flex items-center gap-space-sm bg-surface-container-lowest px-space-md py-space-xs rounded-full shadow-sm border border-outline-variant/30">
            <span className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container animate-pulse"></span>
            <span className="font-body-sm text-body-sm font-semibold text-on-surface">Terminal POS #02</span>
            <span className="text-outline-variant">•</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Sucursal Centro</span>
          </div>

          <div className="flex items-center gap-space-xs text-on-surface">
            <span className="material-symbols-outlined text-[20px] text-secondary">badge</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Operador:</span>
            <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Sofía Ramos</span>
          </div>
        </div>

        <div className="flex items-center gap-space-md">
          {/* Quick Mode Switcher */}
          <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-sm py-1 rounded-lg border border-outline-variant/20">
            <span className="material-symbols-outlined text-secondary text-[18px]">bolt</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface font-semibold">Modo Rápido POS</span>
            <button
              onClick={() => setFastMode(!fastMode)}
              className={`w-8 h-4.5 rounded-full relative p-0.5 transition-colors focus:outline-none cursor-pointer ${
                fastMode ? 'bg-secondary' : 'bg-outline-variant'
              }`}
              type="button"
            >
              <span
                className={`block w-3.5 h-3.5 bg-surface-container-lowest rounded-full shadow transform transition-transform ${
                  fastMode ? 'translate-x-3.5' : 'translate-x-0'
                }`}
              ></span>
            </button>
          </div>

          {/* NFC / QR Sensor State */}
          <div className="flex items-center gap-space-xs bg-primary-container text-on-primary px-space-md py-1.5 rounded-lg shadow-sm">
            <span className="material-symbols-outlined text-[18px] text-tertiary-fixed-dim">sensors</span>
            <span className="font-label-code text-label-code text-primary-fixed uppercase tracking-wider font-semibold">
              Lector NFC/QR: Listo
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="p-space-lg max-w-[1520px] mx-auto w-full flex flex-col gap-space-xl">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
          {/* LEFT COLUMN: Scanner & Active Customer Profile (6 Cols) */}
          <div className="xl:col-span-6 flex flex-col gap-space-lg">
            {/* Live Optical Scanner */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden border border-outline-variant/20">
              <div className="flex items-center justify-between pb-space-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[22px]">qr_code_scanner</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Escáner Apple Wallet</span>
                </div>
                <span className="font-label-code text-label-code bg-surface-container text-on-surface-variant px-2.5 py-1 rounded font-medium">
                  Live Optical Feed
                </span>
              </div>

              {/* Viewfinder Canvas */}
              <div className="relative w-full h-56 bg-primary-container rounded-lg overflow-hidden flex items-center justify-center shadow-inner">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#dae2fd_1px,transparent_1px)] [background-size:16px_16px]"></div>

                <div className="relative w-48 h-48 rounded-lg flex items-center justify-center p-space-sm">
                  {/* Glowing Reticle Corners */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-secondary rounded-tl"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-secondary rounded-tr"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-secondary rounded-bl"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-secondary rounded-br"></div>

                  {/* Laser Scanning Line */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-tertiary-fixed-dim to-transparent absolute top-0 shadow-[0_0_12px_#4edea3] animate-[bounce_2.5s_infinite]"></div>

                  {/* Center prompt icon */}
                  <div className="flex flex-col items-center justify-center gap-space-xs text-center p-space-sm bg-surface-container-lowest/10 backdrop-blur-sm rounded-lg">
                    <span className="material-symbols-outlined text-on-primary text-[36px]">contactless</span>
                    <span className="font-body-sm text-body-sm text-surface-container-lowest font-medium">
                      Acerque iPhone o Apple Watch
                    </span>
                    <span className="font-label-code text-label-code text-primary-fixed-dim">Detectando .pkpass</span>
                  </div>
                </div>

                <div className="absolute bottom-2.5 left-space-md right-space-md flex items-center justify-between text-on-primary-container">
                  <span className="font-label-code text-label-code flex items-center gap-1.5 text-surface-container-lowest">
                    <span className="w-2 h-2 rounded-full bg-on-tertiary-container"></span> Auto-Focus Lock
                  </span>
                  <span className="font-label-code text-label-code text-surface-container-lowest">ISO/IEC 18004 QR</span>
                </div>
              </div>

              {/* Action buttons below scanner */}
              <div className="pt-space-sm flex items-center justify-between gap-space-sm">
                <button
                  onClick={() => setManualModalOpen(true)}
                  className="flex-1 py-2 px-space-sm bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg font-body-sm text-body-sm font-semibold flex items-center justify-center gap-space-xs transition-colors cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">dialpad</span>
                  <span>Ingreso Manual (Teléfono / ID de Pase)</span>
                </button>
                <button
                  onClick={() => showToast('Cámara Alternada', 'Conmutando entre cámara frontal y lector de código')}
                  className="p-2 bg-surface-container-low hover:bg-surface-container text-on-surface-variant rounded-lg transition-colors cursor-pointer"
                  title="Alternar Cámara"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">flip_camera_ios</span>
                </button>
              </div>
            </div>

            {/* Active Customer Details & Apple Wallet Loyalty Pass Card */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-space-md">
                  <div className="relative">
                    {activeCustomer.avatarUrl ? (
                      <img
                        className="w-16 h-16 rounded-full object-cover shadow-sm ring-2 ring-secondary/20"
                        alt={`Foto de ${activeCustomer.name}`}
                        src={activeCustomer.avatarUrl}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-secondary text-on-secondary font-bold flex items-center justify-center text-xl shadow-sm">
                        {activeCustomer.initials}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 bg-secondary text-on-secondary w-6 h-6 rounded-full flex items-center justify-center text-[12px] shadow">
                      <span className="material-symbols-outlined text-[14px]">star</span>
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-headline-md text-headline-md text-on-surface font-semibold">{activeCustomer.name}</span>
                      <span className="bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full font-label-sm text-label-sm uppercase font-semibold">
                        {activeCustomer.tier}
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[16px]">call</span> {activeCustomer.phone}
                    </span>
                    <span className="font-label-code text-label-code text-secondary font-medium tracking-wide mt-1">
                      ID: {activeCustomer.passId}
                    </span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-semibold">Última Visita</span>
                  <span className="font-body-md text-body-md font-semibold text-on-surface">{activeCustomer.lastVisit}</span>
                  <span className="font-label-code text-label-code text-on-tertiary-container mt-1 bg-surface-container-low px-2 py-0.5 rounded font-semibold">
                    {activeCustomer.lastBranch}
                  </span>
                </div>
              </div>

              {/* Realistic Apple Wallet Card */}
              <div className="relative bg-gradient-to-br from-primary-container via-surface-container-highest/20 to-primary-container p-space-md rounded-xl text-on-primary shadow-lg overflow-hidden">
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-secondary/30 rounded-full blur-2xl"></div>

                <div className="flex items-center justify-between pb-space-sm relative z-10">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-secondary-fixed text-[22px]">local_cafe</span>
                    <span className="font-headline-sm text-headline-sm text-on-primary font-bold">PassLoyalty Café Club</span>
                  </div>
                  <div className="flex items-center gap-1 bg-surface-container-lowest/15 backdrop-blur-md px-space-sm py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-[14px] text-tertiary-fixed-dim">verified</span>
                    <span className="font-label-code text-label-code text-surface-container-lowest">Apple PKPass</span>
                  </div>
                </div>

                <div className="relative z-10 py-space-xs">
                  <div className="flex items-baseline justify-between mb-space-xs">
                    <span className="font-body-md text-body-md text-primary-fixed">Progreso de la Tarjeta</span>
                    <span className="font-headline-md text-headline-md font-bold text-tertiary-fixed">
                      <span>{simulatedNewTotal}</span> / {totalMax} Sellos
                    </span>
                  </div>

                  {/* Stamp slots grid */}
                  <div className="grid grid-cols-5 gap-2.5 my-space-sm p-space-sm bg-surface-container-lowest/10 backdrop-blur-md rounded-lg">
                    {Array.from({ length: totalMax }).map((_, i) => {
                      const num = i + 1;
                      const isComplete = num <= simulatedNewTotal;
                      const isCurrentlyActive = num <= currentStamps;
                      const isPendingInTransaction = num > currentStamps && num <= simulatedNewTotal;
                      const isLast = num === totalMax;

                      if (isComplete) {
                        return (
                          <div
                            key={num}
                            className={`aspect-square rounded-lg flex items-center justify-center shadow-sm transition-all ${
                              isPendingInTransaction
                                ? 'bg-secondary text-on-secondary animate-pulse ring-2 ring-white/60'
                                : 'bg-tertiary-fixed text-on-tertiary-fixed'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[22px]">
                              {isLast ? 'redeem' : 'check_circle'}
                            </span>
                          </div>
                        );
                      } else {
                        return (
                          <div
                            key={num}
                            className="aspect-square rounded-lg bg-surface-container-lowest/20 flex flex-col items-center justify-center transition-all text-white/50"
                          >
                            <span className="font-label-code text-label-code text-primary-fixed-dim">#{num}</span>
                            <span className="material-symbols-outlined text-[18px]">
                              {isLast ? 'redeem' : 'radio_button_unchecked'}
                            </span>
                          </div>
                        );
                      }
                    })}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-surface-container-lowest/20 h-2 rounded-full overflow-hidden mt-space-xs">
                    <div
                      className="bg-gradient-to-r from-secondary-fixed to-tertiary-fixed h-full rounded-full transition-all duration-300"
                      style={{ width: `${(simulatedNewTotal / totalMax) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-space-xs flex items-center justify-between text-primary-fixed font-label-code text-label-code">
                  <span>NFC PassID: 9840-AF83-0021</span>
                  <span>Sincronización APNs: Activa</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: POS Action Pad, Reward Alerts, Confirmation (6 Cols) */}
          <div className="xl:col-span-6 flex flex-col gap-space-lg">
            {/* Fast POS Stamp Pad */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[24px]">add_circle</span>
                  <div>
                    <span className="font-headline-sm text-headline-sm text-on-surface block font-bold">Sumar Sellos / Puntos (HU-03)</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Seleccione la regla de venta actual</span>
                  </div>
                </div>
                <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-space-sm py-0.5 rounded-full font-label-code text-label-code font-bold">
                  Fast POS Pad
                </span>
              </div>

              {/* 3 Quick Buttons */}
              <div className="grid grid-cols-3 gap-space-sm">
                <button
                  onClick={() => handleSelectStamps(1)}
                  className={`p-space-md rounded-xl flex flex-col items-center justify-center gap-1 shadow-sm transition-all cursor-pointer ${
                    selectedAddition === 1
                      ? 'bg-primary text-on-primary ring-2 ring-primary/40 shadow-md'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                  }`}
                  type="button"
                >
                  <span className={`font-headline-lg text-headline-lg font-bold ${selectedAddition === 1 ? 'text-white' : 'text-primary'}`}>+1</span>
                  <span className="font-body-sm text-body-sm text-center leading-tight">Compra Habitual</span>
                  <span className={`font-label-code text-label-code mt-1 font-semibold ${selectedAddition === 1 ? 'text-tertiary-fixed-dim' : 'text-on-surface-variant'}`}>
                    1 Café / Bebida
                  </span>
                </button>

                <button
                  onClick={() => handleSelectStamps(2)}
                  className={`p-space-md rounded-xl flex flex-col items-center justify-center gap-1 shadow-sm transition-all cursor-pointer ${
                    selectedAddition === 2
                      ? 'bg-primary text-on-primary ring-2 ring-primary/40 shadow-md'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                  }`}
                  type="button"
                >
                  <span className={`font-headline-lg text-headline-lg font-bold ${selectedAddition === 2 ? 'text-white' : 'text-secondary'}`}>+2</span>
                  <span className="font-body-sm text-body-sm text-center leading-tight font-medium">Menú Especial</span>
                  <span className={`font-label-code text-label-code mt-1 ${selectedAddition === 2 ? 'text-tertiary-fixed-dim' : 'text-on-surface-variant'}`}>
                    Almuerzo / Brunch
                  </span>
                </button>

                <button
                  onClick={() => handleSelectStamps(3)}
                  className={`p-space-md rounded-xl flex flex-col items-center justify-center gap-1 shadow-sm transition-all cursor-pointer ${
                    selectedAddition === 3
                      ? 'bg-primary text-on-primary ring-2 ring-primary/40 shadow-md'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                  }`}
                  type="button"
                >
                  <span className={`font-headline-lg text-headline-lg font-bold ${selectedAddition === 3 ? 'text-white' : 'text-secondary'}`}>+3</span>
                  <span className="font-body-sm text-body-sm text-center leading-tight font-medium">Combo Familiar</span>
                  <span className={`font-label-code text-label-code mt-1 ${selectedAddition === 3 ? 'text-tertiary-fixed-dim' : 'text-on-surface-variant'}`}>
                    Ticket &gt; €30.00
                  </span>
                </button>
              </div>

              {/* Ticket Price Field */}
              <div className="bg-surface-container-low p-space-md rounded-lg flex items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-on-surface-variant">receipt_long</span>
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm font-semibold text-on-surface">Monto del Ticket de Caja (Opcional)</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Asocia el importe a la analítica de fidelidad</span>
                  </div>
                </div>
                <div className="relative w-40">
                  <span className="absolute left-3 top-2.5 font-headline-sm text-headline-sm text-on-surface-variant font-medium">€</span>
                  <input
                    className="w-full h-11 pl-8 pr-3 bg-surface-container-lowest rounded-lg font-headline-sm text-headline-sm font-bold text-on-surface text-right focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm"
                    type="text"
                    value={ticketAmount}
                    onChange={(e) => setTicketAmount(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Reward Alert Card (HU-04) */}
            <div className="bg-surface-container-high p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm border border-outline-variant/30">
              <div className="flex items-start gap-space-sm">
                <div className="p-2 bg-secondary text-on-secondary rounded-lg shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">celebration</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Alerta de Recompensa (HU-04)</span>
                    <span className="font-label-code text-label-code bg-surface-container-lowest text-secondary px-2 py-0.5 rounded font-bold">
                      {stampsRemaining === 0 ? '¡Recompensa Lista!' : '¡Meta Próxima!'}
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                    {stampsRemaining === 0 ? (
                      <span className="text-on-tertiary-container font-semibold">
                        ¡Meta alcanzada! El cliente ya tiene {totalMax} sellos y puede canjear: <strong>{passConfig.rewardTitle}</strong>.
                      </span>
                    ) : (
                      <>
                        ¡Meta casi alcanzada! Solo faltan <span className="font-bold text-secondary">{stampsRemaining} sellos</span> para: <span className="font-semibold text-on-surface">{passConfig.rewardTitle}</span>.
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Redeem Button */}
              <div className="bg-surface-container-lowest p-space-sm rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-outline text-[20px]">inventory_2</span>
                  <span className="font-body-sm text-body-sm text-on-surface font-medium">Pre-canje de recompensa desbloqueada</span>
                </div>
                <button
                  disabled={activeCustomer.stamps < totalMax || isProcessing}
                  onClick={handleCanjear}
                  className={`px-space-md py-2 rounded-lg font-body-sm text-body-sm font-semibold flex items-center gap-space-xs transition-all ${
                    activeCustomer.stamps >= totalMax
                      ? 'bg-secondary text-on-secondary hover:bg-secondary-container cursor-pointer shadow-sm'
                      : 'bg-surface-container text-on-surface-variant cursor-not-allowed opacity-60'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">redeem</span>
                  <span>Canjear Recompensa ({totalMax} Sellos)</span>
                </button>
              </div>
            </div>

            {/* Big Transaction Confirmation CTA */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-xs border border-outline-variant/20">
              <button
                disabled={isProcessing}
                onClick={handleConfirmTransaction}
                className="w-full py-4 px-space-lg bg-primary hover:bg-primary-container text-on-primary rounded-xl font-headline-md text-headline-md font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-space-md active:scale-[0.99] cursor-pointer"
                type="button"
              >
                {isProcessing ? (
                  <>
                    <span className="material-symbols-outlined text-[28px] animate-spin text-tertiary-fixed">sync</span>
                    <span>SINCRONIZANDO CON APPLE APNs...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[28px] text-tertiary-fixed">send_to_mobile</span>
                    <span>CONFIRMAR TRANSACCIÓN & ACTUALIZAR WALLET</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-space-xs text-center pt-1">
                <span className="material-symbols-outlined text-[16px] text-on-tertiary-container animate-pulse">sync</span>
                <span className="font-label-code text-label-code text-on-surface-variant">
                  Se enviará actualización APNs automática y changeMessage al iPhone del cliente en &lt;15s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Transaction History */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
          <div className="flex items-center justify-between pb-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary text-[22px]">history</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Historial de Transacciones en Tiempo Real</span>
              <span className="bg-surface-container text-on-surface-variant font-label-code text-label-code px-2 py-0.5 rounded-full ml-space-xs">
                Turno Actual #02
              </span>
            </div>
            <div className="flex items-center gap-space-sm">
              <span className="font-label-code text-label-code text-on-tertiary-container flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span> WebSocket POS: Online
              </span>
              <button 
                onClick={() => showToast('Auditoría', 'Descargando log completo de transacciones en formato CSV')}
                className="font-body-sm text-body-sm text-secondary hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
              >
                <span>Ver auditoría completa</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-body-sm text-body-sm uppercase tracking-wider">
                  <th className="py-3 px-space-md rounded-l-lg">Hora</th>
                  <th className="py-3 px-space-md">Cliente</th>
                  <th className="py-3 px-space-md">ID de Pase</th>
                  <th className="py-3 px-space-md">Acción POS</th>
                  <th className="py-3 px-space-md">Ticket</th>
                  <th className="py-3 px-space-md">Cajero</th>
                  <th className="py-3 px-space-md rounded-r-lg">Estado Apple Wallet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low font-body-md text-body-md text-on-surface">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3.5 px-space-md font-label-code text-label-code text-on-surface-variant">{tx.time}</td>
                    <td className="py-3.5 px-space-md font-semibold">{tx.customerName}</td>
                    <td className="py-3.5 px-space-md font-label-code text-label-code text-on-surface-variant">{tx.passId}</td>
                    <td className="py-3.5 px-space-md">
                      {tx.action.includes('Canje') ? (
                        <span className="inline-flex items-center gap-1 font-bold text-on-tertiary-container">
                          <span className="material-symbols-outlined text-[16px]">redeem</span> {tx.action}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-secondary">
                          <span className="material-symbols-outlined text-[16px]">add</span> {tx.action}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-space-md font-label-code text-label-code">
                      {tx.ticketAmount > 0 ? `€${tx.ticketAmount.toFixed(2)}` : '€0.00 (-10S)'}
                    </td>
                    <td className="py-3.5 px-space-md text-on-surface-variant">{tx.cashier}</td>
                    <td className="py-3.5 px-space-md">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-surface-container-low text-on-tertiary-container font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span> {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Manual Input Modal */}
      {manualModalOpen && (
        <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm font-bold text-on-surface">Seleccionar o Buscar Cliente</h3>
              <button 
                onClick={() => setManualModalOpen(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">search</span>
              <input
                type="text"
                className="w-full bg-surface-container-low rounded-lg pl-9 pr-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-secondary/30"
                placeholder="Nombre, teléfono o ID de pase..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
              {filteredCustomers.map(cust => (
                <button
                  key={cust.id}
                  onClick={() => {
                    setActiveCustomer(cust);
                    setManualModalOpen(false);
                    showToast('Cliente Seleccionado', `${cust.name} cargado en la terminal`);
                  }}
                  className={`p-3 rounded-xl flex items-center justify-between text-left transition-colors border ${
                    activeCustomer.id === cust.id
                      ? 'bg-secondary-fixed/30 border-secondary'
                      : 'bg-surface-container-low/50 hover:bg-surface-container-low border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary/10 text-secondary font-bold flex items-center justify-center text-sm">
                      {cust.initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-on-surface">{cust.name}</span>
                      <span className="text-xs text-on-surface-variant font-label-code">{cust.passId} · {cust.phone}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-xs text-secondary">{cust.stamps} / {totalMax}</span>
                    <span className="text-[10px] text-on-surface-variant">{cust.tier}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
