// Componente principal
export { default as Plantillas } from './Plantillas';

// API functions
export * from './api';

// React Query hooks
export * from './queries';

// Utilities
export * from './utils/plantillaProcessor';

// Types and interfaces
export type {
  Plantilla,
  CreatePlantillaData,
  UpdatePlantillaData,
  PlantillaPreviewData,
  TemplateVariableInfo,
} from './interfaces/plantilla';

export { AVAILABLE_TEMPLATE_VARIABLES } from './interfaces/plantilla';
