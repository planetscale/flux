import React, { useContext } from 'react';
import { useImmer } from 'use-immer';
import { useClient } from 'urql';
import { tagsOrgQuery } from './queries';

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
  const client = useClient();

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

  const fetchTags = async () => {
    try {
      const result = await client.query(tagsOrgQuery).toPromise();
      if (result.data?.tags) {
        updateState(draft => {
          draft.filterTagList = result.data.tags;
        });
      } else if (result.error) {
        console.error(result.error);
      }
    } catch (e) {
      updateState(draft => {
        draft.loading = false;
        draft.errors = e;
      });
      console.error(e);
    }
  };

  return { setHeaders, setTag, fetchTags };
};

export { TopBarContextProvider, useTopBarContext, useTopBarActions };
