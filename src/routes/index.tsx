import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="w-full space-y-6">
      <div className="hero bg-base-200 rounded-box">
        <div className="hero-content text-center py-12">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Gestión Barrena</h1>
            <p className="py-6">
              Sistema de gestión financiera para el manejo de deudores y plantillas de comunicación.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Deudores */}
        <Link
          to="/deudores"
          className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
        >
          <div className="card-body">
            <h2 className="card-title text-2xl">
              <span className="text-3xl">👥</span>
              Deudores
            </h2>
            <p>
              Gestiona la información de deudores, carga archivos CSV y visualiza datos en tablas
              interactivas.
            </p>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-primary">Ir a Deudores</button>
            </div>
          </div>
        </Link>

        {/* Card Plantillas */}
        <Link
          to="/plantillas"
          className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
        >
          <div className="card-body">
            <h2 className="card-title text-2xl">
              <span className="text-3xl">📄</span>
              Plantillas
            </h2>
            <p>Crea y administra plantillas de comunicación personalizadas para tus deudores.</p>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-primary">Ir a Plantillas</button>
            </div>
          </div>
        </Link>
      </div>

      {/* Info adicional */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-lg">Características del Sistema</h3>
          <ul className="list-disc list-inside space-y-2 text-base-content/80">
            <li>Importación de datos mediante archivos CSV</li>
            <li>Almacenamiento local con IndexedDB</li>
            <li>Gestión de plantillas de comunicación</li>
            <li>Visualización y filtrado de información</li>
            <li>Interfaz moderna y responsive</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
