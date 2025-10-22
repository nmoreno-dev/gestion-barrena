import { Search } from 'lucide-react';

interface PlantillasSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalCount: number;
}

export function PlantillasSearch({
  searchTerm,
  onSearchChange,
  totalCount,
}: PlantillasSearchProps) {
  return (
    <div className="card w-full bg-base-100 shadow-sm border border-base-300">
      <div className="card-body py-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50"
              size={16}
            />
            <input
              type="text"
              placeholder="Buscar plantillas por nombre..."
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
            />
          </div>
          <div className="badge badge-outline">{totalCount} plantillas</div>
        </div>
      </div>
    </div>
  );
}
