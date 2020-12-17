import React, { useContext } from 'react';
import { useImmer } from 'use-immer';
import { loginWithFirebase, logoutWithFirebase } from 'utils/auth/clientConfig';

const defaultContext = {
  isAuthed: false,
  user: null,
};
const AuthContext = React.createContext();
AuthContext.displayName = 'Auth Context';

const AuthContextProvider = ({ children }) => {
  const [state, setState] = useImmer({ ...defaultContext });

  return (
    <AuthContext.Provider value={[state, setState]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => {
  const [state] = useContext(AuthContext);
  return state;
};

const useAuthActions = () => {
  const [state, updateState] = useContext(AuthContext);

  const userLogin = async () => {
    try {
      const res = await loginWithFirebase();
      updateState(draft => {
        draft.isAuthed = true;
        draft.user = res?.user;
      });
    } catch (e) {
      updateState(draft => {
        draft.error = e;
      });
    }
  };

  const userLogout = async () => {
    try {
      logoutWithFirebase().then(() => {
        updateState(draft => {
          draft.isAuthed = false;
          draft.user = null;
        });
      });
    } catch (e) {
      updateState(draft => {
        draft.error = e;
      });
    }
  };

  const rehydrateUser = user => {
    if (user) {
      try {
        updateState(draft => {
          draft.isAuthed = true;
          draft.user = user;
        });
      } catch (e) {
        updateState(draft => {
          draft.error = e;
        });
      }
    }
  };

  return { userLogin, userLogout, rehydrateUser };
};

export { AuthContextProvider, useAuthContext, useAuthActions };
