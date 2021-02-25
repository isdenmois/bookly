import React, { useCallback, useMemo, useState } from 'react';
import { formatDate } from 'utils/date';
import { Calendar } from 'components';
import { OpenableListItem } from './openable-list-item';
import { useForm } from '../book-filters.form';

export function formatPeriod(period) {
  const value: any = period || {};
  const { from, to } = value;

  return from && to ? `${formatDate(from)} - ${formatDate(to)}` : '';
}

export function BookDateFilter() {
  const { form, useValue } = useForm();
  const date = formatPeriod(useValue('date'));
  const today = useMemo(() => new Date(), []);

  const [startDate, setStartDate] = useState<Date>(form.date?.from);
  const [endDate, setEndDate] = useState<Date>(form.date?.to);

  const setDate = useCallback((from: Date, to: Date) => {
    form.set('date', { from, to });
    form.set('year', null);
  }, []);
  const onChange = useCallback(
    ({ startDate, endDate }) => {
      setStartDate(startDate);
      setEndDate(startDate);

      if (endDate) {
        setDate(startDate, endDate);
      }
    },
    [startDate],
  );

  const clear = useCallback(() => form.set('date', null), []);
  const resetState = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
  }, []);

  return (
    <OpenableListItem title='modal.date' viewValue={date} onClear={clear} onClose={resetState}>
      <Calendar startDate={startDate} endDate={endDate} maxDate={today} onChange={onChange} />
    </OpenableListItem>
  );
}
