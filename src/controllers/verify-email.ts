import { getAuthUserById, getUserByVerificationToken, updateVerifyEmailField } from '@auth/services/auth.service';
import { BadRequestError, IAuthDocument } from '@wrightkhlebisol/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export async function verifyEmail(req: Request, res: Response): Promise<void> {
  const { token } = req.body;
  const checkIfUserExist: IAuthDocument = await getUserByVerificationToken(token);
  if (!checkIfUserExist) {
    throw new BadRequestError('Verification token is either invalid or is already used', 'VerifyEmail update() method');
  }
  await updateVerifyEmailField(checkIfUserExist.id!, 1, token);
  const updatedUser = await getAuthUserById(checkIfUserExist.id!);
  res.status(StatusCodes.OK).json({ message: 'Email verified successfully', user: updatedUser });

}