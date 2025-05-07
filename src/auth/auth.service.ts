
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and key must be defined');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, gender, semesterNumber, role } = registerDto;
    
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
          gender,
          semesterNumber,
          role
        }
      }
    });

    if (error) {
      throw error;
    }

    return {
      user: data.user,
      session: data.session
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    return {
      user: data.user,
      session: data.session
    };
  }

  async logout(token: string) {
    const { error } = await this.supabase.auth.signOut();
    
    if (error) {
      throw error;
    }

    return { success: true };
  }

  async validateToken(token: string) {
    const { data, error } = await this.supabase.auth.getUser(token);
    
    if (error) {
      return null;
    }
    
    return data.user;
  }

    /**
   * Elimina un usuario de Supabase Auth
   * @param userId El ID del usuario a eliminar
   * @returns Un objeto indicando el éxito de la operación
   */
    async deleteUser(userId: string) {
      // Esta operación requiere permisos de admin en Supabase
      const { error } = await this.supabase.auth.admin.deleteUser(
        userId
      );
      
      if (error) {
        throw error;
      }
  
      return { success: true, message: 'User successfully deleted from authentication system' };
    }
}
