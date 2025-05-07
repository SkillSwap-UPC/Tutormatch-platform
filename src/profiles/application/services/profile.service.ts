
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Profile } from '../../domain/models/profile.model';
import { ProfileRepository } from '../../domain/repositories/profile.repository.interface';
import { CreateProfileDto } from '../dtos/create-profile.dto';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { PROFILE_REPOSITORY } from '../../profiles.module';
import { AuthService } from '../../../auth/auth.service';


@Injectable()
export class ProfileService {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    private readonly authService: AuthService
  ) {}

  async findAll(): Promise<Profile[]> {
    return this.profileRepository.findAll();
  }

  async findById(id: string): Promise<Profile> {
    const profile = await this.profileRepository.findById(id);
    if (!profile) {
      throw new NotFoundException(`Profile with ID "${id}" not found`);
    }
    return profile;
  }

  async findByEmail(email: string): Promise<Profile> {
    const profile = await this.profileRepository.findByEmail(email);
    if (!profile) {
      throw new NotFoundException(`Profile with email "${email}" not found`);
    }
    return profile;
  }

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const {
      id,
      email,
      firstName,
      lastName,
      gender,
      role,
      semesterNumber,
      academicYear,
      avatar,
      bio,
      phone,
      status,
      tutorId,
    } = createProfileDto;

    const profile = new Profile({
      id,
      email,
      firstName,
      lastName,
      gender,
      role,
      semesterNumber,
      academicYear,
      avatar,
      bio,
      phone,
      status,
      tutorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.profileRepository.create(profile);
  }

  async update(id: string, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const existingProfile = await this.profileRepository.findById(id);

    if (!existingProfile) {
      throw new NotFoundException(`Profile with ID "${id}" not found`);
    }

    const updatedProfile = await this.profileRepository.update(id, {
      ...updateProfileDto,
      updatedAt: new Date(),
    });

    if (!updatedProfile) {
      throw new NotFoundException(`Failed to update profile with ID "${id}"`);
    }

    return updatedProfile;
  }

  async delete(id: string): Promise<boolean> {
    const profile = await this.profileRepository.findById(id);
    
    if (!profile) {
      throw new NotFoundException(`Profile with ID "${id}" not found`);
    }

    // Primero eliminamos el perfil de la base de datos
    const deleted = await this.profileRepository.delete(id);
    
    if (deleted) {
      try {
        // Luego eliminamos el usuario de Supabase Auth
        await this.authService.deleteUser(id);
      } catch (error) {
        console.error('Error deleting user from auth system:', error);
        // Considera si debes revertir la eliminación del perfil o no
        // Dependiendo de tu lógica de negocio
      }
    }

    return deleted;
  }
}
