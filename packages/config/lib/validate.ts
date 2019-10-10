import joi from 'joi'

export function validate (o: joi.ObjectSchema) {
  const { error, value } = joi.validate(process.env, o)

  if (error) {
    throw error
  }

  return value
}