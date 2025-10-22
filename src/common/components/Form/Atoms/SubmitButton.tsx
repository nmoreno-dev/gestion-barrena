// src/components/form/SubmitButton.tsx

import { useFormContext } from '@/common/hooks';
import Button from '../../Button';

export function SubmitButton({ label = 'Guardar' }: { label?: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={s => [s.canSubmit, s.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button
          bgColor="primary"
          block
          type="submit"
          loading={isSubmitting}
          disabled={!canSubmit}
          aria-disabled={!canSubmit}
        >
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
}
