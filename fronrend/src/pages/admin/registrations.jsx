import { useState } from 'react'
import { Layout, theme } from 'antd'
import { Link } from 'react-router-dom'
import AdminHeaderFunc from '../../components/adminHeader'
import EventstsTable from '../../components/eventsTable'

import { Typography } from 'antd'
const { Title, Text } = Typography
import { Button, Empty } from 'antd'
const { Content } = Layout
import { useEvents } from '../../hooks/useEvents';

// Страница Регистрации и мероприятия
// Доступна только администраторам
const Registrations = () => {

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { items: events, loadingEvents, errorEvents } = useEvents();
  const [selectedTab, setSelectedTab] = useState('Future');

  if (events.length === 0) {
    return (
      <>
        <AdminHeaderFunc back='admin-main-page' />
        <Content>
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            description={<Typography.Text style={{ fontSize: '1.5vw', fontFamily: 'pragmatica' }}>На данный момент нет мероприятий</Typography.Text>}
          >
            <Link to={`/admin-main-page`}><Button type="primary">На главную</Button></Link>
          </Empty>
        </Content>
      </>
    );
  }

  // Деление мероприятий на предстоящие и прошедшие
  const currentDate = new Date();
  const pastEvents = events.filter(e => new Date(e.event_time) < currentDate);
  const futureEvents = events.filter(e => new Date(e.event_time) >= currentDate);

  return (

    <Layout style={{ marginTop: '-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%' }}>
      <AdminHeaderFunc back='admin-main-page' />
      <Content>
        <div>
          <Title level={3} style={{ justifySelf: 'center', marginBottom: '1.5%', fontFamily: 'pragmatica', fontSize: '1.5vw', fontWeight: 'lighter' }}>
            МЕРОПРИЯТИЯ
          </Title>
          <div style={{ marginLeft: '5%', marginTop: '1%' }}>
            <Button
              onClick={() => setSelectedTab('Future')}
              type={selectedTab === 'Future' ? 'primary' : 'default'}
              style={{ fontFamily: 'pragmatica', fontSize: '1.6vw', height: '3vw', fontWeight: 'lighter', marginRight: '1%' }}
            >
              Предстоящие
            </Button>
            <Button
              onClick={() => setSelectedTab('Past')}
              type={selectedTab === 'Past' ? 'primary' : 'default'}
              style={{ fontFamily: 'pragmatica', fontSize: '1.6vw', height: '3vw', fontWeight: 'lighter', marginRight: '1%' }}
            >
              Прошедшие
            </Button>
          </div>

          <div style={{ marginLeft: '5%', marginTop: '2%' }}>
            {selectedTab === 'Future' && (
              <>
                <Text style={{ fontSize: '1.3vw' }}>Предстоящие мероприятия</Text>
                <EventstsTable events={futureEvents} status='Future' />
              </>
            )}

            {selectedTab === 'Past' && (
              <>
                <Text style={{ fontSize: '1.3vw' }}>Прошедшие мероприятия</Text>
                <EventstsTable events={pastEvents} status='Past' />
              </>
            )}
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Registrations;
