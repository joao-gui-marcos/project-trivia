import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import Game from '../pages/Game';

const INITIAL_STATE = {
  player: {
    name: 'Joao',
    assertions: 0,
    score: 0,
    gravatarEmail: 'teste@gmail.com'
  }
}

const triviaError = {
  "response_code":3,
  "results":[]
}

const trivia = {
  'response_code': 0,
  'results': [
    {
      'category': "Geography",
      'correct_answer': "Canberra",
      'difficulty': "medium",
      'incorrect_answers': ['Sydney', 'Melbourne', 'Brisbane'],
      'question': "What is the capital of Australia?",
      'type': "multiple",
    },
    {
      'category': "Entertainment: Video Games",
      'correct_answer': "Barrier",
      'difficulty': "medium",
      'incorrect_answers': ['Obsidian', 'Bedrock', 'Block of Diamond'],
      'question': "What block in Minecraft has the highest blast resistance?",
      'type': "multiple",
    },
    {
      'category': "Science: Computers",
      'correct_answer': "Kibibyte",
      'difficulty': "hard",
      'incorrect_answers': ['Kylobyte', 'Kilobyte', 'Kelobyte'],
      'question': "What does the International System of Quantities refer 1024 bytes as?",
      'type': "multiple",
    },
    {
      'category': "Science & Nature",
      'correct_answer': "Malus pumila",
      'difficulty': "mediumm",
      'incorrect_answers': ['Malus americana', 'Pomus domestica', 'Appelus delectica'],
      'question': "What is the Linnean name of the domestic apple tree?",
      'type': "multiple",
    },
    {
      'category': "Entertainment: Books",
      'correct_answer': "False",
      'difficulty': "easy",
      'incorrect_answers': ['True'],
      'question': "Shub-Niggurath is a creature that was created by \tJ. R. R. Tolkien in his novel &quot;The Lord of The Rings&quot;.",
      'type': "boolean",
    },
  ]
}

describe('Testa o componente <Game />', () => {
  test('Verifica se o componente eh renderizado com nome do jogador e perguntas na tela', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(trivia),
    }));
    const {history} = renderWithRouterAndRedux(<App />, INITIAL_STATE, "/game");
    expect(history.location.pathname).toBe('/game');
    expect(screen.getByTestId('header-player-name')).toBeInTheDocument()
    expect(screen.getByTestId('header-player-name')).toHaveTextContent('Joao')
    await waitFor(() => {
      expect(screen.getByTestId('question-category')).toBeInTheDocument()
      expect(screen.getByTestId('question-text')).toBeInTheDocument()
      expect(screen.getByTestId('answer-options')).toBeInTheDocument()
    }); 
  });

  test('Verifica se eh redirecionado para tela de login ao iniciar jogo com token invalido', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(triviaError),
    }));
    const {history} = renderWithRouterAndRedux(<App />, INITIAL_STATE, "/game");
    await waitFor(() => {
      expect(history.location.pathname).toBe('/');
      expect(screen.queryByTestId('header-player-name')).not.toBeInTheDocument()
      expect(screen.queryByTestId('question-category')).not.toBeInTheDocument()
      expect(screen.queryByTestId('question-text')).not.toBeInTheDocument()
      expect(screen.queryByTestId('answer-options')).not.toBeInTheDocument()
    }); 
  });

  test('Verifica se eh possivel responder todas as 5 perguntas e chegar na tela de feedback', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(trivia),
    }));
    const {history} = renderWithRouterAndRedux(<App />, INITIAL_STATE, "/game");
    await waitFor(() => {
      expect(screen.getByTestId('correct-answer')).toBeInTheDocument()
      expect(screen.getByTestId('timer')).toBeInTheDocument()
      expect(screen.getByTestId('timer')).toHaveTextContent('30')
      userEvent.click(screen.getByTestId('correct-answer'))
      expect(screen.getByTestId('btn-next')).toBeInTheDocument()
      userEvent.click(screen.getByTestId('btn-next'))
      userEvent.click(screen.getByTestId('correct-answer'))
      userEvent.click(screen.getByTestId('btn-next'))
      userEvent.click(screen.getByTestId('correct-answer'))
      userEvent.click(screen.getByTestId('btn-next'))
      userEvent.click(screen.getByTestId('correct-answer'))
      userEvent.click(screen.getByTestId('btn-next'))
      userEvent.click(screen.getByTestId('correct-answer'))
      userEvent.click(screen.getByTestId('btn-next'))
      expect(history.location.pathname).toBe('/Feedback');
    }); 
  });

  jest.setTimeout(50000)

  test('Verifica se os botoes das perguntas sao desabilitados apos 30 segundos', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(trivia),
    }));
    renderWithRouterAndRedux(<App />, INITIAL_STATE, "/game");
    await waitFor(() => {
      expect(screen.getByTestId('timer')).toBeInTheDocument()
      expect(screen.getByTestId('correct-answer')).toBeEnabled()
    }); 
    await new Promise((interval) => setTimeout(interval, 32000));
    expect(screen.getByTestId('correct-answer')).toBeDisabled()
  });

})
