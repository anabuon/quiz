import React, { Component } from 'react'
import classes from './Quiz.module.scss'
import ActiveQuiz from '../../components/ActiveQuiz/ActiveQuiz'
import FinishedQuiz from '../../components/FinishedQuiz/FinishedQuiz'
import axios from '../../axios/axios-quiz'
import Loader from '../../components/UI/Loader/Loader'

class Quiz extends Component {
  state = {
    results: {}, // {[id]: succes error}
    activeQuestion: 0,
    answerState: null, //{[id]: 'succes' 'error'}
    isFinished: false,
    quiz: [],
    loading: true,
    //[
    //   {
    //     question: 'Какой метод любого React компонента вызывается первым?',
    //     id: 1,
    //     rightAnswerId: 2,
    //     answers: [
    //       { text: 'componentWillMount', id: 1 },
    //       { text: 'constructor', id: 2 },
    //       { text: 'componentDidMount', id: 3 },
    //       { text: 'render', id: 4 },
    //     ],
    //   },
    //   {
    //     question: 'Какой атрибут обязателен при рендеринге компонентов списка?',
    //     id: 2,
    //     rightAnswerId: 1,
    //     answers: [
    //       { text: 'key', id: 1 },
    //       { text: 'index', id: 2 },
    //       { text: 'data-index', id: 3 },
    //       { text: 'id', id: 4 },
    //     ],
    //   },
    // ],
  }

  onAnswerClickHandler = (answerId) => {
    if (this.state.answerState) {
      const key = Object.keys(this.state.answerState)[0]
      if (this.state.answerState[key] === 'success') {
        return
      }
    }

    console.log('Id: ', answerId)

    const results = this.state.results
    const question = this.state.quiz[this.state.activeQuestion]

    if (question.rightAnswerId === answerId) {
      if (!results[question.id]) {
        results[question.id] = 'success'
      }

      this.setState({
        answerState: { [answerId]: 'success' },
        results,
      })

      const timeout = window.setTimeout(() => {
        if (this.isQuizFinished()) {
          console.log('finished')
          this.setState({
            isFinished: true,
          })
        } else {
          this.setState({
            activeQuestion: this.state.activeQuestion + 1,
            answerState: null,
          })
        }
        window.clearTimeout(timeout)
      }, 1000)
    } else {
      results[question.id] = 'error'
      this.setState({
        answerState: { [answerId]: 'error' },
        results,
      })
    }
  }

  retryHandler = () => {
    this.setState({
      activeQuestion: 0,
      results: {},
      answerState: null,
      isFinished: false,
    })
  }

  isQuizFinished() {
    return this.state.activeQuestion + 1 === this.state.quiz.length
  }

  async componentDidMount() {
    try {
      const response = await axios.get(
        `/quizes/${this.props.match.params.id}.json`
      )
      const quiz = response.data
      this.setState({
        quiz,
        loading: false,
      })
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    return (
      <div className={classes.Quiz}>
        <div className={classes.QuizWrapper}>
          <h1>Quiz</h1>

          {this.state.loading ? (
            <Loader />
          ) : this.state.isFinished ? (
            <FinishedQuiz
              results={this.state.results}
              quiz={this.state.quiz}
              onRetry={this.retryHandler}
            />
          ) : (
            <ActiveQuiz
              answers={this.state.quiz[this.state.activeQuestion].answers}
              question={this.state.quiz[this.state.activeQuestion].question}
              onAnswerClick={this.onAnswerClickHandler}
              answerNumber={this.state.activeQuestion + 1}
              quizLength={this.state.quiz.length}
              state={this.state.answerState}
            />
          )}
        </div>
      </div>
    )
  }
}

export default Quiz
