import { UserRole } from "../../../user/types/enums/roles.enum";

export interface UserPayload {
  id: string;
  clinicId: string;
  email: string;
  role: UserRole;
}
