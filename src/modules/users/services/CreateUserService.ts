import { hash } from 'bcrypt';

import User from '../entities/User.js';
import AppError from '../../../shared/errors/AppError.js';
import { dataSource } from '../../../shared/infra/typeorm/config/datasources/ormconfig.js';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = dataSource.getRepository(User);

    const checkIfUserExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkIfUserExists) {
      throw new AppError('Email address already used');
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    delete user.password;

    return user;
  }
}

export default CreateUserService;
