import { Sort } from 'screens/stat/tabs/shared';
import { BookFilters } from 'types/book-filters';
import { getForm } from 'utils/form';

type BookForm = BookFilters & {
  sort: Sort;
};

const { useForm, useFormState, useFormValue } = getForm<BookForm>();

export { useForm, useFormState, useFormValue };
