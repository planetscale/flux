import React from 'react';
import useSWR, { mutate } from 'swr';
import AuthorNamePlate from 'components/NamePlate/AuthorNamePlate';
import CommenterNamePlate from 'components/NamePlate/CommenterNamePlate';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Star as RemixLineStar,
  Chat1 as Chat,
  Pencil,
} from '@styled-icons/remix-line';
import { Star as RemixFillStar } from '@styled-icons/remix-fill';
import {
  PageWrapper,
  PostMetadata,
  DateTime,
  Title,
  Content,
  CommentList,
  CommentListItem,
  CommentWrapper,
  Comment,
  ReplyContainer,
  Reply,
  Post,
  CommentContent,
  ActionBar,
  ReplyActionBar,
} from 'pageUtils/post/styles';
import { ButtonSquished, ButtonWireframe } from 'components/Button';
import { useUserContext } from 'state/user';
import { getLocaleDateTimeString } from 'utils/dateTime';
import { useImmer } from 'use-immer';
import { original } from 'immer';
import styled from '@emotion/styled';
import MarkdownEditor from 'components/MarkdownEditor';
import ReactMarkdown from 'react-markdown';
import { media } from 'pageUtils/post/theme';
import { fetcher } from 'utils/fetch';
import CustomLayout from 'components/CustomLayout';
import * as Tooltip from '@radix-ui/react-tooltip';
import CommentBox from 'components/CommentBox';

const Meta = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: var(--text-secondary);

  ${media.phone`
    flex-direction: column-reverse;
    align-items: flex-start;
  `}
`;

const MetaData = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: var(--fs-base-minus-1);
`;

const MetaActions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > *:not(:last-child) {
    margin-right: 0.5em;
  }
`;

const CommentContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CommentContainer = styled.div`
  width: 80ch;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  ${media.phone`
    padding: 42px;
    width: 100%;
  `}
`;

const StyledContent = styled(Tooltip.Content)`
  padding: 10px;
  margin: 0;
  list-style-type: none;
  border-radius: 10px;
  font-size: var(--fs-base-minus-1);
  background-color: var(--text-primary);
  color: var(--bg-primary);
`;

const StyledArrow = styled(Tooltip.Arrow)`
  fill: var(--text-primary);
