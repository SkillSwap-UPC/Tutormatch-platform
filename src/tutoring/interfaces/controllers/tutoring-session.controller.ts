
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TutoringSessionService } from '../../application/services/tutoring-session.service';
import { CreateTutoringSessionDto } from '../../application/dtos/create-tutoring-session.dto';
import { CreateTutoringMaterialDto } from '../../application/dtos/create-tutoring-material.dto';
import { CreateTutoringReviewDto } from '../../application/dtos/create-tutoring-review.dto';
import { CreateAvailableTimeDto } from '../../application/dtos/create-available-time.dto';
import { TutoringSession } from 'src/tutoring/domain/models/tutoring-session.model';

@ApiTags('tutoring-sessions')
@Controller('tutoring-sessions')
export class TutoringSessionController {
  constructor(private readonly tutoringSessionService: TutoringSessionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tutoring sessions or filter by tutor, student, or course' })
  @ApiQuery({ name: 'tutorId', required: false, description: 'Filter by tutor ID' })
  @ApiQuery({ name: 'studentId', required: false, description: 'Filter by student ID' })
  @ApiQuery({ name: 'courseId', required: false, description: 'Filter by course ID' })
  @ApiResponse({ status: 200, description: 'Return all tutoring sessions or filtered sessions.' })
  async findAll(
    @Query('tutorId') tutorId?: string,
    @Query('studentId') studentId?: string,
    @Query('courseId') courseId?: string
  ) {
    if (tutorId) {
      return this.tutoringSessionService.findByTutorId(tutorId);
    }
    if (courseId) {
      return this.tutoringSessionService.findByCourseId(courseId);
    }
    return this.tutoringSessionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tutoring session by ID' })
  @ApiParam({ name: 'id', description: 'Tutoring session ID' })
  @ApiResponse({ status: 200, description: 'Return the tutoring session.' })
  @ApiResponse({ status: 404, description: 'Tutoring session not found.' })
  async findById(@Param('id') id: string) {
    return this.tutoringSessionService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new tutoring session' })
  @ApiResponse({ status: 201, description: 'The tutoring session has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createTutoringSessionDto: CreateTutoringSessionDto) {
    return this.tutoringSessionService.create(createTutoringSessionDto);
  }

  @Patch(':id')
    @ApiOperation({ summary: 'Update a tutoring session' })
    @ApiParam({ name: 'id', description: 'Tutoring session ID' })
    @ApiResponse({ status: 200, description: 'The tutoring session has been successfully updated.' })
    @ApiResponse({ status: 404, description: 'Tutoring session not found.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async update(@Param('id') id: string, @Body() updateData: Partial<CreateTutoringSessionDto>) {
      try {
        // Verificar si la sesión existe
        await this.tutoringSessionService.findById(id);
        
        // Extraer el campo availableTimes que requiere tratamiento especial
        const { availableTimes, ...basicUpdateData } = updateData;
        
        // Primero actualizamos los campos básicos
        const updatedSession = await this.tutoringSessionService.update(id, basicUpdateData as Partial<TutoringSession>);
        
        // Si hay availableTimes definidos, los manejamos por separado
        if (availableTimes && availableTimes.length > 0) {
          // Primero, eliminamos los horarios existentes
          const existingTimes = await this.tutoringSessionService.getAvailableTimes(id);
          for (const time of existingTimes) {
            await this.tutoringSessionService.deleteAvailableTime(time.id);
          }
          
          // Luego, agregamos los nuevos horarios
          for (const timeDto of availableTimes) {
            await this.tutoringSessionService.addAvailableTime(id, timeDto);
          }
        }
        
        // Devolver la sesión actualizada
        return this.tutoringSessionService.findById(id);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new BadRequestException(`Error updating tutoring session: ${error.message}`);
      }
    }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a tutoring session' })
  @ApiParam({ name: 'id', description: 'Tutoring session ID' })
  @ApiResponse({ status: 204, description: 'The tutoring session has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Tutoring session not found.' })
  async delete(@Param('id') id: string) {
    await this.tutoringSessionService.delete(id);
  }

  // Material endpoints
  @Post('materials')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a material to a tutoring session' })
  @ApiResponse({ status: 201, description: 'The material has been successfully added.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Tutoring session not found.' })
  async addMaterial(@Body() createMaterialDto: CreateTutoringMaterialDto) {
    return this.tutoringSessionService.addMaterial(createMaterialDto);
  }

  @Patch('materials/:id')
  @ApiOperation({ summary: 'Update a tutoring material' })
  @ApiParam({ name: 'id', description: 'Material ID' })
  @ApiResponse({ status: 200, description: 'The material has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Material not found.' })
  async updateMaterial(@Param('id') id: string, @Body() updateData: Partial<CreateTutoringMaterialDto>) {
    return this.tutoringSessionService.updateMaterial(id, updateData);
  }

  @Delete('materials/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a tutoring material' })
  @ApiParam({ name: 'id', description: 'Material ID' })
  @ApiResponse({ status: 204, description: 'The material has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Material not found.' })
  async deleteMaterial(@Param('id') id: string) {
    await this.tutoringSessionService.deleteMaterial(id);
  }

  @Get(':id/materials')
  @ApiOperation({ summary: 'Get materials for a tutoring session' })
  @ApiParam({ name: 'id', description: 'Tutoring session ID' })
  @ApiResponse({ status: 200, description: 'Return the materials for the tutoring session.' })
  @ApiResponse({ status: 404, description: 'Tutoring session not found.' })
  async getMaterials(@Param('id') id: string) {
    return this.tutoringSessionService.getMaterials(id);
  }

  // Review endpoints
  @Post('reviews')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a review to a tutoring session' })
  @ApiResponse({ status: 201, description: 'The review has been successfully added.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Tutoring session not found.' })
  async addReview(@Body() createReviewDto: CreateTutoringReviewDto) {
    return this.tutoringSessionService.addReview(createReviewDto);
  }

  @Patch('reviews/:id')
  @ApiOperation({ summary: 'Update a tutoring review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'The review has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  async updateReview(@Param('id') id: string, @Body() updateData: Partial<CreateTutoringReviewDto>) {
    return this.tutoringSessionService.updateReview(id, updateData);
  }

  @Delete('reviews/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a tutoring review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 204, description: 'The review has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  async deleteReview(@Param('id') id: string) {
    await this.tutoringSessionService.deleteReview(id);
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Get reviews for a tutoring session' })
  @ApiParam({ name: 'id', description: 'Tutoring session ID' })
  @ApiResponse({ status: 200, description: 'Return the reviews for the tutoring session.' })
  @ApiResponse({ status: 404, description: 'Tutoring session not found.' })
  async getReviews(@Param('id') id: string) {
    return this.tutoringSessionService.getReviews(id);
  }

  // Available time endpoints
  @Post(':id/available-times')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add an available time to a tutoring session' })
  @ApiParam({ name: 'id', description: 'Tutoring session ID' })
  @ApiResponse({ status: 201, description: 'The available time has been successfully added.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Tutoring session not found.' })
  async addAvailableTime(@Param('id') id: string, @Body() createTimeDto: CreateAvailableTimeDto) {
    return this.tutoringSessionService.addAvailableTime(id, createTimeDto);
  }

  @Patch('available-times/:id')
  @ApiOperation({ summary: 'Update a tutoring available time' })
  @ApiParam({ name: 'id', description: 'Available time ID' })
  @ApiResponse({ status: 200, description: 'The available time has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Available time not found.' })
  async updateAvailableTime(@Param('id') id: string, @Body() updateData: Partial<CreateAvailableTimeDto>) {
    return this.tutoringSessionService.updateAvailableTime(id, updateData);
  }

  @Delete('available-times/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a tutoring available time' })
  @ApiParam({ name: 'id', description: 'Available time ID' })
  @ApiResponse({ status: 204, description: 'The available time has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Available time not found.' })
  async deleteAvailableTime(@Param('id') id: string) {
    await this.tutoringSessionService.deleteAvailableTime(id);
  }

  @Get(':id/available-times')
  @ApiOperation({ summary: 'Get available times for a tutoring session' })
  @ApiParam({ name: 'id', description: 'Tutoring session ID' })
  @ApiResponse({ status: 200, description: 'Return the available times for the tutoring session.' })
  @ApiResponse({ status: 404, description: 'Tutoring session not found.' })
  async getAvailableTimes(@Param('id') id: string) {
    return this.tutoringSessionService.getAvailableTimes(id);
  }
}
