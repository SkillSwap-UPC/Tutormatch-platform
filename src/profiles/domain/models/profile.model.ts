
export class Profile {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly gender: string;
  readonly role: string;
  readonly semesterNumber: number;
  readonly academicYear: string | null;
  readonly avatar: string | null;
  readonly bio: string | null;
  readonly phone: string | null;
  readonly status: string | null;
  readonly tutorId: string | null;
  readonly createdAt: Date | null;
  readonly updatedAt: Date | null;

  constructor(props: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    role: string;
    semesterNumber: number;
    academicYear?: string | null;
    avatar?: string | null;
    bio?: string | null;
    phone?: string | null;
    status?: string | null;
    tutorId?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }) {
    this.id = props.id;
    this.email = props.email;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.gender = props.gender;
    this.role = props.role;
    this.semesterNumber = props.semesterNumber;
    this.academicYear = props.academicYear || null;
    this.avatar = props.avatar || null;
    this.bio = props.bio || null;
    this.phone = props.phone || null;
    this.status = props.status || null;
    this.tutorId = props.tutorId || null;
    this.createdAt = props.createdAt || null;
    this.updatedAt = props.updatedAt || null;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      gender: this.gender,
      role: this.role,
      semesterNumber: this.semesterNumber,
      academicYear: this.academicYear,
      avatar: this.avatar,
      bio: this.bio,
      phone: this.phone,
      status: this.status,
      tutorId: this.tutorId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
