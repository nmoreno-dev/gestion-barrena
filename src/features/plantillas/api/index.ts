// Re-export todas las funciones de la API para facilitar las importaciones
export {
  getPlantillas,
  getPlantillaById,
  createPlantilla,
  updatePlantilla,
  deletePlantilla,
  checkPlantillaNombreExists,
  clearAllPlantillas,
} from './plantillasApi';

// Re-export tipos e interfaces
export type {
  Plantilla,
  CreatePlantillaData,
  UpdatePlantillaData,
  PlantillaPreviewData,
  TemplateVariableInfo,
} from '../interfaces/plantilla';

export { AVAILABLE_TEMPLATE_VARIABLES } from '../interfaces/plantilla';
