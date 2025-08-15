import { createContext, useContext, useReducer, useCallback } from 'react'

const initialState = {
  user: null,
}

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        user: action.payload,
      }
    case 'LOGOUT':
      return {
        user: null,
      }
    case 'INITIALIZE':
      return {
        user: action.payload,
      }
    default:
      return state
  }
}

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState)

  const login = useCallback((user) => {
    dispatch({ type: 'LOGIN', payload: user })
  }, [])

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' })
  }, [])

  const initializeUser = useCallback((user) => {
    dispatch({ type: 'INITIALIZE', payload: user })
  }, [])

  const value = {
    user: state.user,
    login,
    logout,
    initializeUser,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
