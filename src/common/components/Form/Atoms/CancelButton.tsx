// src/components/form/SubmitButton.tsx

import { useRouter } from 'next/navigation';
import Button from '../../Button';

interface CancelButtonProps {
  label?: string;
  onClick?: () => void;
}

const CancelButton: React.FC<CancelButtonProps> = ({ label = 'Cancelar', onClick }) => {
  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };

  return (
    <Button bgColor="danger" block type="button" onClick={onClick || handleCancel}>
      {label}
    </Button>
  );
};

export default CancelButton;
