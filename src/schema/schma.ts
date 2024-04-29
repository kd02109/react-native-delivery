import * as z from 'zod';

export const email = z.string().email({message: '이메일 형식을 작성해주세요'});
export const password = z
  .string()
  .min(8, '8글자 이상입니다.')
  .regex(
    /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$\`~!@$!%*#^?&\\(\\)\-_=+]).{8,}$/,
    '대문자 1개 특수문자1개 이상이 포함되어야 합니다.',
  );

export const signInSchema = z.object({
  email,
  password,
});

export type SignInSchema = z.infer<typeof signInSchema>;
