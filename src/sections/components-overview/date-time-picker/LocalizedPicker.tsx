import { useState } from 'react';

// material-ui
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers/DateField';
import { TimeField } from '@mui/x-date-pickers/TimeField';

// third-party
import de from 'date-fns/locale/de';
import enGB from 'date-fns/locale/en-GB';
import zhCN from 'date-fns/locale/zh-CN';
import enUS from 'date-fns/locale/en-US';  // Import enUS locale

// project-imports
import MainCard from 'components/MainCard';

const locales = { 'en-us': enUS, 'en-gb': enGB, 'zh-cn': zhCN, de };  // Include enUS

type LocaleKey = keyof typeof locales;

// ==============================|| DATE PICKER - LOCALIZED ||============================== //

export default function LocalizedPicker() {
  const [locale, setLocale] = useState<LocaleKey>('en-us');
  const [dateValue, setDateValue] = useState<Date | null>(new Date());
  const [timeValue, setTimeValue] = useState<Date | null>(new Date());

  const selectLocale = (newLocale: LocaleKey) => {
    setLocale(newLocale);
  };

  return (
    <MainCard title="Localization Picker">
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locales[locale]}>
        <Stack spacing={3} sx={{ width: 300 }}>
          <ToggleButtonGroup value={locale} exclusive fullWidth onChange={(e, newLocale) => selectLocale(newLocale)}>
            {Object.keys(locales).map((localeItem) => (
              <ToggleButton key={localeItem} value={localeItem}>
                {localeItem.toUpperCase()}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <DateField 
            label="Date" 
            value={dateValue} 
            onChange={(newValue) => setDateValue(newValue)} 
          />
          <TimeField 
            label="Time" 
            value={timeValue} 
            onChange={(newValue) => setTimeValue(newValue)} 
          />
        </Stack>
      </LocalizationProvider>
    </MainCard>
  );
}
