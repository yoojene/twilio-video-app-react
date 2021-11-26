import { ModelInit, MutableModel, PersistentModelConstructor } from '@aws-amplify/datastore';

type ImageMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

export declare class Image {
  readonly id: string;
  readonly name: string;
  readonly base64Data: string;
  readonly description?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Image, ImageMetaData>);
  static copyOf(
    source: Image,
    mutator: (draft: MutableModel<Image, ImageMetaData>) => MutableModel<Image, ImageMetaData> | void
  ): Image;
}
