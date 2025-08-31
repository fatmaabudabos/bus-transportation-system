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

const RechargeForm = styled.form`
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
  
  &:focus {
    outline: none;
    border-color: ${aubTheme.colors.primary};
  }
`;

const BarcodeInput = styled.input`
  padding: 12px 16px;
  border: 2px solid ${aubTheme.colors.border};
  border-radius: 8px;
  font-size: 16px;
  font-family: monospace;
  background: ${aubTheme.colors.background};
  
  &:focus {
    outline: none;
    border-color: ${aubTheme.colors.primary};
  }
`;

const AmountButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 10px;
  margin-top: 10px;
`;

const AmountButton = styled.button`
  padding: 10px;
  border: 2px solid ${aubTheme.colors.border};
  background: ${props => props.selected ? aubTheme.colors.secondary : aubTheme.colors.surface};
  color: ${props => props.selected ? aubTheme.colors.primary : aubTheme.colors.text};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${aubTheme.colors.primary};
  }
`;

const Button = styled.button`
  padding: 14px 24px;
  background: ${aubTheme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s;
  
  &:hover {
    background: ${aubTheme.colors.accent};
  }
  
  &:disabled {
    background: ${aubTheme.colors.textLight};
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

const BarcodeDemo = styled.div`
  background: ${aubTheme.colors.background};
  padding: 15px;
  border-radius: 8px;
  border: 1px dashed ${aubTheme.colors.border};
  margin-top: 10px;
  font-family: monospace;
  text-align: center;
  color: ${aubTheme.colors.textLight};
`;

function QuotaRecharge({ user, onQuotaUpdate }) {
  const [aubId, setAubId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const presetAmounts = [10, 25, 50, 100, 200];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:3000/user/recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aubId, amount: parseFloat(amount) })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(`✅ ${data.message}. New balance: $${data.newQuota}`);
        setAmount('');
        setAubId('');
        onQuotaUpdate(data.newQuota);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Failed to process recharge');
    } finally {
      setLoading(false);
    }
  };

  const handleAmountSelect = (selectedAmount) => {
    setAmount(selectedAmount.toString());
  };

  return (
    <Section>
      <SectionTitle>💳 Recharge Quota</SectionTitle>
      
      {message && (
        <Message type={message.includes('✅') ? 'success' : 'error'}>
          {message}
        </Message>
      )}
      
      <RechargeForm onSubmit={handleSubmit}>
        <InputGroup>
          <Label>AUB ID Barcode</Label>
          <BarcodeInput
            type="text"
            placeholder="Enter your AUB ID from your student card"
            value={aubId}
            onChange={(e) => setAubId(e.target.value)}
            required
          />
          <BarcodeDemo>
            💡 Find your AUB ID on the back of your student card
          </BarcodeDemo>
        </InputGroup>
        
        <InputGroup>
          <Label>Recharge Amount ($)</Label>
          <Input
            type="number"
            min="1"
            max="500"
            step="0.01"
            placeholder="Enter amount (1-500)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <AmountButtons>
            {presetAmounts.map(preset => (
              <AmountButton
                key={preset}
                type="button"
                selected={amount === preset.toString()}
                onClick={() => handleAmountSelect(preset)}
              >
                ${preset}
              </AmountButton>
            ))}
          </AmountButtons>
        </InputGroup>
        
        <Button type="submit" disabled={loading || !aubId || !amount}>
          {loading ? '⏳ Processing...' : '💰 Recharge Now'}
        </Button>
      </RechargeForm>
    </Section>
  );
}

export default QuotaRecharge;
