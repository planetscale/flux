import AuthorNamePlate from 'components/NamePlate/AuthorNamePlate';
import CommenterNamePlate from 'components/NamePlate/CommenterNamePlate';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'urql';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
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
  deleteStarMutation,
} from 'pageUtils/post/queries';
import { ButtonMinor, ButtonTertiary } from 'components/Button';
import { useUserContext } from 'state/user';
import { getLocaleDateTimeString } from 'utils/dateTime';
import { useImmer } from 'use-immer';
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
    starMap: {},
    isStared: false,
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
  const [deleteStarResult, runDeleteStarMutation] = useMutation(
    deleteStarMutation
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
          draft.starMap = postDataResult.data?.post.stars.reduce(
            (acc, curr) => {
              acc[curr.user.id] = { starId: curr.id };
              return acc;
            },
            {}
          );

          if (draft.starMap[userContext?.user?.id]) {
            draft.isStared = true;
          }
        });
      }
    }
  }, [postDataResult]);

  const handleReplyChange = content => {
    setReply(content);
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

  async function handleStarClick() {
    // For constant UI re-render, first add one star to local state, subtract it if network request is not fulfilled.
    if (postState.isStared) {
      updatePostState(draft => {
        draft.numStars = postState.numStars - 1;
        draft.isStared = false;
      });

      try {
        const res = await runDeleteStarMutation({
          starId: postState.starMap[userContext.user.id]?.starId,
        });
        if (res.error) {
          console.error(res.error.message);
        } else {
          updatePostState(draft => {
            draft.starMap = {
              ...postState.starMap,
              [userContext?.user?.id]: undefined,
            };
          });
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      updatePostState(draft => {
        draft.numStars = postState.numStars + 1;
        draft.isStared = true;
      });

      try {
        const res = await runCreateStarMutation({
          postId: Number(router.query?.id),
          userId: userContext.user.id,
        });
        if (res.error) {
          console.error(res.error.message);
        } else {
          updatePostState(draft => {
            draft.starMap = {
              ...postState.starMap,
              [userContext?.user?.id]: { starId: res.data.addStar.id },
            };
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  const handleCommentEditsChange = (content, key) => {
    setCommentInputs(draft => {
      draft.edits[key] = content;
    });
  };

  const handleCommentRepliesChange = (content, key) => {
    setCommentInputs(draft => {
      draft.replies[key] = content;
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

  const handlePostContentChange = getContent => {
    setPostEditState(draft => {
      draft.content = getContent();
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
            <div>#{tag?.name}</div>
            {/* {userContext.user.id === author?.id && ( */}
            <ButtonMinor type="submit" onClick={togglePostEdit}>
              Edit
            </ButtonMinor>
            {/* )} */}
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
              ></MarkdownEditor>
              <ButtonMinor
                type="submit"
                onClick={handlePostEditSubmit}
                disabled={!postEditState.content}
              >
                <Icon className="icon-edit"></Icon>
                Update
              </ButtonMinor>
            </>
          ) : (
            <MarkdownEditor content={content} readOnly={true}></MarkdownEditor>
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
                      <MarkdownEditor
                        content={commentInputs.edits[firstLevelReplyKey]}
                        handleContentChange={getContent => {
                          handleCommentEditsChange(
                            getContent(),
                            firstLevelReplyKey
                          );
                        }}
                      ></MarkdownEditor>
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
                      <MarkdownEditor
                        content={firstLevelReplyValue.content}
                        readOnly={true}
                      ></MarkdownEditor>
                    </CommentContent>
                  )}

                  {commentButtonState.replyButtons[firstLevelReplyKey] && (
                    <Reply>
                      <MarkdownEditor
                        content={commentInputs.replies[firstLevelReplyKey]}
                        handleContentChange={getContent => {
                          handleCommentRepliesChange(
                            getContent(),
                            firstLevelReplyKey
                          );
                        }}
                      ></MarkdownEditor>
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
                          <MarkdownEditor
                            content={commentInputs.edits[k]}
                            handleContentChange={getContent => {
                              handleCommentEditsChange(getContent(), k);
                            }}
                          ></MarkdownEditor>
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
                        <CommentContent>
                          <MarkdownEditor
                            content={v.content}
                            readOnly={true}
                          ></MarkdownEditor>
                        </CommentContent>
                      )}

                      {commentButtonState.replyButtons[k] && (
                        <Reply>
                          <MarkdownEditor
                            content={commentInputs.replies[k]}
                            handleContentChange={getContent => {
                              handleCommentRepliesChange(getContent(), k);
                            }}
                          ></MarkdownEditor>
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
                              <MarkdownEditor
                                content={commentInputs.edits[key]}
                                handleContentChange={getContent => {
                                  handleCommentEditsChange(getContent(), key);
                                }}
                              ></MarkdownEditor>
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
                            <CommentContent>
                              <MarkdownEditor
                                content={value.content}
                                readOnly={true}
                              ></MarkdownEditor>
                            </CommentContent>
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
        <MarkdownEditor
          content={reply}
          handleContentChange={handleReplyChange}
        ></MarkdownEditor>
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
