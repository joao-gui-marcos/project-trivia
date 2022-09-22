import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { MD5 } from 'crypto-js';
import { fetchApi } from '../services';
import { setName } from '../redux/actions';
/* import logo from '../trivia.png'; */

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      name: '',
      btnDisabled: true,
      loading: true,
    };
  }

  validateLogin = () => {
    const { email, name } = this.state;
    const minLengthName = 1;
    const regexEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi.test(email);

    const stateBolean = regexEmail && name.length >= minLengthName;
    return !stateBolean;
  };

  habiliteBtn = () => (
    this.setState({ btnDisabled: this.validateLogin() })
  );

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value }, () => this.habiliteBtn());
  };

  loginEvent = async () => {
    const { dispatch } = this.props;
    const { email, name } = this.state;
    const gravatarEmail = MD5(email).toString();
    this.setState({ loading: true }, async () => {
      await fetchApi();
      this.setState({ loading: false });
    });

    dispatch(setName({ gravatarEmail, name }));
    // history.push('/game');
  };

  render() {
    const { btnDisabled, loading } = this.state;
    return (
      <main>
        {/* <div className="App">
          <header className="App-header">
            <img src={ logo } className="App-logo" alt="logo" />
            <p>SUA VEZ</p>
          </header>
        </div> */}
        <Link to="/Settings">
          <button type="button" data-testid="btn-settings">Settings</button>
        </Link>
        <form
          id="form-login"
        >
          <label htmlFor="input-player-name">
            Nome:
            <input
              type="name"
              name="name"
              data-testid="input-player-name"
              id="input-player-name"
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="input-gravatar-email">
            Email
            <input
              type="text"
              name="email"
              data-testid="input-gravatar-email"
              id="input-gravatar-email"
              onChange={ this.handleChange }
            />
          </label>
          <button
            data-testid="btn-play"
            type="button"
            disabled={ btnDisabled }
            onClick={ this.loginEvent }
          >
            Play
          </button>
        </form>
        {!loading && <Redirect to="/game" />}
      </main>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(Login);
