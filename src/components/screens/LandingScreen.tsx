import React, { useState } from 'react';
import { usePass } from '../../context/PassContext';

export const LandingScreen: React.FC = () => {
  const { setCurrentScreen, showToast } = usePass();

  // ROI Calculator State
  const [ticketVal, setTicketVal] = useState<number>(25);
  const [customersVal, setCustomersVal] = useState<number>(45);

  // Pricing State
  const [isAnnual, setIsAnnual] = useState<boolean>(false);

  // FAQ Expanded State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Calculations
  const addedRevenue = Math.round(customersVal * ticketVal);
  const planCost = isAnnual ? 71 : 89;
  const roiMultiplier = (addedRevenue / planCost).toFixed(1);

  const priceStarter = isAnnual ? 31 : 39;
  const pricePro = isAnnual ? 71 : 89;
  const priceBusiness = isAnnual ? 151 : 189;

  const faqs = [
    {
      q: '¿Qué necesita el cliente en su iPhone para utilizar el pase?',
      a: 'Absolutamente nada que no tenga ya. La app Apple Wallet viene preinstalada de fábrica en el 100% de los iPhone. No necesitan descargar apps de la App Store, ni crear contraseñas, ni autorizar permisos complejos.',
    },
    {
      q: '¿Sirve también para clientes con teléfonos Android?',
      a: 'Sí. Aunque PassLoyalty está optimizado con el protocolo nativo PassKit de Apple, la plataforma genera simultáneamente el enlace compatible para Google Wallet en Android, permitiendo que ningún cliente se quede sin su tarjeta digital.',
    },
    {
      q: '¿Cómo se integra con mi caja o TPV actual?',
      a: 'Puedes operar de dos formas: mediante nuestra terminal web ultra-rápida accesible desde cualquier móvil o tablet del personal, o bien conectando tu sistema de caja mediante nuestra API REST para que cada compra sume puntos de manera automática sin tocar otra pantalla.',
    },
    {
      q: '¿Existe algún límite o coste oculto por las notificaciones push enviadas?',
      a: 'No. A diferencia de WhatsApp Business API o los SMS convencionales que cobran por cada mensaje, las notificaciones push de Apple PassKit se transmiten a través de los servidores oficiales de Apple APNs de forma totalmente ilimitada dentro de tu plan.',
    },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-surface text-on-surface antialiased min-h-screen">
      {/* LANDING HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/20">
        <div className="h-20 max-w-7xl mx-auto px-margin flex items-center justify-between gap-space-md">
          {/* Brand */}
          <div className="flex items-center gap-space-lg">
            <button
              onClick={() => scrollTo('hero')}
              className="flex items-center gap-space-sm text-on-surface select-none text-left cursor-pointer"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-on-primary shadow-sm">
                <span className="material-symbols-outlined text-[22px]">wallet</span>
              </span>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm tracking-tight leading-none text-on-surface font-bold">
                  PassLoyalty
                </span>
                <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">
                  Apple PassKit SaaS
                </span>
              </div>
            </button>
          </div>

          {/* Nav links */}
          <nav className="hidden xl:flex items-center gap-space-lg">
            <button
              onClick={() => scrollTo('how-it-works')}
              className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              Cómo funciona
            </button>
            <button
              onClick={() => scrollTo('pillars')}
              className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              Beneficios Apple Wallet
            </button>
            <button
              onClick={() => scrollTo('pricing')}
              className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              Precios / Planes
            </button>
            <button
              onClick={() => scrollTo('testimonials')}
              className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              Clientes & Casos de Éxito
            </button>
            <button
              onClick={() => scrollTo('calculator')}
              className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              Calculadora de ROI
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-space-md">
            <button
              onClick={() => setCurrentScreen('terminal-de-caja')}
              className="hidden sm:inline-flex items-center justify-center h-10 px-space-md rounded-lg font-body-sm text-body-sm font-semibold text-on-surface bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/20 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] mr-1 text-secondary">point_of_sale</span>
              <span>Ver Demo POS / Studio</span>
            </button>

            <button
              onClick={() => setCurrentScreen('disenador-de-pases')}
              className="inline-flex items-center justify-center h-10 px-space-md rounded-lg font-body-sm text-body-sm font-semibold text-on-primary bg-primary hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
              type="button"
            >
              <span>Acceder al Panel</span>
              <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN HERO SECTION */}
      <main className="w-full pt-20 bg-surface">
        <div id="hero" className="relative w-full overflow-hidden">
          {/* Top Ambient Glow */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[840px] h-[480px] bg-secondary-fixed-dim/40 rounded-full blur-[130px] pointer-events-none -z-10"></div>
          <div className="absolute top-96 right-10 w-[380px] h-[380px] bg-tertiary-fixed/30 rounded-full blur-[110px] pointer-events-none -z-10"></div>

          <section className="max-w-7xl mx-auto px-margin pt-12 pb-20 lg:pt-16 lg:pb-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left: Copy & Value Proposition */}
              <div className="lg:col-span-7 flex flex-col items-start gap-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high shadow-sm border border-outline-variant/30">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  <span className="font-label-sm text-label-sm text-secondary tracking-wide uppercase font-semibold">
                    Fidelización Nativa sin Apps de Terceros · 100% Apple Wallet
                  </span>
                </div>

                <h1 className="font-display text-display text-on-surface tracking-tight max-w-2xl font-extrabold">
                  Convierte visitas en clientes recurrentes directo en el <span className="text-secondary">Apple Wallet</span> de sus iPhone.
                </h1>

                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                  Elimina la fricción de descargar apps que nadie usa. Tus clientes guardan su pase digital en 15 segundos escaneando un QR y reciben notificaciones push en su pantalla de bloqueo con APNs oficial.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
                  <button
                    onClick={() => setCurrentScreen('disenador-de-pases')}
                    className="inline-flex items-center justify-center gap-2 h-13 px-8 rounded-xl font-headline-sm text-headline-sm text-on-primary bg-primary hover:bg-neutral-800 shadow-xl shadow-primary/10 transition-all hover:-translate-y-0.5 active:translate-y-0 text-center cursor-pointer font-bold"
                  >
                    <span>Empezar Prueba Gratuita de 14 Días</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                  <button
                    onClick={() => setCurrentScreen('terminal-de-caja')}
                    className="inline-flex items-center justify-center gap-2 h-13 px-6 rounded-xl font-headline-sm text-headline-sm text-on-surface bg-surface-container-lowest hover:bg-surface-container shadow-md transition-all text-center border border-outline-variant/30 cursor-pointer font-semibold"
                  >
                    <span className="material-symbols-outlined text-secondary text-[22px]">point_of_sale</span>
                    <span>Ver Demo Interactiva</span>
                  </button>
                </div>

                {/* Proof Metrics Bar */}
                <div className="pt-6 mt-4 w-full grid grid-cols-3 gap-4 bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/20">
                  <div className="flex flex-col">
                    <span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">+180</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Comercios y franquicias</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-lg text-headline-lg text-secondary font-bold tracking-tight">98.4%</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Retención de pase en Wallet</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-lg text-headline-lg text-on-tertiary-container font-bold tracking-tight">0%</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Apps para instalar</span>
                  </div>
                </div>
              </div>

              {/* Right: Apple Wallet Pass Composition Mockup */}
              <div className="lg:col-span-5 relative flex justify-center items-center">
                <div className="absolute -top-6 -right-4 w-72 h-44 rounded-2xl bg-surface-container-high/60 rotate-6 shadow-md -z-10"></div>
                <div className="absolute -bottom-6 -left-4 w-72 h-44 rounded-2xl bg-secondary-fixed/50 -rotate-3 shadow-md -z-10"></div>

                <div className="relative w-full max-w-[340px] bg-primary text-on-primary rounded-[44px] p-3 shadow-2xl ring-1 ring-surface-tint/20">
                  {/* Dynamic Island */}
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-5 bg-primary-container rounded-full z-30 flex items-center justify-between px-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
                  </div>

                  {/* Screen Area */}
                  <div className="w-full bg-gradient-to-b from-surface-container-lowest via-surface-bright to-surface-container-low rounded-[36px] overflow-hidden p-4 pt-9 flex flex-col gap-3">
                    {/* Lockscreen Notification */}
                    <div className="bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl p-3 shadow-lg flex items-start gap-3 transition-transform hover:scale-[1.02] border border-outline-variant/20">
                      <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px] text-on-primary">wallet</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-label-sm text-on-surface font-semibold truncate">Apple Wallet · Ahora</span>
                          <span className="material-symbols-outlined text-[14px] text-secondary">location_on</span>
                        </div>
                        <p className="font-headline-sm text-[12px] leading-tight text-on-surface font-semibold pt-0.5">¡Pasa por tu café de especialidad!</p>
                        <p className="font-body-sm text-[11px] leading-tight text-on-surface-variant truncate">Estás a 50m de Café Artisan & Bakery</p>
                      </div>
                    </div>

                    {/* Pass Card */}
                    <div className="w-full bg-primary-container text-on-primary rounded-2xl p-4 shadow-xl flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

                      <div className="flex items-start justify-between relative z-10 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary font-bold text-sm shadow">
                            ☕
                          </div>
                          <div>
                            <span className="font-label-sm text-[10px] tracking-wider uppercase text-on-primary-container font-semibold">Club Exclusivo</span>
                            <h2 className="font-headline-sm text-headline-sm text-on-primary leading-tight font-bold">Artisan Roasters</h2>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-label-sm text-[9px] uppercase tracking-wider text-on-primary-container font-semibold">Nivel</span>
                          <span className="font-headline-sm text-[13px] text-tertiary-fixed font-semibold">Oro VIP</span>
                        </div>
                      </div>

                      {/* Stamp Grid */}
                      <div className="my-3 py-2 px-2.5 rounded-xl bg-surface-container-lowest/10 relative z-10">
                        <div className="flex items-center justify-between text-[11px] font-label-sm text-on-primary-container mb-2 font-medium">
                          <span>Sellos acumulados: <strong className="text-on-primary">7 de 10</strong></span>
                          <span className="text-tertiary-fixed font-bold">Café gratis a los 10</span>
                        </div>
                        <div className="grid grid-cols-5 gap-1.5 justify-items-center">
                          {Array.from({ length: 7 }).map((_, i) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-tertiary-fixed text-primary flex items-center justify-center text-[10px] shadow-sm">
                              <span className="material-symbols-outlined text-[13px]">check</span>
                            </div>
                          ))}
                          <div className="w-6 h-6 rounded-full bg-surface-container-highest/30 flex items-center justify-center text-[10px] text-on-primary-container font-bold">8</div>
                          <div className="w-6 h-6 rounded-full bg-surface-container-highest/30 flex items-center justify-center text-[10px] text-on-primary-container font-bold">9</div>
                          <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[11px] text-on-primary font-bold shadow">🎁</div>
                        </div>
                      </div>

                      {/* Pass Footer / Barcode */}
                      <div className="pt-2 flex flex-col items-center justify-center relative z-10">
                        <div className="bg-surface-container-lowest p-2 rounded-lg flex items-center justify-center shadow-inner w-full">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-primary text-[28px]">qr_code_2</span>
                            <span className="font-label-code text-[11px] text-on-surface font-semibold tracking-wider">PL-9481-BCN</span>
                          </div>
                        </div>
                        <span className="font-label-sm text-[9px] text-on-primary-container tracking-widest mt-1 uppercase font-semibold">
                          Actualización instantánea APNs
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 py-1 text-on-surface-variant font-label-sm text-[11px]">
                      <span className="material-symbols-outlined text-[14px]">smartphone</span>
                      <span>Se abre con doble clic lateral del iPhone</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* SOCIAL PROOF TICKER */}
        <section className="w-full bg-surface-container-lowest py-8 shadow-sm border-y border-outline-variant/20">
          <div className="max-w-7xl mx-auto px-margin flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant whitespace-nowrap font-semibold">
              Impulsando el checkout recurrente en:
            </span>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-8 opacity-70">
              <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface">ARTISAN COFFEE</span>
              <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface">URBAN STYLE CO.</span>
              <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface">GASTROBAR BCN</span>
              <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface">VELO FIT CLUB</span>
              <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface">SMASH BURGER LAB</span>
            </div>
          </div>
        </section>

        {/* 3 PILLARS */}
        <section id="pillars" className="max-w-7xl mx-auto px-margin py-20 lg:py-28">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 gap-4">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold bg-secondary-fixed/50 px-3.5 py-1 rounded-full border border-secondary/20">
              Tecnología PassKit Nativa
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              El canal de retención más directo y rentable del planeta
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Evita pagar a desarrolladores para crear apps nativas costosas que el 90% de los usuarios elimina en la primera semana. Apple Wallet ya está instalado en cada iPhone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group border border-outline-variant/20">
              <div className="flex flex-col gap-4">
                <div className="w-14 h-14 rounded-2xl bg-surface-container-high text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-[30px]">qr_code_scanner</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                  Cero Descargas, Cero Fricción
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Registro ultra-rápido en 30 segundos escaneando un código QR colocado en el mostrador o mesa. Se descarga directamente el archivo criptográfico <span className="font-label-code text-on-surface font-semibold">.pkpass</span> oficial firmado con tu certificado.
                </p>
              </div>
              <div className="mt-8 pt-4 flex items-center gap-2 text-secondary font-headline-sm text-headline-sm font-semibold">
                <span>15s de alta media</span>
                <span className="material-symbols-outlined text-[18px]">bolt</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group border border-outline-variant/20">
              <div className="flex flex-col gap-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                  <span className="material-symbols-outlined text-[30px]">notifications_active</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                  Notificaciones Push Ilimitadas & Gratuitas
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Avisos nativos en la pantalla de bloqueo vía APNs (Apple Push Notification service) mediante el protocolo <span className="font-label-code text-on-surface font-semibold">changeMessage</span>. Olvídate para siempre del coste por envío en WhatsApp o SMS.
                </p>
              </div>
              <div className="mt-8 pt-4 flex items-center gap-2 text-secondary font-headline-sm text-headline-sm font-semibold">
                <span>Coste de push: 0,00 €</span>
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group border border-outline-variant/20">
              <div className="flex flex-col gap-4">
                <div className="w-14 h-14 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center group-hover:bg-primary-container group-hover:text-tertiary-fixed transition-colors">
                  <span className="material-symbols-outlined text-[30px]">near_me</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                  Avisos Automáticos por Geocercas (GPS)
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Configura hasta 10 ubicaciones por local. El pase digital despierta automáticamente en la pantalla del iPhone cuando el cliente camina a menos de 100m de tu puerta con ofertas contextuales.
                </p>
              </div>
              <div className="mt-8 pt-4 flex items-center gap-2 text-secondary font-headline-sm text-headline-sm font-semibold">
                <span>Radio de 50m a 100m</span>
                <span className="material-symbols-outlined text-[18px]">radar</span>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="w-full bg-surface-container-low py-20 border-y border-outline-variant/20">
          <div className="max-w-7xl mx-auto px-margin">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant font-semibold">
                  Flujo Operativo Simple
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mt-2 font-bold">
                  Cómo funciona para tu comercio en 3 pasos
                </h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                Sin hardware nuevo ni migraciones complejas. Tu terminal de caja actual o cualquier smartphone/tablet funciona desde el primer minuto.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm flex flex-col justify-between border border-outline-variant/20">
                <div>
                  <div className="flex items-center justify-between pb-6">
                    <span className="w-10 h-10 rounded-full bg-primary text-on-primary font-headline-sm font-bold flex items-center justify-center">1</span>
                    <span className="font-label-code text-on-surface-variant font-semibold">CONFIGURADOR</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-3 font-bold">
                    Diseña tu tarjeta en minutos
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                    Personaliza paleta cromática, logo institucional, tipo de tarjeta (sellos, puntos acumulables, membresía VIP o cupón de regalo) y las reglas de recompensa en nuestro editor visual.
                  </p>
                </div>
                <div className="rounded-2xl bg-surface-container-high/60 p-4 border border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">palette</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">Editor en tiempo real</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Generación automática de .pkpass</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm flex flex-col justify-between border border-outline-variant/20">
                <div>
                  <div className="flex items-center justify-between pb-6">
                    <span className="w-10 h-10 rounded-full bg-primary text-on-primary font-headline-sm font-bold flex items-center justify-center">2</span>
                    <span className="font-label-code text-on-surface-variant font-semibold">DESPLIEGUE QR</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-3 font-bold">
                    El cliente añade su pase al instante
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                    Descarga e imprime los soportes acrílicos con tu QR exclusivo para el mostrador. El cliente apunta con la cámara de su iPhone y con pulsar &quot;Añadir a Apple Wallet&quot; ya está registrado.
                  </p>
                </div>
                <div className="rounded-2xl bg-surface-container-high/60 p-4 border border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">add_to_home_screen</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">Alta en 1 clic</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Sin formularios tediosos de 12 campos</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm flex flex-col justify-between border border-outline-variant/20">
                <div>
                  <div className="flex items-center justify-between pb-6">
                    <span className="w-10 h-10 rounded-full bg-primary text-on-primary font-headline-sm font-bold flex items-center justify-center">3</span>
                    <span className="font-label-code text-on-surface-variant font-semibold">VALIDACIÓN TPV</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-3 font-bold">
                    Escanea y sella en 1.4 segundos
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                    Tu equipo escanea el pase desde cualquier navegador web en su tablet o mediante pistola de código de barras. El saldo del cliente se actualiza en directo en su pantalla de bloqueo.
                  </p>
                </div>
                <div className="rounded-2xl bg-surface-container-high/60 p-4 border border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">speed</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">Terminal Web Instantánea</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Sin colas en caja durante horas pico</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE ROI CALCULATOR */}
        <section id="calculator" className="max-w-7xl mx-auto px-margin py-20">
          <div className="bg-surface-container-lowest rounded-3xl p-8 lg:p-14 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-10 items-center border border-outline-variant/20">
            <div className="lg:col-span-6 flex flex-col gap-6">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">
                Simulador de Retorno de Inversión
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Calcula cuánto gana tu local reactivando visitas con PassLoyalty
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Descubre cómo apenas un puñado de clientes adicionales que vuelven gracias a los avisos geolocalizados y push de Apple Wallet cubren más de 5 veces el coste de la plataforma.
              </p>

              {/* Sliders */}
              <div className="flex flex-col gap-5 pt-2">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-headline-sm text-headline-sm text-on-surface font-semibold" htmlFor="ticketRange">
                      Ticket Medio de Venta (€)
                    </label>
                    <span className="font-headline-md text-headline-md text-secondary font-bold">
                      {ticketVal} €
                    </span>
                  </div>
                  <input
                    className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                    id="ticketRange"
                    max={150}
                    min={5}
                    type="range"
                    value={ticketVal}
                    onChange={(e) => setTicketVal(parseFloat(e.target.value))}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-headline-sm text-headline-sm text-on-surface font-semibold" htmlFor="customersRange">
                      Clientes Recurrentes Extra al Mes
                    </label>
                    <span className="font-headline-md text-headline-md text-secondary font-bold">
                      {customersVal} clientes
                    </span>
                  </div>
                  <input
                    className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                    id="customersRange"
                    max={300}
                    min={10}
                    step={5}
                    type="range"
                    value={customersVal}
                    onChange={(e) => setCustomersVal(parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Results Card */}
            <div className="lg:col-span-6 bg-surface-container-low rounded-2xl p-8 flex flex-col gap-6 border border-outline-variant/20">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Impacto Estimado Mensual
              </span>
              <div className="flex flex-col">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Facturación Bruta Adicional Estimada:</span>
                <span className="font-display text-display text-on-surface font-extrabold text-secondary tracking-tight">
                  +{addedRevenue.toLocaleString('es-ES')} € / mes
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Coste Plan Recomendado</span>
                  <span className="font-headline-md text-headline-md text-on-surface font-bold">{planCost} € / mes</span>
                </div>
                <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Múltiplo de ROI Bruto</span>
                  <span className="font-headline-md text-headline-md text-on-tertiary-container font-bold">{roiMultiplier}x</span>
                </div>
              </div>

              <p className="font-body-sm text-body-sm text-on-surface-variant">
                *Estimación calculada asumiendo que los clientes con pase en Wallet visitan el establecimiento una media de 1.8 veces más al mes debido a las alertas de geocerca y recordatorios APNs.
              </p>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="max-w-7xl mx-auto px-margin py-20">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12 gap-4">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold bg-secondary-fixed/50 px-3.5 py-1 rounded-full border border-secondary/20">
              Precios Claros y Escalables
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              Elige el plan adaptado a tu escala comercial
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Todos los planes incluyen 14 días de prueba completa sin necesidad de introducir tarjeta de crédito ni compromiso de permanencia.
            </p>

            {/* Toggle Billing */}
            <div className="flex items-center gap-3 bg-surface-container-high p-1.5 rounded-full mt-4 border border-outline-variant/20">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-5 py-2 rounded-full font-label-sm text-label-sm transition-all cursor-pointer ${
                  !isAnnual ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                Facturación Mensual
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-5 py-2 rounded-full font-label-sm text-label-sm transition-all cursor-pointer ${
                  isAnnual ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                Anual <span className="bg-tertiary-fixed text-primary px-2 py-0.5 rounded-full ml-1 font-bold">-20% Dto</span>
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Starter */}
            <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm flex flex-col justify-between border border-outline-variant/20">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Starter</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full font-semibold">1 Local</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                  Para cafeterías independientes, barberías y boutiques locales que dan sus primeros pasos con pases digitales.
                </p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="font-display text-display text-on-surface font-bold">{priceStarter}€</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">/ mes</span>
                </div>
                <div className="flex flex-col gap-3.5 pt-4">
                  <div className="flex items-center gap-2.5 font-body-sm text-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">check_circle</span>
                    <span>Hasta <strong>500 pases activos</strong> en Wallet</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-body-sm text-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">check_circle</span>
                    <span>1 Punto de venta (TPV web ilimitado)</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-body-sm text-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">check_circle</span>
                    <span>Notificaciones automáticas por cambio de saldo</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-body-sm text-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">check_circle</span>
                    <span>Diseñador visual de pases</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-body-sm text-body-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">check_circle</span>
                    <span>Soporte estándar por correo (24h)</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <button
                  onClick={() => setCurrentScreen('disenador-de-pases')}
                  className="w-full inline-flex items-center justify-center h-12 rounded-xl font-headline-sm text-headline-sm text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors font-semibold cursor-pointer"
                  type="button"
                >
                  Comenzar Starter
                </button>
              </div>
            </div>

            {/* Crecimiento Pro */}
            <div className="bg-primary text-on-primary rounded-3xl p-8 shadow-2xl flex flex-col justify-between relative transform lg:-translate-y-3">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary px-4 py-1 rounded-full font-label-sm text-label-sm font-bold uppercase tracking-wider shadow-md">
                MÁS POPULAR / RECOMENDADO
              </div>
              <div>
                <div className="flex items-center justify-between mb-4 mt-2">
                  <h3 className="font-headline-md text-headline-md text-on-primary font-bold">Crecimiento Pro</h3>
                  <span className="font-label-sm text-label-sm text-on-primary-fixed bg-surface-container-lowest/20 px-2.5 py-1 rounded-full font-semibold">
                    Hasta 3 Locales
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-primary-container mb-6">
                  Para restaurantes consolidados y tiendas de retail multisede que quieren automatizar ventas recurrentes.
                </p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="font-display text-display text-on-primary font-bold">{pricePro}€</span>
                  <span className="font-body-sm text-body-sm text-on-primary-container">/ mes</span>
                </div>
                <div className="flex flex-col gap-3.5 pt-4">
                  <div className="flex items-center gap-2.5 font-body-sm text-body-sm text-on-primary">
                    <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">check_circle</span>
                    <span>Hasta <strong>3.000 pases activos</strong> en Wallet</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-body-sm text-body-sm text-on-primary">
                    <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">check_circle</span>
                    <span>Campañas Push Masivas Programadas (HU-06)</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-body-sm text-body-sm text-on-primary">
                    <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">check_circle</span>
                    <span>Geocercas GPS personalizadas por tienda (HU-07)</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-body-sm text-body-sm text-on-primary">
                    <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">check_circle</span>
                    <span>Métricas avanzadas de frecuencia y cohortes</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-body-sm text-body-sm text-on-primary">
                    <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">check_circle</span>
                    <span>Soporte prioritario por WhatsApp & Chat</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <button
                  onClick={() => setCurrentScreen('disenador-de-pases')}
                  className="w-full inline-flex items-center justify-center h-12 rounded-xl font-headline-sm text-headline-sm text-on-primary bg-secondary hover:bg-secondary-container transition-colors shadow-lg font-bold cursor-pointer"
                  type="button"
                >
                  Probar 14 Días Gratis
                </button>
              </div>
            </div>

            {/* Business & Franquicias */}
            <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm flex flex-col justify-between border border-outline-variant/20">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Business & Franquicias</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full font-semibold">Ilimitado</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                  Para cadenas de franquicias, marcas de moda y grupos de restauración con integración centralizada a su stack de caja.
                </p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="font-display text-display text-on-surface font-bold">{priceBusiness}€</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">/ mes</span>
                </div>
                <div className="flex flex-col gap-3.5 pt-4">
                  <div className="flex items-center gap-2.5 font-body-sm text-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">check_circle</span>
                    <span>Hasta <strong>15.000 pases activos</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5 font-body-sm text-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">check_circle</span>
                    <span>Certificados Apple Developer propios (.p12)</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-body-sm text-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">check_circle</span>
                    <span>Integración API REST con TPV (Square, Loyverse, Clover)</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-body-sm text-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">check_circle</span>
                    <span>Multi-usuario con permisos por rol de empleado</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-body-sm text-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">check_circle</span>
                    <span>Gestor de cuenta y SLA de soporte dedicado</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <button
                  onClick={() => {
                    showToast('Contacto Enterprise', 'Un especialista de PassLoyalty se pondrá en contacto en breve');
                  }}
                  className="w-full inline-flex items-center justify-center h-12 rounded-xl font-headline-sm text-headline-sm text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors font-semibold cursor-pointer"
                  type="button"
                >
                  Contactar para Demo Enterprise
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="w-full bg-surface-container-low py-20 border-y border-outline-variant/20">
          <div className="max-w-7xl mx-auto px-margin">
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 gap-3">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">
                Resultados Tangibles en Tienda
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Casos de éxito que hablan con cifras
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Comercios que multiplicaron la frecuencia de repetición tras reemplazar tarjetas de cartón y apps obsoletas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Case 1 */}
              <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm flex flex-col justify-between border border-outline-variant/20">
                <div className="flex flex-col gap-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-display text-secondary font-extrabold">+42%</span>
                    <span className="font-label-sm text-label-sm px-2.5 py-1 bg-surface-container text-on-surface font-semibold rounded-full">
                      Frecuencia en 60d
                    </span>
                  </div>
                  <p className="font-headline-sm text-headline-sm text-on-surface font-bold">Café Artisan & Bakery</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    &quot;Teníamos tarjetas de papel que los clientes siempre perdían o lavaban en el pantalón. En apenas dos meses hemos emitido 3.420 pases en Apple Wallet y la recurrencia semanal se disparó de forma drástica.&quot;
                  </p>
                </div>
                <div className="pt-6 flex items-center gap-3 border-t border-outline-variant/10 mt-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-on-surface">
                    MV
                  </div>
                  <div>
                    <span className="font-headline-sm text-headline-sm text-on-surface block leading-tight font-bold">Marcos V.</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Fundador & Head Roaster</span>
                  </div>
                </div>
              </div>

              {/* Case 2 */}
              <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm flex flex-col justify-between border border-outline-variant/20">
                <div className="flex flex-col gap-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-display text-secondary font-extrabold">+18.70€</span>
                    <span className="font-label-sm text-label-sm px-2.5 py-1 bg-surface-container text-on-surface font-semibold rounded-full">
                      Ticket Medio
                    </span>
                  </div>
                  <p className="font-headline-sm text-headline-sm text-on-surface font-bold">Boutique Urbana Moda</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    &quot;La posibilidad de programar notificaciones push exclusivas antes del fin de semana con novedades de temporada sin pagar a agencias de SMS nos genera picos de venta directa todos los viernes por la tarde.&quot;
                  </p>
                </div>
                <div className="pt-6 flex items-center gap-3 border-t border-outline-variant/10 mt-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-on-surface">
                    LN
                  </div>
                  <div>
                    <span className="font-headline-sm text-headline-sm text-on-surface block leading-tight font-bold">Lucía Navarro</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Directora de Operaciones</span>
                  </div>
                </div>
              </div>

              {/* Case 3 */}
              <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm flex flex-col justify-between border border-outline-variant/20">
                <div className="flex flex-col gap-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-display text-secondary font-extrabold">88.4%</span>
                    <span className="font-label-sm text-label-sm px-2.5 py-1 bg-surface-container text-on-surface font-semibold rounded-full">
                      Apertura Push
                    </span>
                  </div>
                  <p className="font-headline-sm text-headline-sm text-on-surface font-bold">GastroBar Central</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    &quot;Los días de lluvia solían ser un desierto. Ahora lanzamos un aviso geolocalizado con un 2x1 en tapas y llenamos la barra en 45 minutos. Los clientes no borran el pase porque vive silencioso en su Wallet.&quot;
                  </p>
                </div>
                <div className="pt-6 flex items-center gap-3 border-t border-outline-variant/10 mt-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-on-surface">
                    DT
                  </div>
                  <div>
                    <span className="font-headline-sm text-headline-sm text-on-surface block leading-tight font-bold">David Tormo</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Socio Gerente</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="max-w-4xl mx-auto px-margin py-20">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant font-semibold">
              Dudas Comunes
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mt-2 font-bold">
              Preguntas Frecuentes sobre PassLoyalty
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/20 cursor-pointer transition-all hover:bg-surface-container-low/30"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      {faq.q}
                    </h3>
                    <span className="material-symbols-outlined text-secondary text-[22px] transition-transform">
                      {isOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>
                  {isOpen && (
                    <p className="font-body-md text-body-md text-on-surface-variant mt-3 pt-3 border-t border-outline-variant/10 leading-relaxed">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* FINAL CONVERSION BANNER */}
        <section className="max-w-7xl mx-auto px-margin pb-20">
          <div className="w-full bg-primary text-on-primary rounded-3xl p-10 lg:p-16 relative overflow-hidden shadow-2xl flex flex-col items-center text-center gap-6">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-secondary-container/30 rounded-full blur-[100px] pointer-events-none"></div>

            <span className="font-label-sm text-label-sm uppercase tracking-widest text-tertiary-fixed font-semibold z-10">
              Empieza hoy mismo en 15 minutos
            </span>
            <h2 className="font-display text-display text-on-primary max-w-3xl z-10 font-extrabold">
              Únete a los comercios que ya fidelizan con la tecnología nativa de Apple
            </h2>
            <p className="font-body-lg text-body-lg text-on-primary-container max-w-xl z-10">
              Comienza hoy tu prueba gratuita de 14 días. Configura tu primera tarjeta digital y sorprende a tus clientes en el próximo servicio.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 z-10 w-full sm:w-auto">
              <button
                onClick={() => setCurrentScreen('disenador-de-pases')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl font-headline-sm text-headline-sm text-primary bg-surface-container-lowest hover:bg-surface-bright transition-all shadow-lg font-bold cursor-pointer"
                type="button"
              >
                <span>Crear Cuenta Gratis</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
              <button
                onClick={() => setCurrentScreen('terminal-de-caja')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl font-headline-sm text-headline-sm text-on-primary bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 transition-all cursor-pointer font-semibold"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">point_of_sale</span>
                <span>Probar Terminal POS</span>
              </button>
            </div>

            <div className="flex items-center gap-6 pt-4 text-on-primary-container font-body-sm text-body-sm z-10 flex-wrap justify-center">
              <span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-tertiary-fixed">check</span> Sin tarjeta de crédito</span>
              <span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-tertiary-fixed">check</span> Cancela cuando quieras</span>
              <span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-tertiary-fixed">check</span> Puesta en marcha guiada</span>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_12px_rgba(0,0,0,0.02)] mt-space-xl border-t border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-margin pt-space-xl pb-space-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl pb-space-xl">
            <div className="lg:col-span-2 flex flex-col gap-space-md">
              <div className="flex items-center gap-space-sm">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-on-primary">
                  <span className="material-symbols-outlined text-[18px]">wallet</span>
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">PassLoyalty</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                Infraestructura empresarial para tarjetas de fidelización, cupones geolocalizados y credenciales dinámicas en Apple Wallet con sincronización APNs instantánea.
              </p>
              <div className="flex items-center gap-space-sm pt-space-xs flex-wrap">
                <span className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
                  Apple MFi & PassKit Certified
                </span>
                <span className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface font-label-sm text-label-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  SLA 99.98%
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-space-sm">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Plataforma</span>
              <button onClick={() => setCurrentScreen('disenador-de-pases')} className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors text-left">
                Diseñador de Pases
              </button>
              <button onClick={() => setCurrentScreen('terminal-de-caja')} className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors text-left">
                Terminal POS de Caja
              </button>
              <button onClick={() => setCurrentScreen('campanas-y-push')} className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors text-left">
                Campañas Push Masivas
              </button>
              <button onClick={() => setCurrentScreen('metricas-y-clientes')} className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors text-left">
                Métricas & Clientes
              </button>
            </div>

            <div className="flex flex-col gap-space-sm">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Integración POS</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Documentación API REST</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Webhooks & Eventos POS</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">SDKs para TPVs / Retail</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Monitor APNs Push Gate</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Certificados .pkpass</span>
            </div>

            <div className="flex flex-col gap-space-sm">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Legal & Confianza</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Términos del Servicio</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Política de Privacidad</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Cumplimiento RGPD & MFi</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Seguridad de Datos Cifrados</span>
              <div className="pt-space-xs">
                <div className="inline-flex items-center gap-space-xs text-on-surface-variant text-body-sm font-body-sm">
                  <span className="material-symbols-outlined text-[16px]">language</span>
                  <select aria-label="Selector de idioma" className="bg-transparent text-on-surface font-body-sm text-body-sm cursor-pointer outline-none font-medium">
                    <option value="es">Español (ES)</option>
                    <option value="en">English (US)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md text-on-surface-variant font-body-sm text-body-sm border-t border-outline-variant/10">
            <div className="flex items-center gap-space-xs">
              <span>© 2025 PassLoyalty Technologies S.L. Todos los derechos reservados.</span>
            </div>
            <div className="flex items-center gap-space-md">
              <span className="inline-flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
                Red APNs: Operacional
              </span>
              <span>v2.8.4 Enterprise</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
