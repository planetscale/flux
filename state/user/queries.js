import gql from 'graphql-tag';

export const userOrgQuery = gql`
  query($email: String!) {
    user(where: { email: $email }) {
      email
      username
      displayName
      role
      profile {
        avatar
      }
      org {
        name
      }
    }
  }
`;
