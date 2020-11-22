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
import { createState } from './state';

const FormContext = createContext(null);

interface FormProps<T> {
  defaultValues: T;
  onSubmit(form: T);
  children: ReactNode;
}

export function Form<T>({ defaultValues, onSubmit, children }: FormProps<T>) {
  const form = useMemo(() => {
    const [state, useValue] = createState<T>(defaultValues);
    const submit = () => onSubmit(state.getState());

    return { state, form: state, useValue, submit };
  }, []);

  return <FormContext.Provider value={form}> {children} </FormContext.Provider>;
}

export function useFormValue(field, defaultValue) {
  const { useValue } = useContext(FormContext);

  return useValue(field) || defaultValue;
}

export function useFormState(field, defaultValue?) {
  const form = useContext(FormContext);
  const { useValue, state } = form;

  const value = useValue(field, defaultValue);
  const setValue = useCallback(newValue => state.set(field, newValue), []);

  return [value, setValue, form] as const;
}

export function useForm() {
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
