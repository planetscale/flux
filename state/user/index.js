import React, { useContext } from 'react';
import { useImmer } from 'use-immer';
import { defaultFetchHeaders } from 'utils/auth/clientConfig';

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
      const response = await fetch('/api/get-user', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          Authorization: defaultFetchHeaders.authorization,
        },
      });
      const { data: user } = await response.json();
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
    const res = await fetch(`/api/create-user`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: defaultFetchHeaders.authorization,
      },
      body: JSON.stringify(params),
    });
    const { data: user, error } = await res.json();
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
      console.error(e);
    }
  };

  return { getUser, createUser };
};

export { UserContextProvider, useUserContext, useUserActions };
