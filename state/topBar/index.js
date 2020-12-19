import React, { useContext } from 'react';
import { useImmer } from 'use-immer';

const defaultContext = {
  header: null,
  subHeader: null,
  error: null,
};
const TopBarContext = React.createContext();
TopBarContext.displayName = 'Top bar Context';

const TopBarContextProvider = ({ children }) => {
  const [state, setState] = useImmer({ ...defaultContext });

  return (
    <TopBarContext.Provider value={[state, setState]}>
      {children}
    </TopBarContext.Provider>
  );
};

const useTopBarContext = () => {
  const [state] = useContext(TopBarContext);
  return state;
};

const useTopBarActions = () => {
  const [state, updateState] = useContext(TopBarContext);

  const setHeaders = ({ header, subHeader }) => {
    if (header || subHeader) {
      try {
        updateState(draft => {
          if (header) {
            draft.header = header;
          }
          if (subHeader) {
            draft.subHeader = subHeader;
          }
        });
      } catch (e) {
        updateState(draft => {
          draft.error = e;
        });
      }
    }
  };

  return { setHeaders };
};

export { TopBarContextProvider, useTopBarContext, useTopBarActions };
