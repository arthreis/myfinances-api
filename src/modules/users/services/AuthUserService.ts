import { dataSource } from './../../../shared/infra/typeorm/config/datasources/ormconfig.js';
import { compare } from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';

import User from '../entities/User.js';
import AppError from '../../../shared/errors/AppError.js';
import { env } from '../../../env/index.js';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = dataSource.getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const isPasswordMatch = await compare(password, user.password as string);

    if (!isPasswordMatch) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const secret = env.AUTH_JWT_SECRET;
    const expiresIn = env.AUTH_JWT_EXPIRES_IN;

    const token = jwt.sign({}, secret as string, {
      subject: user.id,
      expiresIn,
    } as SignOptions);

    delete user.password;

    return {
      user,
      token,
    };
  }
}

export default AuthUserService;
