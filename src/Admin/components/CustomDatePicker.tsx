import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Button from '@mui/material/Button';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { UseDateFieldProps } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  BaseSingleInputFieldProps,
  DateValidationError,
  FieldSection,
} from '@mui/x-date-pickers/models';
import 'dayjs/locale/pt';
import { newsService } from '../../services/News';

dayjs.locale('pt');

interface ButtonFieldProps
  extends UseDateFieldProps<Dayjs, false>,
    BaseSingleInputFieldProps<
      Dayjs | null,
      Dayjs,
      FieldSection,
      false,
      DateValidationError
    > {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

function ButtonField(props: ButtonFieldProps) {
  const {
    setOpen,
    label,
    id,
    disabled,
    InputProps: { ref } = {},
    inputProps: { 'aria-label': ariaLabel } = {},
  } = props;

  return (
    <Button
      variant="outlined"
      id={id}
      disabled={disabled}
      ref={ref}
      aria-label={ariaLabel}
      size="small"
      onClick={() => setOpen?.((prev) => !prev)}
      startIcon={<CalendarTodayRoundedIcon fontSize="small" />}
      sx={{ minWidth: 'fit-content' }}
    >
      {label ? `${label}` : 'Escolha uma data'}
    </Button>
  );
}

export default function CustomDatePicker(props: any) {
  const { textAlign, onChange, value: externalValue, defaultValue } = props;

  const parseDateValue = (dateValue: any): Dayjs | null => {
    if (!dateValue) return null;
    if (typeof dateValue === 'string') {
      const parsed = dayjs(dateValue);
      return parsed.isValid() ? parsed : null;
    }

    if (dayjs.isDayjs(dateValue)) return dateValue;

    return null;
  };

  const [value, setValue] = React.useState<Dayjs | null>(() => {
    const parsed = parseDateValue(externalValue);
    if (parsed) return parsed;
    
    const defaultParsed = parseDateValue(defaultValue);
    if (defaultParsed) return defaultParsed;
    
    return dayjs().startOf('day');
  });

  React.useEffect(() => {
    const parsed = parseDateValue(externalValue);
    if (parsed && (!value || !parsed.isSame(value))) {
      setValue(parsed);
    }
  }, [externalValue, value]);

  const [open, setOpen] = React.useState(false);

  const handleDateChange = (newValue: Dayjs | null) => {
    console.log(newValue);
    setValue(newValue);

    if (onChange && typeof onChange === 'function') {
      onChange(newValue);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt">
      <DatePicker
        value={value}
        label={
          value == null ?
          'Escolha uma data' :
          `${value.format('DD')} ${value.format('MMM').replace(/^\w/, c => c.toUpperCase())} ${value.format('YYYY')}`
        }
        onChange={handleDateChange}
        slots={{ field: ButtonField }}
        slotProps={{
          field: { setOpen } as any,
          nextIconButton: { size: 'small' },
          previousIconButton: { size: 'small' },
        }}
        sx={{ textAlign: textAlign }}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        views={['day', 'month']}
        format="DD MMM YYYY"
      />
    </LocalizationProvider>
  );
}
