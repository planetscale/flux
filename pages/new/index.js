import styled from '@emotion/styled';
import { ButtonMajor, ButtonMinor } from 'components/Button';
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
import { Post } from 'pageUtils/post/styles';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 42px 0 0 0;

  > div {
    display: flex;
    flex-direction: column;
  }
`;

const TimeAndTags = styled.div`
  color: var(--text);
  display: flex;
  align-items: center;
`;

const TitleInput = styled.textarea`
  outline: 0;
  border: 0;
  resize: none;
  word-break: break-word;
  overflow: hidden;
  font-size: 48px;
  line-height: 58px;
  margin: 8px 0 24px;
  font-weight: 700;
  background-color: var(--background);
  color: var(--text);

  ::placeholder {
    color: var(--accent);
  }
`;

const SubtitleInput = styled.textarea`
  outline: 0;
  border: 0;
  resize: none;
  word-break: break-word;
  overflow: hidden;
  width: 100%;
  font-size: 18px;
  line-height: 22px;
  word-break: break-word;
  background-color: var(--background);
  color: var(--text);

  ::placeholder {
    color: var(--accent);
  }
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

const slackMembersQuery = gql`
  query {
    slackMembers {
      id
      realName
      displayName
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

export default function NewPost() {
  const router = useRouter();
  const userContext = useUserContext();
  const [state, updateState] = useImmer({
    dateTime: new Date().toLocaleDateString(
      navigator.language,
      dateTimeOptions
    ),
    title: '',
    subtitle: '',
    content: '',
    selectedLens: '',
    selectedTag: null,
    tagOptions: [],
    slackMemberSuggestions: [],
  });

  const [lensesResult, runLensesQuery] = useQuery({
    query: lensesQuery,
  });

  const [channelsResult, runChannelsQuery] = useQuery({
    query: channelsQuery,
  });

  const [slackMembersResult, runslackMembersQuery] = useQuery({
    query: slackMembersQuery,
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
      const tagMap = channelsResult.data?.channels.map(item => {
        return { value: item.name, label: `#${item.name}`, channelId: item.id };
      });
      updateState(draft => {
        draft.tagOptions = tagMap;
        draft.selectedTag = tagMap[0];
      });
    }
  }, [channelsResult.data?.channels]);

  useEffect(() => {
    if (slackMembersResult.data?.slackMembers) {
      updateState(draft => {
        draft.slackMemberSuggestions = slackMembersResult.data?.slackMembers.map(
          member => ({
            preview: member.realName,
            value: `@${member.realName}`,
          })
        );
      });
    }
  }, [slackMembersResult.data?.slackMembers]);

  const handleTitleChange = e => {
    let title = e.target;
    title.height = '5px';
    title.style.height = title.scrollHeight + 'px';
    updateState(draft => {
      draft.title = e.target.value;
    });
  };

  const handleSubtitleChange = e => {
    let title = e.target;
    title.height = '1px';
    title.style.height = title.scrollHeight + 'px';
    updateState(draft => {
      draft.subtitle = e.target.value;
    });
  };

  const canSubmitPost = () => {
    return (
      state.title?.trim() &&
      state.subtitle?.trim() &&
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
      formData.append('title', state.title);
      formData.append('content', state.content);
      formData.append('summary', state.subtitle);
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

  return (
    <Wrapper>
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
        <TitleInput
          placeholder="Enter Title"
          rows="1"
          value={state.title}
          onChange={handleTitleChange}
        ></TitleInput>
        <SubtitleInput
          placeholder="Enter Subtitle"
          rows="1"
          value={state.subtitle}
          onChange={handleSubtitleChange}
        ></SubtitleInput>
        <EditorWrapper>
          <MarkdownEditor
            content={state.content}
            handleContentChange={handleContentChange}
            userTagSuggestions={state.slackMemberSuggestions}
          ></MarkdownEditor>
        </EditorWrapper>
        <ActionItems>
          <ButtonMajor onClick={handlePostSubmit} disabled={!canSubmitPost()}>
            <Icon className="icon-post"></Icon>
            Post
          </ButtonMajor>
          <ButtonMinor onClick={handleCancel}>Cancel</ButtonMinor>
        </ActionItems>
      </Post>
    </Wrapper>
  );
}
