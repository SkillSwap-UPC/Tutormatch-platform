import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  const requestMock = {
    query: {},
  } as unknown as Request;

  const responseMock = {
    status: jest.fn(() => ({
      send: jest.fn((y: unknown) => y),
    })),
    send: jest.fn((x: unknown) => x),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return 400 if email or password is missing', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      controller.getUsers(requestMock, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
});
