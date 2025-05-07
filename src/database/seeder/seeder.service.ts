import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SemesterService } from '../../semesters/application/services/semester.service';
import { CourseService } from '../../courses/application/services/course.service';
import { CreateSemesterDto } from '../../semesters/application/dtos/create-semester.dto';
import { CreateCourseDto } from '../../courses/application/dtos/create-course.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly semesterService: SemesterService,
    private readonly courseService: CourseService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    // Verifica si debemos ejecutar el seeding (podemos usar una variable de entorno)
    const shouldSeed = this.configService.get<string>('SEED_DATABASE') === 'true';
    
    if (shouldSeed) {
      await this.seed();
      this.logger.log('Base de datos poblada correctamente');
    } else {
      this.logger.log('Saltando la prepoblación de la base de datos');
    }
  }

  async seed() {
    try {
      const seedData = this.getSeedData();
      await this.seedSemestersAndCourses(seedData);
    } catch (error) {
      this.logger.error('Error al poblar la base de datos', error);
    }
  }

  private getSeedData() {
    return [
      {
        name: 'First',
        courses: [
          { name: 'Introducción a los Algoritmos', semesterNumber: 1 }
        ]
      },
      {
        name: 'Second',
        courses: [
          { name: 'Algoritmos', semesterNumber: 2 }
        ]
      },
      {
        name: 'Third',
        courses: [
          { name: 'Algoritmos y Estructuras de Datos', semesterNumber: 3 },
          { name: 'Diseño y Patrones de Software', semesterNumber: 3 }
        ]
      },
      {
        name: 'Fourth',
        courses: [
          { name: 'Diseño de Base de Datos', semesterNumber: 4 },
          { name: 'IHC y Tecnologías Móviles', semesterNumber: 4 }
        ]
      },
      {
        name: 'Fifth',
        courses: [
          { name: 'Aplicaciones Web', semesterNumber: 5 },
          { name: 'Desarrollo de Aplicaciones Open Source', semesterNumber: 5 }
        ]
      },
      {
        name: 'Sixth',
        courses: [
          { name: 'Aplicaciones para Dispositivos Móviles', semesterNumber: 6 },
          { name: 'Complejidad Algorítmica', semesterNumber: 6 }
        ]
      },
      {
        name: 'Seventh',
        courses: [
          { name: 'Diseño de Experimentos de Ingeniería de Software', semesterNumber: 7 },
          { name: 'Fundamentos de Arquitectura de Software', semesterNumber: 7 }
        ]
      },
      {
        name: 'Eighth',
        courses: [
          { name: 'Arquitecturas de Software Emergentes', semesterNumber: 8 },
          { name: 'Gerencia de Proyectos en Computación', semesterNumber: 8 }
        ]
      }
    ];
  }

  private async seedSemestersAndCourses(data) {
    this.logger.log('Iniciando la población de semestres y cursos...');

    const existingSemesters = await this.semesterService.findAll();
    if (existingSemesters.length > 0) {
      this.logger.log('Ya existen semestres en la base de datos. Saltando el proceso de seeding.');
      return;
    }

    for (const semesterData of data) {
      try {
        // Crear semestre
        const createSemesterDto: CreateSemesterDto = {
          name: semesterData.name
        };
        
        const semester = await this.semesterService.create(createSemesterDto);
        this.logger.log(`Semestre creado: ${semester.name} (${semester.id})`);
        
        // Crear cursos para este semestre
        for (const courseData of semesterData.courses) {
          try {
            const createCourseDto: CreateCourseDto = {
              name: courseData.name,
              semesterNumber: courseData.semesterNumber
            };
            
            const course = await this.courseService.create(createCourseDto);
            this.logger.log(`Curso creado: ${course.name} (${course.id})`);
            
            // Asociar curso al semestre
            await this.semesterService.addCourseToSemester(semester.id, course.id);
            this.logger.log(`Curso ${course.name} añadido al semestre ${semester.name}`);
          } catch (courseError) {
            this.logger.error(`Error al crear curso ${courseData.name}`, courseError);
          }
        }
      } catch (semesterError) {
        this.logger.error(`Error al crear semestre ${semesterData.name}`, semesterError);
      }
    }
  }
}