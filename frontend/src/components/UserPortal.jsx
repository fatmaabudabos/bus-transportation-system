import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { aubTheme } from '../theme';
import Dashboard from './Dashboard';
import ProfileEditor from './ProfileEditor';
import QuotaRecharge from './QuotaRecharge';

const Container = styled.div`
  display: flex;
  gap: 30px;
  
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 280px;
  background: ${aubTheme.colors.surface};
  border-radius: 16px;
  padding: 30px;
  box-shadow: ${aubTheme.shadows.light};
  height: fit-content;
  
  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const MainContent = styled.div`
  flex: 1;
`;

const ProfileSection = styled.div`
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 25px;
  border-bottom: 2px solid ${aubTheme.colors.border};
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, ${aubTheme.colors.primary}, ${aubTheme.colors.accent});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
  margin: 0 auto 15px;
  font-weight: 600;
`;

const UserName = styled.h3`
  color: ${aubTheme.colors.primary};
  margin: 0 0 5px 0;
  font-size: 18px;
`;

const UserEmail = styled.p`
  color: ${aubTheme.colors.textLight};
  margin: 0 0 10px 0;
  font-size: 14px;
`;

const QuotaBadge = styled.div`
  background: ${aubTheme.colors.secondary};
  color: ${aubTheme.colors.primary};
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
`;

const NavMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NavItem = styled.button`
  padding: 12px 16px;
  border: none;
  background: ${props => props.active ? aubTheme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : aubTheme.colors.text};
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &:hover {
    background: ${props => props.active ? aubTheme.colors.accent : aubTheme.colors.hover};
  }
`;

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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, ${aubTheme.colors.primary}10, ${aubTheme.colors.secondary}20);
  padding: 20px;
  border-radius: 12px;
  border: 2px solid ${aubTheme.colors.border};
  text-align: center;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${aubTheme.shadows.medium};
  }
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${aubTheme.colors.primary};
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  color: ${aubTheme.colors.textLight};
  font-size: 12px;
  font-weight: 500;
`;

const TripCard = styled.div`
  background: ${aubTheme.colors.background};
  border: 2px solid ${aubTheme.colors.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${aubTheme.colors.primary};
    box-shadow: ${aubTheme.shadows.light};
    transform: translateY(-1px);
  }
`;

const TripHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const Route = styled.h4`
  color: ${aubTheme.colors.primary};
  margin: 0;
  font-size: 16px;
`;

const Status = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => 
    props.status === 'confirmed' ? '#4CAF5020' :
    props.status === 'completed' ? '#2196F320' : '#FF980020'
  };
  color: ${props => 
    props.status === 'confirmed' ? '#4CAF50' :
    props.status === 'completed' ? '#2196F3' : '#FF9800'
  };
`;

const TripDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  font-size: 14px;
  color: ${aubTheme.colors.textLight};
  margin-bottom: 15px;
`;