`;

export default function PostPage() {
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);

  const [commentButtonState, setCommentButtonState] = useImmer({
    replyButtons: {},
    editButtons: {},
  });
  const [postEditState, setPostEditState] = useImmer({
    content: '',
    isEditing: false,
  });

  const [postState, updatePostState] = useImmer({
    replies: {},
    stars: [],
  });

  const [reply, setReply] = useState('');
  const [replyKey, setReplyKey] = React.useReducer(c => c + 1, 0);

  const [commentInputs, setCommentInputs] = useImmer({
    edits: {},
  });

  const userContext = useUserContext();

  const { data: postData } = useSWR(
    ['/api/post/get-post', Number(router.query?.id)],
    (url, id) => fetcher('GET', url, { id }),
    {
      onSuccess: ({ data }) => {
        mutate(['/api/get-notifications']);
        setPostEditState(draft => {
          draft.content = data.content;
        });
        updatePostState(draft => {
          draft.stars = data.stars;
        });
      },
    }
  );

  useSWR(
    ['/api/post/get-replies', Number(router.query?.id)],
    (url, postId) => fetcher('GET', url, { postId }),
    {
      onSuccess: ({ data }) => {
        // Replies come back in a flat array.  We want a flat map so we can do quick look ups and mutations. Each reply also contains a
        // 'children' property which holds the ids of all direct children of the reply.
        const replyMap = {};
        data.forEach(reply => {
          // Because we can expect the replies to be ordered by id, a child reply will always come after its parent
          // so we can get away with this logic.
          if (reply.parentId && replyMap[reply.parentId]) {
            replyMap[reply.parentId].children.push(reply.id);
          }
          replyMap[reply.id] = { ...reply, children: [] };
        });

        updatePostState(draft => {
          draft.replies = replyMap;
        });
      },
    }
  );

  const {
    authorId,
    authorName,
    authorUsername,
    avatar,
    content,
    createdAt,
    title,
  } = postData?.data || {};

  const handleReplyChange = content => {
    setReply(content);
  };

  const handleCommentSubmit = async () => {
    if (!reply?.trim()) {
      return;
    }

    try {
      setLoading(true);
      const result = await fetcher('POST', '/api/post/create-reply', {
        content: reply.trim(),
        postId: Number(router.query.id),
      });
      setLoading(false);
      if (result.data) {
        setReplyKey();
        updateReplyMap(result.data);
      } else {
        console.error(e);
      }
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };

  async function handleStarClick(replyId) {
    // We will optimistically update the UI star state before the request finishes for better UX.
    // If the request fails we can revert the change to state.
    const userId = userContext.user.id;
    const displayName = userContext.user.displayName;
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
                { id: null, user: { id: userId, displayName } },
              ],
            },
          };
        } else {
          draft.stars = [
            ...postState.stars,
            { id: null, user: { id: userId, displayName } },
          ];
        }
      });

      try {
        setLoading(true);
        const result = await fetcher('POST', `/api/post/add-star`, {
          postId: Number(router.query?.id),
          replyId: Number(replyId) || undefined,
        });
        setLoading(false);

        if (result.error) {
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
                      id: result.id,
                    },
                  ],
                },
              };
            } else {
              const stars = original(draft.stars);
              draft.stars = [
                ...stars.slice(0, -1),
                { ...stars.slice(-1)[0], id: result.id },
              ];
            }
          });
        }
      } catch (e) {
        setLoading(false);
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
        setLoading(true);
        const result = await fetcher('POST', `/api/post/remove-star`, {
          id: match.id,
        });
        setLoading(false);
        if (!result) {
          undoStarDelete(backupStars, replyId);
        }
      } catch (e) {
        setLoading(false);
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

  const toggleCommentReply = (commentId, e) => {
    setCommentButtonState(draft => {
      draft.replyButtons[commentId] = !commentButtonState.replyButtons[
        commentId
      ];
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

  const handleCommentEditSubmit = async (e, commentId) => {
    const id = commentId ? commentId : e.target.dataset.commentId;
    if (!commentInputs.edits[id]?.trim()) {
      return;
    }

    try {
      setLoading(true);
      const result = await fetcher('POST', '/api/post/update-reply', {
        content: commentInputs.edits[id]?.trim(),
        replyId: Number(id),
      });
      setLoading(false);

      if (result.data) {
        updateReplyMap(result.data);
        setCommentInputs(draft => {
          draft.edits[id] = '';
        });
        setCommentButtonState(draft => {
          draft.editButtons[id] = !commentButtonState.editButtons[id];
        });
      } else {
        console.error(e);
      }
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };

  const togglePostEdit = () => {
    setPostEditState(draft => {
      draft.isEditing = !postEditState.isEditing;
    });
  };

  const handlePostContentChange = getContent => {
    setPostEditState(draft => {
      draft.content = getContent();
    });
  };

  const handlePostEditSubmit = async () => {
    try {
      setLoading(true);
      const result = await fetcher('POST', '/api/post/update-post', {
        content: postEditState.content,
        postId: Number(router.query.id),
      });
      setLoading(false);
      if (!result) {
        console.error(e);
      } else {
        setPostEditState(draft => {
          draft.isEditing = !postEditState.isEditing;
        });
      }
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };

  const updateReplyMap = node => {
    const matchedNode = postState.replies[node.id] || {};

    updatePostState(draft => {
      draft.replies[node.id] = {
        replies: {},
        stars: [],
        children: [],
        ...matchedNode,
        ...node,
      };

      if (Object.keys(matchedNode) == 0 && node.parentId) {
        draft.replies[node.parentId].children.push(node.id);
      }
    });
  };

  const canSubmit = str => {
    if (!str || isLoading) return false;
    return str.trim().match(/[0-9a-zA-Z]+/);
  };

  const handleKeyPressSubmit = (e, callback, canSubmit, commentId) => {
    if (e.code === 'Enter' && e.metaKey && canSubmit) {
      if (commentId) {
        callback(e, commentId);
      } else {
        callback();
      }
    }
  };

  // Resursively render comments and their replies (and sub replies, etc)
  const renderComment = (comment, level) => {
    const hasStarred =
      comment.stars.findIndex(star => star.user.id === userContext.user.id) >=
      0;

    return (
      <CommentListItem>
        <CommentWrapper>
          <Comment className={`level${level}`}>
            <CommenterNamePlate
              displayName={comment.author?.displayName}
              userHandle={comment.author?.username}
              avatar={comment.author?.profile?.avatar}
              date={getLocaleDateTimeString(comment.createdAt)}
            />

            <CommentContent>
              <ReactMarkdown>{comment.content}</ReactMarkdown>
            </CommentContent>

            <ActionBar comment>
              <Tooltip.Root>
                <Tooltip.Trigger
                  as={ButtonSquished}
                  color="var(--bg-secondary)"
                  textColor="white"
                  onClick={() => handleStarClick(comment.id)}
                  disabled={isLoading}
                  className={hasStarred ? 'selected' : ''}
                >
                  {hasStarred ? <RemixFillStar /> : <RemixLineStar />}
                  <span>{comment.stars.length}</span>
                </Tooltip.Trigger>
                {comment.stars.length > 0 && (
                  <StyledContent as="ul">
                    {comment.stars.map(star => (
                      <li key={star.user.id}>{star.user.displayName}</li>
                    ))}
                    <StyledArrow />
                  </StyledContent>
                )}
              </Tooltip.Root>
              {level < 2 && !commentButtonState.replyButtons[comment.id] && (
                <ButtonSquished
                  type="submit"
                  onClick={e => toggleCommentReply(comment.id, e)}
                >
                  <Chat />
                  <span>Reply</span>
                </ButtonSquished>
              )}
            </ActionBar>

            {commentButtonState.replyButtons[comment.id] && (
              <CommentBox
                postId={router.query?.id}
                commentId={comment.id}
                closeCommentBoxCallback={toggleCommentReply}
                updateCommentTreeCallback={updateReplyMap}
                placeholder={'Comment'}
              ></CommentBox>
            )}

            {/* {commentButtonState.editButtons[comment.id] ? (
              <Reply>
                <MarkdownEditor
                  placeholder="Comment"
                  content={commentInputs.edits[comment.id]}
                  handleContentChange={getContent => {
                    handleCommentEditsChange(getContent(), comment.id);
                  }}
                  onKeyDown={e => {
                    handleKeyPressSubmit(
                      e,
                      handleCommentEditSubmit,
                      canSubmit(commentInputs.edits[comment.id]),
                      comment.id
                    );
                  }}
                ></MarkdownEditor>
                <ButtonWireframe
                  data-comment-id={comment.id}
                  type="submit"
                  onClick={handleCommentEditSubmit}
                  disabled={!canSubmit(commentInputs.edits[comment.id])}
                >
                  <Pencil />
                  <span>Update</span>
                </ButtonWireframe>
              </Reply>
            ) : (
              <CommentContent>
                <MarkdownEditor
                  placeholder="Comment"
                  content={comment.content}
                  readOnly={true}
                ></MarkdownEditor>
              </CommentContent>
            )} */}
          </Comment>
        </CommentWrapper>

        {comment.children.length > 0 && (
          <CommentList className={`level${level}`}>
            {comment.children.map(childId => {
              const match = postState.replies[childId];
              if (!match) return <></>;
              return (
                <React.Fragment key={match.id}>
                  {renderComment(match, level + 1)}
                </React.Fragment>
              );
            })}
          </CommentList>
        )}
      </CommentListItem>
    );
  };

  // TODO: add better loading indicator, now there's literally none
  if (!postData) {
    return <></>;
  }

  const hasStarred =
    postState.stars.findIndex(star => star.user.id === userContext.user.id) >=
    0;

  return (
    <CustomLayout title={title}>
      <PageWrapper>
        <Post>
          <PostMetadata>
            <Meta>
              <MetaData>
                <DateTime>{getLocaleDateTimeString(createdAt)}</DateTime>
              </MetaData>
            </Meta>
            <Title>{title}</Title>
            <AuthorNamePlate
              displayName={authorName}
              userHandle={authorUsername}
              avatar={avatar}
            />
          </PostMetadata>

          <Content>
            {postEditState.isEditing ? (
              <>
                <MarkdownEditor
                  content={postEditState.content}
                  handleContentChange={handlePostContentChange}
                  onKeyDown={e => {
                    handleKeyPressSubmit(
                      e,
                      handlePostEditSubmit,
                      canSubmit(postEditState.content)
                    );
                  }}
                ></MarkdownEditor>
              </>
            ) : (
              <MarkdownEditor
                content={content}
                handleContentChange={handlePostContentChange}
                readOnly={!postEditState.isEditing}
              ></MarkdownEditor>
            )}
          </Content>

          <ActionBar className={'space-between'}>
            <Tooltip.Root>
              <Tooltip.Trigger
                as={ButtonSquished}
                onClick={() => handleStarClick()}
                disabled={isLoading}
                className={hasStarred ? 'selected' : ''}
              >
                {hasStarred ? <RemixFillStar /> : <RemixLineStar />}
                <span>{postState.stars.length}</span>
              </Tooltip.Trigger>
              {postState.stars.length > 0 && (
                <StyledContent as="ul">
                  {postState.stars.map(star => (
                    <li key={star.user.id}>{star.user.displayName}</li>
                  ))}
                  <StyledArrow />
                </StyledContent>
              )}
            </Tooltip.Root>
            <MetaActions>
              {userContext.user.id === authorId && (
                <React.Fragment>
                  {postEditState.isEditing ? (
                    <ButtonSquished
                      type="submit"
                      onClick={handlePostEditSubmit}
                      disabled={!canSubmit(postEditState.content)}
                    >
                      <Pencil />
                      <span>Update</span>
                    </ButtonSquished>
                  ) : null}
                  <ButtonSquished type="submit" onClick={togglePostEdit}>
                    {postEditState.isEditing ? 'Cancel Edit' : 'Edit Post'}
                  </ButtonSquished>
                </React.Fragment>
              )}
            </MetaActions>
          </ActionBar>
        </Post>
      </PageWrapper>

      <CommentContainerWrapper>
        {Object.keys(postState.replies).length > 0 && (
          <CommentContainer>
            <CommentList main>
              {Object.values(postState.replies)
                .filter(r => !r.parentId)
                .map(firstLevelReply => (
                  <React.Fragment key={firstLevelReply.id}>
                    {renderComment(firstLevelReply, 0)}
                  </React.Fragment>
                ))}
            </CommentList>
          </CommentContainer>
        )}
        <ReplyContainer>
          <Reply>
            <MarkdownEditor
              placeholder="Comment"
              componentKey={replyKey}
              handleContentChange={handleReplyChange}
              onKeyDown={e => {
                handleKeyPressSubmit(e, handleCommentSubmit, canSubmit(reply));
              }}
            ></MarkdownEditor>
            <ReplyActionBar>
              <ButtonWireframe
                className={'with-shortcut'}
                type="submit"
                onClick={handleCommentSubmit}
                disabled={!canSubmit(reply)}
              >
                <Chat />
                <span>Reply</span>
                <span className="shortcut">⌘ Enter</span>
              </ButtonWireframe>
            </ReplyActionBar>
          </Reply>
        </ReplyContainer>
      </CommentContainerWrapper>
    </CustomLayout>
  );
}
