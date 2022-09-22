import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class FeedbackHeader extends React.Component {
  render() {
    const { gravatarEmail, name, score } = this.props;
    return (
      <div>
        <h1>Feedback Header</h1>
        <img
          src={ `https://www.gravatar.com/avatar/${gravatarEmail}` }
          data-testid="header-profile-picture"
          alt="Foto de Perfil"
        />
        <br />
        <span data-testid="header-player-name">{name}</span>
        <br />
        <span>Score:</span>
        <span data-testid="header-score">{score}</span>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  gravatarEmail: state.player.gravatarEmail,
  name: state.player.name,
  score: state.player.score,
});

FeedbackHeader.propTypes = {
  gravatarEmail: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(FeedbackHeader);
