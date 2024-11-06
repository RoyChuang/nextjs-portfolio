import 'i18next';
import { Resources } from '@/locales';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: Resources['en'];
  }
}
