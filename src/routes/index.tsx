import { TablaDeudores } from '@/features/dataLoading/components';
import CsvLoader from '@/features/dataLoading/components/CSVLoader';
import { Deudor } from '@/features/dataLoading/interfaces/deudor';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const [deudores, setDeudores] = useState<Deudor[]>([]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Gestión de Deudores</h2>
          <CsvLoader onDataLoaded={data => setDeudores(data)} />
        </div>
      </div>
      <TablaDeudores deudores={deudores} />
    </div>
  );
}
