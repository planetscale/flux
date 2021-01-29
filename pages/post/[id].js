import AuthorNamePlate from 'components/NamePlate/AuthorNamePlate';
import CommenterNamePlate from 'components/NamePlate/CommenterNamePlate';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'urql';
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
import { original } from 'immer';
import styled from '@emotion/styled';
import MarkdownEditor from 'components/MarkdownEditor';
import { media } from 'pageUtils/post/theme';

const Meta = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: var(--text);

  ${media.phone`
    flex-direction: column-reverse;
    align-items: flex-start;
  `}
`;

const MetaData = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const MetaActions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${media.phone`
    margin-bottom: 2em;
  `}
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
    stars: [],
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
    replies = [],
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
        draft.content = content;
      });

      // Replies come back in a flat array.  We want a flat map so we can do quick look ups and mutations. Each reply also contains a
      // 'children' property which holds the ids of all direct children of the reply.
      const replyMap = {};
      replies.forEach(reply => {
        // Because we can expect the replies to be ordered by id, a child reply will always come after its parent
        // so we can get away with this logic.
        if (reply.parentId && replyMap[reply.parentId]) {
          replyMap[reply.parentId].children.push(reply.id);
        }
        replyMap[reply.id] = { ...reply, children: [] };
      });

      updatePostState(draft => {
        draft.replies = replyMap;
        // FIXME: Manually filtering out stars for replies since this is for the top level post.
        // This is bad, we should not even be querying them but I'm not quite sure how to do that in prisma and need quick fix.
        draft.stars = stars.filter(s => s.reply === null);
      });
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
        updateReplyMap(res.data.createOneReply);
      } else {
        console.error(e);
      }
    } catch (e) {
      console.error(e);
    }
  };

  async function handleStarClick(replyId) {
    // We will optimistically update the UI star state before the request finishes for better UX.
    // If the request fails we can revert the change to state.
    const userId = userContext.user.id;
    let matchIndex;

    if (replyId) {
      const reply = postState.replies[replyId];
      if (!reply) return;
      matchIndex = reply.stars.findIndex(s => s.user.id === userId);
    } else {
      matchIndex = postState.stars.findIndex(s => s.user.id === userId);
    }

    const undoStarAdd = replyId => {
      updatePostState(draft => {
        if (replyId) {
          draft.replies = {
            ...postState.replies,
            [replyId]: {
              ...postState.replies[replyId],
              stars: [...postState.replies[replyId].stars.slice(0, -1)],
            },
          };
        } else {
          draft.stars = [...postState.stars.slice(0, -1)];
        }
      });
    };

    const undoStarDelete = (backupStars, replyId) => {
      updatePostState(draft => {
        if (replyId) {
          draft.replies = {
            ...postState.replies,
            [replyId]: {
              ...postState.replies[replyId],
              stars: [...backupStars],
            },
          };
        } else {
          draft.stars = [...backupStars];
        }
      });
    };

    if (matchIndex < 0) {
      // When making the "fake" optimistic star, give the star and id of null.
      updatePostState(draft => {
        if (replyId) {
          draft.replies = {
            ...postState.replies,
            [replyId]: {
              ...postState.replies[replyId],
              stars: [
                ...postState.replies[replyId].stars,
                { id: null, user: { id: userId } },
              ],
            },
          };
        } else {
          draft.stars = [
            ...postState.stars,
            { id: null, user: { id: userId } },
          ];
        }
      });

      try {
        const res = await runCreateStarMutation({
          postId: Number(router.query?.id),
          replyId: Number(replyId) || null,
          userId: userId,
        });
        if (res.error) {
          undoStarAdd();
        } else {
          updatePostState(draft => {
            if (replyId) {
              const stars = original(draft.replies[replyId].stars);
              draft.replies = {
                ...postState.replies,
                [replyId]: {
                  ...postState.replies[replyId],
                  stars: [
                    ...stars.slice(0, -1),
                    {
                      ...stars.slice(-1)[0],
                      id: res.data.addStar.id,
                    },
                  ],
                },
              };
            } else {
              const stars = original(draft.stars);
              draft.stars = [
                ...stars.slice(0, -1),
                { ...stars.slice(-1)[0], id: res.data.addStar.id },
              ];
            }
          });
        }
      } catch (e) {
        console.error(e);
        undoStarAdd();
      }
    } else {
      let backupStars;
      const match = replyId
        ? postState.replies[replyId].stars[matchIndex]
        : postState.stars[matchIndex];

      // We are trying to delete a placeholder star, ignore that request.
      if (match.id === null) {
        return;
      }

      updatePostState(draft => {
        if (replyId) {
          backupStars = postState.replies[replyId].stars;
          draft.replies = {
            ...postState.replies,
            [replyId]: {
              ...postState.replies[replyId],
              stars: [
                ...postState.replies[replyId].stars.slice(0, matchIndex),
                ...postState.replies[replyId].stars.slice(matchIndex + 1),
              ],
            },
          };
        } else {
          backupStars = postState.stars;
          draft.stars = [
            ...postState.stars.slice(0, matchIndex),
            ...postState.stars.slice(matchIndex + 1),
          ];
        }
      });

      try {
        const res = await runDeleteStarMutation({
          starId: match.id,
        });
        if (res.error) {
          undoStarDelete(backupStars, replyId);
        }
      } catch (e) {
        console.error(e);
        undoStarDelete(backupStars, replyId);
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
        updateReplyMap(res.data.updateOneReply);
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
        updateReplyMap(res.data.createOneReply);
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

  const updateReplyMap = node => {
    const matchedNode = postState[node.id] || {};

    updatePostState(draft => {
      draft.replies[node.id] = {
        replies: {},
        stars: [],
        children: [],
        ...matchedNode,
        ...node,
      };

      if (node.parentId) {
        draft.replies[node.parentId].children.push(node.id);
      }
    });
  };

  const canSubmit = str => {
    if (!str) return false;
    return str.trim().match(/[0-9a-zA-Z]+/);
  };

  // TODO: add better loading indicator, now there's literally none
  if (postDataResult.fetching) {
    return <></>;
  }

  return (
    <PageWrapper>
      <Post>
        <PostMetadata>
          <Meta>
            <MetaData>
              <DateTime>{getLocaleDateTimeString(createdAt)}</DateTime>
              <div>&nbsp; &middot; &nbsp;</div>
              <div>#{tag?.name}</div>
            </MetaData>
            <MetaActions>
              {userContext.user.id === author?.id && (
                <ButtonMinor type="submit" onClick={togglePostEdit}>
                  {postEditState.isOpened ? 'Cancel Edit' : 'Edit Post'}
                </ButtonMinor>
              )}
            </MetaActions>
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
                disabled={!canSubmit(postEditState.content)}
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
          <ButtonTertiary onClick={() => handleStarClick()}>
            <Icon className="icon-star"></Icon>
            <div>{postState.stars.length}</div>
          </ButtonTertiary>
        </ActionBar>
      </Post>

      <CommentList>
        {Object.values(postState.replies)
          .filter(r => !r.parentId)
          .map(firstLevelReply => (
            <div key={firstLevelReply.id}>
              <CommentListItem className="levelone">
                <Comment className="levelone">
                  <CommenterNameplateWrapper>
                    <CommenterNamePlate
                      displayName={firstLevelReply.author?.displayName}
                      userHandle={firstLevelReply.author?.username}
                      avatar={firstLevelReply.author?.profile?.avatar}
                      date={getLocaleDateTimeString(firstLevelReply.createdAt)}
                    />
                  </CommenterNameplateWrapper>
                  <CommentActionButtonGroup className="actions">
                    <ButtonMinor
                      data-comment-id={firstLevelReply.id}
                      type="submit"
                      onClick={toggleCommentReply}
                    >
                      {commentButtonState.replyButtons[firstLevelReply.id]
                        ? 'Cancel Reply'
                        : 'Reply'}
                    </ButtonMinor>
                    {userContext.user.id === firstLevelReply.author?.id && (
                      <ButtonMinor
                        data-comment-id={firstLevelReply.id}
                        type="submit"
                        onClick={e => {
                          toggleCommentEdit(e, firstLevelReply.content);
                        }}
                      >
                        {commentButtonState.editButtons[firstLevelReply.id]
                          ? 'Cancel Edit'
                          : 'Edit'}
                      </ButtonMinor>
                    )}
                  </CommentActionButtonGroup>

                  {commentButtonState.editButtons[firstLevelReply.id] ? (
                    <Reply>
                      <MarkdownEditor
                        content={commentInputs.edits[firstLevelReply.id]}
                        handleContentChange={getContent => {
                          handleCommentEditsChange(
                            getContent(),
                            firstLevelReply.id
                          );
                        }}
                      ></MarkdownEditor>
                      <ButtonMinor
                        data-comment-id={firstLevelReply.id}
                        type="submit"
                        onClick={handleCommentEditSubmit}
                        disabled={
                          !canSubmit(commentInputs.edits[firstLevelReply.id])
                        }
                      >
                        <Icon className="icon-edit"></Icon>
                        Update
                      </ButtonMinor>
                    </Reply>
                  ) : (
                    <CommentContent>
                      <MarkdownEditor
                        content={firstLevelReply.content}
                        readOnly={true}
                      ></MarkdownEditor>
                    </CommentContent>
                  )}

                  {commentButtonState.replyButtons[firstLevelReply.id] && (
                    <Reply>
                      <MarkdownEditor
                        content={commentInputs.replies[firstLevelReply.id]}
                        handleContentChange={getContent => {
                          handleCommentRepliesChange(
                            getContent(),
                            firstLevelReply.id
                          );
                        }}
                      ></MarkdownEditor>
                      <ButtonMinor
                        data-comment-id={firstLevelReply.id}
                        type="submit"
                        onClick={handleCommentReplySubmit}
                        disabled={
                          !canSubmit(commentInputs.replies[firstLevelReply.id])
                        }
                      >
                        <Icon className="icon-comment"></Icon>
                        Reply
                      </ButtonMinor>
                    </Reply>
                  )}
                  <ActionBar>
                    <ButtonTertiary
                      onClick={() => handleStarClick(firstLevelReply.id)}
                    >
                      <Icon className="icon-star"></Icon>
                      <div>{firstLevelReply.stars.length}</div>
                    </ButtonTertiary>
                  </ActionBar>
                </Comment>
              </CommentListItem>

              {firstLevelReply.children.map(childId => {
                const secondLevelReply = postState.replies[childId];
                if (!secondLevelReply) return <></>;
                return (
                  <div key={secondLevelReply.id}>
                    <CommentListItem className="leveltwo">
                      <Comment className="leveltwo">
                        <CommenterNameplateWrapper>
                          <CommenterNamePlate
                            displayName={secondLevelReply.author?.displayName}
                            userHandle={secondLevelReply.author?.username}
                            avatar={secondLevelReply.author?.profile?.avatar}
                            date={getLocaleDateTimeString(
                              secondLevelReply.createdAt
                            )}
                          />
                        </CommenterNameplateWrapper>
                        <CommentActionButtonGroup className="actions">
                          <ButtonMinor
                            data-comment-id={secondLevelReply.id}
                            type="submit"
                            onClick={toggleCommentReply}
                          >
                            {commentButtonState.replyButtons[
                              secondLevelReply.id
                            ]
                              ? 'Cancel Reply'
                              : 'Reply'}
                          </ButtonMinor>
                          {userContext.user.id ===
                            secondLevelReply.author?.id && (
                            <ButtonMinor
                              data-comment-id={secondLevelReply.id}
                              type="submit"
                              onClick={e => {
                                toggleCommentEdit(e, secondLevelReply.content);
                              }}
                            >
                              {commentButtonState.editButtons[
                                secondLevelReply.id
                              ]
                                ? 'Cancel Edit'
                                : 'Edit'}
                            </ButtonMinor>
                          )}
                        </CommentActionButtonGroup>

                        {commentButtonState.editButtons[secondLevelReply.id] ? (
                          <Reply>
                            <MarkdownEditor
                              content={commentInputs.edits[secondLevelReply.id]}
                              handleContentChange={getContent => {
                                handleCommentEditsChange(
                                  getContent(),
                                  secondLevelReply.id
                                );
                              }}
                            ></MarkdownEditor>
                            <ButtonMinor
                              data-comment-id={secondLevelReply.id}
                              type="submit"
                              onClick={handleCommentEditSubmit}
                              disabled={
                                !canSubmit(
                                  commentInputs.edits[secondLevelReply.id]
                                )
                              }
                            >
                              <Icon className="icon-edit"></Icon>
                              Update
                            </ButtonMinor>
                          </Reply>
                        ) : (
                          <CommentContent>
                            <MarkdownEditor
                              content={secondLevelReply.content}
                              readOnly={true}
                            ></MarkdownEditor>
                          </CommentContent>
                        )}

                        {commentButtonState.replyButtons[
                          secondLevelReply.id
                        ] && (
                          <Reply>
                            <MarkdownEditor
                              content={
                                commentInputs.replies[secondLevelReply.id]
                              }
                              handleContentChange={getContent => {
                                handleCommentRepliesChange(
                                  getContent(),
                                  secondLevelReply.id
                                );
                              }}
                            ></MarkdownEditor>
                            <ButtonMinor
                              data-comment-id={secondLevelReply.id}
                              type="submit"
                              onClick={handleCommentReplySubmit}
                              disabled={
                                !canSubmit(
                                  commentInputs.replies[secondLevelReply.id]
                                )
                              }
                            >
                              <Icon className="icon-comment"></Icon>
                              Reply
                            </ButtonMinor>
                          </Reply>
                        )}
                        <ActionBar>
                          <ButtonTertiary
                            onClick={() => handleStarClick(secondLevelReply.id)}
                          >
                            <Icon className="icon-star"></Icon>
                            <div>{secondLevelReply.stars.length}</div>
                          </ButtonTertiary>
                        </ActionBar>
                      </Comment>
                    </CommentListItem>

                    {secondLevelReply.children.map(childId => {
                      const thirdLevelReply = postState.replies[childId];
                      if (!thirdLevelReply) return <></>;
                      return (
                        <div key={thirdLevelReply.id}>
                          <CommentListItem className="levelthree">
                            <Comment className="levelthree">
                              <CommenterNameplateWrapper>
                                <CommenterNamePlate
                                  displayName={
                                    thirdLevelReply.author?.displayName
                                  }
                                  userHandle={thirdLevelReply.author?.username}
                                  avatar={
                                    thirdLevelReply.author?.profile?.avatar
                                  }
                                  date={getLocaleDateTimeString(
                                    thirdLevelReply.createdAt
                                  )}
                                />
                              </CommenterNameplateWrapper>
                              <CommentActionButtonGroup className="actions">
                                {userContext.user.id ===
                                  thirdLevelReply.author?.id && (
                                  <ButtonMinor
                                    data-comment-id={thirdLevelReply.id}
                                    type="submit"
                                    onClick={e => {
                                      toggleCommentEdit(
                                        e,
                                        thirdLevelReply.content
                                      );
                                    }}
                                  >
                                    {commentButtonState.editButtons[
                                      thirdLevelReply.id
                                    ]
                                      ? 'Cancel Edit'
                                      : 'Edit'}
                                  </ButtonMinor>
                                )}
                              </CommentActionButtonGroup>

                              {commentButtonState.editButtons[
                                thirdLevelReply.id
                              ] ? (
                                <Reply>
                                  <MarkdownEditor
                                    content={
                                      commentInputs.edits[thirdLevelReply.id]
                                    }
                                    handleContentChange={getContent => {
                                      handleCommentEditsChange(
                                        getContent(),
                                        thirdLevelReply.id
                                      );
                                    }}
                                  ></MarkdownEditor>
                                  <ButtonMinor
                                    data-comment-id={thirdLevelReply.id}
                                    type="submit"
                                    onClick={handleCommentEditSubmit}
                                    disabled={
                                      !canSubmit(
                                        commentInputs.edits[thirdLevelReply.id]
                                      )
                                    }
                                  >
                                    <Icon className="icon-edit"></Icon>
                                    Update
                                  </ButtonMinor>
                                </Reply>
                              ) : (
                                <CommentContent>
                                  <MarkdownEditor
                                    content={thirdLevelReply.content}
                                    readOnly={true}
                                  ></MarkdownEditor>
                                </CommentContent>
                              )}
                              <ActionBar>
                                <ButtonTertiary
                                  onClick={() =>
                                    handleStarClick(thirdLevelReply.id)
                                  }
                                >
                                  <Icon className="icon-star"></Icon>
                                  <div>{thirdLevelReply.stars.length}</div>
                                </ButtonTertiary>
                              </ActionBar>
                            </Comment>
                          </CommentListItem>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
      </CommentList>
      <Reply>
        <MarkdownEditor
          content={reply}
          handleContentChange={handleReplyChange}
        ></MarkdownEditor>
        <ButtonMinor
          type="submit"
          onClick={handleCommentSubmit}
          disabled={!canSubmit(reply)}
        >
          <Icon className="icon-comment"></Icon>
          Reply
        </ButtonMinor>
      </Reply>
    </PageWrapper>
  );
}
