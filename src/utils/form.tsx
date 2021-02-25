import { Button, Dialog } from 'components';
import React, {
  ComponentProps,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';
import { createState, State, UseValue } from './state';

const FormContext = createContext(null);

interface FormProps<T> {
  defaultValues: T;
  onSubmit(form: T);
  children: ReactNode;
}

interface IFormContext<T> {
  state: State<T>;
  form: State<T>;
  useValue<K extends keyof T>(field: K, defaultValue?: T[K]): T[K];
  submit();
}

export function Form<T>({ defaultValues, onSubmit, children }: FormProps<T>) {
  const form = useMemo(() => {
    const [state, useValue] = createState<T>(defaultValues);
    const submit = () => onSubmit(state.getState());

    return { state, form: state, useValue, submit };
  }, []);

  return <FormContext.Provider value={form}>{children}</FormContext.Provider>;
}

export function getForm<T>() {
  return {
    useFormValue<K extends keyof T>(field: K, defaultValue?: T[K]) {
      return useFormValue<T, K>(field, defaultValue);
    },
    useFormState<K extends keyof T>(field: K, defaultValue?: T[K]) {
      return useFormState<T, K>(field, defaultValue);
    },
    useForm() {
      return useForm<T>();
    },
  };
}

export function useFormValue<T, K extends keyof T>(field: K, defaultValue?: T[K]) {
  const { useValue } = useForm<T>();

  return useValue(field, defaultValue);
}

export function useFormState<T, K extends keyof T>(field: K, defaultValue?: T[K]) {
  const form = useForm<T>();
  const { useValue, state } = form;

  const value = useValue<K>(field, defaultValue);
  const setValue = useCallback((newValue: T[K]) => state.set(field, newValue), []);

  return [value, setValue, form] as const;
}

export function useForm<T = {}>(): IFormContext<T> {
  return useContext(FormContext);
}

type FormDialogProps = Omit<ComponentProps<typeof Dialog>, 'onApply'>;
export function FormDialog(props: FormDialogProps) {
  const changed = useRef(false);
  const { state, submit } = useContext(FormContext);

  useEffect(() => {
    return state.watchAll(() => (changed.current = true));
  }, []);

  return <Dialog {...props} onApply={changed.current && submit} />;
}

export function SubmitButton({ style, label }) {
  const [changed, setChanged] = useState(false);
  const { state, submit } = useContext(FormContext);

  useEffect(() => {
    return state.watchAll(() => setChanged(true));
  }, []);

  if (!changed) return null;

  return (
    <View style={style}>
      <Button label={label} onPress={submit} />
    </View>
  );
}
