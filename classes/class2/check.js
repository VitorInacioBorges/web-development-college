// Import Joi library
import Joi from "joi";
import { messages } from "./messages.js";

// Validates CPF
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

const userFields = {
  user_id: Joi.number().integer().min(0).strip(),

  name: Joi.string().alphanum().min(3).max(30).trim().required(),

  cpf: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!validaCpfCalculo(value)) {
        return helpers.message(messages.invalidCpf);
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
};

const bookFields = {
  book_id: Joi.number().integer().min(0).strip(),

  title: Joi.string().alphanum().min(3).max(50).required(),

  isbn: Joi.number().integer().min(0).required(),

  edition: Joi.number().integer().min(1).required(),

  year: Joi.number().integer().min(1900).max(2026).required(),
};

// User Validation Objects
export const userValidate = Joi.object({
  ...userFields,
  user_id: Joi.number().integer().min(0),
});

export const userUpdateValidate = Joi.object(userFields);

export const userPatchValidate = Joi.object(userFields).fork(
  ["name", "cpf", "email", "password"],
  (schema) => schema.optional(),
).min(1);

// Book Validation Objects
export const bookValidate = Joi.object({
  ...bookFields,
  book_id: Joi.number().integer().min(0),
});

export const bookUpdateValidate = Joi.object(bookFields);

export const bookPatchValidate = Joi.object(bookFields).fork(
  ["title", "isbn", "edition", "year"],
  (schema) => schema.optional(),
).min(1);

// Rent Validation Object
export const rentValidate = Joi.object({
  user_id: Joi.number().integer().min(0).required(),

  book_id: Joi.number().integer().min(0).required(),

  status: Joi.bool().required(),
});
