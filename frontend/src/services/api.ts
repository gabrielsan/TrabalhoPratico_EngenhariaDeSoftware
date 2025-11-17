import axios, { type AxiosResponse, AxiosError } from 'axios';
import { toast } from 'react-toastify';

// Determina a baseURL com base no ambiente
const getBaseURL = () => {
  // Verifica se está rodando em Docker (verificando se é frontend em container)
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '80') {
    // Em container Docker, o backend está no serviço chamado 'backend'
    return 'http://backend:3000';
  }
  // Em ambiente de desenvolvimento local
  return 'http://localhost:3000';
};

// Crie a instância do Axios
const api = axios.create({
  baseURL: getBaseURL(),
});

export interface IError {
  message: string,
  errCode: string
}

// Interceptor de requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      (config.headers as Record<string, string>)['authorization'] = `${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    let errorMessage;
    let errCode;
    if (error.response) {
      errorMessage = (error.response.data as { message?: string }).message || 'Erro desconhecido.';
      errCode = (error.response.data as { errCode?: string }).errCode;

      if (errCode === 'EXPIRED_TOKEN') {
        toast.error('Token expirado! Faça login novamente.');
        window.location.href = '/login'; // Redireciona para a página de login
      } else {
        toast.error(errorMessage);
      }
    } else if (error.request) {
      toast.error('Erro de rede. Verifique sua conexão com a internet ou se a API está online.');
    } else {
      toast.error('Erro desconhecido.');
    }
    return Promise.reject(errorMessage);
  }
);

export default api;