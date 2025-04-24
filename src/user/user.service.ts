import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    const existingUser = await this.usersRepository.findOne({ where: { email } });

    if (existingUser) {
      throw new BadRequestException({
        message: 'Email already exist!'
      })
    }

    const newUser = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(newUser);
  }

  // read all users
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  // read single user
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException({
        message: 'User not found!'
      })
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    const updateUser = this.usersRepository.merge(user, updateUserDto);
    return await this.usersRepository.save(updateUser);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);

    return await this.usersRepository.remove(user);
  }
}