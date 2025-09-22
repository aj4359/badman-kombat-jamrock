import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.2b84925dd83f475087248708ba240157',
  appName: 'badman-kombat-jamrock',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'https://2b84925d-d83f-4750-8724-8708ba240157.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false
  },
  android: {
    allowMixedContent: true
  }
};

export default config;