import React from 'react';
import { useState } from 'react';
import { Chat1 as Chat } from '@styled-icons/remix-line';
import { Reply, ReplyActionBar } from 'pageUtils/post/styles';
import { ButtonWireframe } from 'components/Button';
import MarkdownEditor from 'components/MarkdownEditor';
import { fetcher } from 'utils/fetch';

export default function CommentBox({
  postId,
  commentId,
  closeCommentBoxCallback,
  updateCommentTreeCallback,
  placeholder,
}) {
  const [isLoading, setLoading] = useState(false);
  const [editorKey, setEditorKey] = React.useReducer(c => c + 1, 9000);
  const [commentValue, setCommentValue] = useState('');

  const commentValueChange = getContent => {
    setCommentValue(getContent());
  };

  const isCommentValueEmpty = () => {
    return commentValue.trim() === '';
  };

  const submitComment = async e => {
    if (isCommentValueEmpty()) {
      return;
    }

    try {
      setLoading(true);
      const result = await fetcher('POST', '/api/post/create-reply', {
        content: commentValue,
        postId: Number(postId),
        parentId: Number(commentId),
      });

      setLoading(false);

      if (result.data) {
        updateCommentTreeCallback(result.data);
        closeCommentBoxCallback(commentId, e);
      } else {
        console.error(e);
      }
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };

  const handleKeyPress = e => {
    if (e.code === 'Enter' && e.metaKey) {
      submitComment(e);
    }
  };

  return (
    <Reply subcomment>
      <MarkdownEditor
        placeholder={placeholder}
        componentKey={editorKey}
        handleContentChange={commentValueChange}
        onKeyDown={handleKeyPress}
      ></MarkdownEditor>
      <ReplyActionBar>
        <ButtonWireframe
          className={'with-shortcut'}
          type="submit"
          onClick={submitComment}
          disabled={isCommentValueEmpty()}
        >
          <Chat />
          <span>Reply</span>
          <span className="shortcut">⌘ Enter</span>
        </ButtonWireframe>
        <ButtonWireframe onClick={e => closeCommentBoxCallback(commentId, e)}>
          Cancel
        </ButtonWireframe>
      </ReplyActionBar>
    </Reply>
  );
}
