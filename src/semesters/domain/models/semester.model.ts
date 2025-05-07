
import { Course } from '../../../courses/domain/models/course.model';

export class Semester {
  readonly id: string;
  readonly name: string;
  readonly courses: Course[];
  readonly createdAt: Date | null;
  readonly updatedAt: Date | null;

  constructor(props: {
    id: string;
    name: string;
    courses?: Course[];
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.courses = props.courses || [];
    this.createdAt = props.createdAt || null;
    this.updatedAt = props.updatedAt || null;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      courses: this.courses.map(course => course.toJSON()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
