import type { RegisterFormData } from "../types/auth";

import { validateRegister } from "../schemas/register.schema";
import { authService } from "../services/auth.service";

export async function register(
  data: RegisterFormData
) {
  const validation = validateRegister(data);

  if (!validation.success) {
    return validation;
  }

  return authService.createUser(data);
}