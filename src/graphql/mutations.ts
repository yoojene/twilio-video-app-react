/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createImage = /* GraphQL */ `
  mutation CreateImage($input: CreateImageInput!, $condition: ModelImageConditionInput) {
    createImage(input: $input, condition: $condition) {
      id
      name
      base64Data
      description
      createdAt
      updatedAt
    }
  }
`;
export const updateImage = /* GraphQL */ `
  mutation UpdateImage($input: UpdateImageInput!, $condition: ModelImageConditionInput) {
    updateImage(input: $input, condition: $condition) {
      id
      name
      base64Data
      description
      createdAt
      updatedAt
    }
  }
`;
export const deleteImage = /* GraphQL */ `
  mutation DeleteImage($input: DeleteImageInput!, $condition: ModelImageConditionInput) {
    deleteImage(input: $input, condition: $condition) {
      id
      name
      base64Data
      description
      createdAt
      updatedAt
    }
  }
`;
