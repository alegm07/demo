import React, { createContext, useContext, useState } from 'react';
import { ScreenType, PassConfig, Customer, Transaction, Campaign } from '../types';

interface ToastState {
  show: boolean;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface PassContextType {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  activeBranch: string;
  setActiveBranch: (branch: string) => void;
  passConfig: PassConfig;
  setPassConfig: React.Dispatch<React.SetStateAction<PassConfig>>;
  customers: Customer[];
  activeCustomer: Customer;
  setActiveCustomer: (customer: Customer) => void;
  transactions: Transaction[];
  campaigns: Campaign[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'time'>) => void;
  addCustomer: (newCustomer: Omit<Customer, 'id' | 'passId' | 'initials' | 'tier' | 'registeredDate' | 'iosVersion'>) => Customer;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'sentDate' | 'deliveredCount' | 'deliveryRate' | 'storeVisits48h' | 'visitRate'>) => void;
  updateActiveCustomerStamps: (delta: number) => void;
  redeemActiveCustomerReward: () => void;
  toast: ToastState;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  hideToast: () => void;
}

const initialPassConfig: PassConfig = {
  businessName: 'Café Artisan & Bakery',
  cardTitle: 'PassLoyalty Café Club',
  logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoTAzspZp0ovSv15Qeo_5lkaSJGa_kDSgBTvDdWZAL5w1zNNz268oUEV4w3XKurJn3AcpUKMMWxOJKnjNZGl1aOnQFgAUpmNHXzfD3JNe_L8xtZlR97A4AoQlBQlqBCbtxXbDlfcYtgun_j6-S4gCnVxUhY1CaVgm1ryQLvsJvpYljvrbytq4nxjRbccxFiZHNQQLsV-Dvc2I0m1G_m9nY510Q5bVqQpPH3NwSspTAcL75uX6hhZdM',
  backgroundColor: '#1E1B4B',
  textColor: '#FFFFFF',
  labelColor: '#94A3B8',
  passType: 'stamps',
  totalStamps: 10,
  welcomeStamps: 1,
  rewardTitle: '1 Bebida de Especialidad Gratis + Bollería artesanal',
  geoActive: true,
  latitude: '40.4168',
  longitude: '-3.7038',
  detectionRadius: '100 metros (Óptimo)',
  lockscreenMessage: '¡Pasa por tu café! Tienes 8 sellos acumulados cerca de ti',
  publicUrl: 'https://pass.artisanbakery.com/join/centro',
  seasonPromotion: '2x1 en Flat White todos los martes de 16:00 a 19:00 hrs mostrando este pase.',
  terms: 'Válido en sucursales físicas Artisan. El sello se otorga por ticket mínimo de 3.50€. No canjeable por dinero en efectivo. Pases intransferibles vinculados al Apple ID del titular.',
  storePhone: '+34 912 34 56 78',
  website: 'artisanbakery.com',
};

