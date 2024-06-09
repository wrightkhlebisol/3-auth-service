import AuthModel from '@auth/models/auth.schema';
import { loginSchema } from '@auth/schemes/signin';
import { getUserByEmail, getUserByUsername, signToken } from '@auth/services/auth.service';
import { BadRequestError, IAuthDocument, isEmail } from '@wrightkhlebisol/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export async function read(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(loginSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Signup read() method error');
  }
  const { username, password } = req.body;
  const existingUser: IAuthDocument = !isEmail(username) ? await getUserByUsername(username) : await getUserByEmail(username);
  if (!existingUser) {
    throw new BadRequestError('User account does not exist', 'Gateway signin');
  }
  const passwordsMatch: boolean = await AuthModel.prototype.comparePassword(password, existingUser.password!);
  if (!passwordsMatch) {
    throw new BadRequestError('Invalid credentials', 'Signin read() method error');
  }

  const userJWT: string = signToken(existingUser.id!, existingUser.email!, existingUser.username!);
  delete existingUser.password;
  res.status(StatusCodes.OK).json({
    message: 'User login successfully',
    token: userJWT,
    user: existingUser,
  });
}