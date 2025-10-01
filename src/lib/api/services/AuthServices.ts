import requests from './httpServices';
import { LoginResponse, RegisterResponse } from '../types';



const AuthServices = {

  doLogin: async (email: string, password: string): Promise<LoginResponse> => {
    return requests.post<LoginResponse>('/jwt-auth/v1/token', {
      username: email,
      password: password,
    });
  },

  doRegister: async (fullname: string, email: string, password: string): Promise<RegisterResponse> => {
    return requests.post<RegisterResponse>('/custom/v1/register', {
      fullName: fullname,
      email: email,
      password: password,
    });
  },

};

export default AuthServices;