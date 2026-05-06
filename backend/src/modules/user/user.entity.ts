import { Exclude } from "class-transformer";
import { UserRole } from "./types/enums/roles.enum";

export class UserEntity {
  pk!: string;
  sk!: string;

  id!: string;

  clinicId!: string;

  name!: string;
  email!: string;

  @Exclude()
  password?: string;

  role!: UserRole;
  isActive!: boolean;
  cro?: string;

  createdAt!: string;
  updatedAt!: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);

    if (this.clinicId && this.id) {
      this.pk = `CLINIC#${this.clinicId}`;
      this.sk = `USER#${this.id}`;

      if (!this.createdAt) {
        this.createdAt = new Date().toISOString();
      }

      if (!this.updatedAt) {
        this.updatedAt = this.createdAt;
      }
    }
  }
}
