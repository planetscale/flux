import { createStore, createHook } from 'react-sweet-state';
import { loginWithFirebase } from 'utils/fireConfig';

const Store = React.createContext({
  isAuthed: false,
});

const Store = createStore({
  initialState: {
    isAuthed: false,
  },

  actions: {
    userLogin: () => () => {
      loginWithFirebase().then(res => {
        setState({
          isAuthed: true,
        });
      });
    },
  },

  // optional, mostly used for easy debugging
  name: 'auth',
});

const useAuthStore = createHook(Store);

export { Store };