const initialCustomers: Customer[] = [
  {
    id: 'c-1',
    passId: 'PASS-8921-VM',
    name: 'Valentina Morales',
    phone: '+34 612 345 678',
    email: 'valentina.m@icloud.com',
    initials: 'VM',
    tier: 'Nivel Gold',
    stamps: 8,
    totalSpent: 312.4,
    visits: 14,
    registeredDate: 'Hace 3 semanas',
    registeredOrigin: 'QR Mostrador Centro',
    iosVersion: 'iOS 17.5',
    lastVisit: 'Ayer, 18:40',
    lastBranch: 'Store Centro #02',
    lastCashier: 'Sofía Ramos',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDht6JIglM21mM0GEi0Zn0axrBfKnGA_Ze1sTgOM0Avvj36WBPw2Z7LNiiiniePD-ImMAzf2X8j16f_3u2L4jxSDKbK22_fFXf-4ZvcIvWilJbyGnVbbMjhnWR7abFTdIpakdaJBR3x6KBAcKRRNZK8fp2CiSfCuBUXEGkYUbZcq53lT5ZaCERAEJ9Sfnh8srQ7FToUIPG5v690_9M-PdYBmtffwPB4VlVtTZMKaVmQMisu-58qdlzO',
  },
  {
    id: 'c-2',
    passId: 'pass.pk.882910',
    name: 'Sofía Lozano',
    phone: '+34 612 884 102',
    email: 'sofia.l@icloud.com',
    initials: 'SL',
    tier: 'Nivel Gold',
    stamps: 10,
    totalSpent: 284.5,
    visits: 10,
    registeredDate: 'Hace 12 días',
    registeredOrigin: 'QR Mostrador Centro',
    iosVersion: 'iOS 17.4',
    lastVisit: 'Ayer, 14:15',
    lastBranch: 'Sucursal Centro',
    lastCashier: 'Marcos V.',
  },
  {
    id: 'c-3',
    passId: 'pass.pk.771042',
    name: 'Alejandro Ruiz',
    phone: '+34 689 311 049',
    email: 'al.ruiz@gmail.com',
    initials: 'AR',
    tier: 'Nivel Silver',
    stamps: 8,
    totalSpent: 192.0,
    visits: 8,
    registeredDate: 'Hace 1 mes',
    registeredOrigin: 'Enlace Campaña SMS',
    iosVersion: 'iOS 17.2',
    lastVisit: 'Hace 3 días',
    lastBranch: 'Sucursal Norte',
    lastCashier: 'Elena R.',
  },
  {
    id: 'c-4',
    passId: 'pass.pk.901243',
    name: 'Mateo Torres',
    phone: '+34 655 420 891',
    email: 'mtorres@outlook.es',
    initials: 'MT',
    tier: 'Nivel Inicial',
    stamps: 3,
    totalSpent: 68.2,
    visits: 3,
    registeredDate: 'Hace 4 días',
    registeredOrigin: 'QR Mesa Carta #14',
    iosVersion: 'iOS 17.5',
    lastVisit: 'Hoy 13:20',
    lastBranch: 'Sucursal Centro',
    lastCashier: 'Marcos V.',
  },
];

const initialTransactions: Transaction[] = [
  {
    id: 'tx-1',
    time: '19:14:02',
    customerName: 'Marcos Valls',
    passId: 'PASS-1092-MV',
    action: '+ 1 Sello',
    stampsDelta: 1,
    ticketAmount: 4.2,
    cashier: 'Sofía Ramos',
    status: 'Sincronizado APNs',
  },
  {
    id: 'tx-2',
    time: '19:08:45',
    customerName: 'Elena Garrido',
    passId: 'PASS-7841-EG',
    action: '+ 2 Sellos',
    stampsDelta: 2,
    ticketAmount: 18.9,
    cashier: 'Sofía Ramos',
    status: 'Sincronizado APNs',
  },
  {
    id: 'tx-3',
    time: '18:55:12',
    customerName: 'Andrés Soto',
    passId: 'PASS-4490-AS',
    action: 'Canje Muffin',
    stampsDelta: -10,
    ticketAmount: 0.0,
    cashier: 'Sofía Ramos',
    status: 'Sincronizado APNs',
  },
  {
    id: 'tx-4',
    time: '18:42:30',
    customerName: 'Clara Fuentes',
    passId: 'PASS-9932-CF',
    action: '+ 1 Sello',
    stampsDelta: 1,
    ticketAmount: 3.8,
    cashier: 'Sofía Ramos',
    status: 'Sincronizado APNs',
  },
  {
    id: 'tx-5',
    time: '18:29:10',
    customerName: 'Lucía Navarro',
    passId: 'PASS-3019-LN',
    action: '+ 3 Sellos',
    stampsDelta: 3,
    ticketAmount: 34.2,
    cashier: 'Sofía Ramos',
    status: 'Sincronizado APNs',
  },
];

