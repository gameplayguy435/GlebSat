import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export const useReCaptchaV3 = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const validateReCaptcha = async (action: string): Promise<string | null> => {
    if (!executeRecaptcha) {
      console.error('reCAPTCHA não inicializado');
      return null;
    }

    try {
      const token = await executeRecaptcha(action);
      if (!token) {
        console.error('Erro ao validar reCAPTCHA!');
        return null;
      }
      return token;
    } catch (error) {
      console.error('Erro ao validar reCAPTCHA:', error);
      return null;
    }
  };

  return { validateReCaptcha };
};