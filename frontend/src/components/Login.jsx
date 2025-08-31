import { useState } from 'react';
import styled from 'styled-components';
import { aubTheme } from '../theme';

const Container = styled.div`
  max-width: 450px;
  margin: 0 auto;
  padding: 40px;
  background: ${aubTheme.colors.surface};
  border-radius: 16px;
  box-shadow: ${aubTheme.shadows.medium};
  border-top: 4px solid ${aubTheme.colors.primary};
`;

const Title = styled.h2`
  color: ${aubTheme.colors.primary};
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: ${aubTheme.colors.text};
  font-weight: 500;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid ${aubTheme.colors.border};
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${aubTheme.colors.primary};
  }
`;

const Button = styled.button`
  padding: 14px;
  background: ${aubTheme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background 0.2s;
  
  &:hover {
    background: ${aubTheme.colors.accent};
  }
  
  &:disabled {
    background: ${aubTheme.colors.textLight};
    cursor: not-allowed;
  }
`;

const ToggleSection = styled.div`
  text-align: center;
  margin-top: 20px;
  color: ${aubTheme.colors.textLight};
`;

const ToggleBtn = styled.button`
  background: none;
  border: none;
  color: ${aubTheme.colors.primary};
  cursor: pointer;
  text-decoration: underline;
  font-weight: 500;
  margin-left: 5px;
`;

const Error = styled.div`
  color: ${aubTheme.colors.error};
  font-size: 14px;
  padding: 10px;
  background: #FFEBEE;
  border-radius: 6px;
  border-left: 4px solid ${aubTheme.colors.error};
`;

const DemoSection = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: linear-gradient(135deg, ${aubTheme.colors.secondary}20, ${aubTheme.colors.primary}10);
  border-radius: 8px;
  border: 1px solid ${aubTheme.colors.border};
`;

const DemoTitle = styled.h4`
  color: ${aubTheme.colors.primary};
  margin: 0 0 10px 0;
  font-size: 14px;
`;

const DemoAccount = styled.p`
  margin: 5px 0;
  font-size: 13px;
  color: ${aubTheme.colors.textLight};
  font-family: monospace;
`;

function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const endpoint = isSignup ? '/auth/signup' : '/auth/login';
      console.log('Attempting login to:', `http://localhost:3000${endpoint}`);
      
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        console.log('Login successful, calling onLogin with:', data.user);
        onLogin(data.user);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>{isSignup ? '📝 Create Account' : '🔐 Welcome Back'}</Title>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>Email Address</Label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </InputGroup>
        
        <InputGroup>
          <Label>Password</Label>
          <Input
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </InputGroup>
        
        {isSignup && (
          <InputGroup>
            <Label>Full Name</Label>
            <Input
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </InputGroup>
        )}
        
        {error && <Error>❌ {error}</Error>}
        
        <Button type="submit" disabled={loading}>
          {loading ? '⏳ Please wait...' : (isSignup ? '🚀 Create Account' : '🚌 Login')}
        </Button>
      </Form>
      
      <ToggleSection>
        {isSignup ? 'Already have an account?' : "Don't have an account?"}
        <ToggleBtn onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Login here' : 'Sign up here'}
        </ToggleBtn>
      </ToggleSection>
      
      <DemoSection>
        <DemoTitle>🎯 Demo Accounts</DemoTitle>
        <DemoAccount><strong>Admin:</strong> admin@bus.com / admin123</DemoAccount>
        <DemoAccount><strong>User:</strong> user@bus.com / user123</DemoAccount>
      </DemoSection>
    </Container>
  );
}

export default Login;
