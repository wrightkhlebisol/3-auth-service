import crypto from 'crypto';

import { BadRequestError, IAuthDocument, IEmailMessageDetails, firstLetterUppercase, lowerCase, uploads } from '@wrightkhlebisol/jobber-shared';
import { createAuthUser, getUserByUsernameOrEmail, signToken } from '@auth/services/auth.service';
import { config } from '@auth/config';
import { publishDirectMessage } from '@auth/queues/auth.producer';
import { Request, Response } from 'express';
import { signupSchema } from '@auth/schemes/signup';
import { UploadApiResponse } from 'cloudinary';
import { v4 as uuidV4 } from 'uuid';
import { authChannel } from '@auth/server';
import { StatusCodes } from 'http-status-codes';

export async function create(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(signupSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Signup create() method error');
  }

  const { username, email, password, country, profilePicture } = req.body;
  const checkIfUserExist: IAuthDocument = await getUserByUsernameOrEmail(username, email);
  if (checkIfUserExist) {
    throw new BadRequestError('Invalid credentials. Email or Username', 'Signup create() method error');
  }

  const profilePublicId = uuidV4();
  const uploadResult: UploadApiResponse = await uploads(profilePicture, `${profilePublicId}`, true, true) as UploadApiResponse;
  if (!uploadResult.public_id) {
    throw new BadRequestError('File upload error. try again', 'Signup create() method');
  }
  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');
  const authData: IAuthDocument = {
    username: firstLetterUppercase(username),
    email: lowerCase(email),
    profilePublicId,
    password,
    country,
    profilePicture: uploadResult?.secure_url,
    emailVerificationToken: randomCharacters
  } as IAuthDocument;

  const result: IAuthDocument = await createAuthUser(authData);
  const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=${authData.emailVerificationToken}`;
  const messageDetails: IEmailMessageDetails = {
    receiverEmail: result.email,
    verifyLink: verificationLink,
    template: 'verifyEmail'
  };
  // 
  await publishDirectMessage(
    authChannel,
    'jobber-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Verify email message has been sent to notification service',
  );
  const userJWT: string = signToken(result.id!, result.email!, result.username!);
  res.status(StatusCodes.CREATED).json({
    message: 'User created successfully',
    user: result,
    token: userJWT
  });
}