import AuthorNamePlate from 'components/NamePlate/AuthorNamePlate';
import CommenterNamePlate from 'components/NamePlate/CommenterNamePlate';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'urql';
import ReactMarkdown from 'react-markdown';
import { Icon } from 'pageUtils/post/atoms';
import {
  PageWrapper,
  PostMetadata,
  DateTime,
  Title,
  Content,
  CommentList,
  CommentListItem,
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
  updatePostMutation,
} from 'pageUtils/post/queries';
import { ButtonMinor, ButtonTertiary } from 'components/Button';
import { useUserContext } from 'state/user';
import { getLocaleDateTimeString } from 'utils/dateTime';
import { useImmer } from 'use-immer';
import CodeBlock from 'components/MarkdownEditor/CodeBlock';
import styled from '@emotion/styled';
import MarkdownEditor from 'components/MarkdownEditor';
import LoadingIndicator from 'components/LoadingIndicator';

const Meta = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: var(--text);

  ${ButtonMinor} {
    margin: 0 0 0 8px;
  }
`;

export default function PostPage() {
  const router = useRouter();
  const [commentButtonState, setCommentButtonState] = useImmer({
    replyButtons: {},
    editButtons: {},
  });
  const [postEditState, setPostEditState] = useImmer({
    content: '',
    isOpened: false,
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
  const {
    createdAt,
    title,
    summary,
    content,
    author,
    lens,
    replies,
    stars,
    tag,
  } = postDataResult.data?.post || {};
  const [createReplyResult, runCreateReplyMutation] = useMutation(
    createReplyMutation
  );
  const [createStarResult, runCreateStarMutation] = useMutation(
    createStarMutation
  );
  const [updateReplyResult, runUpdateReplyMutation] = useMutation(
    updateReplyMutation
  );
  const [updatePostResult, runUpdatePostMutation] = useMutation(
    updatePostMutation
  );

  useEffect(() => {
    if (!postDataResult.fetching && !postDataResult.data?.post) {
      router.push('/');
    }

    if (postDataResult.data?.post) {
      setPostEditState(draft => {
        draft.content = postDataResult.data?.post.content;
      });

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

  const togglePostEdit = () => {
    setPostEditState(draft => {
      draft.isOpened = !postEditState.isOpened;
    });
  };

  const handlePostContentChange = content => {
    setPostEditState(draft => {
      draft.content = content;
    });
  };

  const handlePostEditSubmit = async () => {
    try {
      const res = await runUpdatePostMutation({
        content: postEditState.content,
        postId: Number(router.query?.id),
      });
      if (!res.data) {
        console.error(e);
      } else {
        setPostEditState(draft => {
          draft.isOpened = !postEditState.isOpened;
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // TODO: add better loading indicator, now there's literally none
  if (postDataResult.fetching) {
    return <LoadingIndicator></LoadingIndicator>;
  }

  return (
    <PageWrapper>
      <Post>
        <PostMetadata>
          <Meta>
            <DateTime>{getLocaleDateTimeString(createdAt)}</DateTime>
            <div>&nbsp; &middot; &nbsp;</div>
            <div>#{tag.name}</div>
            {userContext.user.id === author?.id && (
              <ButtonMinor type="submit" onClick={togglePostEdit}>
                Edit
              </ButtonMinor>
            )}
          </Meta>
          <Title>{title}</Title>
          <AuthorNamePlate
            displayName={author?.displayName}
            userHandle={author?.username}
            avatar={author?.profile?.avatar}
          />
        </PostMetadata>

        <Content>
          {postEditState.isOpened ? (
            <>
              <MarkdownEditor
                content={postEditState.content}
                handleContentChange={handlePostContentChange}
                // userTagSuggestions={state.slackMemberSuggestions}
              ></MarkdownEditor>
              <ButtonMinor
                type="submit"
                onClick={handlePostEditSubmit}
                disabled={!postEditState.content?.trim()}
              >
                <Icon className="icon-edit"></Icon>
                Update
              </ButtonMinor>
            </>
          ) : (
            <ReactMarkdown renderers={{ code: CodeBlock }}>
              {content}
            </ReactMarkdown>
          )}
        </Content>
        <ActionBar>
          <ButtonTertiary onClick={handleStarClick}>
            <Icon className="icon-star"></Icon>
            <div>{postState.numStars}</div>
          </ButtonTertiary>
        </ActionBar>
      </Post>

      <CommentList>
        {Object.entries(postState.replies).map(
          ([firstLevelReplyKey, firstLevelReplyValue]) => (
            <div key={firstLevelReplyKey}>
              <CommentListItem className="levelone">
                <Comment className="levelone">
                  <CommenterNameplateWrapper>
                    <CommenterNamePlate
                      displayName={firstLevelReplyValue.author?.displayName}
                      userHandle={firstLevelReplyValue.author?.username}
                      avatar={firstLevelReplyValue.author?.profile?.avatar}
                      date={getLocaleDateTimeString(
                        firstLevelReplyValue.createdAt
                      )}
                    />
                  </CommenterNameplateWrapper>
                  <CommentActionButtonGroup className="actions">
                    <ButtonMinor
                      data-comment-id={firstLevelReplyKey}
                      type="submit"
                      onClick={toggleCommentReply}
                    >
                      Reply
                    </ButtonMinor>
                    {userContext.user.id ===
                      firstLevelReplyValue.author?.id && (
                      <ButtonMinor
                        data-comment-id={firstLevelReplyKey}
                        type="submit"
                        onClick={e => {
                          toggleCommentEdit(e, firstLevelReplyValue.content);
                        }}
                      >
                        Edit
                      </ButtonMinor>
                    )}
                  </CommentActionButtonGroup>

                  {commentButtonState.editButtons[firstLevelReplyKey] ? (
                    <Reply>
                      <textarea
                        data-comment-id={firstLevelReplyKey}
                        value={commentInputs.edits[firstLevelReplyKey]}
                        onChange={handleCommentEditsChange}
                        autoFocus
                      ></textarea>
                      <ButtonMinor
                        data-comment-id={firstLevelReplyKey}
                        type="submit"
                        onClick={handleCommentEditSubmit}
                        disabled={
                          !commentInputs.edits[firstLevelReplyKey]?.trim()
                        }
                      >
                        <Icon className="icon-edit"></Icon>
                        Update
                      </ButtonMinor>
                    </Reply>
                  ) : (
                    <CommentContent>
                      {firstLevelReplyValue.content}
                    </CommentContent>
                  )}

                  {commentButtonState.replyButtons[firstLevelReplyKey] && (
                    <Reply>
                      <textarea
                        data-comment-id={firstLevelReplyKey}
                        value={commentInputs.replies[firstLevelReplyKey]}
                        onChange={handleCommentRepliesChange}
                        autoFocus
                      ></textarea>
                      <ButtonMinor
                        data-comment-id={firstLevelReplyKey}
                        type="submit"
                        onClick={handleCommentReplySubmit}
                        disabled={
                          !commentInputs.replies[firstLevelReplyKey]?.trim()
                        }
                      >
                        <Icon className="icon-comment"></Icon>
                        Reply
                      </ButtonMinor>
                    </Reply>
                  )}
                </Comment>
              </CommentListItem>

              {Object.entries(firstLevelReplyValue.replies).map(([k, v]) => (
                <div key={k}>
                  <CommentListItem className="leveltwo">
                    <Comment className="leveltwo">
                      <CommenterNameplateWrapper>
                        <CommenterNamePlate
                          displayName={v.author?.displayName}
                          userHandle={v.author?.username}
                          avatar={v.author?.profile?.avatar}
                          date={getLocaleDateTimeString(v.createdAt)}
                        />
                      </CommenterNameplateWrapper>
                      <CommentActionButtonGroup className="actions">
                        <ButtonMinor
                          data-comment-id={k}
                          type="submit"
                          onClick={toggleCommentReply}
                        >
                          Reply
                        </ButtonMinor>
                        {userContext.user.id === v.author?.id && (
                          <ButtonMinor
                            data-comment-id={k}
                            type="submit"
                            onClick={e => {
                              toggleCommentEdit(e, v.content);
                            }}
                          >
                            Edit
                          </ButtonMinor>
                        )}
                      </CommentActionButtonGroup>

                      {commentButtonState.editButtons[k] ? (
                        <Reply>
                          <textarea
                            data-comment-id={k}
                            value={commentInputs.edits[k]}
                            onChange={handleCommentEditsChange}
                            autoFocus
                          ></textarea>
                          <ButtonMinor
                            data-comment-id={k}
                            type="submit"
                            onClick={handleCommentEditSubmit}
                            disabled={!commentInputs.edits[k]?.trim()}
                          >
                            <Icon className="icon-edit"></Icon>
                            Update
                          </ButtonMinor>
                        </Reply>
                      ) : (
                        <CommentContent>{v.content}</CommentContent>
                      )}

                      {commentButtonState.replyButtons[k] && (
                        <Reply>
                          <textarea
                            data-comment-id={k}
                            value={commentInputs.replies[k]}
                            onChange={handleCommentRepliesChange}
                            autoFocus
                          ></textarea>
                          <ButtonMinor
                            data-comment-id={k}
                            type="submit"
                            onClick={handleCommentReplySubmit}
                            disabled={!commentInputs.replies[k]?.trim()}
                          >
                            <Icon className="icon-comment"></Icon>
                            Reply
                          </ButtonMinor>
                        </Reply>
                      )}
                    </Comment>
                  </CommentListItem>

                  {Object.entries(v.replies).map(([key, value]) => (
                    <div key={key}>
                      <CommentListItem className="levelthree">
                        <Comment className="levelthree">
                          <CommenterNameplateWrapper>
                            <CommenterNamePlate
                              displayName={value.author?.displayName}
                              userHandle={value.author?.username}
                              avatar={value.author?.profile?.avatar}
                              date={getLocaleDateTimeString(value.createdAt)}
                            />
                          </CommenterNameplateWrapper>
                          <CommentActionButtonGroup className="actions">
                            {userContext.user.id === value.author?.id && (
                              <ButtonMinor
                                data-comment-id={key}
                                type="submit"
                                onClick={e => {
                                  toggleCommentEdit(e, value.content);
                                }}
                              >
                                Edit
                              </ButtonMinor>
                            )}
                          </CommentActionButtonGroup>

                          {commentButtonState.editButtons[key] ? (
                            <Reply>
                              <textarea
                                data-comment-id={key}
                                value={commentInputs.edits[key]}
                                onChange={handleCommentEditsChange}
                                autoFocus
                              ></textarea>
                              <ButtonMinor
                                data-comment-id={key}
                                type="submit"
                                onClick={handleCommentEditSubmit}
                                disabled={!commentInputs.edits[key]?.trim()}
                              >
                                <Icon className="icon-edit"></Icon>
                                Update
                              </ButtonMinor>
                            </Reply>
                          ) : (
                            <CommentContent>{value.content}</CommentContent>
                          )}
                        </Comment>
                      </CommentListItem>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )
        )}
      </CommentList>
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
          <Icon className="icon-comment"></Icon>
          Reply
        </ButtonMinor>
      </Reply>
    </PageWrapper>
  );
}
