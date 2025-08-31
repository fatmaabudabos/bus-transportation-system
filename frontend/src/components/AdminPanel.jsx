import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { aubTheme } from '../theme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Section = styled.div`
  background: ${aubTheme.colors.surface};
  padding: 30px;
  border-radius: 16px;
  box-shadow: ${aubTheme.shadows.light};
  border-left: 4px solid ${aubTheme.colors.secondary};
`;

const SectionTitle = styled.h3`
  color: ${aubTheme.colors.primary};
  margin: 0 0 25px 0;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  align-items: end;
  margin-bottom: 30px;
  padding: 25px;
  background: ${aubTheme.colors.background};
  border-radius: 12px;
  border: 2px dashed ${aubTheme.colors.border};
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  grid-column: 1 / -1;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  
  ${props => props.variant === 'primary' ? `
    background: ${aubTheme.colors.primary};
    color: white;
    &:hover { 
      background: ${aubTheme.colors.accent}; 
      transform: translateY(-1px);
    }
  ` : props.variant === 'secondary' ? `
    background: ${aubTheme.colors.secondary};
    color: ${aubTheme.colors.primary};
    &:hover { 
      background: #E6C200; 
      transform: translateY(-1px);
    }
  ` : `
    background: ${aubTheme.colors.error};
    color: white;
    &:hover { 
      background: #D32F2F; 
      transform: translateY(-1px);
    }
  `}
`;

const TripsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TripRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: ${aubTheme.colors.background};
  border: 2px solid ${aubTheme.colors.border};
  border-radius: 12px;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${aubTheme.colors.primary};
    box-shadow: ${aubTheme.shadows.light};
  }
`;

const TripInfo = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 20px;
  align-items: center;
  flex: 1;
`;

const RouteInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Route = styled.div`
  font-weight: 600;
  color: ${aubTheme.colors.primary};
  font-size: 16px;
`;

const TripDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;
`;

const DetailLabel = styled.span`
  font-size: 12px;
  color: ${aubTheme.colors.textLight};
  text-transform: uppercase;
  font-weight: 500;
`;

const DetailValue = styled.span`
  font-weight: 600;
  color: ${aubTheme.colors.text};
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-left: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${aubTheme.colors.textLight};
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

function AdminPanel() {
  const [trips, setTrips] = useState([]);
  const [formData, setFormData] = useState({
    from: '', to: '', departure: '', price: '', seats: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    const response = await fetch('http://localhost:3000/trips');
    const data = await response.json();
    setTrips(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId 
      ? `http://localhost:3000/admin/trips/${editingId}`
      : 'http://localhost:3000/admin/trips';
    
    const response = await fetch(url, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        price: parseFloat(formData.price),
        seats: parseInt(formData.seats)
      })
    });

    const data = await response.json();
    if (data.success) {
      setFormData({ from: '', to: '', departure: '', price: '', seats: '' });
      setEditingId(null);
      fetchTrips();
    }
  };

  const handleEdit = (trip) => {
    setFormData({
      from: trip.from,
      to: trip.to,
      departure: trip.departure,
      price: trip.price.toString(),
      seats: trip.seats.toString()
    });
    setEditingId(trip.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this trip?')) {
      const response = await fetch(`http://localhost:3000/admin/trips/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (data.success) {
        fetchTrips();
      }
    }
  };

  const cancelEdit = () => {
    setFormData({ from: '', to: '', departure: '', price: '', seats: '' });
    setEditingId(null);
  };

  return (
    <Container>
      <Section>
        <SectionTitle>
          {editingId ? '✏️ Edit Trip' : '➕ Add New Trip'}
        </SectionTitle>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>From City</Label>
            <Input
              type="text"
              placeholder="e.g., Beirut"
              value={formData.from}
              onChange={(e) => setFormData({...formData, from: e.target.value})}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>To City</Label>
            <Input
              type="text"
              placeholder="e.g., Jounieh"
              value={formData.to}
              onChange={(e) => setFormData({...formData, to: e.target.value})}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Departure Time</Label>
            <Input
              type="time"
              value={formData.departure}
              onChange={(e) => setFormData({...formData, departure: e.target.value})}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Price ($)</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="25.00"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Total Seats</Label>
            <Input
              type="number"
              placeholder="40"
              value={formData.seats}
              onChange={(e) => setFormData({...formData, seats: e.target.value})}
              required
            />
          </InputGroup>
          <ButtonGroup>
            {editingId && (
              <Button type="button" onClick={cancelEdit}>
                ❌ Cancel
              </Button>
            )}
            <Button type="submit" variant="primary">
              {editingId ? '💾 Update Trip' : '🚌 Add Trip'}
            </Button>
          </ButtonGroup>
        </Form>
      </Section>

      <Section>
        <SectionTitle>🚌 Manage Trips</SectionTitle>
        {trips.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🚌</EmptyIcon>
            <h3>No trips available</h3>
            <p>Add your first trip using the form above.</p>
          </EmptyState>
        ) : (
          <TripsList>
            {trips.map(trip => (
              <TripRow key={trip.id}>
                <TripInfo>
                  <RouteInfo>
                    <Route>{trip.from} → {trip.to}</Route>
                  </RouteInfo>
                  <TripDetail>
                    <DetailLabel>Departure</DetailLabel>
                    <DetailValue>🕐 {trip.departure}</DetailValue>
                  </TripDetail>
                  <TripDetail>
                    <DetailLabel>Price</DetailLabel>
                    <DetailValue>💰 ${trip.price}</DetailValue>
                  </TripDetail>
                  <TripDetail>
                    <DetailLabel>Seats</DetailLabel>
                    <DetailValue>💺 {trip.seats}</DetailValue>
                  </TripDetail>
                </TripInfo>
                <Actions>
                  <Button variant="secondary" onClick={() => handleEdit(trip)}>
                    ✏️ Edit
                  </Button>
                  <Button onClick={() => handleDelete(trip.id)}>
                    🗑️ Delete
                  </Button>
                </Actions>
              </TripRow>
            ))}
          </TripsList>
        )}
      </Section>
    </Container>
  );
}

export default AdminPanel;
