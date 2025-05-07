
export class TutoringAvailableTime {
  readonly id: string;
  readonly tutoringId: string;
  readonly dayOfWeek: number;
  readonly startTime: string;
  readonly endTime: string;
  readonly createdAt: Date | null;
  readonly updatedAt: Date | null;

  constructor(props: {
    id: string;
    tutoringId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }) {
    this.id = props.id;
    this.tutoringId = props.tutoringId;
    this.dayOfWeek = props.dayOfWeek;
    this.startTime = props.startTime;
    this.endTime = props.endTime;
    this.createdAt = props.createdAt || null;
    this.updatedAt = props.updatedAt || null;
  }

  toJSON() {
    return {
      id: this.id,
      tutoringId: this.tutoringId,
      dayOfWeek: this.dayOfWeek,
      startTime: this.startTime,
      endTime: this.endTime,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
