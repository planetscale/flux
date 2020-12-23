import AuthorNamePlate from 'components/NamePlate/AuthorNamePlate';
import CommenterNamePlate from 'components/NamePlate/CommenterNamePlate';
import UserIcon from 'components/UserIcon';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'urql';
import {
  Wrapper,
  BodyWrapper,
  Post,
  Content,
  Comment,
  UserIconWrapper,
  Reply,
} from 'pageUtils/post/styles';
import { postDataQuery } from 'pageUtils/post/queries';
import { useTopBarActions } from 'state/topBar';
import { ButtonBase } from 'components/Button';
import gql from 'graphql-tag';

const createReplyMutation = gql`
  mutation($content: String!, $postId: Int!, $userId: Int!) {
    createOneReply(
      data: {
        content: $content
        post: { connect: { id: $postId } }
        author: { connect: { id: $userId } }
      }
    ) {
      id
    }
  }
`;

export default function PostPage() {
  const router = useRouter();
  const [reply, setReply] = useState('');
  const { setHeaders } = useTopBarActions();
  const [postDataResult, runPostDataQuery] = useQuery({
    query: postDataQuery,
    variables: { id: Number(router.query?.id) },
  });
  const { createdAt, title, summary, content, author, lens, replies } =
    postDataResult.data?.post || {};
  const [createReplyResult, runCreateReplyMutation] = useMutation(
    createReplyMutation
  );

  useEffect(() => {
    if (!postDataResult.fetching && !postDataResult.data?.post) {
      router.push('/');
    }
  }, [postDataQuery]);

  useEffect(() => {
    if (lens?.name) {
      setHeaders({
        header: lens.name,
        subHeader: title,
      });
    }
  }, [lens, title]);

  // TODO: add better loading indicator, now there's literally none
  if (postDataResult.fetching) {
    return <></>;
  }

  const handleReplyChange = e => {
    setReply(e.target.value);
  };

  const handleCommentSubmit = () => {
    runCreateReplyMutation({
      content: reply,
      postId: 1,
      userId: 1,
    });
  };

  return (
    <Wrapper>
      <BodyWrapper>
        <Post>
          <UserIconWrapper>
            <UserIcon
              src={author?.profile?.avatar || '/user_profile_icon.svg'}
              width="62px"
              height="62px"
              alt="user avatar"
            />
          </UserIconWrapper>
          <AuthorNamePlate
            displayName={author?.displayName}
            userHandle={author?.username}
            time={createdAt}
            numComments={replies?.length}
            numStars={0}
          />
          <Content>{content}</Content>
        </Post>
        {replies?.map(reply => (
          <Comment key={reply.id}>
            <UserIconWrapper>
              <UserIcon
                src={reply.author?.profile?.avatar || '/user_profile_icon.svg'}
                width="62px"
                height="62px"
                alt="user avatar"
              />
            </UserIconWrapper>
            <CommenterNamePlate
              displayName={reply.author?.displayName}
              userHandle={reply.author?.username}
            />
            <Content>{reply.content}</Content>
            <div>{reply.createdAt} ago</div>
          </Comment>
        ))}
      </BodyWrapper>
      <Reply>
        <UserIconWrapper>
          <UserIcon
            src="/user_profile_icon.svg"
            width="62px"
            height="62px"
            alt="user avatar"
          />
        </UserIconWrapper>
        <textarea onChange={handleReplyChange}></textarea>
        <ButtonBase type="submit" onClick={handleCommentSubmit}>
          Reply.
        </ButtonBase>
      </Reply>
    </Wrapper>
  );
}