const initialCampaigns: Campaign[] = [
  {
    id: 'camp-1',
    name: 'Promo Fin de Semana Pastel Gratis',
    pushText: 'Ven por tu flat white y llévate un croissant recién horneado hoy',
    segment: 'Todos con pase activo',
    segmentKey: 'all',
    sentDate: '11 Mayo 2025 · 08:00 AM',
    deliveredCount: 3418,
    totalTarget: 3420,
    deliveryRate: 99.9,
    storeVisits48h: 1094,
    visitRate: 32.0,
    status: 'Completada / APNs Entregado',
  },
  {
    id: 'camp-2',
    name: 'Reactivación Clientes +30 Días',
    pushText: '¡Te extrañamos! Tienes 100 puntos extra en tu próxima visita este mes',
    segment: 'Inactivos (+30d)',
    segmentKey: 'inactive',
    sentDate: '04 Mayo 2025 · 17:15 PM',
    deliveredCount: 608,
    totalTarget: 612,
    deliveryRate: 99.3,
    storeVisits48h: 178,
    visitRate: 29.2,
    status: 'Completada / APNs Entregado',
  },
  {
    id: 'camp-3',
    name: 'Felicidades de Cumpleaños - Mayo',
    pushText: '¡Feliz mes! Reclama tu bebida grande de cortesía presentando este pase',
    segment: 'Cumpleañeros Mayo',
    segmentKey: 'birthday',
    sentDate: '01 Mayo 2025 · 09:00 AM',
    deliveredCount: 148,
    totalTarget: 148,
    deliveryRate: 100,
    storeVisits48h: 82,
    visitRate: 55.4,
    status: 'Completada / APNs Entregado',
  },
  {
    id: 'camp-4',
    name: 'Recordatorio Canje Puntos Gold',
    pushText: 'Tienes una bolsa de café en grano esperando por tus 500 puntos',
    segment: 'Recompensa Lista',
    segmentKey: 'reward',
    sentDate: '26 Abr 2025 · 12:30 PM',
    deliveredCount: 280,
    totalTarget: 280,
    deliveryRate: 100,
    storeVisits48h: 143,
    visitRate: 51.1,
    status: 'Completada / APNs Entregado',
  },
];

const PassContext = createContext<PassContextType | undefined>(undefined);

export const PassProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('disenador-de-pases');
  const [activeBranch, setActiveBranch] = useState('Sucursal Principal - Centro');
  const [passConfig, setPassConfig] = useState<PassConfig>(initialPassConfig);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [activeCustomer, setActiveCustomer] = useState<Customer>(initialCustomers[0]);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [toast, setToast] = useState<ToastState>({ show: false, title: '', message: '' });

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ show: true, title, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3800);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const addTransaction = (tx: Omit<Transaction, 'id' | 'time'>) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      time: timeStr,
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const updateActiveCustomerStamps = (delta: number) => {
    const updatedStamps = Math.max(0, Math.min(passConfig.totalStamps, activeCustomer.stamps + delta));
    const updated = {
      ...activeCustomer,
      stamps: updatedStamps,
      visits: activeCustomer.visits + (delta > 0 ? 1 : 0),
    };
    setActiveCustomer(updated);
    setCustomers(prev => prev.map(c => (c.id === updated.id ? updated : c)));
  };

  const redeemActiveCustomerReward = () => {
    const updated = {
      ...activeCustomer,
      stamps: 0,
    };
    setActiveCustomer(updated);
    setCustomers(prev => prev.map(c => (c.id === updated.id ? updated : c)));
  };

  const addCustomer = (data: Omit<Customer, 'id' | 'passId' | 'initials' | 'tier' | 'registeredDate' | 'iosVersion'>) => {
    const id = `c-${Date.now()}`;
    const initials = data.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CP';
    const passNum = Math.floor(100000 + Math.random() * 900000);
    const newCust: Customer = {
      ...data,
      id,
      passId: `pass.pk.${passNum}`,
      initials,
      tier: 'Nivel Inicial',
      registeredDate: 'Hoy (Registro Express)',
      iosVersion: 'iOS 17.5',
    };
    setCustomers(prev => [newCust, ...prev]);
    return newCust;
  };

  const addCampaign = (campData: Omit<Campaign, 'id' | 'sentDate' | 'deliveredCount' | 'deliveryRate' | 'storeVisits48h' | 'visitRate'>) => {
    const newCamp: Campaign = {
      ...campData,
      id: `camp-${Date.now()}`,
      sentDate: 'Hoy · En vivo',
      deliveredCount: campData.totalTarget,
      deliveryRate: 99.8,
      storeVisits48h: Math.round(campData.totalTarget * 0.28),
      visitRate: 28.5,
    };
    setCampaigns(prev => [newCamp, ...prev]);
  };

  return (
    <PassContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        activeBranch,
        setActiveBranch,
        passConfig,
        setPassConfig,
        customers,
        activeCustomer,
        setActiveCustomer,
        transactions,
        campaigns,
        addTransaction,
        addCustomer,
        addCampaign,
        updateActiveCustomerStamps,
        redeemActiveCustomerReward,
        toast,
        showToast,
        hideToast,
      }}
    >
      {children}
    </PassContext.Provider>
  );
};

export const usePass = () => {
  const context = useContext(PassContext);
  if (!context) {
    throw new Error('usePass must be used within a PassProvider');
  }
  return context;
};
