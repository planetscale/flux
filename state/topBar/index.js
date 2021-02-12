import React, { useContext } from 'react';
import { useImmer } from 'use-immer';

const defaultContext = {
  header: null,
  subHeader: 'all',
  error: null,
  filterTagList: [],
  selectedTag: null,
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

  const setHeaders = ({ header, subHeader, query }) => {
    if (header || subHeader || query) {
      try {
        updateState(draft => {
          if (header) {
            draft.header = header;
          }

          if (subHeader) {
            draft.subHeader = subHeader;
          }

          if (query) {
            draft.query = query;
          } else {
            draft.query = '';
          }
        });
      } catch (e) {
        updateState(draft => {
          draft.error = e;
        });
      }
    }
  };

  const setTag = tag => {
    try {
      updateState(draft => {
        draft.selectedTag = tag;
      });
    } catch (e) {
      updateState(draft => {
        draft.error = e;
      });
    }
  };

  return { setHeaders, setTag };
};

export { TopBarContextProvider, useTopBarContext, useTopBarActions };
