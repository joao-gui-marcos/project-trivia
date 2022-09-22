import React from 'react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import Ranking from '../pages/Ranking';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockData from './helpers/mockData';

const arrayRanking = [
  {name: "Player 3", score: 134, assertions: 3},
  {name: "Player 1", score: 312, assertions: 5},
  {name: "Player 2", score: 196, assertions: 4},
];

beforeEach(() => {
  localStorage.setItem('ranking', JSON.stringify(arrayRanking));
})

describe('Testando a página ranking', () => {
  test('Verifica se a rota para o ranking está correta', () => {
    const {history} = renderWithRouterAndRedux(<Ranking />, {}, '/ranking');
    expect(history.location.pathname).toBe('/ranking');
  });

  test('Verifica se o titulo está na tela', () => {
    renderWithRouterAndRedux(<Ranking />);

    const title = screen.getByTestId('ranking-title');
    expect(title).toBeInTheDocument();
    
  });

  test('Verifica se o botão de jogar novamente está na tela', () => {
    renderWithRouterAndRedux(<Ranking />);

    const button = screen.getByTestId('btn-go-home');
    expect(button).toBeInTheDocument();
    
  });

  test('Verifica se o nome e a pontuação do jogador estão sendo exibidas corretamente', () => {

    renderWithRouterAndRedux(<Ranking />);

    const nameID = screen.getByTestId('player-name-0')
    const scoreID = screen.getByTestId('player-score-0')

    expect(nameID).toBeInTheDocument();
    expect(scoreID).toBeInTheDocument();

  });

  test('Verifica se é renderizado um novo ranking caso não exista', () => {
    const initialState = {
      player: {
        name: 'Xablau',
        assertions: 3,
        score: 134,
        gravatarEmail: 'Hakuna Matata',
      }
    }
    
    localStorage.clear();

    renderWithRouterAndRedux(<Ranking />, initialState);
    const getStorage = localStorage.getItem('ranking');
    if (getStorage === null) {
      expect(getStorage).toBe(initialState);
    }
  });

  test('Verifica se o ranking está sendo renderizado corretamente', () => {
   
    renderWithRouterAndRedux(<Ranking />);

    arrayRanking.sort((a, b) => {
      if (a.score > b.score) {
        const min = -1;
        return min;
      } if (a.score < b.score) {
        return 1;
      }
      return 0;
    });

    arrayRanking.forEach((player, index) => {
      const nameID = screen.getByTestId(`player-name-${index}`)
      const scoreID = screen.getByTestId(`player-score-${index}`)

      expect(nameID).toBeInTheDocument();
      expect(scoreID).toBeInTheDocument();

      expect(player.name).toBe(mockData[index].name);

      const score = `Acertos: ${mockData[index].assertions} Pontuação: ${mockData[index].score}`
      const valuePlayerScore = `Acertos: ${player.assertions} Pontuação: ${player.score}`
      expect(valuePlayerScore).toBe(score);
    })

  });

  test('Verifica se o botão de jogar novamente está redireciona o usuario para tela inicial', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/ranking');

    const button = screen.getByTestId('btn-go-home');
    userEvent.click(button)
    
    expect(history.location.pathname).toBe('/');    
  });

})