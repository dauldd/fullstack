import React from 'react'
import Header from "./header";
import Content from "./content";
import Total from "./total";

const Course = ({ course }) => (
  <div>
    <Header course={course} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
)

export default Course
