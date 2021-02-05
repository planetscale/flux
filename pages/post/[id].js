import React from 'react';
import useSWR from 'swr';
import { defaultFetchHeaders } from 'utils/auth/clientConfig';
import AuthorNamePlate from 'components/NamePlate/AuthorNamePlate';
import CommenterNamePlate from 'components/NamePlate/CommenterNamePlate';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Icon } from 'pageUtils/post/atoms';
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
  Reply,
  Post,
  CommentContent,
  ActionBar,
  CommenterNameplateWrapper,
  CommentActionButtonGroup,
} from 'pageUtils/post/styles';
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

const fetcher = async (url, auth, params) => {
  const searchParams = new URLSearchParams(params);
  const response = await fetch(`${url}?${searchParams}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Authorization: auth,
    },
  });
  return response.json();
};

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

  const [commentInputs, setCommentInputs] = useImmer({
    replies: {},
    edits: {},
  });
  const userContext = useUserContext();

  const { data: postData } = useSWR(
    [
      '/api/post/get-post',
      defaultFetchHeaders.authorization,
      Number(router.query?.id),
    ],
    (url, auth, id) => fetcher(url, auth, { id }),
    {
      // FIXME: Review these settings, having swr refresh on it's own was interfering with our predictive state management for likes
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
      onSuccess: ({ data }) => {
        setPostEditState(draft => {
          draft.content = data.content;
        });
        updatePostState(draft => {
          draft.stars = data.stars.map(s => ({
            id: s.starId,
            user: {
              id: s.userId,
            },
          }));
        });
      },
    }
  );

  useSWR(
    [
      '/api/post/get-replies',
      defaultFetchHeaders.authorization,
      Number(router.query?.id),
    ],
    (url, auth, postId) => fetcher(url, auth, { postId }),
    {
      // FIXME: Review these settings, having swr refresh on it's own was interfering with our predictive state management for likes
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
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
    tagName,
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
      const res = await fetch('/api/post/create-reply', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          Authorization: defaultFetchHeaders.authorization,
        },
        body: JSON.stringify({
          content: reply.trim(),
          postId: Number(router.query.id),
        }),
      });
      const result = await res.json();
      setLoading(false);
      if (result.data) {
        setReply('');
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
        setLoading(true);
        const res = await fetch(`/api/post/add-star`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: defaultFetchHeaders.authorization,
          },
          body: JSON.stringify({
            postId: Number(router.query?.id),
            replyId: Number(replyId) || undefined,
          }),
        });
        const result = await res.json();
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
        const res = await fetch(`/api/post/remove-star`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: defaultFetchHeaders.authorization,
          },
          body: JSON.stringify({
            id: match.id,
          }),
        });
        const result = await res.json();
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
      setLoading(true);
      const res = await fetch('/api/post/update-reply', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          Authorization: defaultFetchHeaders.authorization,
        },
        body: JSON.stringify({
          content: commentInputs.edits[e.target.dataset.commentId]?.trim(),
          replyId: Number(e.target.dataset.commentId),
        }),
      });
      const result = await res.json();
      setLoading(false);

      if (result.data) {
        updateReplyMap(result.data);
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
      setLoading(false);
      console.error(e);
    }
  };

  const handleCommentReplySubmit = async e => {
    if (!commentInputs.replies[e.target.dataset.commentId]?.trim()) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/post/create-reply', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          Authorization: defaultFetchHeaders.authorization,
        },
        body: JSON.stringify({
          content: commentInputs.replies[e.target.dataset.commentId]?.trim(),
          postId: Number(router.query.id),
          parentId: Number(e.target.dataset.commentId),
        }),
      });
      const result = await res.json();
      setLoading(false);
      if (result.data) {
        updateReplyMap(result.data);
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
      const res = await fetch('/api/post/update-post', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          Authorization: defaultFetchHeaders.authorization,
        },
        body: JSON.stringify({
          content: postEditState.content,
          postId: Number(router.query.id),
        }),
      });
      const result = await res.json();
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

  // Resursively render comments and their replies (and sub replies, etc)
  const renderComment = (comment, level) => {
    return (
      <CommentListItem>
        <CommentWrapper>
          <Comment className={`level${level}`}>
            <CommenterNameplateWrapper>
              <CommenterNamePlate
                displayName={comment.author?.displayName}
                userHandle={comment.author?.username}
                avatar={comment.author?.profile?.avatar}
                date={getLocaleDateTimeString(comment.createdAt)}
              />
            </CommenterNameplateWrapper>
            <CommentActionButtonGroup className="actions">
              {level < 2 && (
                <ButtonMinor
                  data-comment-id={comment.id}
                  type="submit"
                  onClick={toggleCommentReply}
                >
                  {commentButtonState.replyButtons[comment.id]
                    ? 'Cancel Reply'
                    : 'Reply'}
                </ButtonMinor>
              )}
              {userContext.user.id === comment.author?.id && (
                <ButtonMinor
                  data-comment-id={comment.id}
                  type="submit"
                  onClick={e => {
                    toggleCommentEdit(e, comment.content);
                  }}
                >
                  {commentButtonState.editButtons[comment.id]
                    ? 'Cancel Edit'
                    : 'Edit'}
                </ButtonMinor>
              )}
            </CommentActionButtonGroup>

            {commentButtonState.editButtons[comment.id] ? (
              <Reply>
                <MarkdownEditor
                  content={commentInputs.edits[comment.id]}
                  handleContentChange={getContent => {
                    handleCommentEditsChange(getContent(), comment.id);
                  }}
                ></MarkdownEditor>
                <ButtonMinor
                  data-comment-id={comment.id}
                  type="submit"
                  onClick={handleCommentEditSubmit}
                  disabled={!canSubmit(commentInputs.edits[comment.id])}
                >
                  <Icon className="icon-edit"></Icon>
                  Update
                </ButtonMinor>
              </Reply>
            ) : (
              <CommentContent>
                <MarkdownEditor
                  content={comment.content}
                  readOnly={true}
                ></MarkdownEditor>
              </CommentContent>
            )}

            {commentButtonState.replyButtons[comment.id] && (
              <Reply>
                <MarkdownEditor
                  content={commentInputs.replies[comment.id]}
                  handleContentChange={getContent => {
                    handleCommentRepliesChange(getContent(), comment.id);
                  }}
                ></MarkdownEditor>
                <ButtonMinor
                  data-comment-id={comment.id}
                  type="submit"
                  onClick={handleCommentReplySubmit}
                  disabled={!canSubmit(commentInputs.replies[comment.id])}
                >
                  <Icon className="icon-comment"></Icon>
                  Reply
                </ButtonMinor>
              </Reply>
            )}
            <ActionBar>
              <ButtonTertiary
                onClick={() => handleStarClick(comment.id)}
                disabled={isLoading}
              >
                <Icon className="icon-star"></Icon>
                <div>{comment.stars.length}</div>
              </ButtonTertiary>
            </ActionBar>
          </Comment>
        </CommentWrapper>

        {comment.children.length > 0 && (
          <CommentList>
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

  return (
    <PageWrapper>
      <Post>
        <PostMetadata>
          <Meta>
            <MetaData>
              <DateTime>{getLocaleDateTimeString(createdAt)}</DateTime>
              <div>&nbsp; &middot; &nbsp;</div>
              <div>#{tagName}</div>
            </MetaData>
            <MetaActions>
              {userContext.user.id === authorId && (
                <ButtonMinor type="submit" onClick={togglePostEdit}>
                  {postEditState.isEditing ? 'Cancel Edit' : 'Edit Post'}
                </ButtonMinor>
              )}
            </MetaActions>
          </Meta>
          <Title>{title}</Title>
          <AuthorNamePlate
            displayName={authorName}
            userHandle={authorUsername}
            avatar={avatar}
          />
        </PostMetadata>

        <Content>
          <MarkdownEditor
            content={content}
            handleContentChange={handlePostContentChange}
            readOnly={!postEditState.isEditing}
          ></MarkdownEditor>
          {postEditState.isEditing && (
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
          )}
        </Content>
        <ActionBar>
          <ButtonTertiary
            onClick={() => handleStarClick()}
            disabled={isLoading}
          >
            <Icon className="icon-star"></Icon>
            <div>{postState.stars.length}</div>
          </ButtonTertiary>
        </ActionBar>
      </Post>

      <CommentList>
        {Object.values(postState.replies)
          .filter(r => !r.parentId)
          .map(firstLevelReply => (
            <React.Fragment key={firstLevelReply.id}>
              {renderComment(firstLevelReply, 0)}
            </React.Fragment>
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
