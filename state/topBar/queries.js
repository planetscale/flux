import gql from 'graphql-tag';

export const tagsOrgQuery = gql`
  query {
    tags {
      id
      name
    }
  }
`;
