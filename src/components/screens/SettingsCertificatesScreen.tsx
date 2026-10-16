import React, { useState } from 'react';
import { usePass } from '../../context/PassContext';

export const SettingsCertificatesScreen: React.FC = () => {
  const { showToast, passConfig, setPassConfig } = usePass();

  const [appleTeamId, setAppleTeamId] = useState('APPLE984MFI');
  const [passTypeId, setPassTypeId] = useState('pass.com.artisan.loyalty');
  const [keyId, setKeyId] = useState('2X984ZLKQ9');
  const [webhookUrl, setWebhookUrl] = useState('https://api.artisanbakery.com/pos/webhooks/apple-passkit');
  const [isTestingCert, setIsTestingCert] = useState(false);

  const handleTestCert = () => {
    setIsTestingCert(true);
    setTimeout(() => {
      setIsTestingCert(false);
      showToast('Certificado Válido', 'Firma SHA-256 con clave privada Apple Worldwide Developer Relations confirmada');
    }, 1000);
  };

  const handleSaveSettings = () => {
    showToast('Ajustes Guardados', 'Credenciales y endpoints actualizados en el servidor PassKit');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Header */}
      <div className="px-space-margin py-space-md bg-surface-container-lowest shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-space-md border-b border-outline-variant/20">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs">
            <span className="font-label-code text-label-code text-secondary font-semibold uppercase tracking-wider">PassKit Security & Crypto</span>
            <span className="text-on-surface-variant font-label-code text-label-code">/</span>
            <span className="font-label-code text-label-code text-on-surface-variant">Apple Developer Gateway</span>
          </div>
          <div className="flex items-center gap-space-sm mt-1">
            <h1 className="font-headline-md text-headline-md text-on-surface font-bold">Ajustes & Certificados Apple Wallet</h1>
            <span className="bg-surface-container text-on-surface font-label-code text-label-code px-2 py-0.5 rounded">MFi · APNs HTTP/2</span>
          </div>
        </div>

        <div className="flex items-center gap-space-sm">
          <button
            onClick={handleTestCert}
            disabled={isTestingCert}
            className="flex items-center gap-space-xs px-space-md h-10 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-all font-body-sm text-body-sm font-semibold shadow-sm cursor-pointer border border-outline-variant/20"
            type="button"
          >
            <span className={`material-symbols-outlined text-[18px] ${isTestingCert ? 'animate-spin' : ''}`}>
              {isTestingCert ? 'sync' : 'verified'}
            </span>
            <span>Verificar Firma Criptográfica</span>
          </button>
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-space-xs px-space-md h-10 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all font-body-sm text-body-sm font-semibold shadow-md cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>Guardar Credenciales</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-space-lg max-w-[1440px] mx-auto w-full flex flex-col gap-space-lg">
        {/* Certificate Status Alert */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px]">lock</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-headline-sm font-bold text-on-surface">Certificado Pass Type ID Activo y Cifrado</h3>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-tertiary-container font-label-code text-xs font-bold">
                Válido hasta Octubre 2026
              </span>
            </div>
            <p className="font-body-sm text-on-surface-variant mt-1 leading-relaxed">
              Todos los paquetes <code className="font-label-code bg-surface-container px-1 py-0.5 rounded">.pkpass</code> generados son firmados digitalmente con la clave privada de tu cuenta Apple Developer y el certificado intermedio WWDR G4 de Apple, garantizando que iOS los reconozca como pases legítimos de máxima seguridad.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
          {/* Section 1: Apple PassKit Identifiers */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">developer_mode</span>
                <h2 className="font-headline-sm font-bold text-on-surface">Credenciales Apple Developer</h2>
              </div>
              <span className="font-label-code text-xs text-on-surface-variant font-semibold">pass.json</span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm uppercase tracking-wider font-semibold text-on-surface">Pass Type Identifier (Pass Type ID)</label>
                <input
                  type="text"
                  className="h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-label-code text-sm outline-none border border-outline-variant/20 focus:ring-2 focus:ring-secondary/30"
                  value={passTypeId}
                  onChange={(e) => setPassTypeId(e.target.value)}
                />
                <span className="font-body-sm text-xs text-on-surface-variant">Registrado en developer.apple.com/account/resources/identifiers</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm uppercase tracking-wider font-semibold text-on-surface">Apple Team ID (10 Caracteres)</label>
                <input
                  type="text"
                  className="h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-label-code text-sm outline-none border border-outline-variant/20 focus:ring-2 focus:ring-secondary/30"
                  value={appleTeamId}
                  onChange={(e) => setAppleTeamId(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm uppercase tracking-wider font-semibold text-on-surface">APNs Key ID (AuthKey_*.p8)</label>
                <input
                  type="text"
                  className="h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-label-code text-sm outline-none border border-outline-variant/20 focus:ring-2 focus:ring-secondary/30"
                  value={keyId}
                  onChange={(e) => setKeyId(e.target.value)}
                />
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-body-sm font-semibold text-on-surface">Certificado Criptográfico (.p12)</span>
                  <span className="font-label-code text-xs text-on-surface-variant">pass.com.artisan.loyalty.p12 (Instalado)</span>
                </div>
                <button
                  onClick={() => showToast('Reemplazo de Certificado', 'Selecciona el nuevo archivo .p12 con clave privada')}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container font-body-sm text-xs font-semibold shadow-sm border border-outline-variant/30 cursor-pointer"
                  type="button"
                >
                  Renovar .p12
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: POS Webhooks & API Integration */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">api</span>
                <h2 className="font-headline-sm font-bold text-on-surface">Integración API & TPV Webhook</h2>
              </div>
              <span className="font-label-code text-xs text-on-tertiary-container bg-surface-container-low px-2 py-0.5 rounded font-bold">
                REST v1
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm uppercase tracking-wider font-semibold text-on-surface">URL de Webhook para Eventos POS</label>
                <input
                  type="text"
                  className="h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-label-code text-xs outline-none border border-outline-variant/20 focus:ring-2 focus:ring-secondary/30"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
                <span className="font-body-sm text-xs text-on-surface-variant">
                  Recibe eventos instantáneos cuando un cliente escanea o canjea su pase en caja.
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-label-sm uppercase tracking-wider font-semibold text-on-surface">Conectores TPV Soportados</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-lg bg-surface-container-low flex flex-col items-center justify-center gap-1 border border-outline-variant/20">
                    <span className="font-bold text-sm text-on-surface">Square</span>
                    <span className="font-label-code text-[10px] text-on-tertiary-container font-semibold">Conectado</span>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-container-low flex flex-col items-center justify-center gap-1 border border-outline-variant/20">
                    <span className="font-bold text-sm text-on-surface">Loyverse</span>
                    <span className="font-label-code text-[10px] text-on-tertiary-container font-semibold">Conectado</span>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-container-low flex flex-col items-center justify-center gap-1 border border-outline-variant/20">
                    <span className="font-bold text-sm text-on-surface">Clover POS</span>
                    <span className="font-label-code text-[10px] text-on-surface-variant">Disponible</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-1 border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <span className="font-body-sm font-semibold text-on-surface">Clave de API Secreta (Bearer)</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('pk_live_894021984210984120948');
                      showToast('Clave Copiada', 'Bearer API key copiada al portapapeles');
                    }}
                    className="font-label-code text-xs text-secondary font-bold hover:underline cursor-pointer"
                  >
                    Copiar
                  </button>
                </div>
                <span className="font-label-code text-xs text-on-surface-variant">pk_live_••••••••••••••••••••948</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
