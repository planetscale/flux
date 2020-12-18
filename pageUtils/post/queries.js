import gql from 'graphql-tag';

const postDataQuery = gql`
  query($id: Int!) {
    post(where: { id: $id }) {
      id
      createdAt
      name
      summary
      content
      author {
        username
        displayName
        profile {
          avatar
        }
      }
      replies {
        id
        content
        createdAt
        author {
          username
          displayName
          profile {
            avatar
          }
        }
      }
    }
  }
`;

export { postDataQuery };
