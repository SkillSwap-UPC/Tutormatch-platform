
import { TutoringMaterial } from './tutoring-material.model';
import { TutoringReview } from './tutoring-review.model';
import { TutoringAvailableTime } from './tutoring-available-time.model';

export class TutoringSession {
  readonly id: string;
  readonly tutorId: string;
  readonly courseId?: string;
  readonly title: string;
  readonly description?: string;
  readonly price: number;
  readonly whatTheyWillLearn: string[];
  readonly imageUrl?: string;
  readonly materials: TutoringMaterial[];
  readonly reviews: TutoringReview[];
  readonly availableTimes: TutoringAvailableTime[];
  readonly createdAt: Date | null;
  readonly updatedAt: Date | null;

  constructor(props: {
    id: string;
    tutorId: string;
    courseId?: string;
    title: string;
    description?: string;
    price: number;
    whatTheyWillLearn?: string[];
    imageUrl?: string;
    materials?: TutoringMaterial[];
    reviews?: TutoringReview[];
    availableTimes?: TutoringAvailableTime[];
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }) {
    this.id = props.id;
    this.tutorId = props.tutorId;
    this.courseId = props.courseId;
    this.title = props.title;
    this.description = props.description;
    this.price = props.price;
    this.whatTheyWillLearn = props.whatTheyWillLearn || [];
    this.imageUrl = props.imageUrl;
    this.materials = props.materials || [];
    this.reviews = props.reviews || [];
    this.availableTimes = props.availableTimes || [];
    this.createdAt = props.createdAt || null;
    this.updatedAt = props.updatedAt || null;
  }

  toJSON() {
    return {
      id: this.id,
      tutorId: this.tutorId,
      courseId: this.courseId,
      title: this.title,
      description: this.description,
      price: this.price,
      whatTheyWillLearn: this.whatTheyWillLearn,
      imageUrl: this.imageUrl,
      materials: this.materials.map(material => material.toJSON()),
      reviews: this.reviews.map(review => review.toJSON()),
      availableTimes: this.availableTimes.map(time => time.toJSON()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
