import { createContext, useContext, useReducer } from 'react'

const initialState = {
  message: null,
  type: null,
}

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return {
        message: action.payload.message,
        type: action.payload.type || 'success',
      }
    case 'CLEAR_NOTIFICATION':
      return {
        message: null,
        type: null,
      }
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, initialState)

  const showNotification = (message, type = 'success') => {
    dispatch({
      type: 'SHOW_NOTIFICATION',
      payload: { message, type },
    })

    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
    }, 5000)
  }

  const clearNotification = () => {
    dispatch({ type: 'CLEAR_NOTIFICATION' })
  }

  const value = {
    notification,
    showNotification,
    clearNotification,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    )
  }
  return context
}
