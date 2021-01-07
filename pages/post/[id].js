import AuthorNamePlate from 'components/NamePlate/AuthorNamePlate';
import CommenterNamePlate from 'components/NamePlate/CommenterNamePlate';
import UserIcon from 'components/UserIcon';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'urql';
import ReactMarkdownWithHtml from 'react-markdown/with-html';
import {
  Wrapper,
  BodyWrapper,
  Post,
  Content,
  Comment,
  UserIconWrapper,
  Reply,
} from 'pageUtils/post/styles';
import {
  postDataQuery,
  createReplyMutation,
  createStarMutation,
} from 'pageUtils/post/queries';
import { useTopBarActions } from 'state/topBar';
import { ButtonBase } from 'components/Button';
import { useUserContext } from 'state/user';
import { getLocaleDateTimeString } from 'utils/dateTime';
import { useImmer } from 'use-immer';

export default function PostPage() {
  const router = useRouter();
  const [postState, updatePostState] = useImmer({
    replies: [],
    numStars: 0,
  });
  const [reply, setReply] = useState('');
  const userContext = useUserContext();
  const [postDataResult, runPostDataQuery] = useQuery({
    query: postDataQuery,
    variables: {
      id: Number(router.query?.id),
    },
  });
  const { createdAt, title, summary, content, author, lens, replies, stars } =
    postDataResult.data?.post || {};
  const [createReplyResult, runCreateReplyMutation] = useMutation(
    createReplyMutation
  );
  const [createStarResult, runCreateStarMutation] = useMutation(
    createStarMutation
  );

  useEffect(() => {
    if (!postDataResult.fetching && !postDataResult.data?.post) {
      router.push('/');
    }

    if (postDataResult.data?.post) {
      updatePostState(draft => {
        draft.replies = postDataResult.data?.post.replies;
        draft.numStars = postDataResult.data?.post.stars.length;
      });
    }
  }, [postDataResult]);

  const handleReplyChange = e => {
    setReply(e.target.value);
  };

  const handleCommentSubmit = async () => {
    try {
      const res = await runCreateReplyMutation({
        content: reply,
        postId: Number(router.query?.id),
        userId: userContext.user.id,
      });
      if (res.data) {
        updatePostState(draft => {
          draft.replies = [...draft.replies, res.data.createOneReply];
        });

        setReply('');
      } else {
        console.error(e);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStarClick = async () => {
    // For constant UI re-render, first add one star to local state, subtract it if network request is not fulfilled.
    updatePostState(draft => {
      draft.numStars = draft.numStars + 1;
    });
    try {
      const res = await runCreateStarMutation({
        postId: Number(router.query?.id),
        userId: userContext.user.id,
      });
      if (!res.data) {
        updatePostState(draft => {
          draft.numStars = draft.numStars - 1;
        });
        console.error(e);
      }
    } catch (e) {
      updatePostState(draft => {
        draft.numStars = draft.numStars - 1;
      });
      console.error(e);
    }
  };

  // TODO: add better loading indicator, now there's literally none
  if (postDataResult.fetching) {
    return <></>;
  }

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
            numStars={postState.numStars}
            onStarClick={handleStarClick}
          />
          <Content>
            <ReactMarkdownWithHtml allowDangerousHtml>
              {content}
            </ReactMarkdownWithHtml>
          </Content>
        </Post>
        {postState.replies?.map(reply => (
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
            <div>{getLocaleDateTimeString(reply.createdAt)}</div>
          </Comment>
        ))}
      </BodyWrapper>
      <Reply>
        <UserIconWrapper>
          <UserIcon
            src={reply.author?.profile?.avatar || '/user_profile_icon.svg'}
            width="62px"
            height="62px"
            alt="user avatar"
          />
        </UserIconWrapper>
        <textarea value={reply} onChange={handleReplyChange}></textarea>
        <ButtonBase type="submit" onClick={handleCommentSubmit}>
          Reply.
        </ButtonBase>
      </Reply>
    </Wrapper>
  );
}
