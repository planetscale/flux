import React, { useContext } from 'react';
import { useImmer } from 'use-immer';
import { loginWithFirebase, logoutWithFirebase } from 'utils/auth/clientConfig';

const defaultContext = {
  isAuthed: false,
  user: null,
  authChecked: false,
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

      if (!isValidUser(res?.user)) {
        return userLogout();
      }

      if (res) {
        updateState(draft => {
          draft.isAuthed = true;
          draft.user = res?.user;
          draft.authChecked = true;
        });
      }
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
          draft.authChecked = false;
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
          draft.authChecked = true;
        });
      } catch (e) {
        updateState(draft => {
          draft.error = e;
        });
      }
    }
  };

  const setUserAuthChecked = () => {
    try {
      updateState(draft => {
        draft.isAuthed = false;
        draft.user = null;
        draft.authChecked = true;
      });
    } catch (e) {
      updateState(draft => {
        draft.error = e;
      });
    }
  };

  // It doesn't seem possible to actually tell OAuth to block emails that don't match a certain domain.
  // A user without access can still create a firebase user unfortunately, but will be blocked from the app from here.
  const isValidUser = user => {
    return user.email.match(
      new RegExp(process.env.NEXT_PUBLIC_ALLOWED_EMAIL_REGEX)
    );
  };

  return {
    userLogin,
    userLogout,
    rehydrateUser,
    setUserAuthChecked,
    isValidUser,
  };
};

export { AuthContextProvider, useAuthContext, useAuthActions };
