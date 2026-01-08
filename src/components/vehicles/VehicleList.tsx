/ src/components/vehicles/VehicleList.tsx
// ===============================================
import { Vehicle } from '@/types/vehicle';
import VehicleCard from './VehicleCard';

interface VehicleListProps {
  vehicles: Vehicle[];
  viewMode: 'grid' | 'list';
  onView: (id: string) => void;
}

export const VehicleList: React.FC<VehicleListProps> = ({ vehicles, viewMode, onView }) => (
  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
    {vehicles.map((vehicle) => (
      <VehicleCard
        key={vehicle.id}
        vehicle={vehicle}
        viewMode={viewMode}
        onView={() => onView(vehicle.id)}
      />
    ))}
  </div>
);

export default VehicleList;