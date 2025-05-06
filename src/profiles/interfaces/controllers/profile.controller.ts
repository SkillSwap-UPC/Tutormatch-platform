
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  HttpStatus,
  HttpCode,
  Res,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProfileService } from '../../application/services/profile.service';
import { CreateProfileDto } from '../../application/dtos/create-profile.dto';
import { UpdateProfileDto } from '../../application/dtos/update-profile.dto';
import { Profile } from '../../domain/models/profile.model';

@ApiTags('profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los perfiles', description: 'Recupera la lista completa de perfiles de usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de perfiles recuperada con éxito', type: [Profile] })
  async findAll(@Res() response): Promise<void> {
    const profiles = await this.profileService.findAll();
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.send(profiles);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un perfil por ID' })
  @ApiParam({ name: 'id', description: 'ID único del perfil', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Perfil encontrado', type: Profile })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  async findById(@Param('id') id: string): Promise<Profile> {
    return this.profileService.findById(id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get a profile by email' })
  @ApiResponse({ status: 200, description: 'Return the profile.' })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  async findByEmail(@Param('email') email: string): Promise<Profile> {
    return this.profileService.findByEmail(email);
  }

  @Post()
  @ApiOperation({ summary: 'Create a profile' })
  @ApiResponse({ status: 201, description: 'The profile has been successfully created.' })
  async create(@Body() createProfileDto: CreateProfileDto): Promise<Profile> {
    return this.profileService.create(createProfileDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a profile' })
  @ApiResponse({ status: 200, description: 'The profile has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    return this.profileService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a profile' })
  @ApiResponse({ status: 204, description: 'The profile has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.profileService.delete(id);
  }
}
