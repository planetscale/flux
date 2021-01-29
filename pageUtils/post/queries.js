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
        id
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
        stars {
          id
          user {
            id
          }
        }
        author {
          id
          username
          displayName
          profile {
            avatar
          }
        }
      }
      stars {
        id
        user {
          id
        }
        reply {
          id
        }
      }
      tag {
        id
        name
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
        id
        username
        displayName
        profile {
          avatar
        }
      }
    }
  }
`;

const updateReplyMutation = gql`
  mutation($content: String!, $replyId: Int!) {
    updateOneReply(
      data: { content: { set: $content } }
      where: { id: $replyId }
    ) {
      id
      createdAt
      content
      parentId
      author {
        id
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
  mutation($postId: Int!, $replyId: Int, $userId: Int!) {
    addStar(postId: $postId, replyId: $replyId, userId: $userId) {
      id
    }
  }
`;

const deleteStarMutation = gql`
  mutation($starId: Int!) {
    deleteOneStar(where: { id: $starId }) {
      id
    }
  }
`;

const updatePostMutation = gql`
  mutation($content: String!, $postId: Int!) {
    updateOnePost(
      data: { content: { set: $content } }
      where: { id: $postId }
    ) {
      id
    }
  }
`;

export {
  postDataQuery,
  createReplyMutation,
  createStarMutation,
  updateReplyMutation,
  updatePostMutation,
  deleteStarMutation,
};
