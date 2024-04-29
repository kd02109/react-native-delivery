import * as z from 'zod';

export const email = z.string().email({message: '이메일 형식을 작성해주세요'});
export const password = z
  .string()
  .min(8, '8글자 이상입니다.')
  .regex(
    /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,}$/,
    '대문자 1개 특수문자1($@^!%*#?&)개 이상이 포함되어야 합니다.',
  );

export const name = z
  .string()
  .min(2, '2글자 이상이어야 합니다.')
  .regex(/^[a-zA-Z가-힣]{2,}$/, '영어, 한글만 사용할 수 있습니다.');

export const signInSchema = z.object({
  email,
  password,
});

export const signUpSchema = z.object({
  name,
  email,
  password,
});

export type SignInSchema = z.infer<typeof signInSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
