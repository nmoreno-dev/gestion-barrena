import CsvLoader from '@/features/dataLoading/components/CSVLoader';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <h1>Home</h1>
      <CsvLoader
        onDataLoaded={data => console.log('Datos cargados:', JSON.stringify(data, null, 2))}
      />
    </>
  );
}
