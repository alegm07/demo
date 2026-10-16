export type ScreenType = 
  | 'landing' 
  | 'disenador-de-pases' 
  | 'terminal-de-caja' 
  | 'campanas-y-push' 
  | 'metricas-y-clientes' 
  | 'ajustes-y-certificados';

export interface PassConfig {
  businessName: string;
  cardTitle: string;
  logoUrl: string;
  backgroundColor: string;
  textColor: string;
  labelColor: string;
  passType: 'stamps' | 'points';
  totalStamps: number;
  welcomeStamps: number;
  rewardTitle: string;
  geoActive: boolean;
  latitude: string;
  longitude: string;
  detectionRadius: string;
  lockscreenMessage: string;
  publicUrl: string;
  seasonPromotion: string;
  terms: string;
  storePhone: string;
  website: string;
}

export interface Customer {
  id: string;
  passId: string;
  name: string;
  phone: string;
  email: string;
  initials: string;
  tier: string;
  stamps: number;
  totalSpent: number;
  visits: number;
  registeredDate: string;
  registeredOrigin: string;
  iosVersion: string;
  lastVisit: string;
  lastBranch: string;
  lastCashier: string;
  avatarUrl?: string;
}

export interface Transaction {
  id: string;
  time: string;
  customerName: string;
  passId: string;
  action: string;
  stampsDelta: number;
  ticketAmount: number;
  cashier: string;
  status: 'Sincronizado APNs' | 'Pendiente' | 'Completado';
}

export interface Campaign {
  id: string;
  name: string;
  pushText: string;
  segment: string;
  segmentKey: 'all' | 'inactive' | 'birthday' | 'reward';
  sentDate: string;
  deliveredCount: number;
  totalTarget: number;
  deliveryRate: number;
  storeVisits48h: number;
  visitRate: number;
  status: 'Completada / APNs Entregado' | 'Enviando...' | 'Programada';
}
