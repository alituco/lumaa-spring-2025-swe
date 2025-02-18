import { plainToInstance, Type } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @Type(() => Number)
  @IsNumber()
  PORT: number;

  @IsString()
  FRONTEND_URL: string;

  @IsString()
  JWT_SECRET: string;

}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config);
  const errors = validateSync(validatedConfig);

  if (errors.length > 0) {
    throw new Error(`Env validation error: ${errors.toString()}`);
  }
  return validatedConfig;
}