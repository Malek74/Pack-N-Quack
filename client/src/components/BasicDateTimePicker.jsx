import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useState } from 'react';
import dayjs from 'dayjs';

export default function BasicDateTimePicker({ value, onChange }) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateTimePicker']}>
                <DateTimePicker
                    label="Basic date time picker"
                    value={value ? dayjs(value) : null} // Convert to Day.js object
                    onChange={(newValue) => {
                        onChange(newValue ? newValue.toISOString() : ''); // Convert to ISO string
                    }}
                    renderInput={(params) => <input {...params} />} // Customize input if necessary
                />
            </DemoContainer>
        </LocalizationProvider>
    );
}
