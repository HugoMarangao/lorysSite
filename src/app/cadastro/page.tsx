'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { auth, db } from '../../Configuracao/Firebase/firebaseConf';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import HeaderSecudaria from '@/componente/Header/HeaderSecundaria/Header';
import Footer from '@/componente/Footer/Footer';
import Image from 'next/image';
import crypto from 'crypto'; // Para hashing SHA256

const Cadastro: React.FC = () => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [numero, setNumero] = useState('');
  const [promocoes, setPromocoes] = useState(true);
  const [sms, setSms] = useState(true);
  const [cepError, setCepError] = useState('');
  const [showAddressFields, setShowAddressFields] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      console.log('Tentando criar usuário com email:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Usuário criado com sucesso:', user.uid);
      await setDoc(doc(db, 'users', user.uid), {
        nome,
        cpf,
        dataNascimento,
        telefone,
        email,
        endereco: {
          cep,
          logradouro,
          bairro,
          cidade,
          uf,
          numero,
        },
        promocoes,
        sms,
        type: "user" 
      });
      await sendFacebookLeadEvent(email);
      router.push('/');
      alert('Cadastro realizado com sucesso!');
    } catch (err) {
      console.error('Erro ao cadastrar:', err);
      setError('Erro ao cadastrar: ' + err);
    }
  };
  // Função para enviar o evento de lead para o Facebook
  const sendFacebookLeadEvent = async (email: string) => {
    try {
      await fetch('/api/facebook/sendEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_name: 'cadastro', // Evento de Lead após cadastro
          user_data: {
            em: sha256(email), // Hash do e-mail do usuário (SHA256)
            client_user_agent: navigator.userAgent,
          },
          custom_data: {},
        }),
      });
      console.log('Evento de lead enviado com sucesso para o Facebook');
    } catch (error) {
      console.error('Erro ao enviar evento de lead para o Facebook:', error);
    }
  };

  // Função para calcular o hash SHA256 do e-mail
  function sha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCep = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    setCep(e.target.value);

    if (newCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${newCep}/json/`);
        const data = await response.json();
        if (data.erro) {
          setCepError('CEP não encontrado');
          setLogradouro('');
          setBairro('');
          setCidade('');
          setUf('');
          setShowAddressFields(false);
        } else {
          setCepError('');
          setLogradouro(data.logradouro);
          setBairro(data.bairro);
          setCidade(data.localidade);
          setUf(data.uf);
          setShowAddressFields(true);
        }
      } catch (error) {
        setCepError('Erro ao buscar CEP');
        setShowAddressFields(false);
      }
    } else {
      setCepError('');
      setLogradouro('');
      setBairro('');
      setCidade('');
      setUf('');
      setShowAddressFields(false);
    }
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '') // Remove caracteres não numéricos
      .replace(/(\d{3})(\d)/, '$1.$2') // Coloca o ponto após os 3 primeiros dígitos
      .replace(/(\d{3})(\d)/, '$1.$2') // Coloca o ponto após os 6 primeiros dígitos
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Coloca o traço antes dos 2 últimos dígitos
  };

  const formatDate = (value: string) => {
    return value
      .replace(/\D/g, '') // Remove caracteres não numéricos
      .replace(/(\d{2})(\d)/, '$1/$2') // Coloca a barra após os 2 primeiros dígitos
      .replace(/(\d{2})(\d)/, '$1/$2'); // Coloca a barra após os 4 primeiros dígitos
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
  };

  const handleDataNascimentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataNascimento(formatDate(e.target.value));
  };

  return (
    <>
      <HeaderSecudaria />
      <Container>
        <CadastroContainer>
          <ImageContainer>
            <Image
              src="/images/Banner/banner3.png"
              alt="Logo"
              width={200}
              height={100}
              
            />          </ImageContainer>
          <FormContainer>
            <Title>Novo Cadastro</Title>
            <Form onSubmit={handleCadastro}>
              <InputContainer>
                <Input
                  type="text"
                  value={nome}
                  onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setNome(e.target.value)}
                  required
                  placeholder=" "
                />
                <Label>Nome completo</Label>
              </InputContainer>
              <InputContainer>
                <Input
                  type="text"
                  value={cpf}
                  onChange={handleCpfChange}
                  required
                  placeholder=" "
                />
                <Label>CPF</Label>
              </InputContainer>
              <InputContainer>
                <Input
                  type="text"
                  value={dataNascimento}
                  onChange={handleDataNascimentoChange}
                  required
                  placeholder=" "
                />
                <Label>Data de nascimento (dd/mm/aaaa)</Label>
              </InputContainer>
              <InputContainer>
                <Input
                  type="text"
                  value={telefone}
                  onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setTelefone(e.target.value)}
                  required
                  placeholder=" "
                />
                <Label>Seu telefone</Label>
              </InputContainer>
              <InputContainer>
                <Input
                  type="email"
                  value={email}
                  onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setEmail(e.target.value)}
                  required
                  placeholder=" "
                />
                <Label>E-mail</Label>
              </InputContainer>
              <InputContainer>
                <PasswordInput>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}
                    required
                    placeholder=" "
                  />
                  <Label>Senha</Label>
                  <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </PasswordToggle>
                </PasswordInput>
              </InputContainer>
              <Title>Endereço</Title>
              <EnderecoMessage>Insira o CEP para preenchermos seu endereço.</EnderecoMessage>
              <InputContainer>
                <Input
                  type="text"
                  value={cep}
                  onChange={handleCepChange}
                  required
                  placeholder=" "
                />
                <Label>CEP</Label>
                {cepError && <ErrorMessage>{cepError}</ErrorMessage>}
              </InputContainer>
              {showAddressFields && (
                <>
                  <InputContainer>
                    <Input
                      type="text"
                      value={logradouro}
                      onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setLogradouro(e.target.value)}
                      required
                      placeholder=" "
                      disabled
                    />
                    <Label>Logradouro</Label>
                  </InputContainer>
                  <InputContainer>
                    <Input
                      type="text"
                      value={bairro}
                      onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setBairro(e.target.value)}
                      required
                      placeholder=" "
                      disabled
                    />
                    <Label>Bairro</Label>
                  </InputContainer>
                  <InputContainer>
                    <Input
                      type="text"
                      value={cidade}
                      onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setCidade(e.target.value)}
                      required
                      placeholder=" "
                      disabled
                    />
                    <Label>Cidade</Label>
                  </InputContainer>
                  <InputContainer>
                    <Input
                      type="text"
                      value={uf}
                      onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setUf(e.target.value)}
                      required
                      placeholder=" "
                      disabled
                    />
                    <Label>UF</Label>
                  </InputContainer>
                  <InputContainer>
                    <Input
                      type="text"
                      value={numero}
                      onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setNumero(e.target.value)}
                      required
                      placeholder=" "
                    />
                    <Label>Número</Label>
                  </InputContainer>
                </>
              )}
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  checked={!promocoes}
                  onChange={() => setPromocoes(!promocoes)}
                />
                <CheckboxLabel>Não quero receber e-mails promocionais!</CheckboxLabel>
              </CheckboxContainer>
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  checked={!sms}
                  onChange={() => setSms(!sms)}
                />
                <CheckboxLabel>Não gostaria de receber SMS do pedido!</CheckboxLabel>
              </CheckboxContainer>
              <Button type="submit">Cadastrar</Button>
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </Form>
          </FormContainer>
        </CadastroContainer>
      </Container>
      <Footer/>
    </>
  );
};

export default Cadastro;

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

const CadastroContainer = styled.div`
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

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
`;

const Button = styled.button`
  padding: 15px;
  background: #0070f3;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: #005bb5;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;

const EnderecoMessage = styled.p`
  color: #000;
  font-size: 14px;
  margin-bottom: 20px;
`;
