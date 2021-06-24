import styled from '@emotion/styled';
import { ButtonWireframe } from 'components/Button';
import MarkdownEditor from 'components/MarkdownEditor';
import { useRouter } from 'next/router';
import { useUserContext } from 'state/user';
import { useImmer } from 'use-immer';
import { Article, AlarmWarning } from '@styled-icons/remix-line';
import { PageWrapper, Post } from 'pageUtils/post/styles';
import { media } from 'pageUtils/post/theme';
import { fetcher } from 'utils/fetch';
import CustomLayout from 'components/CustomLayout';

const Time = styled.div`
  color: var(--text-primary);
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-primary);
  margin: 0 -2em;
  padding: 0 2em 2em;

  ${media.phone`
    flex-direction: column;
    align-items: flex-start;
  `}
`;

const PostDate = styled.div`
  ${media.phone`
    margin-bottom: 1em;
  `}
`;

const TitleInputWrapper = styled.div`
  position: relative;
  display: flex;
  margin: 0 -2em;
  padding: 2em;
  border-bottom: 1px solid var(--border-primary);

  svg {
    position: absolute;
    width: 24px;
    height: 24px;
    left: -3em;
    top: 40%;
    color: rgba(var(--red-500), 0.8);
  }

  &:hover,
  &:focus-within {
    background-color: var(--bg-secondary);
  }

  &.invalid {
    background-color: rgba(var(--red-500), 0.02);
  }
`;

const TitleInputBase = `
  outline: 0;
  border: 0;
  resize: none;
  word-break: break-word;
  overflow: hidden;
  width: 100%;
  color: var(--text-primary);
  background-color: unset;
  padding-bottom: 4px;

  ::placeholder {
    color: var(--border-secondary);
  }
`;

const TitleInput = styled.input`
  ${TitleInputBase}
  font-size: 40px;
  line-height: 58px;
  font-weight: 700;
`;

const SubtitleInput = styled.input`
  ${TitleInputBase}
  font-size: var(--fs-base-plus-1);
  line-height: 30px;
  word-break: break-word;
`;

const ActionItems = styled.div`
  display: flex;
  padding-top: 2em;

  button {
    margin: 0 1em 0 0;
  }
`;

const EditorWrapper = styled.div`
  padding: 2em 0;
  height: fit-content;
  position: relative;
  display: flex;
  margin: 0 -2em;
  padding: 2em;
  border-bottom: 1px solid var(--border-primary);

  &:hover,
  &:focus-within {
    background-color: var(--bg-secondary);
  }
`;

const dateTimeOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

const TITLE_MAX_LENGTH = 70;

export default function NewPost() {
  const router = useRouter();
  const userContext = useUserContext();
  const [state, updateState] = useImmer({
    dateTime: new Date().toLocaleDateString(
      navigator.language,
      dateTimeOptions
    ),
    title: {
      value: '',
      hasFocused: false,
    },
    subtitle: {
      value: '',
      hasFocused: false,
    },
    content: '',
    disableSubmit: false,
  });

  const handleTitleChange = (e, field) => {
    let title = e.target;
    title.style.height = title.scrollHeight + 'px';
    updateState(draft => {
      draft[field].value = e.target.value;
    });
  };

  const canSubmitPost = () => {
    return (
      state.title?.value.trim() &&
      state.content?.trim() &&
      state.content?.trim().match(/[0-9a-zA-Z]+/) &&
      !state.disableSubmit
    );
  };

  const handlePostSubmit = async () => {
    if (!canSubmitPost()) {
      return;
    }

    try {
      updateState(draft => {
        draft.disableSubmit = true;
      });

      const resp = await fetcher('POST', '/api/create-post', {
        title: state.title.value,
        summary: state.subtitle.value,
        content: state.content,
      });

      if (!resp?.error && resp?.data.id) {
        router.push(`/post/${resp.data.id}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  const handleContentChange = getContent => {
    updateState(draft => {
      draft.content = getContent();
    });
  };

  const handleBlur = key => {
    updateState(draft => {
      draft[key].hasFocused = true;
    });
  };

  const handleFocus = () => {};

  const getTitleClasses = title => {
    if (title.value.length) return 'valid';
    if (!title.hasFocused) return '';
    if (!title.value.length) return 'invalid';
  };

  const handleKeyPressSubmit = (e, callback, canSubmit) => {
    if (e.code === 'Enter' && e.metaKey && canSubmit) {
      callback();
    }
  };

  return (
    <CustomLayout title="Create New Post">
      <PageWrapper>
        <Post>
          <Time>
            <PostDate>{state.dateTime}</PostDate>
          </Time>
          <TitleInputWrapper
            className={`${getTitleClasses(state.title)}`}
            onBlur={() => handleBlur('title')}
            onFocus={handleFocus()}
          >
            <TitleInput
              placeholder="Enter Title"
              rows="1"
              maxLength={TITLE_MAX_LENGTH}
              value={state.title.value}
              onChange={e => handleTitleChange(e, 'title')}
            ></TitleInput>
            {getTitleClasses(state.title) === 'invalid' ? <AlarmWarning /> : ''}
          </TitleInputWrapper>
          <TitleInputWrapper>
            <SubtitleInput
              placeholder="Enter Subtitle (optional)"
              rows="1"
              maxLength={TITLE_MAX_LENGTH}
              value={state.subtitle.value}
              onChange={e => handleTitleChange(e, 'subtitle')}
            ></SubtitleInput>
          </TitleInputWrapper>
          <EditorWrapper>
            <MarkdownEditor
              handleContentChange={handleContentChange}
              onKeyDown={e => {
                handleKeyPressSubmit(e, handlePostSubmit, canSubmitPost());
              }}
            ></MarkdownEditor>
          </EditorWrapper>
          <ActionItems>
            <ButtonWireframe
              className={'primary with-shortcut'}
              tabIndex={'0'}
              onClick={handlePostSubmit}
              disabled={!canSubmitPost()}
            >
              <Article />
              <span>Post</span>
              <span className="shortcut">⌘ Enter</span>
            </ButtonWireframe>
            <ButtonWireframe tabIndex={'0'} onClick={handleCancel}>
              Cancel
            </ButtonWireframe>
          </ActionItems>
        </Post>
      </PageWrapper>
    </CustomLayout>
  );
}
