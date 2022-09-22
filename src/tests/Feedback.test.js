import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import Feedback from '../pages/Feedback';
import App from '../App';

describe('Verifica o componente <Login />', () => {
  test('Se existe um score na tela', () => {
    renderWithRouterAndRedux(<Feedback />);

    const scoreText = screen.getByText(/Score/i);
    expect(scoreText).toBeInTheDocument();
    const scoreValue = screen.getByTestId('header-score');
    expect(scoreValue).toBeInTheDocument();
  });

  test('Se existe um Placar final na tela', () => {
    renderWithRouterAndRedux(<Feedback />);

    const placarText = screen.getByText(/placar final/i);
    expect(placarText).toBeInTheDocument()
    const placarValue = screen.getByTestId('feedback-total-score');
    expect(placarValue).toBeInTheDocument();
   
  });

  test('Se existe o numero de acertos na tela', () => {
    renderWithRouterAndRedux(<Feedback />);

    const acertosText = screen.getByText(/numero de acertos/i);
    expect(acertosText).toBeInTheDocument()
    const acertosValue = screen.getByTestId('feedback-total-question');
    expect(acertosValue).toBeInTheDocument();
  });

  test('Se existe um botão para ver ranking  se ele direciona para a respectiva pagina', () => {
    const { history } = renderWithRouterAndRedux(<App />);

    history.push('/feedback')
    const btnRanking = screen.getByTestId('btn-ranking');
    expect(btnRanking.innerHTML).toBe('Ver Ranking')
    expect(btnRanking).toBeInTheDocument()

    userEvent.click(btnRanking);
    expect(history.location.pathname).toBe('/ranking'); 
  });

  test('Se existe um botão para jogar novamente e se ele direciona para a respectiva pagina', () => {
    const { history } = renderWithRouterAndRedux(<App />);

    history.push('/feedback')
    const btnJogar = screen.getByTestId('btn-play-again');
    expect(btnJogar.innerHTML).toBe('Jogar Novamente')
    expect(btnJogar).toBeInTheDocument();

    userEvent.click(btnJogar);
    expect(history.location.pathname).toBe('/'); 
  });

  test('Se existe a mensagem de feedback "Could be better..." caso tenha acertado menos de 3 questões', () => {
    const initialState = {
      player: {
        name: '',
        assertions: 0,
        score: 0,
        gravatarEmail: ''
      }
    };
    renderWithRouterAndRedux(<Feedback />, initialState );

    const feedbackText = screen.getByTestId('feedback-text');
    expect(feedbackText.innerHTML).toBe('Could be better...')
    expect(feedbackText).toBeInTheDocument();

  });

  test('Se existe a mensagem de feedback "Well Done!" caso tenha acertado 3 ou mais questões', () => {
    const initialState = {
      player: {
        name: '',
        assertions: 3,
        score: 0,
        gravatarEmail: ''
      }
    };
    renderWithRouterAndRedux(<Feedback />, initialState );

    const feedbackText = screen.getByTestId('feedback-text');
    expect(feedbackText.innerHTML).toBe('Well Done!')
    expect(feedbackText).toBeInTheDocument();
  });
});

