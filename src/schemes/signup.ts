import Joi, { ObjectSchema } from 'joi';

const signupSchema: ObjectSchema = Joi.object().keys({
  username: Joi.string().min(4).max(12).required().messages({
    'string.base': 'Username must be of type string',
    'string.min': 'Username length should be greater than or equal to 4',
    'string.max': 'Username length should be lesser than or equal to 12',
    'string.empty': 'Username is a required field'
  }),
  password: Joi.string().min(4).max(12).required().messages({
    'string.base': 'Password must be of type string',
    'string.min': 'Password length should be greater or equal to 4',
    'string.max': 'Password length should be lesser or equal to 12',
    'string.empty': 'Password is a required field'
  }),
  country: Joi.string().required().messages({
    'string.base': 'Country must be of type string',
    'string.empty': 'Country is a required field'
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be of type string',
    'string.email': 'Invalid email',
    'string.empty': 'Email is a required field'
  }),
  profilePicture: Joi.string()
    // .base64()
    .required().messages({
      'string.base': 'Please add a profile picture',
      'string.base64': 'Profile picture is not a valid base64 string',
      'string.empty': 'Profile picture is required'
    }),
});

export { signupSchema };