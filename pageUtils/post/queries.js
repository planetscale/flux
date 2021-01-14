import gql from 'graphql-tag';

const postDataQuery = gql`
  query($id: Int!) {
    post(where: { id: $id }) {
      id
      createdAt
      title
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
        parentId
        author {
          username
          displayName
          profile {
            avatar
          }
        }
      }
      stars {
        id
      }
    }
  }
`;

const createReplyMutation = gql`
  mutation($content: String!, $postId: Int!, $userId: Int!, $parentId: Int) {
    createOneReply(
      data: {
        content: $content
        post: { connect: { id: $postId } }
        author: { connect: { id: $userId } }
        parentId: $parentId
      }
    ) {
      id
      parentId
      createdAt
      content
      author {
        username
        displayName
        profile {
          avatar
        }
      }
    }
  }
`;

const createStarMutation = gql`
  mutation($postId: Int!, $userId: Int!) {
    createOneStar(
      data: {
        post: { connect: { id: $postId } }
        user: { connect: { id: $userId } }
      }
    ) {
      id
    }
  }
`;

export { postDataQuery, createReplyMutation, createStarMutation };
