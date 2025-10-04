import { Request, Response } from 'express';

import User from '@/modules/users/entities/User';

import CreateUserService from '@/modules/users/services/CreateUserService';
import AppError from '../../../../errors/AppError';
import { dataSource } from '../../../typeorm/config/datasources/ormconfig';

export default class UsersController {
  async store(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return res.json(user);
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const usersRepository = dataSource.getRepository(User);

    const user = await usersRepository.findOne({where:{id}});

    if (!user) throw new AppError('Invalid User');

    delete user.password;

    return res.json(user);
  }
}
