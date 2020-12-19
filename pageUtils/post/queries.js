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
      lens {
        id
        name
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
