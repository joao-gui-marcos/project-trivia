import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FeedbackHeader from '../components/FeedbackHeader';
import ButtonNewGame from '../components/ButtonNewGame';

class Feedback extends Component {
  ranking = () => {
    const { history } = this.props;
    history.push('/ranking');
  };

  render() {
    const { history, score, assertions } = this.props;
    const TRES = 3;

    return (
      <div>
        <FeedbackHeader />
        <div>
          <span>Placar Final:</span>
          <span data-testid="feedback-total-score">{ score }</span>
        </div>
        <div>
          <span>Numero de acertos:</span>
          <span data-testid="feedback-total-question">{ assertions }</span>
        </div>

        { assertions < TRES && <p data-testid="feedback-text">Could be better...</p> }
        { assertions >= TRES && <p data-testid="feedback-text">Well Done!</p> }
        <button
          type="button"
          data-testid="btn-ranking"
          onClick={ this.ranking }
        >
          Ver Ranking

        </button>
        <ButtonNewGame history={ history } nameButton="btn-play-again" />
      </div>
    );
  }
}
Feedback.propTypes = {
  score: PropTypes.number.isRequired,
  assertions: PropTypes.number.isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};
const mapStateToProps = (state) => ({
  score: state.player.score,
  assertions: state.player.assertions,
});
export default connect(mapStateToProps)(Feedback);
//
