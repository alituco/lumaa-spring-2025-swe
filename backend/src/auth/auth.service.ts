import { 
    Injectable, 
    ConflictException, 
    UnauthorizedException 
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { User } from '../entities/user.entity';
  import * as bcrypt from 'bcrypt';
  import { JwtService } from '@nestjs/jwt';
  import { CreateUserDto } from './dto/create-user.dto';
  import { LoginUserDto } from './dto/login-user.dto';
  
  @Injectable()
  export class AuthService {
    constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
      private jwtService: JwtService,
    ) {}
  
    async register(createUserDto: CreateUserDto): Promise<{ message: string }> {
      const existingUser = await this.usersRepository.findOne({
        where: { username: createUserDto.username },
      });
  
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }
  
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.usersRepository.create({
        username: createUserDto.username,
        password: hashedPassword,
      });
  
      await this.usersRepository.save(user);
      return { message: 'User registered successfully' };
    }
  
    async login(loginDto: LoginUserDto): Promise<{ access_token: string }> {
      const user = await this.usersRepository.findOne({
        where: { username: loginDto.username },
      });
  
      if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      const payload = { username: user.username, sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
  }