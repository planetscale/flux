import styled from '@emotion/styled';
import { ButtonWireframe } from 'components/Button';
import MarkdownEditor from 'components/MarkdownEditor';
import { useRouter } from 'next/router';
import { useUserContext } from 'state/user';
import { useImmer } from 'use-immer';
import Select from 'react-select';
import { Article } from '@styled-icons/remix-line';
import { PageWrapper, Post } from 'pageUtils/post/styles';
import { media } from 'pageUtils/post/theme';
import { fetcher } from 'utils/fetch';
import CustomLayout from 'components/CustomLayout';
import { useEffect } from 'react';

const TimeAndTags = styled.div`
  color: var(--text-primary);
  display: flex;
  align-items: center;
  margin-bottom: 0.5em;

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

const DotSeperator = styled.div`
  ${media.phone`
    display: none;
  `}
`;

const TitleInputWrapper = styled.div`
  position: relative;
  display: flex;
  margin: 2em -1em 0;
  padding: 1em;

  border-radius: 6px;

  &:hover,
  &:focus-within {
    background-color: var(--bg-secondary);
    box-shadow: var(--layer-shadow);
  }

  &.invalid > * {
    border-color: rgb(var(--red-500));
  }

  &.valid > * {
    border-color: var(--border-primary);
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
  border-bottom: 1px solid var(--border-primary);

  ::placeholder {
    color: var(--border-secondary);
  }

  &:active, &:focus {
  }
`;

const TitleInput = styled.textarea`
  ${TitleInputBase}
  font-size: 40px;
  line-height: 42px;
  font-weight: 700;
`;

const SubtitleInput = styled.textarea`
  ${TitleInputBase}
  font-size: var(--fs-base-plus-1);
  line-height: 22px;
  word-break: break-word;
`;

const ActionItems = styled.div`
  display: flex;
  margin-top: 2em;
  padding-top: 2em;
  border-top: 1px solid var(--border-primary);

  button {
    margin: 0 1em 0 0;
  }
`;

const EditorWrapper = styled.div`
  padding: 2em 0;
  height: fit-content;
  position: relative;
  display: flex;
  margin: 2em -1em 0;
  padding: 1em;

  border-radius: 6px;

  &:hover,
  &:focus-within {
    background-color: var(--bg-secondary);
    box-shadow: var(--layer-shadow);
  }
`;

const customStyles = {
  container: provided => ({
    ...provided,
    width: '200px',
  }),
  control: provided => ({
    ...provided,
    borderColor: 'var(--border-primary)',
    backgroundColor: 'var(--bg-primary)',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: '6px',
    ':hover': {
      backgroundColor: 'var(--bg-secondary)',
      borderColor: 'unset',
      boxShadow: 'var(--layer-shadow)',
    },
  }),
  indicatorSeparator: provided => ({
    ...provided,
    backgroundColor: 'var(--bg-primary)',
  }),
  indicatorContainer: provided => ({
    ...provided,
    color: 'var(--text-primary)',
  }),
  option: provided => ({
    ...provided,
    whiteSpace: 'nowrap',
    color: 'var(--text-primary)',
    ':hover': {
      backgroundColor: 'var(--bg-tertiary)',
    },
  }),
  singleValue: provided => ({
    ...provided,
    color: 'var(--text-primary)',
  }),
  menu: provided => ({
    ...provided,
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--bg-tertiary)',
    borderRadius: '8px',
    boxShadow: 'var(--layer-shadow)',
  }),
};

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
    selectedTag: null,
    tagOptions: [],
    disableSubmit: false,
  });

  useEffect(async () => {
    try {
      const resp = await fetcher('GET', '/api/get-tags');
      const fluxSandboxChannel = {};
      const tagMap = resp.data.map(item => {
        // assign dev default channel
        if (item.name.toLowerCase() === 'flux-sandbox') {
          fluxSandboxChannel['value'] = item.name;
          fluxSandboxChannel['label'] = `#${item.name}`;
          fluxSandboxChannel['channelId'] = item.id;
        }

        return {
          value: item.name,
          label: `#${item.name}`,
          channelId: item.id,
        };
      });

      updateState(draft => {
        draft.tagOptions = tagMap;
        draft.selectedTag =
          process.env.NODE_ENV === 'development'
            ? fluxSandboxChannel
            : tagMap[0];
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

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
        content: state.content,
        summary: state.subtitle.value,
        tagChannelId: state.selectedTag?.channelId,
        tagName: state.selectedTag?.value,
        userAvatar:
          userContext?.user?.profile?.avatar ?? '/user_profile_icon.svg',
        userDisplayName: userContext?.user?.displayName,
        domain: window.location.origin,
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

  const handleTagChange = selectedOption => {
    updateState(draft => {
      draft.selectedTag = selectedOption;
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
          <TimeAndTags>
            <PostDate>{state.dateTime}</PostDate>
            {state.tagOptions.length > 0 && (
              <>
                <DotSeperator>&nbsp; &middot; &nbsp;</DotSeperator>
                <div>
                  <Select
                    isClearable={false}
                    isSearchable={false}
                    styles={customStyles}
                    value={state.selectedTag}
                    onChange={handleTagChange}
                    options={state.tagOptions}
                    defaultValue={state.selectedTag}
                    placeholder="Select a tag"
                    theme={theme => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary25: 'var(--bg-tertiary)',
                        primary50: 'var(--bg-tertiary)',
                        primary75: 'var(--bg-tertiary)',
                        primary: 'var(--bg-tertiary)',
                      },
                    })}
                  />
                </div>
              </>
            )}
          </TimeAndTags>
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
              content={state.content}
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
