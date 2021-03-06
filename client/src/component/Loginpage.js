import React, { useEffect, useContext } from 'react';
import GoogleLogin from 'react-google-login';
import styled from 'styled-components';
import { AuthContext } from 'context/AuthContext';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { LOGIN, SIGNUP } from 'graphql/auth';
import jwt from 'jsonwebtoken';
import { useHistory } from 'react-router-dom';
import LoadingIcon from 'component/share/LoadingIcon';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: #000839;
`;

const Header = styled.header`
  font-size: ${(props) => props.theme.size.lg};
  text-shadow: 2px 2px 2px ${(props) => props.theme.color.shadowPink};
  color: #fff;
`;

export const getGoogleLoginIdToken = () => {
  let idToken = '';
  const hash = window.location.hash;
  if (hash.length > 0) {
    const splitedHash = hash.split('id_token=');
    if (splitedHash.length > 1) {
      idToken = splitedHash[1].split('&')[0];
    }
  }
  return idToken;
};

export default function Loginpags() {
  const [userInfo, setUserInfo] = useContext(AuthContext);
  const [login, { loading: loadingLogin, data: loginResult, error: errorLogin }] = useLazyQuery(LOGIN);
  const [signupMutation, { data: signupResult, error: errorSignup, stopPolling }] = useMutation(SIGNUP);
  const history = useHistory();

  useEffect(() => {
    const googleIdToken = getGoogleLoginIdToken();
    if (googleIdToken) {
      const { sub: googleId, email } = jwt.decode(googleIdToken);
      const userName = email.split('@')[0];
      login({ variables: { name: userName, googleId } });
    }
  }, []);

  useEffect(() => {
    if (loginResult) {
      const { success, token } = loginResult.Login;
      if (success) {
        localStorage.setItem('Bearer', token);
        const { id, name, googleId } = jwt.decode(token);
        setUserInfo({ id, name, googleId });
        history.push('/mainpage');
      } else {
        const googleIdToken = getGoogleLoginIdToken();
        if (googleIdToken) {
          const { sub: googleId, email } = jwt.decode(googleIdToken);
          const userName = email.split('@')[0];
          signupMutation({ variables: { name: userName, googleId } });
        }
      }
    }
  }, [loginResult]);

  useEffect(() => {
    if (signupResult) {
      const { success, token } = signupResult.Signup;
      if (success) {
        localStorage.setItem('Bearer', token);
        const { id, name, googleId } = jwt.decode(token);
        setUserInfo({ id, name, googleId });
        history.push('/mainpage');
      }
    }
  }, [signupResult]);

  return (
    <Section>
      <Header>B Mart</Header>
      <LoadingIcon loader />
      <GoogleLogin
        icon={true}
        clientId={process.env.REACT_APP_GOOGLE_LOGIN_CLIENT_ID}
        cookiePolicy={'single_host_origin'}
        responseType="id_token"
        buttonText="구글 계정으로 로그인"
        uxMode="redirect"
        redirectUri={`${process.env.REACT_APP_PUBLIC_URI}:${process.env.REACT_APP_PUBLIC_PORT}/login`}
      />
    </Section>
  );
}
