
export class Course {
  readonly id: string;
  readonly name: string;
  readonly semesterNumber: number;
  readonly createdAt: Date | null;
  readonly updatedAt: Date | null;

  constructor(props: {
    id: string;
    name: string;
    semesterNumber: number;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.semesterNumber = props.semesterNumber;
    this.createdAt = props.createdAt || null;
    this.updatedAt = props.updatedAt || null;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      semesterNumber: this.semesterNumber,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
