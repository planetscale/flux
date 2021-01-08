import AuthorNamePlate from 'components/NamePlate/AuthorNamePlate';
import CommenterNamePlate from 'components/NamePlate/CommenterNamePlate';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'urql';
import ReactMarkdownWithHtml from 'react-markdown/with-html';
import {
  PageWrapper,
  PostMetadata,
  DateTime,
  Title,
  Content,
  Comment,
  Reply,
  Post,
  CommentContent,
  ActionBar,
} from 'pageUtils/post/styles';
import {
  postDataQuery,
  createReplyMutation,
  createStarMutation,
} from 'pageUtils/post/queries';
import { ButtonMinor, ButtonTertiary } from 'components/Button';
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
    if (!reply?.trim()) {
      return;
    }

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
        console.error(e);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // TODO: add better loading indicator, now there's literally none
  if (postDataResult.fetching) {
    return <></>;
  }

  return (
    <PageWrapper>
      <Post>
        <PostMetadata>
          <DateTime>{getLocaleDateTimeString(createdAt)}</DateTime>
          <Title>{title}</Title>
          <AuthorNamePlate
            displayName={author?.displayName}
            userHandle={author?.username}
            avatar={author?.profile?.avatar}
          />
        </PostMetadata>

        <Content>
          <ReactMarkdownWithHtml allowDangerousHtml>
            {content}
          </ReactMarkdownWithHtml>
        </Content>
        <ActionBar>
          <ButtonTertiary onClick={handleStarClick}>
            <img src="/star.svg" alt="star" />
            <div>{postState.numStars}</div>
          </ButtonTertiary>
        </ActionBar>
      </Post>

      {postState.replies?.map(reply => (
        <Comment key={reply.id}>
          <CommenterNamePlate
            displayName={reply.author?.displayName}
            userHandle={reply.author?.username}
            avatar={reply.author?.profile?.avatar}
            date={getLocaleDateTimeString(reply.createdAt)}
          />
          <CommentContent>{reply.content}</CommentContent>
        </Comment>
      ))}

      <Reply>
        <textarea value={reply} onChange={handleReplyChange}></textarea>
        <ButtonMinor type="submit" onClick={handleCommentSubmit}>
          <img src="/icon_comment.svg" alt="button to submit response" />
          Reply
        </ButtonMinor>
      </Reply>
    </PageWrapper>
  );
}
