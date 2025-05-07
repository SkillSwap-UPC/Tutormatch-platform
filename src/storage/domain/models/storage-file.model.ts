    export class StorageFile {
      readonly path: string;
      readonly url: string;
      readonly size: number;
      readonly mimeType: string;
      readonly name: string;
      readonly bucket: string;
      readonly contentType: string;
      readonly createdAt: Date;
    
      constructor(props: {
        path: string;
        url: string;
        size: number;
        mimeType: string;
        name: string;
        bucket: string;
        contentType: string;
        createdAt?: Date;
      }) {
        this.path = props.path;
        this.url = props.url;
        this.size = props.size;
        this.mimeType = props.mimeType;
        this.name = props.name;
        this.bucket = props.bucket;
        this.contentType = props.contentType;
        this.createdAt = props.createdAt || new Date();
      }
    
      toJSON() {
        return {
          path: this.path,
          url: this.url,
          size: this.size,
          mimeType: this.mimeType,
          name: this.name,
          bucket: this.bucket,
          contentType: this.contentType,
          createdAt: this.createdAt,
        };
      }
    }