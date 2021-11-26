/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateImageInput = {
  id?: string | null;
  name: string;
  base64Data: string;
  description?: string | null;
};

export type ModelImageConditionInput = {
  name?: ModelStringInput | null;
  base64Data?: ModelStringInput | null;
  description?: ModelStringInput | null;
  and?: Array<ModelImageConditionInput | null> | null;
  or?: Array<ModelImageConditionInput | null> | null;
  not?: ModelImageConditionInput | null;
};

export type ModelStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export enum ModelAttributeTypes {
  binary = 'binary',
  binarySet = 'binarySet',
  bool = 'bool',
  list = 'list',
  map = 'map',
  number = 'number',
  numberSet = 'numberSet',
  string = 'string',
  stringSet = 'stringSet',
  _null = '_null',
}

export type ModelSizeInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
};

export type Image = {
  __typename: 'Image';
  id: string;
  name: string;
  base64Data: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateImageInput = {
  id: string;
  name?: string | null;
  base64Data?: string | null;
  description?: string | null;
};

export type DeleteImageInput = {
  id: string;
};

export type ModelImageFilterInput = {
  id?: ModelIDInput | null;
  name?: ModelStringInput | null;
  base64Data?: ModelStringInput | null;
  description?: ModelStringInput | null;
  and?: Array<ModelImageFilterInput | null> | null;
  or?: Array<ModelImageFilterInput | null> | null;
  not?: ModelImageFilterInput | null;
};

export type ModelIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export type ModelImageConnection = {
  __typename: 'ModelImageConnection';
  items?: Array<Image | null> | null;
  nextToken?: string | null;
};

export type CreateImageMutationVariables = {
  input: CreateImageInput;
  condition?: ModelImageConditionInput | null;
};

export type CreateImageMutation = {
  createImage?: {
    __typename: 'Image';
    id: string;
    name: string;
    base64Data: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type UpdateImageMutationVariables = {
  input: UpdateImageInput;
  condition?: ModelImageConditionInput | null;
};

export type UpdateImageMutation = {
  updateImage?: {
    __typename: 'Image';
    id: string;
    name: string;
    base64Data: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type DeleteImageMutationVariables = {
  input: DeleteImageInput;
  condition?: ModelImageConditionInput | null;
};

export type DeleteImageMutation = {
  deleteImage?: {
    __typename: 'Image';
    id: string;
    name: string;
    base64Data: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type GetImageQueryVariables = {
  id: string;
};

export type GetImageQuery = {
  getImage?: {
    __typename: 'Image';
    id: string;
    name: string;
    base64Data: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListImagesQueryVariables = {
  filter?: ModelImageFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListImagesQuery = {
  listImages?: {
    __typename: 'ModelImageConnection';
    items?: Array<{
      __typename: 'Image';
      id: string;
      name: string;
      base64Data: string;
      description?: string | null;
      createdAt: string;
      updatedAt: string;
    } | null> | null;
    nextToken?: string | null;
  } | null;
};

export type OnCreateImageSubscription = {
  onCreateImage?: {
    __typename: 'Image';
    id: string;
    name: string;
    base64Data: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnUpdateImageSubscription = {
  onUpdateImage?: {
    __typename: 'Image';
    id: string;
    name: string;
    base64Data: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnDeleteImageSubscription = {
  onDeleteImage?: {
    __typename: 'Image';
    id: string;
    name: string;
    base64Data: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};