const TripActions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 15px;
  border-top: 1px solid ${aubTheme.colors.border};
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  background: ${aubTheme.colors.error};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s;
  
  &:hover {
    background: #D32F2F;
  }
  
  &:disabled {
    background: ${aubTheme.colors.textLight};
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${aubTheme.colors.textLight};
`;

function UserPortal({ user: initialUser }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(initialUser);
  const [userBookings, setUserBookings] = useState([]);
  const [userStats, setUserStats] = useState({ totalTrips: 0, totalSpent: 0, upcomingTrips: 0, completedTrips: 0, quota: 0 });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [bookingsResponse, statsResponse] = await Promise.all([
        fetch('http://localhost:3000/user/bookings'),
        fetch('http://localhost:3000/user/stats')
      ]);
      
      if (bookingsResponse.ok) {
        const bookings = await bookingsResponse.json();
        setUserBookings(bookings);
      }
      
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        setUserStats(stats);
        setUser(prev => ({ ...prev, quota: stats.quota }));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleQuotaUpdate = (newQuota) => {
    setUser(prev => ({ ...prev, quota: newQuota }));
    setUserStats(prev => ({ ...prev, quota: newQuota }));
  };

  const handleCancelTrip = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this trip? You will receive a full refund.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/user/bookings/${bookingId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`✅ Trip cancelled successfully! $${data.refundedAmount} has been refunded to your account.`);
        fetchUserData(); // Refresh data
      } else {
        alert('❌ ' + data.message);
      }
    } catch (error) {
      alert('❌ Failed to cancel trip');
    }
  };

  const renderDashboard = () => (
    <>
      <StatsGrid>
        <StatCard>
          <StatNumber>{userStats.totalTrips}</StatNumber>
          <StatLabel>Total Trips</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>${userStats.totalSpent}</StatNumber>
          <StatLabel>Total Spent</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{userStats.upcomingTrips}</StatNumber>
          <StatLabel>Upcoming</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>${userStats.quota}</StatNumber>
          <StatLabel>Available Quota</StatLabel>
        </StatCard>
      </StatsGrid>
      
      <Section>
        <SectionTitle>🎫 Recent Bookings</SectionTitle>
        {userBookings.slice(0, 3).map(booking => (
          <TripCard key={booking.id}>
            <TripHeader>
              <Route>{booking.from} → {booking.to}</Route>
              <Status status={booking.status}>
                {booking.status === 'confirmed' ? '✅ Confirmed' : 
                 booking.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
              </Status>
            </TripHeader>
            <TripDetails>
              <div>📅 {booking.travelDate}</div>
              <div>🕐 {booking.departure}</div>
              <div>💺 {booking.seats} seat(s)</div>
              <div>💰 ${booking.totalPrice}</div>
            </TripDetails>
            {booking.status === 'confirmed' && (
              <TripActions>
                <CancelButton onClick={() => handleCancelTrip(booking.id)}>
                  ❌ Cancel Trip
                </CancelButton>
              </TripActions>
            )}
          </TripCard>
        ))}
        {userBookings.length === 0 && (
          <EmptyState>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>🎫</div>
            <h3>No bookings yet</h3>
            <p>Start exploring routes and book your first trip!</p>
          </EmptyState>
        )}
      </Section>
    </>
  );

  const renderMyTrips = () => (
    <Section>
      <SectionTitle>🚌 My Trips</SectionTitle>
      {userBookings.length === 0 ? (
        <EmptyState>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>🎫</div>
          <h3>No trips booked yet</h3>
          <p>Start exploring routes and book your first trip!</p>
        </EmptyState>
      ) : (
        userBookings.map(booking => (
          <TripCard key={booking.id}>
            <TripHeader>
              <Route>{booking.from} → {booking.to}</Route>
              <Status status={booking.status}>
                {booking.status === 'confirmed' ? '✅ Confirmed' : 
                 booking.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
              </Status>
            </TripHeader>
            <TripDetails>
              <div>📅 Date: {booking.travelDate}</div>
              <div>🕐 Time: {booking.departure}</div>
              <div>💺 Seats: {booking.seats}</div>
              <div>💰 Price: ${booking.totalPrice}</div>
              <div>🎫 Booking ID: #{booking.id}</div>
              <div>📋 Booked: {booking.bookingDate}</div>
            </TripDetails>
            {booking.status === 'confirmed' && (
              <TripActions>
                <CancelButton onClick={() => handleCancelTrip(booking.id)}>
                  ❌ Cancel Trip
                </CancelButton>
              </TripActions>
            )}
          </TripCard>
        ))
      )}
    </Section>
  );

  return (
    <Container>
      <Sidebar>
        <ProfileSection>
          <Avatar>{user.name.charAt(0).toUpperCase()}</Avatar>
          <UserName>{user.name}</UserName>
          <UserEmail>{user.email}</UserEmail>
          <QuotaBadge>💰 ${user.quota || 0} quota</QuotaBadge>
        </ProfileSection>
        
        <NavMenu>
          <NavItem 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </NavItem>
          <NavItem 
            active={activeTab === 'trips'} 
            onClick={() => setActiveTab('trips')}
          >
            🎫 My Trips
          </NavItem>
          <NavItem 
            active={activeTab === 'search'} 
            onClick={() => setActiveTab('search')}
          >
            🔍 Search & Book
          </NavItem>
          <NavItem 
            active={activeTab === 'recharge'} 
            onClick={() => setActiveTab('recharge')}
          >
            💳 Recharge Quota
          </NavItem>
          <NavItem 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </NavItem>
        </NavMenu>
      </Sidebar>

      <MainContent>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'trips' && renderMyTrips()}
        {activeTab === 'search' && <Dashboard user={user} onBookingSuccess={fetchUserData} />}
        {activeTab === 'recharge' && <QuotaRecharge user={user} onQuotaUpdate={handleQuotaUpdate} />}
        {activeTab === 'profile' && <ProfileEditor user={user} onUserUpdate={handleUserUpdate} />}
      </MainContent>
    </Container>
  );
}

export default UserPortal;
