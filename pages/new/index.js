import styled from '@emotion/styled';
import { ButtonBase } from 'components/Button';
import MarkdownEditor from 'components/MarkdownEditor';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUserContext } from 'state/user';
import { useQuery } from 'urql';
import { useImmer } from 'use-immer';
import { defaultFetchHeaders } from 'utils/auth/clientConfig';

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

const InputBase = styled.input`
  padding: 0;
  border: unset;
  width: fit-content;
  font-style: normal;
  font-weight: bold;
  letter-spacing: 0.75px;
  margin: 8px 0 0;

  :focus {
    outline: none;
  }

  ::placeholder {
    color: #ccc;
  }
`;

const TimeAndTags = styled.div``;

const TitleInput = styled(InputBase)`
  height: 58px;
  font-size: 48px;
  line-height: 58px;
  margin: 8px 0;
`;

const SubtitleInput = styled(InputBase)`
  font-weight: normal;
  height: 22px;
  font-size: 18px;
  line-height: 22px;
`;

const SubmitButton = styled(ButtonBase)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  width: 90px;
  height: 34px;
  background: #000000;
  color: #ffffff;
  box-sizing: border-box;
  border-radius: 99px;
`;

const CancelButton = styled(ButtonBase)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  width: 78px;
  height: 34px;
  background: #ffffff;
  border: 1px solid #000000;
  box-sizing: border-box;
  border-radius: 99px;
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

export default function NewPost() {
  const router = useRouter();
  const userContext = useUserContext();

  const months = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec',
  };

  const [state, updateState] = useImmer({
    date: new Date().getDate(),
    month: months[new Date().getMonth()],
    year: new Date().getFullYear(),
    title: '',
    subtitle: '',
    content: '',
    selectedLens: '',
  });
  const [lensesResult, runLensesQuery] = useQuery({
    query: lensesQuery,
  });

  useEffect(() => {
    if (lensesResult.data?.lenses) {
      updateState(draft => {
        // TODO: let user select channel/tag/lens
        draft.selectedLens = lensesResult.data?.lenses?.[0].id;
      });
    }
  }, [lensesResult.data?.lenses]);

  const handleTitleChange = e => {
    updateState(draft => {
      draft.title = e.target.value;
    });
  };

  const handleSubtitleChange = e => {
    updateState(draft => {
      draft.subtitle = e.target.value;
    });
  };

  const handlePostSubmit = async () => {
    if (
      !(state.title && state.subtitle && state.content && state.selectedLens)
    ) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', state.title);
      formData.append('content', state.content);
      formData.append('summary', state.subtitle);
      formData.append('userId', userContext?.user?.id);
      formData.append('lensId', Number(state.selectedLens));

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
    // TODO: redirect user to previous page
    router.push('/');
  };

  const handleContentChange = content => {
    updateState(draft => {
      draft.content = content;
    });
  };

  return (
    <Wrapper>
      <div>
        <TimeAndTags>
          <div>
            {state.date} {state.month} {state.year}
          </div>
          <div></div>
        </TimeAndTags>
        <TitleInput
          placeholder="Enter Title"
          value={state.title}
          onChange={handleTitleChange}
        ></TitleInput>
        <SubtitleInput
          placeholder="Enter Subtitle"
          value={state.subtitle}
          onChange={handleSubtitleChange}
        ></SubtitleInput>
        <EditorWrapper>
          <MarkdownEditor
            content={state.content}
            handleContentChange={handleContentChange}
          ></MarkdownEditor>
        </EditorWrapper>
        <ActionItems>
          <SubmitButton onClick={handlePostSubmit}>Post</SubmitButton>
          <CancelButton onClick={handleCancel}>Cancel</CancelButton>
        </ActionItems>
      </div>
    </Wrapper>
  );
}
