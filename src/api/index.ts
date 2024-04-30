import {SignUpSchema} from '@/schema/schma';
import axios, {AxiosError} from 'axios';

// 에뮬레이터 내부 주소
export const SERVER = 'http://10.0.2.2:3105';

export const instance = axios.create({
  baseURL: SERVER,
});

export async function postSignup(data: SignUpSchema) {
  let message = '';
  try {
    const res = await instance.post('/user', {
      email: data.email,
      name: data.name,
      password: data.password,
    });
    console.log('res :', res);
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
