import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
}

// validate envs with joi schema
const envsSchema = joi
  .object({
    PORT: joi.number().required(), // ya lo parsea a number
  })
  .unknown(true); // allow other envs not defined in schema - process.env

const { error, value } = envsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envsVars: EnvVars = value;

export const envs = {
  PORT: envsVars.PORT,
};
