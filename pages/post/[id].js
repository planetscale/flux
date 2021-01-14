import AuthorNamePlate from 'components/NamePlate/AuthorNamePlate';
import CommenterNamePlate from 'components/NamePlate/CommenterNamePlate';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'urql';
import ReactMarkdown from 'react-markdown';

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
  CommenterNameplateWrapper,
  CommentActionButtonGroup,
} from 'pageUtils/post/styles';
import {
  postDataQuery,
  createReplyMutation,
  createStarMutation,
  updateReplyMutation,
} from 'pageUtils/post/queries';
import { ButtonMinor, ButtonTertiary } from 'components/Button';
import { useUserContext } from 'state/user';
import { getLocaleDateTimeString } from 'utils/dateTime';
import { useImmer } from 'use-immer';
import CodeBlock from 'components/MarkdownEditor/CodeBlock';

export default function PostPage() {
  const router = useRouter();
  const [commentButtonState, setCommentButtonState] = useImmer({
    replyButtons: {},
    editButtons: {},
  });
  const [postState, updatePostState] = useImmer({
    replies: {},
    numStars: 0,
  });
  const [reply, setReply] = useState('');
  const [commentInputs, setCommentInputs] = useImmer({
    replies: {},
    edits: {},
  });
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
  const [updateReplyResult, runUpdateReplyMutation] = useMutation(
    updateReplyMutation
  );

  useEffect(() => {
    if (!postDataResult.fetching && !postDataResult.data?.post) {
      router.push('/');
    }

    if (postDataResult.data?.post) {
      const replyMap = postDataResult.data?.post.replies.reduce((acc, curr) => {
        const { author, content, createdAt } = curr;
        if (!curr.parentId) {
          acc[curr.id] = { author, content, createdAt, replies: {} };
        } else {
          // DFS to search for the parent
          const stack = [];
          Object.entries(acc).forEach(item => {
            stack.push(item);

            while (stack.length) {
              const currItem = stack.pop();

              if (Number(currItem[0]) === curr.parentId) {
                currItem[1]['replies'][curr.id] = {
                  author,
                  content,
                  createdAt,
                  replies: {},
                };
              }

              Object.entries(currItem[1].replies).forEach(item => {
                stack.push(item);
              });
            }
          });
        }

        return acc;
      }, {});

      updatePostState(draft => {
        draft.replies = replyMap;
      });

      if (postState.numStars === 0) {
        updatePostState(draft => {
          draft.numStars = postDataResult.data?.post.stars.length;
        });
      }
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
        content: reply.trim(),
        postId: Number(router.query?.id),
        userId: userContext.user.id,
      });
      if (res.data) {
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

  const handleCommentEditsChange = e => {
    setCommentInputs(draft => {
      draft.edits[e.target.dataset.commentId] = e.target.value;
    });
  };

  const handleCommentRepliesChange = e => {
    setCommentInputs(draft => {
      draft.replies[e.target.dataset.commentId] = e.target.value;
    });
  };

  const toggleCommentReply = e => {
    setCommentButtonState(draft => {
      draft.replyButtons[e.target.dataset.commentId] = !commentButtonState
        .replyButtons[e.target.dataset.commentId];
    });
  };

  const toggleCommentEdit = (e, content) => {
    setCommentButtonState(draft => {
      draft.editButtons[e.target.dataset.commentId] = !commentButtonState
        .editButtons[e.target.dataset.commentId];
    });

    setCommentInputs(draft => {
      draft.edits[e.target.dataset.commentId] =
        commentInputs.edits[e.target.dataset.commentId] || content;
    });
  };

  const handleCommentEditSubmit = async e => {
    if (!commentInputs.edits[e.target.dataset.commentId]?.trim()) {
      return;
    }

    try {
      const res = await runUpdateReplyMutation({
        content: commentInputs.edits[e.target.dataset.commentId]?.trim(),
        replyId: Number(e.target.dataset.commentId),
      });
      if (res.data) {
        setCommentInputs(draft => {
          draft.edits[e.target.dataset.commentId] = '';
        });
        setCommentButtonState(draft => {
          draft.editButtons[e.target.dataset.commentId] = !commentButtonState
            .editButtons[e.target.dataset.commentId];
        });
      } else {
        console.error(e);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCommentReplySubmit = async e => {
    if (!commentInputs.replies[e.target.dataset.commentId]?.trim()) {
      return;
    }

    try {
      const res = await runCreateReplyMutation({
        content: commentInputs.replies[e.target.dataset.commentId]?.trim(),
        postId: Number(router.query?.id),
        userId: userContext.user.id,
        parentId: Number(e.target.dataset.commentId),
      });
      if (res.data) {
        setCommentInputs(draft => {
          draft.replies[e.target.dataset.commentId] = '';
        });
        setCommentButtonState(draft => {
          draft.replyButtons[e.target.dataset.commentId] = !commentButtonState
            .replyButtons[e.target.dataset.commentId];
        });
      } else {
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
          <ReactMarkdown renderers={{ code: CodeBlock }}>
            {content}
          </ReactMarkdown>
        </Content>
        <ActionBar>
          <ButtonTertiary onClick={handleStarClick}>
            <img src="/icon_star.svg" alt="star" />
            <div>{postState.numStars}</div>
          </ButtonTertiary>
        </ActionBar>
      </Post>

      {Object.entries(postState.replies).map(
        ([firstLevelReplyKey, firstLevelReplyValue]) => (
          <div key={firstLevelReplyKey}>
            <Comment>
              <CommenterNameplateWrapper>
                <CommenterNamePlate
                  displayName={firstLevelReplyValue.author?.displayName}
                  userHandle={firstLevelReplyValue.author?.username}
                  avatar={firstLevelReplyValue.author?.profile?.avatar}
                  date={getLocaleDateTimeString(firstLevelReplyValue.createdAt)}
                />
                <CommentActionButtonGroup>
                  <ButtonMinor
                    data-comment-id={firstLevelReplyKey}
                    type="submit"
                    onClick={toggleCommentReply}
                  >
                    Reply
                  </ButtonMinor>
                  <ButtonMinor
                    data-comment-id={firstLevelReplyKey}
                    type="submit"
                    onClick={e => {
                      toggleCommentEdit(e, firstLevelReplyValue.content);
                    }}
                  >
                    Edit
                  </ButtonMinor>
                </CommentActionButtonGroup>
              </CommenterNameplateWrapper>

              {commentButtonState.editButtons[firstLevelReplyKey] ? (
                <Reply>
                  <textarea
                    data-comment-id={firstLevelReplyKey}
                    value={commentInputs.edits[firstLevelReplyKey]}
                    onChange={handleCommentEditsChange}
                  ></textarea>
                  <ButtonMinor
                    data-comment-id={firstLevelReplyKey}
                    type="submit"
                    onClick={handleCommentEditSubmit}
                    disabled={!commentInputs.edits[firstLevelReplyKey]?.trim()}
                  >
                    <img
                      src="/icon_comment.svg"
                      alt="button to submit comment edit"
                    />
                    Submit
                  </ButtonMinor>
                </Reply>
              ) : (
                <CommentContent>{firstLevelReplyValue.content}</CommentContent>
              )}

              {commentButtonState.replyButtons[firstLevelReplyKey] && (
                <Reply>
                  <textarea
                    data-comment-id={firstLevelReplyKey}
                    value={commentInputs.replies[firstLevelReplyKey]}
                    onChange={handleCommentRepliesChange}
                  ></textarea>
                  <ButtonMinor
                    data-comment-id={firstLevelReplyKey}
                    type="submit"
                    onClick={handleCommentReplySubmit}
                    disabled={
                      !commentInputs.replies[firstLevelReplyKey]?.trim()
                    }
                  >
                    <img
                      src="/icon_comment.svg"
                      alt="button to submit response to comment"
                    />
                    Submit
                  </ButtonMinor>
                </Reply>
              )}
            </Comment>

            <div>
              {Object.entries(firstLevelReplyValue.replies).map(([k, v]) => (
                <Comment key={k}>
                  <CommenterNamePlate
                    displayName={v.author?.displayName}
                    userHandle={v.author?.username}
                    avatar={v.author?.profile?.avatar}
                    date={getLocaleDateTimeString(v.createdAt)}
                  />
                  <CommentContent>{v.content}</CommentContent>
                </Comment>
              ))}
            </div>
          </div>
        )
      )}

      <Reply>
        <textarea
          value={reply}
          placeholder="Reply to this post"
          onChange={handleReplyChange}
        ></textarea>
        <ButtonMinor
          type="submit"
          onClick={handleCommentSubmit}
          disabled={!reply?.trim()}
        >
          <img src="/icon_comment.svg" alt="button to submit response" />
          Reply
        </ButtonMinor>
      </Reply>
    </PageWrapper>
  );
}
