import React, { useState } from 'react';
import { usePass } from '../../context/PassContext';
import { Campaign } from '../../types';

export const PushCampaignsScreen: React.FC = () => {
  const { campaigns, addCampaign, showToast, passConfig } = usePass();

  const [campaignName, setCampaignName] = useState('Promo Jueves Lluvioso 2x1');
  const [selectedSegment, setSelectedSegment] = useState<'all' | 'inactive' | 'birthday' | 'reward'>('all');
  const [pushText, setPushText] = useState('¡Hoy 2x1 en Café de Especialidad! Muestra este pase en caja hasta las 20:00h');
  const [scheduleType, setScheduleType] = useState<'immediate' | 'later'>('immediate');
  const [scheduleDate, setScheduleDate] = useState('2025-05-15');
  const [scheduleTime, setScheduleTime] = useState('16:30');
  const [isLaunching, setIsLaunching] = useState(false);
  const [searchTableQuery, setSearchTableQuery] = useState('');

  const segmentCounts: Record<string, { label: string; count: number }> = {
    all: { label: 'Todos los clientes con pase activo', count: 3420 },
    inactive: { label: 'Clientes inactivos (+30 días sin visitas)', count: 612 },
    birthday: { label: 'Cumpleañeros del mes actual', count: 148 },
    reward: { label: 'Clientes con recompensa lista para canjear', count: 280 },
  };

  const activeDeviceCount = segmentCounts[selectedSegment].count;

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushText.trim()) return;

    setIsLaunching(true);

    setTimeout(() => {
      addCampaign({
        name: campaignName,
        pushText: pushText,
        segment: segmentCounts[selectedSegment].label,
        segmentKey: selectedSegment,
        totalTarget: activeDeviceCount,
        status: 'Completada / APNs Entregado',
      });

      setIsLaunching(false);
      showToast(
        'Lote APNs Emitido con Éxito',
        `Enviando actualización silenciosa changeMessage a ${activeDeviceCount.toLocaleString()} pases registrados`
      );
    }, 1200);
  };

  const injectTemplate = (text: string) => {
    setPushText(text);
  };

  const filteredCampaigns = campaigns.filter(c =>
    c.name.toLowerCase().includes(searchTableQuery.toLowerCase()) ||
    c.segment.toLowerCase().includes(searchTableQuery.toLowerCase()) ||
    c.pushText.toLowerCase().includes(searchTableQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full">
      <div className="px-space-md md:px-space-xl py-space-lg max-w-[1440px] mx-auto w-full flex flex-col gap-space-lg">
        {/* Top Context & Protocol Notice */}
        <div className="flex flex-col gap-space-sm">
          <div className="flex flex-wrap items-center justify-between gap-space-md">
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs text-on-surface-variant">
                <span className="font-label-code text-label-code uppercase tracking-wider text-secondary font-semibold">
                  Apple PassKit APNs Gateway
                </span>
                <span className="font-label-code text-label-code">•</span>
                <span className="font-label-code text-label-code">HU-05 / HU-06 Campaign Engine</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-0.5 font-bold">
                Campañas Promocionales & Notificaciones Push
              </h1>
            </div>

            <div className="flex items-center gap-space-sm">
              <div className="hidden sm:flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-2 rounded-lg shadow-sm border border-outline-variant/30">
                <span className="h-2 w-2 rounded-full bg-on-tertiary-container animate-pulse"></span>
                <span className="font-label-code text-label-code text-on-surface font-semibold">APNs Production: Conexión HTTP/2 OK</span>
              </div>
              <button
                onClick={() => showToast('Logs APNs', 'Visualizando registro HTTP/2 de conexión con gateway.push.apple.com')}
                className="flex items-center gap-space-xs bg-surface-container-lowest text-on-surface px-space-md py-2 rounded-lg shadow-sm hover:bg-surface-container-high transition-colors font-body-sm text-body-sm font-semibold border border-outline-variant/30 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">history</span>
                <span>Logs de Entrega</span>
              </button>
            </div>
          </div>

          {/* Callout: Apple Wallet Mechanics Architecture */}
          <div className="relative overflow-hidden bg-primary-container text-on-primary rounded-xl p-space-md md:p-space-lg shadow-md">
            <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none"></div>
            <div className="flex items-start gap-space-md relative z-10">
              <div className="p-2.5 rounded-lg bg-surface-container-lowest/10 text-on-secondary-fixed shrink-0">
                <span className="material-symbols-outlined text-[24px]">info</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-space-sm flex-wrap">
                  <span className="font-headline-sm text-headline-sm text-on-primary font-bold">
                    Mecánica Nativa de Push en Apple Wallet (PassKit Architecture)
                  </span>
                  <span className="font-label-code text-label-code bg-secondary text-on-secondary px-2 py-0.5 rounded-full font-bold">
                    changeMessage Protocol
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-primary-container max-w-4xl leading-relaxed">
                  Apple Wallet no soporta push con texto libre directo; el texto se transmite actualizando un campo del pase con{' '}
                  <code className="font-label-code text-label-code bg-surface-container-lowest/15 px-1.5 py-0.5 rounded text-white">
                    changeMessage: &quot;%@&quot;
                  </code>
                  . El push de APNs notifica la actualización silenciosa del{' '}
                  <code className="font-label-code text-label-code bg-surface-container-lowest/15 px-1.5 py-0.5 rounded text-white">
                    .pkpass
                  </code>{' '}
                  y el iPhone renderiza nativamente el banner en la pantalla de bloqueo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Key Reach & Delivery Metrics Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {/* Metric 1 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Pases Activos en Wallet</span>
              <span className="material-symbols-outlined text-[20px] text-secondary">wallet</span>
            </div>
            <div className="flex items-baseline gap-space-xs mt-3">
              <span className="font-display text-display text-on-surface tracking-tight font-bold">3,420</span>
              <span className="font-body-sm text-body-sm text-on-tertiary-container font-semibold flex items-center">
                <span className="material-symbols-outlined text-[16px]">trending_up</span> +5.2%
              </span>
            </div>
            <div className="mt-2 text-on-surface-variant font-body-sm text-body-sm">
              99.1% tokens con APNs válido
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Tasa de Instalación</span>
              <span className="material-symbols-outlined text-[20px] text-secondary">install_mobile</span>
            </div>
            <div className="flex items-baseline gap-space-xs mt-3">
              <span className="font-display text-display text-on-surface tracking-tight font-bold">88.4%</span>
              <span className="font-body-sm text-body-sm text-on-tertiary-container font-semibold">Objetivo &gt;80%</span>
            </div>
            <div className="mt-2 w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: '88.4%' }}></div>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Notificaciones este Mes</span>
              <span className="material-symbols-outlined text-[20px] text-secondary">send</span>
            </div>
            <div className="flex items-baseline gap-space-xs mt-3">
              <span className="font-display text-display text-on-surface tracking-tight font-bold">14,250</span>
              <span className="font-label-code text-label-code text-on-surface-variant">/ 50k APNs limit</span>
            </div>
            <div className="mt-2 text-on-surface-variant font-body-sm text-body-sm flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-on-tertiary-container"></span>
              Sin penalizaciones Apple
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Tasa de Apertura / Visita</span>
              <span className="material-symbols-outlined text-[20px] text-secondary">loyalty</span>
            </div>
            <div className="flex items-baseline gap-space-xs mt-3">
              <span className="font-display text-display text-on-surface tracking-tight font-bold">31.8%</span>
              <span className="font-body-sm text-body-sm text-on-tertiary-container font-semibold flex items-center">
                <span className="material-symbols-outlined text-[16px]">arrow_drop_up</span> 4.1 pts vs mes anterior
              </span>
            </div>
            <div className="mt-2 text-on-surface-variant font-body-sm text-body-sm">
              Medido en caja por lectura QR
            </div>
          </div>
        </div>

        {/* 2 & 3: Main Dual Workspace (Campaign Form + Realistic iOS Lock Screen Simulator) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Campaign Builder (7 Cols) */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="p-2 rounded-lg bg-surface-container-low text-secondary">
                  <span className="material-symbols-outlined text-[22px]">campaign</span>
                </span>
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Nueva Campaña Push</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Configura el lote de emisión firmado con certificado PassKit de producción</p>
                </div>
              </div>
              <span className="font-label-code text-label-code px-2.5 py-1 rounded-full bg-surface-container-low text-secondary font-semibold">
                Pass Type ID: pass.com.artisan.coffee
              </span>
            </div>

            <form className="flex flex-col gap-space-md" onSubmit={handleLaunch}>
              {/* Campaign Name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="campaignName">
                  Nombre Interno de la Campaña
                </label>
                <input
                  className="h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all border border-outline-variant/20"
                  id="campaignName"
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
                <span className="font-body-sm text-body-sm text-on-surface-variant">Visible únicamente para administradores en tableros analíticos.</span>
              </div>

              {/* Audience Segmentation */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-body-sm text-body-sm font-semibold text-on-surface">
                    Segmentación de Destinatarios (HU-06)
                  </label>
                  <span className="font-label-code text-label-code text-secondary font-semibold">
                    {activeDeviceCount.toLocaleString()} pases seleccionados
                  </span>
                </div>
                <div className="relative">
                  <select
                    className="w-full h-10 pl-3 pr-10 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md appearance-none focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all cursor-pointer border border-outline-variant/20"
                    value={selectedSegment}
                    onChange={(e) => setSelectedSegment(e.target.value as any)}
                  >
                    <option value="all">Todos los clientes con pase activo (3,420 pases)</option>
                    <option value="inactive">Clientes inactivos (+30 días sin visitas - 612 pases)</option>
                    <option value="birthday">Cumpleañeros del mes actual (148 pases)</option>
                    <option value="reward">Clientes con recompensa lista para canjear (280 pases)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-on-surface-variant text-[20px]">
                    expand_more
                  </span>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[18px]">group</span>
                    <span>Alcance total garantizado vía Apple APNs</span>
                  </span>
                  <span className="font-label-code text-label-code font-bold text-on-surface">
                    {activeDeviceCount.toLocaleString()} dispositivos
                  </span>
                </div>
              </div>

              {/* PassKit Target Field Mapping */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-body-sm text-body-sm font-semibold text-on-surface">Campo del Pase a Modificar (Apple PassKit Structure)</label>
                  <span className="font-label-code text-label-code text-on-tertiary-container bg-surface-container-low px-2 py-0.5 rounded font-semibold">
                    backFields.promo_banner
                  </span>
                </div>
                <div className="p-space-sm bg-surface-container-low rounded-lg flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-code text-label-code text-on-surface font-semibold">changeMessage String Pattern:</span>
                    <span className="font-label-code text-label-code text-secondary font-bold">&quot;%@&quot;</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Se actualizará la propiedad <code className="font-label-code text-label-code bg-surface-container-highest px-1 rounded text-on-surface">promo_banner</code> en el JSON del pase. Al recibir el push APNs vacío, la app Wallet consulta el endpoint del servidor y renderiza el valor inyectado.
                  </p>
                </div>
              </div>

              {/* Push Message Content (changeMessage) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="pushContentInput">
                    Texto de la Notificación (changeMessage)
                  </label>
                  <span className="font-label-code text-label-code text-on-surface-variant font-medium">
                    {pushText.length} / 110 caracteres
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    className="w-full p-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all resize-none border border-outline-variant/20"
                    id="pushContentInput"
                    maxLength={110}
                    rows={3}
                    value={pushText}
                    onChange={(e) => setPushText(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Recomendación Apple: Mantener bajo 90 caracteres para evitar truncamiento en iPhone mini/SE.
                  </span>
                  <button
                    className="text-secondary font-body-sm text-body-sm font-semibold hover:underline cursor-pointer"
                    onClick={() => injectTemplate('¡Tu café favorito te espera con un 30% OFF en barra hasta el mediodía!')}
                    type="button"
                  >
                    Sugerir texto
                  </button>
                </div>
              </div>

              {/* Scheduling Options */}
              <div className="flex flex-col gap-2">
                <span className="font-body-sm text-body-sm font-semibold text-on-surface">Programación de Envío</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                  <label
                    onClick={() => setScheduleType('immediate')}
                    className={`flex items-center gap-space-sm p-3 rounded-lg cursor-pointer transition-colors border ${
                      scheduleType === 'immediate' ? 'bg-surface-container border-secondary' : 'bg-surface-container-low border-transparent hover:bg-surface-container-high'
                    }`}
                  >
                    <input
                      checked={scheduleType === 'immediate'}
                      onChange={() => {}}
                      className="w-4 h-4 text-secondary accent-secondary cursor-pointer"
                      name="scheduling"
                      type="radio"
                    />
                    <div className="flex flex-col">
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface">Enviar de inmediato</span>
                      <span className="font-body-sm text-[12px] text-on-surface-variant">Lote distribuido en ~4.2 seg</span>
                    </div>
                  </label>

                  <label
                    onClick={() => setScheduleType('later')}
                    className={`flex items-center gap-space-sm p-3 rounded-lg cursor-pointer transition-colors border ${
                      scheduleType === 'later' ? 'bg-surface-container border-secondary' : 'bg-surface-container-low border-transparent hover:bg-surface-container-high'
                    }`}
                  >
                    <input
                      checked={scheduleType === 'later'}
                      onChange={() => {}}
                      className="w-4 h-4 text-secondary accent-secondary cursor-pointer"
                      name="scheduling"
                      type="radio"
                    />
                    <div className="flex flex-col">
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface">Programar fecha/hora</span>
                      <span className="font-body-sm text-[12px] text-on-surface-variant">Sincronizado con huso local</span>
                    </div>
                  </label>
                </div>

                {scheduleType === 'later' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mt-1">
                    <input
                      className="h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 border border-outline-variant/20"
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                    />
                    <input
                      className="h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 border border-outline-variant/20"
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Launch CTA */}
              <div className="pt-space-sm flex flex-col sm:flex-row items-center justify-between gap-space-md">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">verified</span>
                  <span className="font-body-sm text-body-sm">Certificado PassKit firmado y válido hasta Oct 2026</span>
                </div>

                <button
                  disabled={isLaunching}
                  className="w-full sm:w-auto px-space-lg py-3 rounded-lg bg-secondary text-on-secondary hover:bg-secondary-container transition-all shadow-md font-body-md text-body-md font-semibold flex items-center justify-center gap-space-xs active:scale-[0.98] cursor-pointer"
                  type="submit"
                >
                  {isLaunching ? (
                    <>
                      <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                      <span>Contactando Apple APNs...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                      <span>Lanzar Campaña Push vía APNs</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Live iOS Lock Screen Simulation (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-space-sm">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">phone_iphone</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Previsualización iPhone</span>
              </div>
              <span className="font-label-code text-label-code px-2 py-0.5 rounded bg-surface-container-low text-on-surface font-medium">
                iOS 17/18 Lock Screen
              </span>
            </div>

            {/* Phone Shell Mockup */}
            <div className="relative w-full max-w-[360px] mx-auto rounded-[44px] p-3.5 bg-primary shadow-xl overflow-hidden aspect-[9/18.5] flex flex-col justify-between border border-white/10">
              {/* Dynamic Island */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-primary rounded-full z-30 flex items-center justify-end px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-surface-container-lowest/20"></div>
              </div>

              {/* iOS Lock Screen Background Wallpaper */}
              <div
                className="absolute inset-0 bg-cover bg-center rounded-[36px]"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBgksMPakmLo3T7CcAuWDyVJtsr-eELB1rINdPoTbOROWX2dOIZ9D-m3DLd8Y3snhLlcTUscqxm1InB1WxP7TzZp-PSdaGn4CnNQysqTqw33fuh-6QDYHi-l9v2HF3YUYPKYeMz1tKynFa43kgfrTZr5fJSLIEGmOmcO0kn_i2mcHZs-ioq-BeWvmICiHIibZeHbvhFOEMBRMU-pKkKnreVE1g1ReTOgtB6X7I1vJ3AyQ_1r9bD_eR2')`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/50 via-primary/20 to-primary/80 backdrop-blur-[2px]"></div>
              </div>

              {/* Top Status Bar & Clock */}
              <div className="relative z-20 pt-8 flex flex-col items-center text-on-primary">
                <div className="w-full flex items-center justify-between px-4 text-on-primary/90 font-label-code text-[11px] font-semibold mb-3">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">signal_cellular_alt</span>
                    <span className="material-symbols-outlined text-[14px]">wifi</span>
                    <span className="material-symbols-outlined text-[14px]">battery_full</span>
                  </div>
                </div>

                <span className="font-body-sm text-body-sm font-medium tracking-wide text-on-primary/80">Jueves, 15 de Mayo</span>
                <span className="font-display text-[64px] leading-none font-bold tracking-tight text-on-primary mt-1 drop-shadow-sm">
                  09:41
                </span>
              </div>

              {/* iOS Push Notification Banner */}
              <div className="relative z-20 w-full mb-14 flex flex-col gap-2">
                <div className="w-full bg-surface-container-lowest/85 backdrop-blur-xl rounded-[20px] p-3.5 shadow-xl text-on-surface flex flex-col gap-1.5 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-[5px] bg-primary flex items-center justify-center text-on-primary shadow-sm">
                        <span className="material-symbols-outlined text-[13px]">wallet</span>
                      </div>
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">WALLET</span>
                    </div>
                    <span className="font-body-sm text-[11px] text-on-surface-variant">Ahora</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm font-bold text-on-surface tracking-tight">
                      {passConfig.businessName} - Pase Fidelidad
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface leading-tight mt-0.5 font-medium">
                      {pushText || 'Escribe un mensaje para previsualizar el banner de bloqueo en iOS...'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-secondary font-medium">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">touch_app</span> Toca para ver pase
                    </span>
                    <span className="font-label-code text-[10px] text-on-surface-variant">changeMessage: %@</span>
                  </div>
                </div>

                <div className="bg-primary/60 backdrop-blur-md rounded-full px-3 py-1 mx-auto flex items-center gap-1.5 text-on-primary/90">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  <span className="font-body-sm text-[11px]">Desliza para desbloquear y canjear</span>
                </div>
              </div>

              {/* Bottom Home Indicator */}
              <div className="relative z-20 pb-2 flex justify-center">
                <div className="w-32 h-1 bg-surface-container-lowest/70 rounded-full"></div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm text-center border border-outline-variant/20">
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Al tocar la notificación en iOS, se abre automáticamente el reverso o anverso del pase con el nuevo valor resaltado en color contrastante.
              </span>
            </div>
          </div>
        </div>

        {/* 4. Historical Campaigns & Acceptance Criteria Audit (HU-06) */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
            <div className="flex flex-col">
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Historial de Campañas Recientes (HU-06)</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Monitoreo de entregas APNs, confirmación de actualización de pases y retorno en punto de venta
              </p>
            </div>

            <div className="flex items-center gap-space-xs self-stretch sm:self-auto">
              <div className="relative w-full sm:w-64">
                <input
                  className="w-full h-9 pl-8 pr-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-secondary/40 border border-outline-variant/20"
                  placeholder="Filtrar por nombre o segmento..."
                  type="text"
                  value={searchTableQuery}
                  onChange={(e) => setSearchTableQuery(e.target.value)}
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-on-surface-variant text-[18px]">search</span>
              </div>
              <button
                onClick={() => showToast('CSV Exportado', 'Descargando reporte completo de campañas')}
                className="p-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20"
                title="Exportar CSV"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-body-sm text-body-sm">
                  <th className="py-3 px-space-md rounded-l-lg font-semibold uppercase tracking-wider">Campaña & Push Text</th>
                  <th className="py-3 px-space-md font-semibold uppercase tracking-wider">Segmento</th>
                  <th className="py-3 px-space-md font-semibold uppercase tracking-wider">Fecha de Envío</th>
                  <th className="py-3 px-space-md font-semibold uppercase tracking-wider">Pases Actualizados (APNs)</th>
                  <th className="py-3 px-space-md font-semibold uppercase tracking-wider">Visitas Caja (48h)</th>
                  <th className="py-3 px-space-md rounded-r-lg font-semibold uppercase tracking-wider text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {filteredCampaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-3.5 px-space-md">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-1.5 h-10 rounded-full bg-on-tertiary-container"></div>
                        <div className="flex flex-col">
                          <span className="font-body-md text-body-md font-semibold text-on-surface">{camp.name}</span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">
                            &quot;{camp.pushText}&quot;
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md">
                      <span className="font-label-code text-label-code px-2 py-1 rounded bg-surface-container-low text-on-surface font-semibold">
                        {camp.segment}
                      </span>
                    </td>
                    <td className="py-3.5 px-space-md">
                      <div className="flex flex-col">
                        <span className="font-body-md text-body-md text-on-surface font-medium">{camp.sentDate}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-on-surface font-label-code text-label-code font-bold">
                          <span>{camp.deliveredCount.toLocaleString()} / {camp.totalTarget.toLocaleString()}</span>
                          <span className="text-on-tertiary-container">{camp.deliveryRate}%</span>
                        </div>
                        <div className="w-32 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                          <div className="bg-on-tertiary-container h-full rounded-full" style={{ width: `${camp.deliveryRate}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md">
                      <div className="flex items-center gap-space-xs">
                        <span className="font-body-md text-body-md font-semibold text-on-surface">{camp.storeVisits48h.toLocaleString()} clientes</span>
                        <span className="font-label-sm text-label-sm text-on-tertiary-container bg-surface-container-low px-1.5 py-0.5 rounded font-bold">
                          {camp.visitRate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md text-right">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-on-tertiary-container font-body-sm text-body-sm font-semibold">
                        <span className="w-2 h-2 rounded-full bg-on-tertiary-container"></span>
                        {camp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-xs text-on-surface-variant font-body-sm text-body-sm">
            <span>Mostrando {filteredCampaigns.length} de {campaigns.length} campañas históricas</span>
            <div className="flex items-center gap-space-xs">
              <button className="px-3 py-1.5 rounded bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high disabled:opacity-50 cursor-pointer" disabled type="button">
                Anterior
              </button>
              <span className="font-label-code text-label-code px-2 py-1 text-on-surface font-semibold">Pág. 1 de 1</span>
              <button className="px-3 py-1.5 rounded bg-surface-container-low text-on-surface hover:bg-surface-container-high cursor-pointer" type="button">
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
