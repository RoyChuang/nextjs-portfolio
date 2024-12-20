'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguageStore } from '@/store/languageStore';

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { currentLanguage, setLanguage } = useLanguageStore();
  const router = useRouter();

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    router.refresh();
  };

  return (
    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{t('language.en')}</SelectItem>
        <SelectItem value="zh">{t('language.zh')}</SelectItem>
      </SelectContent>
    </Select>
  );
}
