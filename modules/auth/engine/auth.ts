import type {
  RegisterFormData,
  AuthResult,
} from "../types/auth";

import { validateRegister } from "../schemas/register.schema";
import { authService } from "../services/auth.service";

export async function register(
  data: RegisterFormData
): Promise<AuthResult> {

  const validation =
    validateRegister(data);

  if (!validation.success) {
    return validation;
  }

  return await authService.createUser(
    data
  );

}