const url = 'https://opentdb.com/api_token.php?command=request';

export const fetchApi = async () => {
  const response = await fetch(url);
  const data = await response.json();
  const { token } = data;
  const tokenApi = token;
  localStorage.setItem('token', tokenApi);
  return tokenApi;
};

export const fetchGameApi = async (gameUrl) => {
  const response = await fetch(gameUrl);
  const data = await response.json();
  return data;
};
