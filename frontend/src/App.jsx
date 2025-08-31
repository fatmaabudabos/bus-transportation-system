import { useState } from 'react';
import styled from 'styled-components';
import { aubTheme } from './theme';
import Login from './components/Login';
import UserPortal from './components/UserPortal';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${aubTheme.colors.background} 0%, #F0F0F0 100%);
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px 30px;
  background: ${aubTheme.colors.surface};
  border-radius: 12px;
  box-shadow: ${aubTheme.shadows.light};
  border-left: 4px solid ${aubTheme.colors.primary};
`;

const Title = styled.h1`
  color: ${aubTheme.colors.primary};
  margin: 0;
  font-size: 28px;
  font-weight: 700;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const WelcomeText = styled.span`
  color: ${aubTheme.colors.text};
  font-weight: 500;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background: ${aubTheme.colors.primary};
    color: white;
    &:hover { background: ${aubTheme.colors.accent}; }
  ` : props.variant === 'secondary' ? `
    background: ${aubTheme.colors.secondary};
    color: ${aubTheme.colors.primary};
    &:hover { background: #E6C200; }
  ` : `
    background: ${aubTheme.colors.error};
    color: white;
    &:hover { background: #D32F2F; }
  `}
`;

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('portal');

  const handleLogout = async () => {
    await fetch('http://localhost:3000/auth/logout', { method: 'POST' });
    setUser(null);
    setCurrentView('portal');
  };

  if (!user) {
    return (
      <AppContainer>
        <Container>
          <Header>
            <Title>🚌 AUB Bus Transportation</Title>
          </Header>
          <Login onLogin={setUser} />
        </Container>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Container>
        <Header>
          <Title>🚌 AUB Bus Transportation</Title>
          <UserSection>
            <WelcomeText>Welcome, {user.name}!</WelcomeText>
            {user.role === 'admin' && (
              <>
                <Button 
                  variant="secondary"
                  onClick={() => setCurrentView(currentView === 'admin' ? 'portal' : 'admin')}
                >
                  {currentView === 'admin' ? '👤 User Portal' : '⚙️ Admin Panel'}
                </Button>
                <Button 
                  variant="primary"
                  onClick={() => setCurrentView(currentView === 'search' ? 'portal' : 'search')}
                >
                  {currentView === 'search' ? '🏠 Portal' : '🔍 Quick Search'}
                </Button>
              </>
            )}
            {user.role === 'user' && (
              <Button 
                variant="primary"
                onClick={() => setCurrentView(currentView === 'search' ? 'portal' : 'search')}
              >
                {currentView === 'search' ? '🏠 Portal' : '🔍 Quick Search'}
              </Button>
            )}
            <Button onClick={handleLogout}>Logout</Button>
          </UserSection>
        </Header>
        
        {currentView === 'admin' && user.role === 'admin' ? (
          <AdminPanel />
        ) : currentView === 'search' ? (
          <Dashboard user={user} />
        ) : (
          <UserPortal user={user} />
        )}
      </Container>
    </AppContainer>
  );
}

export default App;
