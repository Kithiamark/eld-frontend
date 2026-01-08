/**
 * Inspection Types
 * FMCSA-compliant inspection and DVIR types
 */

export interface Inspection {
  id: string;
  driver_id: string;
  vehicle_id: string;
  inspection_type: InspectionType;
  inspection_date: string;
  odometer: number;
  status: InspectionStatus;
  location: Location;
  defects: Defect[];
  repairs: Repair[];
  driver_signature?: string;
  mechanic_signature?: string;
  certifier_name?: string;
  certification_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type InspectionType = 
  | 'pre_trip'
  | 'post_trip'
  | 'en_route'
  | 'annual'
  | 'dot_roadside';

export type InspectionStatus = 
  | 'passed'
  | 'failed'
  | 'defects_noted'
  | 'out_of_service';

export interface Defect {
  id: string;
  component: VehicleComponent;
  description: string;
  severity: DefectSeverity;
  is_safety_critical: boolean;
  requires_repair: boolean;
  repaired: boolean;
  repair_date?: string;
}

export type VehicleComponent =
  | 'brakes'
  | 'tires'
  | 'lights'
  | 'steering'
  | 'suspension'
  | 'engine'
  | 'transmission'
  | 'fuel_system'
  | 'exhaust'
  | 'coupling_devices'
  | 'cargo_securement'
  | 'emergency_equipment'
  | 'windshield_wipers'
  | 'horn'
  | 'mirrors'
  | 'other';

export type DefectSeverity = 'minor' | 'major' | 'critical';

export interface Repair {
  id: string;
  defect_id: string;
  description: string;
  mechanic_name: string;
  repair_date: string;
  parts_used?: string[];
  labor_hours?: number;
  cost?: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
}

export interface CreateInspectionRequest {
  driver_id: string;
  vehicle_id: string;
  inspection_type: InspectionType;
  odometer: number;
  location: Location;
  defects?: Omit<Defect, 'id'>[];
  notes?: string;
}

export interface InspectionSummary {
  total_inspections: number;
  passed: number;
  failed: number;
  defects_noted: number;
  out_of_service: number;
  pending_repairs: number;
  compliance_rate: number;
}

export interface DVIRReport {
  inspection: Inspection;
  vehicle: {
    id: string;
    vehicle_number: string;
    make: string;
    model: string;
  };
  driver: {
    id: string;
    name: string;
    license_number: string;
  };
}