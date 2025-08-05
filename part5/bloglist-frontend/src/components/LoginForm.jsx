const LoginForm = ({
  handleLogin,
  username,
  password,
  setUsername,
  setPassword,
  errorMessage,
}) => {
  return (
    <div>
      <h2>Log in to application</h2>
      {errorMessage && (
        <p className="error" style={{ color: 'red' }}>
          {errorMessage}
        </p>
      )}
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="login_button" type="submit">
          login
        </button>
      </form>
    </div>
  )
}

export default LoginForm
