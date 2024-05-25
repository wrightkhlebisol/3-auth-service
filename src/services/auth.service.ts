import { config } from '@auth/config';
import AuthModel from '@auth/models/auth.schema';
import { publishDirectMessage } from '@auth/queues/auth.producer';
import { authChannel } from '@auth/server';
import { IAuthBuyerMessageDetails, IAuthDocument, firstLetterUppercase } from '@wrightkhlebisol/jobber-shared';
import { sign } from 'jsonwebtoken';
import { lowerCase } from 'lodash';
import { Model, Op } from 'sequelize';

export async function createAuthUser(data: IAuthDocument): Promise<IAuthDocument> {
  const result: Model = await AuthModel.create(data);
  const messageDetails: IAuthBuyerMessageDetails = {
    username: result.dataValues.username!,
    email: result.dataValues.email!,
    profilePicture: result.dataValues.profilePicture!,
    country: result.dataValues.country!,
    createdAt: result.dataValues.createdAt!,
    type: 'auth'
  };
  await publishDirectMessage(
    authChannel,
    'jobber-buyer-update',
    'user-buyer',
    JSON.stringify(messageDetails),
    'Buyer details sent to buyer service'
  );
  delete result.dataValues.password;
  return result.dataValues;
}

export async function getAuthUserById(authId: number): Promise<IAuthDocument> {
  const user: Model = await AuthModel.findOne({
    where: { id: authId },
    attributes: {
      exclude: ['password']
    }
  }) as Model;
  return user.dataValues;
}

export async function getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument> {
  const user: Model = await AuthModel.findOne({
    where: {
      [Op.or]: [
        { username: firstLetterUppercase(username) },
        { email: lowerCase(email) }
      ]
    }
  }) as Model;

  return user.dataValues;
}

export async function getUserByEmail(email: string): Promise<IAuthDocument> {
  const user: Model = await AuthModel.findOne({
    where: {
      email: lowerCase(email),
    }
  }) as Model;

  return user.dataValues;
}

export async function getUserByUsername(username: string): Promise<IAuthDocument> {
  const user: Model = await AuthModel.findOne({
    where: {
      username: firstLetterUppercase(username)
    }
  }) as Model;

  return user.dataValues;
}

export async function getUserByVerificationToken(token: string): Promise<IAuthDocument> {
  const user: Model = await AuthModel.findOne({
    where: {
      emailVerificationToken: token
    },
    attributes: {
      exclude: ['password'],
    }
  }) as Model;

  return user.dataValues;
}

export async function getUserByPasswordToken(token: string): Promise<IAuthDocument> {
  const user: Model = await AuthModel.findOne({
    where: {
      [Op.and]: [{
        passwordResetToken: token,
        passwordResetExpires: {
          [Op.gt]: new Date()
        }
      }]
    },
    attributes: {
      exclude: ['password'],
    }
  }) as Model;

  return user.dataValues;
}

export async function updateVerifyEmailField(authId: number, emailVerified: number, emailVerificationToken: string): Promise<void> {
  AuthModel.update(
    {
      emailVerified,
      emailVerificationToken
    },
    {
      where: {
        id: authId
      },
    }
  );
}

export async function updatePasswordToken(authId: number, token: string, tokenExpiration: string): Promise<void> {
  AuthModel.update(
    {
      passwordRestToken: token,
      passwordResetExpires: tokenExpiration,
    },
    {
      where: {
        id: authId
      },
    }
  );
}

export async function updatePassword(authId: number, password: string): Promise<void> {
  AuthModel.update(
    {
      password,
      passwordRestToken: '',
      passwordResetExpires: new Date(),
    },
    {
      where: {
        id: authId
      },
    }
  );
}

export function signToken(id: number, email: string, username: string): string {
  return sign({
    id,
    email,
    username
  }, config.JWT_TOKEN!);
}