/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const syncImages = /* GraphQL */ `
  query SyncImages($filter: ModelImageFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
    syncImages(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
      items {
        id
        name
        base64Data
        description
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getImage = /* GraphQL */ `
  query GetImage($id: ID!) {
    getImage(id: $id) {
      id
      name
      base64Data
      description
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const listImages = /* GraphQL */ `
  query ListImages($filter: ModelImageFilterInput, $limit: Int, $nextToken: String) {
    listImages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        base64Data
        description
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
