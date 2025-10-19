import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('lister les users', () => {
    it('should return array of users', async () => {
      const result: User[] = [
        {
          id: '1',
          email: 'joe@exemple.com',
          phone: '',
          fullName: 'Joe Exemple',
          password: 'hashedpassword',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest
        .spyOn(userService, 'findAll')
        .mockImplementation(async () => Promise.resolve(result));

      expect(await userController.findAll()).toBe(result);
    });
  });
});
