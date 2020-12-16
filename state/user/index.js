import React, { useContext } from 'react';
import { useClient } from 'urql';
import { useImmer } from 'use-immer';
import { userOrgQuery } from './queries';

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
  const [state, updateState] = useContext(UserContext);
  const client = useClient();

  const getUserOrg = async ({ email }) => {
    updateState(draft => {
      draft.loading = true;
    });
    try {
      const result = await client
        .query(userOrgQuery, {
          email,
        })
        .toPromise();

      updateState(draft => {
        draft.user = result?.data?.user;
        draft.loading = false;
        draft.loaded = true;
      });
    } catch (e) {
      updateState(draft => {
        draft.loading = false;
      });
      console.error(e);
    }
  };

  return { getUserOrg };
};

export { UserContextProvider, useUserContext, useUserActions };
