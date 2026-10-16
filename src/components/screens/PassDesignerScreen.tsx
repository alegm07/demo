import React, { useState } from 'react';
import { usePass } from '../../context/PassContext';

export const PassDesignerScreen: React.FC = () => {
  const { passConfig, setPassConfig, showToast } = usePass();

  const [activeTab, setActiveTab] = useState<'identity' | 'rules' | 'geo' | 'onboarding'>('identity');
  const [passSide, setPassSide] = useState<'front' | 'back'>('front');
  const [showLockBanner, setShowLockBanner] = useState(true);

  // Palettes
  const applyPreset = (bg: string, text: string, label: string) => {
    setPassConfig(prev => ({
      ...prev,
      backgroundColor: bg,
      textColor: text,
      labelColor: label,
    }));
    showToast('Paleta Apple HIG Aplicada', 'Colores sincronizados en contenedor .pkpass');
  };

  const handleExportPkpass = () => {
    // Generate pass.json bundle blob
    const passData = {
      formatVersion: 1,
      passTypeIdentifier: "pass.com.artisan.loyalty",
      serialNumber: "PK-882194-PROD",
      teamIdentifier: "APPLE984MFI",
      organizationName: passConfig.businessName,
      description: "Pase de Fidelidad Digital",
      logoText: passConfig.businessName,
      foregroundColor: passConfig.textColor,
      backgroundColor: passConfig.backgroundColor,
      labelColor: passConfig.labelColor,
      storeCard: {
        headerFields: [
          { key: "progress", label: "PROGRESO", value: `8 / ${passConfig.totalStamps}` }
        ],
        primaryFields: [
          { key: "tier", label: "CLUB", value: "Socio Frecuente" }
        ],
        secondaryFields: [
          { key: "holder", label: "TITULAR", value: "Valentina Morales" },
          { key: "reward", label: "RECOMPENSA", value: passConfig.rewardTitle }
        ],
        backFields: [
          { key: "promo", label: "PROMOCIÓN", value: passConfig.seasonPromotion },
          { key: "terms", label: "TÉRMINOS", value: passConfig.terms },
          { key: "phone", label: "TELÉFONO", value: passConfig.storePhone },
          { key: "web", label: "SITIO WEB", value: passConfig.website }
        ]
      },
      barcode: {
        message: "PK-882194",
        format: "PKBarcodeFormatPDF417",
        messageEncoding: "iso-8859-1"
      },
      locations: passConfig.geoActive ? [
        {
          latitude: parseFloat(passConfig.latitude),
          longitude: parseFloat(passConfig.longitude),
          relevantText: passConfig.lockscreenMessage
        }
      ] : []
    };

    const blob = new Blob([JSON.stringify(passData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `artisan_loyalty_${Date.now()}.pass.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('Paquete .pkpass Generado', 'Descargando bundle JSON estructurado para firma criptográfica');
  };

  const handleTestOnPhone = () => {
    showToast('Push APNs Enviado', 'Notificación changeMessage transmitida a tu iPhone de prueba');
  };

  const handleSave = () => {
    showToast('Plantilla Guardada', 'Configuración de pases sincronizada con Apple Wallet Gateway');
  };

  const currentStamps = 8;
  const total = passConfig.totalStamps;

  return (
    <div className="flex flex-col w-full">
      {/* Top Utility Bar / Command Header */}
      <div className="px-space-margin py-space-md bg-surface-container-lowest shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-space-md border-b border-outline-variant/20">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs">
            <span className="font-label-code text-label-code text-secondary font-semibold uppercase tracking-wider">PassKit Studio</span>
            <span className="text-on-surface-variant font-label-code text-label-code">/</span>
            <span className="font-label-code text-label-code text-on-surface-variant">v2.4 Engine</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-label-sm font-label-sm bg-surface-container-low text-on-tertiary-container font-semibold ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container mr-1.5 animate-pulse"></span>
              Sincronizado APNs
            </span>
          </div>
          <div className="flex items-center gap-space-sm mt-1">
            <h1 className="font-headline-md text-headline-md text-on-surface font-bold">Diseñador de Pases Apple Wallet</h1>
            <span className="bg-surface-container text-on-surface font-label-code text-label-code px-2 py-0.5 rounded">HU-01 · HU-02 · HU-07</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-space-sm">
          <button
            onClick={handleExportPkpass}
            className="flex items-center gap-space-xs px-space-md h-10 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-all font-body-sm text-body-sm font-semibold shadow-sm cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
            <span>Exportar .pkpass</span>
          </button>
          <button
            onClick={handleTestOnPhone}
            className="flex items-center gap-space-xs px-space-md h-10 rounded-lg bg-secondary text-on-secondary hover:bg-secondary-container transition-all font-body-sm text-body-sm font-semibold shadow-sm cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">send_to_mobile</span>
            <span>Probar en mi iPhone</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-space-xs px-space-md h-10 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all font-body-sm text-body-sm font-semibold shadow-md cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>Guardar cambios</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Split Workspace */}
      <div className="px-space-margin py-space-lg grid grid-cols-1 xl:grid-cols-12 gap-space-xl items-start">
        {/* LEFT COLUMN: Studio Inspector & Configuration Tabs (7 Columns) */}
        <div className="xl:col-span-7 flex flex-col gap-space-lg">
          {/* Studio Navigation Tabs */}
          <div className="bg-surface-container-lowest p-1.5 rounded-xl shadow-sm flex items-center gap-1 overflow-x-auto border border-outline-variant/20">
            <button
              onClick={() => setActiveTab('identity')}
              className={`flex-1 min-w-[130px] flex items-center justify-center gap-space-xs py-2 px-space-sm rounded-lg font-body-sm text-body-sm font-semibold transition-all ${
                activeTab === 'identity' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">palette</span>
              <span>1. Identidad & Estilo</span>
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`flex-1 min-w-[130px] flex items-center justify-center gap-space-xs py-2 px-space-sm rounded-lg font-body-sm text-body-sm font-medium transition-all ${
                activeTab === 'rules' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">loyalty</span>
              <span>2. Reglas Sellos</span>
            </button>
            <button
              onClick={() => setActiveTab('geo')}
              className={`flex-1 min-w-[130px] flex items-center justify-center gap-space-xs py-2 px-space-sm rounded-lg font-body-sm text-body-sm font-medium transition-all ${
                activeTab === 'geo' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">near_me</span>
              <span>3. Cercanía (HU-07)</span>
            </button>
            <button
              onClick={() => setActiveTab('onboarding')}
              className={`flex-1 min-w-[130px] flex items-center justify-center gap-space-xs py-2 px-space-sm rounded-lg font-body-sm text-body-sm font-medium transition-all ${
                activeTab === 'onboarding' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
              <span>4. Registro QR (HU-02)</span>
            </button>
          </div>

          {/* TAB 1: IDENTIDAD & ESTILO */}
          {activeTab === 'identity' && (
            <div className="flex flex-col gap-space-md">
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Branding & Apariencia PassKit</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Define los elementos cromáticos y gráficos del contenedor .pkpass.</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-surface-container-low font-label-code text-label-code text-secondary font-semibold">JSON: pass.json</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
                  {/* Business Name */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider font-semibold">Nombre del Comercio / Emisor</label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">storefront</span>
                      <input
                        className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:ring-2 focus:ring-secondary/30 transition-all"
                        value={passConfig.businessName}
                        onChange={(e) => setPassConfig({ ...passConfig, businessName: e.target.value })}
                        type="text"
                      />
                    </div>
                  </div>

                  {/* Logo Official Header */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider font-semibold">Logo Oficial de Cabecera (logo@2x.png)</label>
                    <div className="flex items-center gap-space-md p-space-sm bg-surface-container-low rounded-xl">
                      <div className="w-14 h-14 rounded-lg bg-surface-container-lowest shadow-sm flex items-center justify-center overflow-hidden border border-outline-variant/20">
                        <img
                          className="w-10 h-10 object-contain"
                          alt="Logo de Café Artisan"
                          src={passConfig.logoUrl}
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <span className="font-body-sm text-body-sm font-semibold text-on-surface">artisan_logo_wallet.png</span>
                        <span className="font-label-code text-label-code text-on-surface-variant">160x160 px · PNG transparente · Certificado Apple</span>
                      </div>
                      <button
                        onClick={() => showToast('Logo Certificado', 'El logo actual cumple con las directrices HIG de Apple')}
                        className="px-space-md py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold transition-all shadow-sm"
                        type="button"
                      >
                        Cambiar
                      </button>
                    </div>
                  </div>

                  {/* Pass Background Color */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider font-semibold">Color de Fondo del Pase</label>
                    <div className="flex items-center gap-space-sm p-1.5 bg-surface-container-low rounded-lg">
                      <input
                        className="w-9 h-9 rounded cursor-pointer border-0 bg-transparent p-0"
                        type="color"
                        value={passConfig.backgroundColor}
                        onChange={(e) => setPassConfig({ ...passConfig, backgroundColor: e.target.value })}
                      />
                      <input
                        className="font-label-code text-label-code uppercase tracking-wider bg-transparent text-on-surface w-24 outline-none font-semibold"
                        type="text"
                        value={passConfig.backgroundColor}
                        onChange={(e) => setPassConfig({ ...passConfig, backgroundColor: e.target.value })}
                      />
                      <span className="font-body-sm text-body-sm text-on-surface-variant ml-auto pr-2">Fondo</span>
                    </div>
                  </div>

                  {/* Pass Text Color */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider font-semibold">Color de Texto (Valores)</label>
                    <div className="flex items-center gap-space-sm p-1.5 bg-surface-container-low rounded-lg">
                      <input
                        className="w-9 h-9 rounded cursor-pointer border-0 bg-transparent p-0"
                        type="color"
                        value={passConfig.textColor}
                        onChange={(e) => setPassConfig({ ...passConfig, textColor: e.target.value })}
                      />
                      <input
                        className="font-label-code text-label-code uppercase tracking-wider bg-transparent text-on-surface w-24 outline-none font-semibold"
                        type="text"
                        value={passConfig.textColor}
                        onChange={(e) => setPassConfig({ ...passConfig, textColor: e.target.value })}
                      />
                      <span className="font-body-sm text-body-sm text-on-surface-variant ml-auto pr-2">Texto</span>
                    </div>
                  </div>

                  {/* Label Color */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider font-semibold">Color de Etiquetas Secundarias (LabelColor)</label>
                    <div className="flex items-center gap-space-sm p-1.5 bg-surface-container-low rounded-lg">
                      <input
                        className="w-9 h-9 rounded cursor-pointer border-0 bg-transparent p-0"
                        type="color"
                        value={passConfig.labelColor}
                        onChange={(e) => setPassConfig({ ...passConfig, labelColor: e.target.value })}
                      />
                      <input
                        className="font-label-code text-label-code uppercase tracking-wider bg-transparent text-on-surface w-24 outline-none font-semibold"
                        type="text"
                        value={passConfig.labelColor}
                        onChange={(e) => setPassConfig({ ...passConfig, labelColor: e.target.value })}
                      />
                      <div className="flex items-center gap-2 ml-auto pr-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: passConfig.labelColor }}></span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Etiquetas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Presets Quick Picker */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Paletas Curadas Apple HIG</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
                  <button
                    onClick={() => applyPreset('#1E1B4B', '#FFFFFF', '#94A3B8')}
                    className="flex items-center gap-space-xs p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-all text-left"
                    type="button"
                  >
                    <span className="w-5 h-5 rounded-md bg-[#1E1B4B] shadow-inner shrink-0"></span>
                    <span className="font-body-sm text-body-sm font-medium text-on-surface truncate">Artisan Nocturno</span>
                  </button>
                  <button
                    onClick={() => applyPreset('#0F172A', '#F8FAFC', '#A5B4FC')}
                    className="flex items-center gap-space-xs p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-all text-left"
                    type="button"
                  >
                    <span className="w-5 h-5 rounded-md bg-[#0F172A] shadow-inner shrink-0"></span>
                    <span className="font-body-sm text-body-sm font-medium text-on-surface truncate">Obsidian Black</span>
                  </button>
                  <button
                    onClick={() => applyPreset('#064E3B', '#ECFDF5', '#6EE7B7')}
                    className="flex items-center gap-space-xs p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-all text-left"
                    type="button"
                  >
                    <span className="w-5 h-5 rounded-md bg-[#064E3B] shadow-inner shrink-0"></span>
                    <span className="font-body-sm text-body-sm font-medium text-on-surface truncate">Café Matcha</span>
                  </button>
                  <button
                    onClick={() => applyPreset('#78350F', '#FEF3C7', '#FDE68A')}
                    className="flex items-center gap-space-xs p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-all text-left"
                    type="button"
                  >
                    <span className="w-5 h-5 rounded-md bg-[#78350F] shadow-inner shrink-0"></span>
                    <span className="font-body-sm text-body-sm font-medium text-on-surface truncate">Tostado Espresso</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REGLAS DEL PROGRAMA */}
          {activeTab === 'rules' && (
            <div className="flex flex-col gap-space-md">
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Mecánica de Recompensas</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Configura cómo acumulan sellos los comensales y el premio automático desbloqueable.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
                  {/* Pass Type Selection */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider font-semibold">Tipo de Pase PassKit</label>
                    <div className="grid grid-cols-2 gap-space-sm">
                      <label 
                        onClick={() => setPassConfig({ ...passConfig, passType: 'stamps' })}
                        className={`flex items-start gap-space-sm p-space-md rounded-xl cursor-pointer shadow-sm transition-all border ${
                          passConfig.passType === 'stamps' ? 'bg-surface-container-low border-secondary' : 'bg-surface-container-lowest border-outline-variant/30 hover:bg-surface-container-low'
                        }`}
                      >
                        <input
                          checked={passConfig.passType === 'stamps'}
                          onChange={() => {}}
                          className="mt-1 accent-secondary"
                          type="radio"
                          name="passType"
                        />
                        <div className="flex flex-col">
                          <span className="font-body-sm text-body-sm font-bold text-on-surface">Tarjeta de Sellos</span>
                          <span className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">Ideal para cafeterías, panaderías y consumos recurrentes (1 sello por visita).</span>
                        </div>
                      </label>

                      <label 
                        onClick={() => setPassConfig({ ...passConfig, passType: 'points' })}
                        className={`flex items-start gap-space-sm p-space-md rounded-xl cursor-pointer shadow-sm transition-all border ${
                          passConfig.passType === 'points' ? 'bg-surface-container-low border-secondary' : 'bg-surface-container-lowest border-outline-variant/30 hover:bg-surface-container-low'
                        }`}
                      >
                        <input
                          checked={passConfig.passType === 'points'}
                          onChange={() => {}}
                          className="mt-1 accent-secondary"
                          type="radio"
                          name="passType"
                        />
                        <div className="flex flex-col">
                          <span className="font-body-sm text-body-sm font-bold text-on-surface">Puntos Acumulables</span>
                          <span className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">1 punto por cada €1 gastado con monedero virtual recargable.</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Total Stamps */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider font-semibold">Total de Sellos para Recompensa</label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">verified</span>
                      <select
                        className="w-full h-10 pl-9 pr-8 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none appearance-none cursor-pointer"
                        value={passConfig.totalStamps}
                        onChange={(e) => setPassConfig({ ...passConfig, totalStamps: parseInt(e.target.value, 10) })}
                      >
                        <option value="6">6 Sellos (Rápido)</option>
                        <option value="8">8 Sellos (Frecuente)</option>
                        <option value="10">10 Sellos (Estándar Artisan)</option>
                        <option value="12">12 Sellos (Club VIP)</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 text-on-surface-variant text-[18px] pointer-events-none">expand_more</span>
                    </div>
                  </div>

                  {/* Welcome Stamps */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider font-semibold">Sello de Bienvenida (Registro)</label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">card_giftcard</span>
                      <input
                        className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none"
                        max="3"
                        min="0"
                        type="number"
                        value={passConfig.welcomeStamps}
                        onChange={(e) => setPassConfig({ ...passConfig, welcomeStamps: parseInt(e.target.value, 10) || 0 })}
                      />
                    </div>
                  </div>

                  {/* Reward Title */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider font-semibold">Recompensa Prometida</label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">workspace_premium</span>
                      <input
                        className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none"
                        value={passConfig.rewardTitle}
                        onChange={(e) => setPassConfig({ ...passConfig, rewardTitle: e.target.value })}
                        type="text"
                      />
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Este texto aparece destacado en el reverso y al completar el cartón digital.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GEOLOCALIZACIÓN & CERCANÍA (HU-07) */}
          {activeTab === 'geo' && (
            <div className="flex flex-col gap-space-md">
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-secondary text-[20px]">location_on</span>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Pantalla de Bloqueo por Proximidad (HU-07)</h2>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Apple Wallet activa la tarjeta nativa automáticamente en la pantalla del iPhone cuando el cliente camina a menos de 100m.
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-code text-label-code font-bold">iBeacon / GPS</span>
                </div>

                {/* Feature Activation Toggle */}
                <div className="p-space-md bg-surface-container-low rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-lg bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[22px]">notifications_active</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body-sm text-body-sm font-bold text-on-surface">Mostrar pase en pantalla de bloqueo por cercanía</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Inyección del payload 'locations' dentro del paquete .pkpass</span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      checked={passConfig.geoActive}
                      onChange={(e) => {
                        setPassConfig({ ...passConfig, geoActive: e.target.checked });
                        setShowLockBanner(e.target.checked);
                      }}
                      className="sr-only peer"
                      type="checkbox"
                    />
                    <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </div>

                {/* Geolocation Coordinates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">Latitud (GPS)</label>
                    <input
                      className="h-10 px-3 rounded-lg bg-surface-container-low font-label-code text-label-code text-on-surface outline-none"
                      value={passConfig.latitude}
                      onChange={(e) => setPassConfig({ ...passConfig, latitude: e.target.value })}
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">Longitud (GPS)</label>
                    <input
                      className="h-10 px-3 rounded-lg bg-surface-container-low font-label-code text-label-code text-on-surface outline-none"
                      value={passConfig.longitude}
                      onChange={(e) => setPassConfig({ ...passConfig, longitude: e.target.value })}
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">Radio de Detección</label>
                    <input
                      className="h-10 px-3 rounded-lg bg-surface-container text-on-surface-variant font-label-code text-label-code cursor-not-allowed"
                      readOnly
                      type="text"
                      value={passConfig.detectionRadius}
                    />
                  </div>
                </div>

                {/* Push Message for Lockscreen */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider font-semibold">Mensaje relevante en pantalla de bloqueo</label>
                    <span className="font-label-code text-label-code text-on-surface-variant">{passConfig.lockscreenMessage.length} / 90 chars</span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px]">chat</span>
                    <input
                      className="w-full h-10 pl-10 pr-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none"
                      value={passConfig.lockscreenMessage}
                      onChange={(e) => setPassConfig({ ...passConfig, lockscreenMessage: e.target.value })}
                      type="text"
                    />
                  </div>
                </div>

                {/* Embedded Static Map Reference */}
                <div className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Sucursal Centro · Puerta del Sol / Callao</span>
                  <div
                    className="w-full h-36 rounded-xl overflow-hidden relative shadow-sm bg-cover bg-center"
                    style={{
                      backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCkt44bDu1X2gEj1AN7jkN5dqTzW8Ygy8VcqyzgvVL-tyN8QXCgb_rcGwnXQ-Ukp7SBPQQRrFTmrGChMKs7VoDF7y1T4gFy1__7QavkEledIlJc1Tny_Za06wPeo-A-O6Enc5gGMtdKl6PZ1a74Ag9xiiYpltziU0n4LaE5-UiFAiEKmobvO1dJFobY83Hsz17uJjgUPWPzOK7Bj0W_bbB4LTrXU0qMEbJDW5IwiWyHiq2bGZlRIDJ7')`,
                    }}
                  >
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-[0.5px]"></div>
                    <div className="absolute bottom-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-space-xs text-on-surface shadow-md">
                      <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                      <span className="font-label-code text-label-code font-semibold">Geocerca Activa: 100m</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REGISTRO RÁPIDO & QR (HU-02) */}
          {activeTab === 'onboarding' && (
            <div className="flex flex-col gap-space-md">
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Auto-Registro de Clientes (En &lt; 30 seg)</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Captura inmediata sin apps pesadas: el cliente escanea y añade el pase directo a Apple Wallet.</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-label-code text-label-code font-bold">HU-02 Frictionless</span>
                </div>

                {/* Registration Link Box */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider font-semibold">Enlace Permanente de Emisión</label>
                  <div className="flex items-center gap-space-xs p-1.5 bg-surface-container-low rounded-lg">
                    <span className="material-symbols-outlined text-on-surface-variant pl-2 text-[18px]">link</span>
                    <input
                      className="bg-transparent flex-1 font-label-code text-label-code text-on-surface outline-none"
                      readOnly
                      type="text"
                      value={passConfig.publicUrl}
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(passConfig.publicUrl);
                        showToast('Enlace Copiado', 'URL de emisión copiada al portapapeles');
                      }}
                      className="px-3 py-1.5 rounded bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold transition-all shadow-sm"
                      type="button"
                    >
                      Copiar
                    </button>
                  </div>
                </div>

                {/* Minimalist QR Stand Preview & Kit */}
                <div className="p-space-lg bg-surface-container-low rounded-xl flex flex-col sm:flex-row items-center gap-space-lg">
                  {/* Counter Stand Mockup Visual */}
                  <div className="w-40 p-4 bg-surface-container-lowest rounded-xl shadow-lg flex flex-col items-center text-center border border-outline-variant/20">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-2">
                      <span className="material-symbols-outlined text-[20px]">local_cafe</span>
                    </div>
                    <span className="font-label-sm text-label-sm font-bold text-on-surface uppercase">Escanea & Gana</span>
                    <span className="font-label-code text-[9px] text-on-surface-variant">Sello de bienvenida gratis</span>

                    {/* SVG QR */}
                    <div className="p-2 bg-surface-container-lowest my-2 rounded">
                      <svg className="w-24 h-24 text-primary" viewBox="0 0 100 100">
                        <path
                          d="M10 10h30v30h-30z M15 15v20h20v-20z M20 20h10v10h-10z M60 10h30v30h-30z M65 15v20h20v-20z M70 20h10v10h-10z M10 60h30v30h-30z M15 65v20h20v-20z M20 70h10v10h-10z M45 10h10v10h-10z M45 30h10v10h-10z M45 45h10v10h-10z M10 45h10v10h-10z M25 45h15v5h-15z M60 45h30v5h-30z M60 55h10v10h-10z M80 55h10v15h-10z M45 60h10v20h-10z M60 75h10v15h-10z M75 80h15v10h-15z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>

                    {/* Apple Wallet Pill */}
                    <div className="px-2 py-0.5 bg-primary text-on-primary rounded text-[9px] font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px]">wallet</span>
                      <span>Apple Wallet</span>
                    </div>
                  </div>

                  {/* Stand details & PDF export */}
                  <div className="flex-1 flex flex-col gap-space-sm text-center sm:text-left">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-code text-label-code font-bold">Kit Listo para Impresión A6 / Acrílico</span>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 font-bold">Material de Mostrador de Caja</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Genera cartelería en vector de alta resolución con la marca de {passConfig.businessName} para colocar al lado del datáfono y terminal POS.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-space-sm pt-space-xs justify-center sm:justify-start">
                      <button
                        onClick={() => showToast('PDF Generado', 'Kit de mostrador listo para imprimir en tamaño A6 y A5')}
                        className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all font-body-sm text-body-sm font-semibold shadow-sm"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                        <span>Descargar Kit de Mesa (PDF)</span>
                      </button>
                      <button
                        onClick={() => showToast('SVG Descargado', 'Vector SVG escalable con código QR de registro')}
                        className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold transition-all shadow-sm border border-outline-variant/30"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">file_download</span>
                        <span>SVG Vectorial</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Tips / HIG Compliance Card */}
          <div className="p-space-md bg-surface-container-low rounded-xl flex items-center gap-space-md border border-outline-variant/20">
            <div className="w-10 h-10 rounded-lg bg-surface-container-lowest shadow-sm flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
            <div className="flex-1 flex flex-col">
              <span className="font-body-sm text-body-sm font-bold text-on-surface">Cumplimiento Apple HIG & PassKit Protocol</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                El certificado criptográfico de firma Pass Type ID (pass.com.artisan.loyalty) está validado con Apple Worldwide Developer Relations.
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: iPhone Live Simulator & Apple Wallet Card (5 Columns) */}
        <div className="xl:col-span-5 flex flex-col items-center">
          {/* Simulator Control Bar */}
          <div className="w-full max-w-[390px] mb-space-md flex items-center justify-between px-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
              <span className="font-label-code text-label-code text-on-surface font-bold">Simulador iPhone 16 Pro</span>
            </div>
            <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-lg shadow-sm border border-outline-variant/20">
              <button
                onClick={() => setPassSide('front')}
                className={`px-3 py-1 rounded font-label-code text-label-code font-bold transition-all ${
                  passSide === 'front' ? 'bg-secondary text-on-secondary' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Frente
              </button>
              <button
                onClick={() => setPassSide('back')}
                className={`px-3 py-1 rounded font-label-code text-label-code font-bold transition-all ${
                  passSide === 'back' ? 'bg-secondary text-on-secondary' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Reverso
              </button>
            </div>
          </div>

          {/* iPhone Frame Enclosure */}
          <div className="relative w-full max-w-[390px] bg-[#1E293B] p-4 rounded-[48px] shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] ring-1 ring-white/10">
            {/* Dynamic Island */}
            <div className="absolute top-7 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-between px-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#111]"></div>
              <div className="w-2 h-2 rounded-full bg-[#0d233a]/80"></div>
            </div>

            {/* iPhone Internal Screen Canvas */}
            <div className="relative w-full min-h-[690px] bg-black rounded-[38px] overflow-hidden flex flex-col justify-between pt-10 pb-6 px-4">
              {/* iOS Status Bar */}
              <div className="w-full flex items-center justify-between text-white text-[12px] font-semibold px-2 mb-2 z-20">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">signal_cellular_alt</span>
                  <span className="material-symbols-outlined text-[14px]">wifi</span>
                  <span className="material-symbols-outlined text-[16px]">battery_full</span>
                </div>
              </div>

              {/* Notification Preview Trigger (HU-07 Simulator Overlay) */}
              {showLockBanner && passConfig.geoActive && (
                <div className="w-full bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl p-3 text-on-surface shadow-xl mb-3 transition-all duration-300">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-primary">wallet</span>
                      <span className="font-label-sm text-label-sm font-bold text-on-surface">WALLET · CERCA DE TI</span>
                    </div>
                    <span className="font-label-code text-[10px] text-on-surface-variant">Ahora</span>
                  </div>
                  <p className="font-body-sm text-body-sm font-medium text-on-surface leading-tight">
                    {passConfig.lockscreenMessage}
                  </p>
                </div>
              )}

              {/* Apple Wallet Pass Interactive Card Container */}
              <div className="relative w-full flex-1 flex flex-col justify-center my-auto">
                {/* PASS FRONT VIEW */}
                {passSide === 'front' ? (
                  <div
                    className="w-full rounded-[22px] p-5 shadow-2xl relative overflow-hidden transition-all duration-300"
                    style={{ backgroundColor: passConfig.backgroundColor, color: passConfig.textColor }}
                  >
                    {/* Glass Sheen Gradient */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 via-transparent to-black/25"></div>

                    {/* Pass Header: Business & Balance */}
                    <div className="relative z-10 flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm p-1.5 flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-[20px]">local_cafe</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-headline-sm text-[15px] font-bold tracking-tight text-white leading-tight">
                            {passConfig.businessName}
                          </span>
                          <span className="font-label-code text-[11px] uppercase tracking-wider" style={{ color: passConfig.labelColor }}>
                            {passConfig.passType === 'stamps' ? 'Tarjeta de Sellos' : 'Monedero de Puntos'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end">
                        <span className="font-label-code text-[10px] uppercase font-bold tracking-wider" style={{ color: passConfig.labelColor }}>
                          Progreso
                        </span>
                        <span className="font-headline-lg text-[22px] font-extrabold leading-none tracking-tight">
                          {currentStamps} / {total}
                        </span>
                      </div>
                    </div>

                    {/* Stamp Visual Grid */}
                    <div className="relative z-10 my-5 bg-black/20 backdrop-blur-sm rounded-xl p-3.5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-label-code text-[10px] font-semibold tracking-wider uppercase" style={{ color: passConfig.labelColor }}>
                          Sellos Acumulados
                        </span>
                        <span className="font-label-code text-[10px] text-tertiary-fixed font-bold">
                          {total - currentStamps > 0 ? `¡Faltan ${total - currentStamps} para canje!` : '¡Listo para canje!'}
                        </span>
                      </div>

                      <div className={total > 10 ? "grid grid-cols-6 gap-1.5" : "grid grid-cols-5 gap-2"}>
                        {Array.from({ length: total }).map((_, i) => {
                          const slotIndex = i + 1;
                          const isFilled = slotIndex <= currentStamps;
                          const isLast = slotIndex === total;

                          if (isFilled) {
                            return (
                              <div
                                key={slotIndex}
                                className={`aspect-square rounded-full bg-secondary text-white flex items-center justify-center shadow-md ${
                                  slotIndex === currentStamps ? 'animate-pulse' : ''
                                }`}
                              >
                                <span className="material-symbols-outlined text-[16px]">check</span>
                              </div>
                            );
                          } else if (isLast) {
                            return (
                              <div key={slotIndex} className="aspect-square rounded-full bg-white/10 flex items-center justify-center text-white/40">
                                <span className="material-symbols-outlined text-[14px]">stars</span>
                              </div>
                            );
                          } else {
                            return (
                              <div key={slotIndex} className="aspect-square rounded-full bg-white/10 flex items-center justify-center text-white/40">
                                <span className="font-label-code text-[11px] font-bold">{slotIndex}</span>
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>

                    {/* Auxiliary Pass Info */}
                    <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-3 mb-4">
                      <div className="flex flex-col">
                        <span className="font-label-code text-[10px] uppercase font-bold tracking-wider" style={{ color: passConfig.labelColor }}>
                          Titular
                        </span>
                        <span className="font-body-sm text-[13px] font-semibold text-white">Valentina Morales</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="font-label-code text-[10px] uppercase font-bold tracking-wider" style={{ color: passConfig.labelColor }}>
                          Recompensa
                        </span>
                        <span className="font-body-sm text-[12px] font-medium text-white truncate max-w-[170px]">
                          {passConfig.rewardTitle}
                        </span>
                      </div>
                    </div>

                    {/* Barcode Slot */}
                    <div className="relative z-10 bg-white rounded-xl p-3 flex flex-col items-center shadow-md">
                      <div className="w-full flex justify-between items-center px-1 mb-1.5">
                        <span className="font-label-code text-[9px] text-gray-500 font-bold uppercase">Pass ID: PK-882194</span>
                        <span className="font-label-code text-[9px] text-gray-500">Scan at POS</span>
                      </div>
                      <div className="w-full h-10 flex items-center justify-center bg-gray-50 rounded overflow-hidden px-2">
                        <div className="w-full h-7 flex items-stretch gap-[1.5px] opacity-90">
                          {Array.from({ length: 34 }).map((_, idx) => (
                            <div
                              key={idx}
                              className={idx % 3 === 0 ? 'w-2 bg-transparent' : idx % 2 === 0 ? 'w-1 bg-black' : 'w-0.5 bg-black'}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* PASS BACK VIEW */
                  <div
                    className="w-full rounded-[22px] p-5 shadow-2xl relative overflow-hidden transition-all duration-300"
                    style={{ backgroundColor: passConfig.backgroundColor, color: passConfig.textColor }}
                  >
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 via-transparent to-black/25"></div>
                    <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="font-body-md text-body-md font-bold text-white">Detalles del Pase</span>
                      <button
                        onClick={() => setPassSide('front')}
                        className="px-2.5 py-1 rounded-full bg-white/20 text-white font-label-sm text-[11px] hover:bg-white/30 transition-all cursor-pointer"
                        type="button"
                      >
                        Listo
                      </button>
                    </div>

                    <div className="relative z-10 flex flex-col gap-3.5 my-3 max-h-[360px] overflow-y-auto pr-1">
                      {/* Promotion HU-06 */}
                      <div className="p-2.5 rounded-lg bg-white/10">
                        <span className="font-label-code text-[10px] uppercase font-bold text-tertiary-fixed">Promoción de Temporada</span>
                        <p className="font-body-sm text-[12px] font-semibold text-white mt-0.5">{passConfig.seasonPromotion}</p>
                      </div>

                      {/* Terms */}
                      <div className="flex flex-col">
                        <span className="font-label-code text-[10px] uppercase font-bold" style={{ color: passConfig.labelColor }}>
                          Términos & Condiciones
                        </span>
                        <p className="font-body-sm text-[11px] text-white/80 mt-0.5 leading-relaxed">
                          {passConfig.terms}
                        </p>
                      </div>

                      {/* Location & Website */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
                        <div className="flex flex-col">
                          <span className="font-label-code text-[10px] uppercase font-bold" style={{ color: passConfig.labelColor }}>
                            Teléfono Sucursal
                          </span>
                          <span className="font-body-sm text-[12px] text-white font-medium">{passConfig.storePhone}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-code text-[10px] uppercase font-bold" style={{ color: passConfig.labelColor }}>
                            Sitio Web
                          </span>
                          <span className="font-body-sm text-[12px] text-white font-medium underline">{passConfig.website}</span>
                        </div>
                      </div>

                      {/* Automatic Updates */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-black/20">
                        <div className="flex flex-col">
                          <span className="font-body-sm text-[11px] font-semibold text-white">Actualizaciones automáticas</span>
                          <span className="font-label-code text-[9px]" style={{ color: passConfig.labelColor }}>Apple Push Notification Service</span>
                        </div>
                        <span className="material-symbols-outlined text-tertiary-fixed text-[18px]">check_circle</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Official Apple Wallet Button Badge */}
              <div className="w-full flex justify-center pt-3 pb-1 z-20">
                <button
                  onClick={() => showToast('Apple Wallet', 'Apertura de pase nativo .pkpass')}
                  className="px-5 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-900 transition-all flex items-center gap-2.5 shadow-lg border border-white/10 cursor-pointer"
                  type="button"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M20 7V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-2zm-2 12H4V5h14v2h-4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h4v2zm2-4h-6v-6h6v6z"></path>
                  </svg>
                  <span className="font-label-sm text-[12px] font-bold tracking-tight">Add to Apple Wallet</span>
                </button>
              </div>

              {/* iPhone Home Indicator Bar */}
              <div className="w-32 h-1 bg-white/40 rounded-full mx-auto mt-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
