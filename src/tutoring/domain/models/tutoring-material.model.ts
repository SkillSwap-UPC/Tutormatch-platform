
export class TutoringMaterial {
  readonly id: string;
  readonly tutoringId: string;
  readonly title: string;
  readonly description?: string;
  readonly type: 'document' | 'video' | 'link' | 'image' | 'code';
  readonly url: string;
  readonly size?: number;
  readonly uploadedBy?: string;
  readonly createdAt: Date | null;
  readonly updatedAt: Date | null;

  constructor(props: {
    id: string;
    tutoringId: string;
    title: string;
    description?: string;
    type: 'document' | 'video' | 'link' | 'image' | 'code';
    url: string;
    size?: number;
    uploadedBy?: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }) {
    this.id = props.id;
    this.tutoringId = props.tutoringId;
    this.title = props.title;
    this.description = props.description;
    this.type = props.type;
    this.url = props.url;
    this.size = props.size;
    this.uploadedBy = props.uploadedBy;
    this.createdAt = props.createdAt || null;
    this.updatedAt = props.updatedAt || null;
  }

  toJSON() {
    return {
      id: this.id,
      tutoringId: this.tutoringId,
      title: this.title,
      description: this.description,
      type: this.type,
      url: this.url,
      size: this.size,
      uploadedBy: this.uploadedBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
