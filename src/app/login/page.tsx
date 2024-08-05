'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Configuracao/Firebase/firebaseConf';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import HeaderSecudaria from '@/componente/Header/HeaderSecundaria/Header';
import Footer from '@/componente/Footer/Footer';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setError('');

    if (!email) {
      setEmailError('Campo obrigatório');
    }

    if (!password) {
      setPasswordError('Campo obrigatório');
    }

    if (email && password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/');
      } catch (err) {
        setError('Usuário não existe');
      }
    }
  };

  const handleCadastroClick = () => {
    router.push('/cadastro');
  };

  return (
    <>
      <HeaderSecudaria />
      <Container>
        <LoginContainer>
          <ImageContainer>
            <img src="/images/Banner/banner3.png" alt="Moda pra gente" />
          </ImageContainer>
          <FormContainer>
            <Title>Olá, acesse sua conta!</Title>
            <Form onSubmit={handleLogin}>
              <InputContainer>
                <Input
                  type="email"
                  value={email}
                  onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setEmail(e.target.value)}
                  required
                  placeholder=" " // Adicione um espaço para garantir que o placeholder funcione corretamente
                />
                <Label>Email ou CPF</Label>
                {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
              </InputContainer>
              <InputContainer>
                <PasswordInput>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}
                    required
                    placeholder=" " // Adicione um espaço para garantir que o placeholder funcione corretamente
                  />
                  <Label>Senha</Label>
                  <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </PasswordToggle>
                </PasswordInput>
                {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
              </InputContainer>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <RecaptchaContainer>
                {/* Adicione o componente reCAPTCHA aqui, se necessário */}
              </RecaptchaContainer>
              <ForgotPasswordLink>Esqueceu a senha?</ForgotPasswordLink>
              <Button type="submit">Entrar na minha conta</Button>
              <Separator>ou entrar com</Separator>
              <SocialButton>Facebook</SocialButton>
              <RegisterLink onClick={handleCadastroClick}>Cadastre-se</RegisterLink>
            </Form>
          </FormContainer>
        </LoginContainer>
       
      </Container>
      <Footer/>
    </>
  );
};

export default Login;

// Styled Components

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
  color: #000;
`;

const LoginContainer = styled.div`
  display: flex;
  width: 80%;
  max-width: 1200px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 80%;
    height: auto;
  }
  @media (max-width: 768px) {
    display: none;
  }
`;

const FormContainer = styled.div`
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: left;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const Label = styled.label`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  background-color: white;
  padding: 0 5px;
  transition: all 0.2s;
  pointer-events: none;
  font-size: 16px;
  color: #999;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 10px 10px 0;
  border: none;
  border-bottom: 2px solid #ddd;
  font-size: 16px;
  &:focus {
    border-bottom: 2px solid #0070f3;
    outline: none;
  }
  &:focus + ${Label},
  &:not(:placeholder-shown) + ${Label} {
    top: -10px;
    font-size: 12px;
    color: #0070f3;
  }
`;

const PasswordInput = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const PasswordToggle = styled.div`
  position: absolute;
  right: 10px;
  cursor: pointer;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;

const RecaptchaContainer = styled.div`
  margin-bottom: 20px;
`;

const ForgotPasswordLink = styled.a`
  font-size: 14px;
  color: #0070f3;
  text-decoration: none;
  margin-bottom: 20px;
  cursor: pointer;
  align-self: flex-end;
`;

const Button = styled.button`
  padding: 15px;
  background: #0070f3;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;

  &:hover {
    background: #005bb5;
  }
`;

const Separator = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
  font-size: 14px;
  color: #999;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ddd;
  }

  &::before {
    margin-right: 10px;
  }

  &::after {
    margin-left: 10px;
  }
`;

const SocialButton = styled.button`
  padding: 15px;
  background: #3b5998;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;

  &:hover {
    background: #2d4373;
  }
`;

const RegisterLink = styled.a`
  font-size: 16px;
  color: #0070f3;
  text-decoration: none;
  text-align: center;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;


