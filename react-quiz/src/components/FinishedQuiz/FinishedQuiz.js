import React from 'react'
import classes from './FinishedQuiz.module.scss'
import Button from '../UI/Button/Button'

const FinishedQuiz = (props) => {
  const successCount = Object.keys(props.results).reduce((total, key) => {
    if (props.results[key] === 'success') {
      total++
    }
    return total
  }, 0)

  return (
    <div className={classes.FinishedQuiz}>
      <ul>
        {props.quiz.map((quizItem, index) => {
          const cls = [
            'fa',
            props.results[quizItem.id] === 'error' ? 'fa-times' : 'fa-check',
            classes[props.results[quizItem.id]],
          ]
          return (
            <li key={index}>
              <strong>{index + 1}</strong>.&nbsp;
              {quizItem.question}
              <i className={cls.join(' ')} />
            </li>
          )
        })}
      </ul>
      <p>
        Good {successCount} n {props.quiz.length}
      </p>

      <Button onClick={props.onRetry} type="primary">
        Repeat
      </Button>
      <Button type="success">go to the tests</Button>
    </div>
  )
}

export default FinishedQuiz
