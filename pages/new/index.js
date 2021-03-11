import styled from '@emotion/styled';
import { SlateEditor } from 'components/Editor';
import { ButtonWireframe, ButtonSpecial } from 'components/Button';
import { useRouter } from 'next/router';
import { useUserContext } from 'state/user';
import { useImmer } from 'use-immer';
import { Icon } from 'pageUtils/post/atoms';
import { PageWrapper, Post } from 'pageUtils/post/styles';
import { media } from 'pageUtils/post/theme';
import { fetcher } from 'utils/fetch';
import CustomLayout from 'components/CustomLayout';
import TagSelector from 'components/TagSelector';
import { useEffect } from 'react';

const TimeAndTags = styled.div`
  color: var(--text);
  display: flex;
  align-items: center;
  margin-bottom: 1em;

  ${media.phone`
    flex-direction: column;
    align-items: flex-start;
    padding-bottom: 1em;
    border-bottom: 1px solid var(--accent2);
  `}
`;

const MetaTime = styled.div`
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
  margin: 1em 0;
  padding: 0.5em;
  border-radius: 6px;
  border: 1px solid var(--accent2);

  &.invalid {
    border-color: red;
  }

  &.valid {
    border-color: var(--accent2);
  }

  .chars-left {
    display: flex;
    flex-direction: row;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier,
      monospace;
    align-items: flex-end;
    color: var(--accent);
    font-size: 12px;
  }
`;

const TitleInputBase = `
  outline: 0;
  border: 0;
  resize: none;
  word-break: break-word;
  overflow: hidden;
  width: 100%;
  color: var(--text);

  ::placeholder {
    color: var(--accent);
  }
`;

const TitleInput = styled.textarea`
  ${TitleInputBase}
  font-size: 48px;
  line-height: 58px;
  font-weight: 700;
  background-color: unset;
`;

const SubtitleInput = styled.textarea`
  ${TitleInputBase}
  font-size: 18px;
  line-height: 22px;
  word-break: break-word;
  background-color: var(--background);
`;

const ActionItems = styled.div`
  display: flex;
  margin: 32px 0;

  button {
    margin: 0 8px 0 0;
  }
`;

const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  border-top: 1px solid var(--accent2);
  padding: 1em 0;
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
    content: {},
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
      state.content &&
      state.selectedTag &&
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
        tagChannelId: state.selectedTag.channelId,
        tagName: state.selectedTag.value,
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

  const handleContentChange = content => {
    updateState(draft => {
      draft.content = content;
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
            <MetaTime>{state.dateTime}</MetaTime>
            <DotSeperator>&nbsp; &middot; &nbsp;</DotSeperator>
            <TagSelector
              tagOptions={state.tagOptions}
              selectedTag={state.selectedTag}
              tagChangeCallback={handleTagChange}
            ></TagSelector>
          </TimeAndTags>
          <TitleInputWrapper
            className={`${getTitleClasses(state.title)}`}
            onBlur={() => handleBlur('title')}
          >
            <TitleInput
              placeholder="Enter Title"
              rows="1"
              maxLength={TITLE_MAX_LENGTH}
              value={state.title.value}
              onChange={e => handleTitleChange(e, 'title')}
            ></TitleInput>
            <div className="chars-left">
              {TITLE_MAX_LENGTH - state.title.value.length}
            </div>
          </TitleInputWrapper>
          <TitleInputWrapper
            className={`${getTitleClasses(state.subtitle)}`}
            onBlur={() => handleBlur('subtitle')}
          >
            <SubtitleInput
              placeholder="Enter Subtitle (optional)"
              rows="1"
              maxLength={TITLE_MAX_LENGTH}
              value={state.subtitle.value}
              onChange={e => handleTitleChange(e, 'subtitle')}
            ></SubtitleInput>
            <div className="chars-left">
              {TITLE_MAX_LENGTH - state.subtitle.value.length}
            </div>
          </TitleInputWrapper>
          <EditorWrapper>
            <SlateEditor
              // users={state.allUsers}
              onChange={handleContentChange}
              readOnly={false}
            ></SlateEditor>
          </EditorWrapper>
          <ActionItems>
            <ButtonSpecial
              onClick={handlePostSubmit}
              disabled={!canSubmitPost()}
            >
              <Icon className="icon-post"></Icon>
              Post
            </ButtonSpecial>
            <ButtonWireframe onClick={handleCancel}>Cancel</ButtonWireframe>
          </ActionItems>
        </Post>
      </PageWrapper>
    </CustomLayout>
  );
}
