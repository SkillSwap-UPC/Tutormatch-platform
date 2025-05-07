
export class TutoringReview {
  readonly id: string;
  readonly tutoringId: string;
  readonly studentId: string;
  readonly rating: number;
  readonly comment?: string;
  readonly likes?: number;
  readonly createdAt: Date | null;
  readonly updatedAt: Date | null;

  constructor(props: {
    id: string;
    tutoringId: string;
    studentId: string;
    rating: number;
    comment?: string;
    likes?: number;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }) {
    this.id = props.id;
    this.tutoringId = props.tutoringId;
    this.studentId = props.studentId;
    this.rating = props.rating;
    this.comment = props.comment;
    this.likes = props.likes;
    this.createdAt = props.createdAt || null;
    this.updatedAt = props.updatedAt || null;
  }

  toJSON() {
    return {
      id: this.id,
      tutoringId: this.tutoringId,
      studentId: this.studentId,
      rating: this.rating,
      comment: this.comment,
      likes: this.likes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
