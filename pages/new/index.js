import styled from '@emotion/styled';
import { ButtonMinor, ButtonSpecial } from 'components/Button';
import MarkdownEditor from 'components/MarkdownEditor';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUserContext } from 'state/user';
import { useQuery } from 'urql';
import { useImmer } from 'use-immer';
import Select from 'react-select';
import { defaultFetchHeaders } from 'utils/auth/clientConfig';
import { Icon } from 'pageUtils/post/atoms';
import { PageWrapper, Post } from 'pageUtils/post/styles';

const TimeAndTags = styled.div`
  color: var(--text);
  display: flex;
  align-items: center;
`;

const TitleInputWrapper = styled.div`
  position: relative;
  display: flex;
  margin: 8px 0 0;

  &:before {
    content: ' ';
    display: inline-block;
    position: absolute;
    height: 0.5em;
    width: 0.5em;
    background-color: var(--accent);
    top: calc(44% - 0.25em);
    left: -1em;
    border-radius: 50%;
  }

  &.invalid {
    &:before {
      background-color: red;
    }
  }

  &.valid {
    &:before {
      background-color: green;
    }
  }

  .chars-left {
    display: flex;
    align-items: flex-end;
    color: var(--accent);
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
  margin: 32px 0 0 0;
  height: fit-content;
`;

const lensesQuery = gql`
  query {
    lenses {
      id
      name
    }
  }
`;

const channelsQuery = gql`
  query {
    channels {
      id
      name
    }
  }
`;

const customStyles = {
  container: provided => ({
    ...provided,
    width: '200px',
  }),
  control: provided => ({
    ...provided,
    borderColor: 'unset',
    borderRadius: 'unset',
    borderStyle: 'unset',
    borderWidth: 'unset',
    boxShadow: 'unset',
    backgroundColor: 'var(--accent3)',
    borderRadius: '5px',
  }),
  indicatorSeparator: provided => ({
    ...provided,
    backgroundColor: 'var(--background)',
    marginBottom: '0',
    marginTop: '0',
  }),
  indicatorContainer: provided => ({
    ...provided,
    color: 'var(--foreground)',
  }),
  option: provided => ({
    ...provided,
    whiteSpace: 'nowrap',
    color: 'var(--text)',
    ':hover': {
      backgroundColor: 'var(--accent)',
    },
  }),
  singleValue: provided => ({
    ...provided,
    color: 'var(--text)',
  }),
  menu: provided => ({
    ...provided,
    backgroundColor: 'var(--background)',
    border: '1px solid var(--accent)',
    borderRadius: '8px',
    boxShadow: 'var(--shadow)',
    width: 'unset',
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
    selectedLens: '',
    selectedTag: null,
    tagOptions: [],
  });

  const [lensesResult, runLensesQuery] = useQuery({
    query: lensesQuery,
  });

  const [channelsResult, runChannelsQuery] = useQuery({
    query: channelsQuery,
  });

  useEffect(() => {
    if (lensesResult.data?.lenses) {
      updateState(draft => {
        // TODO: remove concept of lens if backend ready
        draft.selectedLens = lensesResult.data?.lenses?.[0].id;
      });
    }
  }, [lensesResult.data?.lenses]);

  useEffect(() => {
    if (channelsResult.data?.channels) {
      const fluxSandboxChannel = {};
      const tagMap = channelsResult.data?.channels.map(item => {
        // assign dev default channel
        if (item.name.toLowerCase() === 'flux-sandbox') {
          fluxSandboxChannel['value'] = item.name;
          fluxSandboxChannel['label'] = `#${item.name}`;
          fluxSandboxChannel['channelId'] = item.id;
        }

        return { value: item.name, label: `#${item.name}`, channelId: item.id };
      });

      updateState(draft => {
        draft.tagOptions = tagMap;
        draft.selectedTag =
          process.env.NODE_ENV === 'development'
            ? fluxSandboxChannel
            : tagMap[0];
      });
    }
  }, [channelsResult.data?.channels]);

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
      state.subtitle?.value.trim() &&
      state.content?.trim() &&
      state.selectedLens &&
      state.selectedTag
    );
  };

  const handlePostSubmit = async () => {
    if (!canSubmitPost()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', state.title.value);
      formData.append('content', state.content);
      formData.append('summary', state.subtitle.value);
      formData.append('userId', userContext?.user?.id);
      formData.append('lensId', Number(state.selectedLens));
      formData.append(
        'userAvatar',
        userContext?.user?.profile?.avatar ?? '/user_profile_icon.svg'
      );
      formData.append('userDisplayName', userContext?.user?.displayName);
      formData.append('domain', window.location.origin);
      formData.append('tagName', state.selectedTag.value);
      formData.append('tagChannelId', state.selectedTag.channelId);

      const rawResp = await fetch('/api/upload/post', {
        method: 'POST',
        headers: defaultFetchHeaders,
        body: formData,
      });
      const resp = await rawResp.json();

      if (rawResp.status === 200 && resp.id) {
        router.push(`/post/${resp.id}`);
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

  return (
    <PageWrapper>
      <Post>
        <TimeAndTags>
          <div>{state.dateTime}&nbsp; &middot; &nbsp;</div>
          <div>
            <Select
              isClearable={true}
              isSearchable={true}
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
                  primary25: 'var(--highlight)',
                  primary50: 'var(--highlight)',
                  primary75: 'var(--highlight)',
                  primary: 'var(--highlight)',
                },
              })}
            />
          </div>
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
            placeholder="Enter Subtitle"
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
          <MarkdownEditor
            content={state.content}
            handleContentChange={handleContentChange}
          ></MarkdownEditor>
        </EditorWrapper>
        <ActionItems>
          <ButtonSpecial onClick={handlePostSubmit} disabled={!canSubmitPost()}>
            <Icon className="icon-post"></Icon>
            Post
          </ButtonSpecial>
          <ButtonMinor onClick={handleCancel}>Cancel</ButtonMinor>
        </ActionItems>
      </Post>
    </PageWrapper>
  );
}
