// src/app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Configuracao/Firebase/firebaseConf';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err) {
      setError('Email ou senha incorretos');
    }
  };

  return (
    <Container>
      <LoginContainer>
        <ImageContainer>
          <img src="/images/login-image.png" alt="Moda pra gente" />
        </ImageContainer>
        <FormContainer>
          <Title>Olá, acesse sua conta!</Title>
          <Form onSubmit={handleLogin}>
            <InputContainer>
              <Label>E-mail ou CPF</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputContainer>
            <InputContainer>
              <Label>Senha</Label>
              <PasswordInput>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </PasswordToggle>
              </PasswordInput>
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </InputContainer>
            <RecaptchaContainer>
              {/* Adicione o componente reCAPTCHA aqui, se necessário */}
            </RecaptchaContainer>
            <ForgotPasswordLink>Esqueceu a senha?</ForgotPasswordLink>
            <Button type="submit">Entrar na minha conta</Button>
            <Separator>ou entrar com</Separator>
            <SocialButton>Facebook</SocialButton>
            <RegisterLink>Cadastre-se</RegisterLink>
          </Form>
        </FormContainer>
      </LoginContainer>
      <Footer>
        <FooterLink>Precisa de Ajuda?</FooterLink>
        <FooterLink>Política de Privacidade</FooterLink>
      </Footer>
    </Container>
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
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 5px;
  text-align: left;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
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

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px 40px;
  margin-top: 20px;
  background-color: #fff;
  border-top: 1px solid #ddd;
`;

const FooterLink = styled.a`
  font-size: 14px;
  color: #0070f3;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
