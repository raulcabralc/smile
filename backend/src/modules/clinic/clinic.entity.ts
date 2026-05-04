import { SystemPlan } from "./types/enums/system-plan.enum";
import { Address } from "./types/interfaces/address.interface";
import { Marker } from "./types/interfaces/marker.interface";

export class ClinicEntity {
  pk!: string;
  sk!: string;

  id!: string;

  ownerId!: string;

  name!: string;
  cnpj!: string;
  systemPlan!: SystemPlan;
  phone!: string;
  address!: Address;
  markers!: Marker[];
  imageUrl!: string;

  createdAt!: string;
  updatedAt!: string;

  constructor(partial: Partial<ClinicEntity>) {
    Object.assign(this, partial);

    if (this.id) {
      this.pk = `CLINIC#${this.id}`;
      this.sk = `METADATA#${this.id}`;

      if (!this.createdAt) {
        this.createdAt = new Date().toISOString();
      }

      if (!this.updatedAt) {
        this.updatedAt = this.createdAt;
      }
    }
  }
}
