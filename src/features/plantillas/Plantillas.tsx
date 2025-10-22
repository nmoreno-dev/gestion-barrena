import { Mail, MessageSquare, FileType, Info, Settings, Plus } from 'lucide-react';

function Plantillas() {
  const templateCategories = [
    {
      id: 'email',
      title: 'Plantillas de Email',
      description: 'Gestiona plantillas para correos electrónicos y comunicaciones formales',
      icon: Mail,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      count: 0,
    },
    {
      id: 'sms',
      title: 'Plantillas de SMS',
      description: 'Crea plantillas para mensajes de texto y notificaciones rápidas',
      icon: MessageSquare,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      count: 0,
    },
    {
      id: 'custom',
      title: 'Plantillas Personalizadas',
      description: 'Diseña plantillas adaptadas a tus necesidades específicas',
      icon: FileType,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      count: 0,
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="card w-full bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <div className="flex justify-between items-start flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-base-content mb-2">Gestión de Plantillas</h1>
              <p className="text-base-content/70 text-lg">
                Centraliza y organiza todas tus plantillas de comunicación en un solo lugar
              </p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-ghost btn-sm gap-2">
                <Settings size={16} />
                Configuración
              </button>
              <button className="btn btn-primary btn-sm gap-2">
                <Plus size={16} />
                Nueva Plantilla
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <div className="alert bg-info/10 border border-info/20">
        <Info className="text-info" size={20} />
        <div className="flex-1">
          <h3 className="font-semibold text-info mb-1">Sistema de Plantillas</h3>
          <p className="text-sm text-base-content/70">
            Administra plantillas reutilizables para optimizar tus comunicaciones con deudores y
            clientes.
          </p>
        </div>
      </div>

      {/* Template Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {templateCategories.map(category => {
          const IconComponent = category.icon;
          return (
            <div
              key={category.id}
              className={`card bg-base-100 shadow-sm border transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${category.borderColor}`}
            >
              <div className="card-body p-6">
                {/* Icon Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-3 rounded-lg ${category.bgColor} border ${category.borderColor}`}
                  >
                    <IconComponent className={category.color} size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-base-content">{category.title}</h3>
                    <div className="badge badge-outline badge-sm">{category.count} plantillas</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-base-content/70 mb-6 leading-relaxed">
                  {category.description}
                </p>

                {/* Actions */}
                <div className="card-actions justify-between items-center">
                  <button className="btn btn-ghost btn-sm gap-2">
                    <Settings size={14} />
                    Gestionar
                  </button>
                  <button className="btn btn-primary btn-sm gap-2">
                    <Plus size={14} />
                    Crear
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Statistics Section */}
      <div className="card w-full bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Estadísticas de Uso</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-figure text-primary">
                <FileType size={24} />
              </div>
              <div className="stat-title">Total Plantillas</div>
              <div className="stat-value text-primary">0</div>
              <div className="stat-desc">En todas las categorías</div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-figure text-secondary">
                <MessageSquare size={24} />
              </div>
              <div className="stat-title">Más Utilizadas</div>
              <div className="stat-value text-secondary">0</div>
              <div className="stat-desc">Este mes</div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-figure text-accent">
                <Plus size={24} />
              </div>
              <div className="stat-title">Creadas Recientemente</div>
              <div className="stat-value text-accent">0</div>
              <div className="stat-desc">Últimos 7 días</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Plantillas;
