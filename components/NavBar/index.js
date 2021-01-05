import styled from '@emotion/styled';
import { ButtonBase } from 'components/Button';
import Input from 'components/Input';
import { useRouter } from 'next/router';
import { useTopBarActions } from 'state/topBar';
import { useImmer } from 'use-immer';

const Wrapper = styled.div`
  height: 100vh;
  min-width: 236px;
  width: fit-content;
  box-sizing: border-box;
  border-right: 1px solid #000000;
  overflow-y: auto;

  img {
    margin: 20px 0 44px 24px;
  }

  > div:first-of-type {
    height: fit-content;
    border-bottom: 1px solid #000000;
    padding: 24px;

    > ${ButtonBase} {
      font-family: inherit;
      display: block;
      font-weight: 500;
      font-size: 20px;
      line-height: 21px;
      color: #000000;
      text-align: left;
    }

    > ${ButtonBase}:not(:last-of-type) {
      margin: 0 0 16px 0;
    }
  }
`;

const LowerContainer = styled.div`
  height: fit-content;
  padding: 24px;
  box-sizing: border-box;

  > div {
    margin: 0 0 44px 0;

    > ${ButtonBase} {
      font-size: 18px;
      line-height: 19px;
      color: #000000;
      display: inline-block;
    }

    div {
      display: flex;
      flex-direction: column;
      align-items: baseline;

      ${ButtonBase} {
        font-weight: 300;
        font-size: 16px;
        line-height: 17px;
        text-decoration-line: underline;
        margin: 20px 0 0 20px;
        color: #000000;
      }
    }
  }
`;

const StyledInput = styled(Input)`
  border-bottom: 1px solid #000000;
  font-size: 18px;
  font-weight: unset;
  margin: 16px 0 0 0;
`;

const AddLensButton = styled(ButtonBase)`
  font-size: 18px;
  border: 2px solid black;
  padding: 5px;
  margin: 10px 0 0 0;
`;

const ToggleAddLensButton = styled(ButtonBase)`
  margin: 0 0 0 20px;
  text-transform: unset;
  display: inline-block;
`;

export default function Navbar({
  titles = ['Home'],
  orgs = [],
  handleLensCreate,
}) {
  const defaultLensCreationState = orgs.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.name]: false,
    };
  }, {});
  const defaultLensNameState =
    ((acc, curr) => {
      return {
        ...acc,
        [curr.name]: '',
      };
    },
    {});
  const router = useRouter();
  const [isLensCreationOpened, setLensCreationOpened] = useImmer(
    defaultLensCreationState
  );
  const [newLensNames, setNewLensName] = useImmer(defaultLensNameState);
  const { setHeaders } = useTopBarActions();

  const redirectToHome = () => {
    if (router.pathname !== '/') {
      router.push('/');
    }
  };

  const toggleLensCreation = orgName => {
    setLensCreationOpened(draft => {
      draft[orgName] = !isLensCreationOpened[orgName];
    });
  };

  const onNewLensNameChange = (e, orgName) => {
    setNewLensName(draft => {
      draft[orgName] = e.target.value;
    });
  };

  const addLens = (orgId, orgName) => {
    setLensCreationOpened(draft => {
      draft[orgName] = !isLensCreationOpened[orgName];
    });
    handleLensCreate(orgId, newLensNames[orgName]);
  };

  return (
    <Wrapper>
      <img src="/icon.svg" alt="parallax logo" />
      <div>
        {titles?.map(title => (
          <ButtonBase key={title} onClick={redirectToHome}>
            <div>{title}</div>
          </ButtonBase>
        ))}
      </div>
      <LowerContainer>
        {orgs?.map(org => {
          return (
            <div key={org.id}>
              <ButtonBase
                type="button"
                onClick={() => {
                  setHeaders({
                    header: org.name,
                    subHeader: '',
                  });
                  redirectToHome();
                }}
              >
                {org.name}
              </ButtonBase>
              <ToggleAddLensButton
                type="button"
                onClick={() => {
                  toggleLensCreation(org.name);
                }}
              >
                {!isLensCreationOpened[org.name] ? '+' : 'x'}
              </ToggleAddLensButton>
              <div>
                {org.lenses?.map(lens => (
                  <ButtonBase
                    key={lens.id}
                    onClick={() => {
                      setHeaders({
                        header: org.name,
                        subHeader: lens.name,
                      });
                      redirectToHome();
                    }}
                  >
                    <div>{lens.name}</div>
                  </ButtonBase>
                ))}
              </div>
              {isLensCreationOpened[org.name] && (
                <>
                  <StyledInput
                    autoFocus
                    placeholder="New Lens name"
                    onChange={e => {
                      onNewLensNameChange(e, org.name);
                    }}
                  />
                  <AddLensButton
                    type="button"
                    onClick={() => {
                      addLens(Number(org.id), org.name);
                    }}
                  >
                    add
                  </AddLensButton>
                </>
              )}
            </div>
          );
        })}
      </LowerContainer>
    </Wrapper>
  );
}
