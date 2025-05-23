import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  @Get()
  getUsers(@Req() request: Request, @Res() response: Response) {
    const { email, password } = request.query;
    if (!email || !password) {
      return response
        .status(400)
        .json({ message: 'Email and password are required' });
    } else {
      return response
        .status(200)
        .json({ message: 'User authenticated successfully', email, password });
    }
  }
}
