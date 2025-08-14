import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()
  if (!notification) return null

  return (
    <div style={{ border: '1px solid', padding: 10, marginBottom: 10 }}>
      {notification}
    </div>
  )
}

export default Notification
