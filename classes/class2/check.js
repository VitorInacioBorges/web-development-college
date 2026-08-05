// import joi lib
import Joi from "joi";

// Joi object
const Joi = require("joi");

// Validates CPF (Physical Person Registering)
const validaCpfCalculo = (value) => {
  const cpf = value.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0,
    resto;

  // First digit
  for (let i = 1; i <= 9; i++)
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  // Second digit
  soma = 0;
  for (let i = 1; i <= 10; i++)
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
};

// User Validation Object
export const userValidate = Joi.object({
  user_id: Joi.number().integer().min(0),

  name: Joi.string().alphanum().min(3).max(30).required(),

  cpf: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!validaCpfCalculo(value)) {
        return helpers.message("O CPF informado é inválido.");
      }

      return value;
    }),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
})
  .with("username", "birth_year")
  .xor("password", "access_token")
  .with("password", "repeat_password");

// Book Validation Object
export const bookValidate = Joi.object({
  book_id: Joi.number().integer().min(0),

  title: Joi.string().alphanum().min(3).max(50).required(),

  isbn: Joi.number().integer().min(0).required(),

  edition: Joi.number().integer().min(1).required(),

  year: Joi.number().integer().min(1900).max(2026).required(),
})
  .with("username", "birth_year")
  .xor("password", "access_token")
  .with("password", "repeat_password");

// Rent Validation Object
export const rentValidate = Joi.object({
  user_id: Joi.number().integer().min(0).required(),

  book_id: Joi.number().integer().min(0).required(),

  status: Joi.bool().required(),
})
  .with("username", "birth_year")
  .xor("password", "access_token")
  .with("password", "repeat_password");
