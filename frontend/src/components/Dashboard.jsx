import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { aubTheme } from '../theme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const QuotaWarning = styled.div`
  background: ${props => props.low ? '#FFF3CD' : '#D1ECF1'};
  color: ${props => props.low ? '#856404' : '#0C5460'};
  padding: 15px 20px;
  border-radius: 8px;
  border-left: 4px solid ${props => props.low ? '#FFC107' : '#17A2B8'};
  margin-bottom: 20px;
  font-weight: 500;
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
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SearchForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 20px;
  align-items: end;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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
  padding: 12px 24px;
  background: ${aubTheme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: ${aubTheme.colors.accent};
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: ${aubTheme.colors.textLight};
    cursor: not-allowed;
    transform: none;
  }
`;

const TripGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
`;

const TripCard = styled.div`
  background: ${aubTheme.colors.surface};
  border: 2px solid ${aubTheme.colors.border};
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${aubTheme.colors.primary};
    box-shadow: ${aubTheme.shadows.medium};
    transform: translateY(-2px);
  }
`;

const RouteHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Route = styled.h4`
  color: ${aubTheme.colors.primary};
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

const Price = styled.div`
  background: ${aubTheme.colors.secondary};
  color: ${aubTheme.colors.primary};
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 16px;
`;

const TripDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${aubTheme.colors.textLight};
  font-size: 14px;
`;

const BookingSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid ${aubTheme.colors.border};
`;

const SeatSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SeatInput = styled.input`
  width: 60px;
  padding: 8px;
  border: 2px solid ${aubTheme.colors.border};
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
  
  &:focus {
    outline: none;
    border-color: ${aubTheme.colors.primary};
  }
`;

const DateInput = styled.input`
  padding: 8px 12px;
  border: 2px solid ${aubTheme.colors.border};
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${aubTheme.colors.primary};
  }
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

const CostDisplay = styled.div`
  font-size: 12px;
  color: ${props => props.canAfford ? aubTheme.colors.textLight : aubTheme.colors.error};
  margin-top: 5px;
`;

function Dashboard({ user, onBookingSuccess }) {
  const [trips, setTrips] = useState([]);
  const [searchParams, setSearchParams] = useState({ from: '', to: '' });
  const [bookingSeats, setBookingSeats] = useState({});
  const [travelDates, setTravelDates] = useState({});

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`http://localhost:3000/trips/search?${query}`);
    const data = await response.json();
    setTrips(data);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTrips(searchParams);
  };

  const handleBooking = async (tripId) => {
    const seats = bookingSeats[tripId] || 1;
    const travelDate = travelDates[tripId] || new Date().toISOString().split('T')[0];
    
    const response = await fetch('http://localhost:3000/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId, seats, travelDate })
    });
    
    const data = await response.json();
    if (data.success) {
      alert(`🎉 Booking successful! Remaining quota: $${data.remainingQuota}`);
      fetchTrips(searchParams);
      if (onBookingSuccess) {
        onBookingSuccess();
      }
    } else {
      alert('❌ ' + data.message);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const getQuotaWarning = () => {
    if (user.quota <= 0) {
      return { message: "⚠️ Your quota is empty! You cannot book any trips until you add more funds.", low: true };
    } else if (user.quota < 50) {
      return { message: `💡 Your quota is running low ($${user.quota}). Consider adding more funds soon.`, low: true };
    } else {
      return { message: `💰 You have $${user.quota} available for bookings.`, low: false };
    }
  };

  const quotaInfo = getQuotaWarning();

  return (
    <Container>
      <QuotaWarning low={quotaInfo.low}>
        {quotaInfo.message}
      </QuotaWarning>

      <Section>
        <SectionTitle>🔍 Search Routes</SectionTitle>
        <SearchForm onSubmit={handleSearch}>
          <InputGroup>
            <Label>From</Label>
            <Input
              type="text"
              placeholder="Origin city (e.g., Beirut)"
              value={searchParams.from}
              onChange={(e) => setSearchParams({...searchParams, from: e.target.value})}
            />
          </InputGroup>
          <InputGroup>
            <Label>To</Label>
            <Input
              type="text"
              placeholder="Destination city (e.g., Jounieh)"
              value={searchParams.to}
              onChange={(e) => setSearchParams({...searchParams, to: e.target.value})}
            />
          </InputGroup>
          <Button type="submit">
            🔍 Search Trips
          </Button>
        </SearchForm>
      </Section>

      <Section>
        <SectionTitle>🚌 Available Trips</SectionTitle>
        {trips.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🚌</EmptyIcon>
            <h3>No trips found</h3>
            <p>Try adjusting your search criteria or check back later for new routes.</p>
          </EmptyState>
        ) : (
          <TripGrid>
            {trips.map(trip => {
              const seats = bookingSeats[trip.id] || 1;
              const totalCost = trip.price * seats;
              const canAfford = user.quota >= totalCost;
              
              return (
                <TripCard key={trip.id}>
                  <RouteHeader>
                    <Route>{trip.from} → {trip.to}</Route>
                    <Price>${trip.price}</Price>
                  </RouteHeader>
                  
                  <TripDetails>
                    <DetailItem>
                      🕐 Departure: {trip.departure}
                    </DetailItem>
                    <DetailItem>
                      💺 Available: {trip.seats} seats
                    </DetailItem>
                  </TripDetails>
                  
                  <BookingSection>
                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                      <SeatSelector>
                        <Label>Seats:</Label>
                        <SeatInput
                          type="number"
                          min="1"
                          max={trip.seats}
                          value={seats}
                          onChange={(e) => setBookingSeats({
                            ...bookingSeats,
                            [trip.id]: parseInt(e.target.value)
                          })}
                        />
                      </SeatSelector>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                        <Label style={{fontSize: '12px'}}>Travel Date:</Label>
                        <DateInput
                          type="date"
                          min={defaultDate}
                          value={travelDates[trip.id] || defaultDate}
                          onChange={(e) => setTravelDates({
                            ...travelDates,
                            [trip.id]: e.target.value
                          })}
                        />
                      </div>
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <CostDisplay canAfford={canAfford}>
                        Total: ${totalCost} {!canAfford && '(Insufficient quota)'}
                      </CostDisplay>
                      <Button 
                        onClick={() => handleBooking(trip.id)}
                        disabled={trip.seats === 0 || !canAfford || user.quota <= 0}
                      >
                        {trip.seats === 0 ? '❌ Sold Out' : 
                         !canAfford ? '💸 Insufficient Quota' : '🎫 Book Now'}
                      </Button>
                    </div>
                  </BookingSection>
                </TripCard>
              );
            })}
          </TripGrid>
        )}
      </Section>
    </Container>
  );
}

export default Dashboard;
