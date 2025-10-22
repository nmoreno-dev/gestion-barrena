// src/components/form/SubmitButton.tsx

import { useNavigate } from '@tanstack/react-router';
import Button from '../../Button';

interface CancelButtonProps {
  label?: string;
  onClick?: () => void;
}

const CancelButton = ({ label = 'Cancelar', onClick = undefined }: CancelButtonProps) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate({ to: '..' });
  };

  return (
    <Button bgColor="danger" block type="button" onClick={onClick || handleCancel}>
      {label}
    </Button>
  );
};

export default CancelButton;
