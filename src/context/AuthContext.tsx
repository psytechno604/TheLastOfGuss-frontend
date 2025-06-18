import { createContext, useReducer, useContext, useEffect } from 'react';
import { getWhoAmI } from '../api';

type State = {
  username: string | null;
  roundTaps: Record<string, number>; // ключ — roundId
};

type Action =
  | { type: 'setUser'; username: string }
  | { type: 'clearUser' }
  | { type: 'setTaps'; roundId: string; taps: number };

const AuthContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: { username: null, roundTaps: {} }, dispatch: () => {} });

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setUser':
      return { ...state, username: action.username };
    case 'clearUser':
      return { username: null, roundTaps: {} };
    case 'setTaps':
      return {
        ...state,
        roundTaps: { ...state.roundTaps, [action.roundId]: action.taps },
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { username: null, roundTaps: {} });

  useEffect(() => {
    getWhoAmI().then(res => {
      if (res?.username) {
        dispatch({ type: 'setUser', username: res.username });
      }
    }).catch(() => {
      dispatch({ type: 'clearUser' });
    });
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
