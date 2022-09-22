import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Header from '../components/Header';
import { setScore, setAssertions } from '../redux/actions';
import { fetchGameApi } from '../services';

class Game extends React.Component {
  constructor() {
    const positions = 11;
    super();
    this.state = {
      data: [],
      currentQuestion: 0,
      loading: true,
      redirect: false,
      position: Math.floor(Math.random() * positions),
      timer: 30,
      timeout: false,
      score: 0,
      assertions: 0,
      displayNextButton: false,
      redirectToFeedback: false,
    };
    this.handleAnswerClick = this.handleAnswerClick.bind(this);
    this.updateTimer = this.updateTimer.bind(this);
    this.handleNextButtonClick = this.handleNextButtonClick.bind(this);
  }

  async componentDidMount() {
    const token = localStorage.getItem('token');
    const gameURL = `https://opentdb.com/api.php?amount=5&token=${token}`;
    const data = await fetchGameApi(gameURL);
    const badToken = 3;
    if (data.response_code === badToken) {
      localStorage.removeItem('token');
      this.setState({ redirect: true });
    } else {
      this.setState({ data, loading: false });
    }
    console.log(data);
    const interval = 1000;
    setInterval(this.updateTimer, interval);
  }

  handleAnswerClick(event) {
    const { dispatch } = this.props;
    const { timer, data, currentQuestion, score, assertions } = this.state;
    const multiplier = 10;
    const hard = 3;
    console.log(data);
    if (event.target.id === 'right-answer') {
      console.log('resposta correta');
      const newAssertions = assertions + 1;
      dispatch(setAssertions(newAssertions));
      this.setState({ assertions: newAssertions });
      switch (data.results[currentQuestion].difficulty) {
      case 'easy':
        this.setState({ score: score + multiplier + (timer * 1) });
        dispatch(setScore(score + multiplier + (timer * 1)));
        break;
      case 'medium':
        this.setState({ score: score + multiplier + (timer * 2) });
        dispatch(setScore(score + multiplier + (timer * 2)));
        break;
      case 'hard':
        this.setState({ score: score + multiplier + (timer * hard) });
        dispatch(setScore(score + multiplier + (timer * hard)));
        break;
      default: dispatch(setScore(score + multiplier + (timer)));
      }
    }
    document.querySelectorAll('#wrong-answer').forEach((elem) => {
      elem.classList.add('wrong-answer');
    });
    document.querySelectorAll('#right-answer').forEach((elem) => {
      elem.classList.add('right-answer');
    });
    this.setState({ displayNextButton: true });
  }

  handleNextButtonClick() {
    const { currentQuestion } = this.state;
    const maxQuestions = 4;
    if (currentQuestion < maxQuestions) {
      const nextQuestion = currentQuestion + 1;
      this.setState({ currentQuestion: nextQuestion });
    }
    if (currentQuestion === maxQuestions) {
      this.setState({ redirectToFeedback: true });
    }
  }

  updateTimer() {
    let { timer } = this.state;
    timer -= 1;
    if (timer >= 0) {
      this.setState({ timer });
    }
    if (timer === 0) {
      this.setState({ timeout: true });
    }
  }

  render() {
    const { data, currentQuestion, loading, redirect, position, timer,
      timeout, displayNextButton, redirectToFeedback } = this.state;
    const answerPosition = 6;
    return (
      <div>
        <Header />
        {redirect && <Redirect to="./" />}
        {
          loading
            ? (<div>Loading...</div>)
            : (
              <div>
                <p data-testid="timer">{timer}</p>
                <p
                  data-testid="question-category"
                >
                  {data.results[currentQuestion].category}
                </p>
                <p
                  data-testid="question-text"
                >
                  {data.results[currentQuestion].question}
                </p>
                <div data-testid="answer-options">
                  {
                    position <= answerPosition
                      ? (
                        <button
                          type="button"
                          data-testid="correct-answer"
                          id="right-answer"
                          onClick={ this.handleAnswerClick }
                          disabled={ timeout }
                        >
                          {data.results[currentQuestion].correct_answer}
                        </button>
                      )
                      : (<div />)
                  }
                  {data.results[currentQuestion].incorrect_answers.map((elem, index) => (
                    <button
                      type="button"
                      key={ index }
                      data-testid={ `wrong-answer-${index}` }
                      id="wrong-answer"
                      onClick={ this.handleAnswerClick }
                      disabled={ timeout }
                    >
                      {elem}

                    </button>
                  ))}
                  {
                    position > answerPosition
                      ? (
                        <button
                          type="button"
                          data-testid="correct-answer"
                          id="right-answer"
                          onClick={ this.handleAnswerClick }
                          disabled={ timeout }
                        >
                          {data.results[currentQuestion].correct_answer}
                        </button>
                      )
                      : (<div />)
                  }

                </div>
              </div>
            )
        }
        {
          displayNextButton
            ? (
              <button
                data-testid="btn-next"
                type="button"
                onClick={ this.handleNextButtonClick }
              >
                Next
              </button>
            )
            : (<div />)
        }
        {redirectToFeedback && <Redirect to="./Feedback" />}
      </div>
    );
  }
}

Game.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(Game);
