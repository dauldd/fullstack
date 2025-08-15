import { useNotification } from '../contexts/NotificationContext'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const { notification } = useNotification()

  if (notification.message === null) return null

  return (
    <Alert variant={notification.type === 'error' ? 'danger' : 'success'}>
      {notification.message}
    </Alert>
  )
}

export default Notification
