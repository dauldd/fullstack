const Content = ({ parts }) => (

  <section>
    <h3>Courses</h3>
    {parts.map(part => (
      <p key={part.id}>
        {part.name} {part.exercises}
      </p>
    ))}
  </section>
)


export default Content