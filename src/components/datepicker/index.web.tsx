import React, { memo, useCallback, useMemo } from 'react';
import { format } from 'utils/date';

const DATE_FORMAT = 'YYYY-MM-DD';

export const DateTimePicker = memo(({ date, onConfirm }: any) => {
  const value = useMemo(() => date && format(date, DATE_FORMAT), [date]);
  const onChange = useCallback(event => onConfirm(new Date(event.target.value)), [onConfirm]);

  return <input type='date' value={value} onChange={onChange} />;
});
