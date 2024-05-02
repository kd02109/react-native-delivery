import {REFRESH_TOKEN} from '@/lib/constant';
import {getStorage} from '@/lib/encryptedStorage';
import {SignInSchema, SignUpSchema} from '@/schema/schma';
import {UserState} from '@/slice/user';
import axios, {AxiosError, AxiosResponse} from 'axios';

import Config from 'react-native-config';

// 에뮬레이터 내부 주소
export const SERVER = 'http://10.0.2.2:3105';

export const instance = axios.create({
  baseURL: Config.API_URL,
});

export async function postSignup(data: SignUpSchema) {
  let message = '';
  try {
    await instance.post('/user', {
      email: data.email,
      name: data.name,
      password: data.password,
    });
    message = 'sucess';
  } catch (err) {
    console.error(err);
    if (err instanceof AxiosError) {
      message = err.response?.data.message
        ? err.response?.data.message
        : 'axios Error';
    } else if (err instanceof Error) {
      message = '네트워크 통신에 실패했습니다.';
    } else {
      message = 'unknown Error';
    }
    return message;
  } finally {
    return message;
  }
}

export async function postSignIn(data: SignInSchema) {
  try {
    const response = await instance.post<
      SignInSchema,
      AxiosResponse<{data: UserState}>
    >('/login', {
      email: data.email,
      password: data.password,
    });

    return response.data.data;
  } catch (err) {
    let message: string;
    if (err instanceof AxiosError) {
      message = err.response?.data.message
        ? err.response?.data.message
        : 'axios Error';
    } else {
      message = '로그인 실패';
    }
    return message;
  }
}

export async function postWithRefreshToken<T>(path: string) {
  const refreshToken = await getStorage(REFRESH_TOKEN);
  try {
    if (!refreshToken) {
      return '다시 로그인 해주세요';
    }
    const response = await instance.post<any, AxiosResponse<{data: T}>>(
      path,
      {},
      {
        headers: {Authorization: `Bearer ${refreshToken}`},
      },
    );
    return response.data.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const message = err.response?.data.message
        ? (err.response?.data.message as string)
        : '다시 로그인 해주세요';
      throw new Error(message);
    }
    throw new Error('다시 로그인 해주세요');
  }
}

export async function postWithAuthToken<T>(path: string, token: string) {
  const refreshToken = await getStorage(REFRESH_TOKEN);
  try {
    if (!refreshToken) {
      return '다시 로그인 해주세요';
    }
    const response = await instance.post<any, AxiosResponse<{data: T}>>(
      path,
      {},
      {
        headers: {Authorization: token},
      },
    );
    return response.data.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const message = err.response?.data.message
        ? (err.response?.data.message as string)
        : '다시 로그인 해주세요';
      throw new Error(message);
    }
    throw new Error('다시 로그인 해주세요');
  }
}
