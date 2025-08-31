import { useState } from 'react';
import styled from 'styled-components';
import { aubTheme } from '../theme';

const Section = styled.div`
  background: ${aubTheme.colors.surface};
  padding: 30px;
  border-radius: 16px;
  box-shadow: ${aubTheme.shadows.light};
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  color: ${aubTheme.colors.primary};
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProfileForm = styled.form`
  display: grid;
  gap: 20px;
  max-width: 500px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${aubTheme.colors.text};
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid ${aubTheme.colors.border};
  border-radius: 8px;
  font-size: 16px;
  background: ${props => props.readOnly ? aubTheme.colors.background : aubTheme.colors.surface};
  
  &:focus {
    outline: none;
    border-color: ${aubTheme.colors.primary};
  }
`;

const QuotaDisplay = styled.div`
  background: linear-gradient(135deg, ${aubTheme.colors.secondary}20, ${aubTheme.colors.primary}10);
  padding: 20px;
  border-radius: 12px;
  border: 2px solid ${aubTheme.colors.border};
  text-align: center;
  margin-bottom: 20px;
`;

const QuotaAmount = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${aubTheme.colors.primary};
  margin-bottom: 5px;
`;

const QuotaLabel = styled.div`
  color: ${aubTheme.colors.textLight};
  font-size: 14px;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background: ${aubTheme.colors.primary};
    color: white;
    &:hover { background: ${aubTheme.colors.accent}; }
  ` : `
    background: ${aubTheme.colors.border};
    color: ${aubTheme.colors.text};
    &:hover { background: ${aubTheme.colors.textLight}; }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 15px;
  ${props => props.type === 'success' ? `
    background: #E8F5E8;
    color: #2E7D32;
    border-left: 4px solid #4CAF50;
  ` : `
    background: #FFEBEE;
    color: #C62828;
    border-left: 4px solid #F44336;
  `}
`;

function ProfileEditor({ user, onUserUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user.name, email: user.email });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:3000/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        onUserUpdate(data.user);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: user.name, email: user.email });
    setIsEditing(false);
    setMessage('');
  };

  return (
    <Section>
      <SectionTitle>👤 Profile & Account</SectionTitle>
      
      <QuotaDisplay>
        <QuotaAmount>${user.quota || 0}</QuotaAmount>
        <QuotaLabel>Available Quota</QuotaLabel>
      </QuotaDisplay>
      
      {message && (
        <Message type={message.includes('success') ? 'success' : 'error'}>
          {message}
        </Message>
      )}
      
      <ProfileForm onSubmit={handleSubmit}>
        <InputGroup>
          <Label>Full Name</Label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            readOnly={!isEditing}
            required
          />
        </InputGroup>
        
        <InputGroup>
          <Label>Email Address</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            readOnly={!isEditing}
            required
          />
        </InputGroup>
        
        <InputGroup>
          <Label>Account Type</Label>
          <Input
            type="text"
            value={user.role === 'admin' ? 'Administrator' : 'Regular User'}
            readOnly
          />
        </InputGroup>
        
        <InputGroup>
          <Label>Member Since</Label>
          <Input type="text" value="September 2024" readOnly />
        </InputGroup>
        
        <ButtonGroup>
          {!isEditing ? (
            <Button type="button" variant="primary" onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile
            </Button>
          ) : (
            <>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? '⏳ Saving...' : '💾 Save Changes'}
              </Button>
              <Button type="button" onClick={handleCancel}>
                ❌ Cancel
              </Button>
            </>
          )}
        </ButtonGroup>
      </ProfileForm>
    </Section>
  );
}

export default ProfileEditor;
