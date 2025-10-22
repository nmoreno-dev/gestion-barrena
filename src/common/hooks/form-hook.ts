// src/lib/form/form-hook.ts
import SelectField from '@/common/components/Form/Atoms/SelectInput';
import { SubmitButton } from '@/common/components/Form/Atoms/SubmitButton';
import TextField from '@/common/components/Form/Atoms/TextInput';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';

// ① Contextos
export const {
  fieldContext,
  formContext,
  useFieldContext,
  useFormContext, // <- faltaba
} = createFormHookContexts();

// ② Hook + HOC con todos los registrables vacíos por ahora
export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, SelectField },
  formComponents: { SubmitButton },
});
