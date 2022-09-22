import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setGame } from '../redux/actions';

class ButtonNewGame extends React.Component {
  newGame = () => {
    const { history, dispatch } = this.props;
    dispatch(setGame());
    history.push('/');
  };

  render() {
    const { nameButton } = this.props;
    return (
      <button
        type="button"
        data-testid={ nameButton }
        onClick={ this.newGame }
      >
        Jogar Novamente

      </button>
    );
  }
}

ButtonNewGame.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  nameButton: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(ButtonNewGame);
