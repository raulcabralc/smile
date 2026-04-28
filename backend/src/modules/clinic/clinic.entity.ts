import { SystemPlan } from "./types/enums/system-plan.enum";
import { Address } from "./types/interfaces/address.interface";
import { Marker } from "./types/interfaces/marker.interface";

export class ClinicEntity {
  pk!: string;
  sk!: string;

  id!: string;

  name!: string;
  cnpj!: string;
  system_plan!: SystemPlan;
  phone!: string;
  address!: Address;
  markers!: Marker[];
  image_url!: string;
  created_at!: string;

  constructor(partial: Partial<ClinicEntity>) {
    Object.assign(this, partial);

    if (this.id) {
      this.pk = `CLINIC#${this.id}`;
      this.sk = `METADATA#${this.id}`;
    }
  }
}
