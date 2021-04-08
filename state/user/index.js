import React, { useContext } from 'react';
import { useImmer } from 'use-immer';
import { fetcher } from 'utils/fetch';

const defaultContext = {
  user: null,
  loading: false,
  loaded: false,
};
const UserContext = React.createContext();
UserContext.displayName = 'User Context';

const UserContextProvider = ({ children }) => {
  const [state, setState] = useImmer({ ...defaultContext });

  return (
    <UserContext.Provider value={[state, setState]}>
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => {
  const [state] = useContext(UserContext);
  return state;
};

const useUserActions = () => {
  const [_, updateState] = useContext(UserContext);

  const getUser = async () => {
    updateState(draft => {
      draft.loading = true;
    });
    try {
      const { data: user } = await fetcher('GET', '/api/get-user');
      // FIXME: Refactor the app's user object to not have nested elements
      const restructureUser = user
        ? {
            ...user,
            profile: {
              avatar: user.avatar,
            },
            org: {
              id: user.orgId,
              name: user.orgName,
            },
          }
        : null;

      updateState(draft => {
        draft.user = restructureUser;
        draft.loading = false;
        draft.loaded = true;
      });
    } catch (e) {
      updateState(draft => {
        draft.loading = false;
        draft.errors = e;
      });
      console.error(e);
    }
  };

  const createUser = async params => {
    const { data: user, error } = await fetcher(
      'POST',
      `/api/create-user`,
      params
    );
    if (!error) {
      // FIXME: Refactor the app's user object to not have nested elements
      const restructureUser = user
        ? {
            ...user,
            profile: {
              avatar: user.avatar,
            },
            org: {
              id: user.orgId,
              name: user.orgName,
            },
          }
        : null;
      updateState(draft => {
        draft.user = restructureUser;
        draft.loading = false;
        draft.loaded = true;
      });
    } else {
      throw error;
    }
  };

  return { getUser, createUser };
};

export { UserContextProvider, useUserContext, useUserActions };
