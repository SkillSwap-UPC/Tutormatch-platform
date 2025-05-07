
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SemesterService } from '../../application/services/semester.service';
import { CreateSemesterDto } from '../../application/dtos/create-semester.dto';
import { UpdateSemesterDto } from '../../application/dtos/update-semester.dto';

@ApiTags('semesters')
@Controller('semesters')
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Get()
  @ApiOperation({ summary: 'Get all semesters' })
  @ApiResponse({ status: 200, description: 'Return all semesters.' })
  async findAll() {
    return this.semesterService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a semester by ID' })
  @ApiParam({ name: 'id', description: 'Semester ID' })
  @ApiResponse({ status: 200, description: 'Return the semester.' })
  @ApiResponse({ status: 404, description: 'Semester not found.' })
  async findById(@Param('id') id: string) {
    return this.semesterService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new semester' })
  @ApiResponse({ status: 201, description: 'The semester has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createSemesterDto: CreateSemesterDto) {
    return this.semesterService.create(createSemesterDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a semester' })
  @ApiParam({ name: 'id', description: 'Semester ID' })
  @ApiResponse({ status: 200, description: 'The semester has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Semester not found.' })
  async update(@Param('id') id: string, @Body() updateSemesterDto: UpdateSemesterDto) {
    return this.semesterService.update(id, updateSemesterDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a semester' })
  @ApiParam({ name: 'id', description: 'Semester ID' })
  @ApiResponse({ status: 204, description: 'The semester has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Semester not found.' })
  async delete(@Param('id') id: string) {
    await this.semesterService.delete(id);
  }

  @Post(':semesterId/courses/:courseId')
  @ApiOperation({ summary: 'Add a course to a semester' })
  @ApiParam({ name: 'semesterId', description: 'Semester ID' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'The course has been successfully added to the semester.' })
  @ApiResponse({ status: 404, description: 'Semester or course not found.' })
  async addCourse(@Param('semesterId') semesterId: string, @Param('courseId') courseId: string) {
    return this.semesterService.addCourseToSemester(semesterId, courseId);
  }

  @Delete(':semesterId/courses/:courseId')
  @ApiOperation({ summary: 'Remove a course from a semester' })
  @ApiParam({ name: 'semesterId', description: 'Semester ID' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'The course has been successfully removed from the semester.' })
  @ApiResponse({ status: 404, description: 'Semester not found.' })
  async removeCourse(@Param('semesterId') semesterId: string, @Param('courseId') courseId: string) {
    return this.semesterService.removeCourseFromSemester(semesterId, courseId);
  }

  @Get(':id/courses')
  @ApiOperation({ summary: 'Get courses for a semester' })
  @ApiParam({ name: 'id', description: 'Semester ID' })
  @ApiResponse({ status: 200, description: 'Return the courses for the semester.' })
  @ApiResponse({ status: 404, description: 'Semester not found.' })
  async getCourses(@Param('id') id: string) {
    return this.semesterService.getSemesterCourses(id);
  }
}
