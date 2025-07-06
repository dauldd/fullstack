import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

const StatisticLine = (props) => {
  return (
    <p style={{ margin: 0 }}>
      <span style={{ display: 'inline-block', width: '60px' }}>{props.text}</span>
      <span style={{ display: 'inline-block', width: '50px', textAlign: 'left' }}>{props.value}</span>
    </p>
  )
}

const Statistics = (props) => {
  if (props.total === 0) {
  return <p>No feedback given</p>
}
  return (
    <div>
      <StatisticLine text="good" value={props.good} />
      <StatisticLine text="neutral" value={props.neutral} />
      <StatisticLine text="bad" value={props.bad} />
      <StatisticLine text="average" value={props.average} />
      <StatisticLine text="positive" value={`${props.positive}%`} />
    </div>

  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const total = good + neutral + bad
  const average = total === 0 ? 0 : ((good - bad) / total).toFixed(1)
  const positive = total === 0 ? 0 : ((good / total) * 100).toFixed(1)

  console.log('Good:', good, 'Neutral:', neutral, 'Bad:', bad)

  return (
    <div>

      <p><strong>Please provide feedback</strong></p>
      <Button text="good" handleClick={() => setGood(good + 1)} />
      <Button text="neutral" handleClick={() => setNeutral(neutral + 1)} />
      <Button text="bad" handleClick={() => setBad(bad + 1)} />
      <p><strong>Statistics</strong></p>
      <Statistics good={good} neutral={neutral} bad={bad} total={total} average={average} positive={positive} />
      <p>clarification: good = +1, neutral = 0, bad = -1</p>
    </div>
  )
}

export default App