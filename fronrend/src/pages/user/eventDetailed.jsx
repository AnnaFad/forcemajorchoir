import { Link, useParams } from 'react-router-dom';
import Footer from '/src/components/Footer/Footer'
import { useEventsOne } from '../../hooks/useEvents';
import { Typography } from 'antd';
import { Button, Flex } from 'antd';
import { Layout, Menu } from 'antd';
import logo from '/src/assets/logo.svg'
import { DownOutlined } from '@ant-design/icons';

const { Content, Header } = Layout;
const { Title, Text } = Typography;

const menuitems = [
  {
    key: 'logo',
    label: (
      <Link to="/" style={{ display: 'flex' }}>
        <img src={logo} alt="Лого" style={{ height: '64px' }} />
      </Link>
    )
  },
  {
    key: 1, label: 'О нас', subItems: [
      { key: 1, label: 'О хоре', path: '/about-us' },
      { key: 2, label: 'Галерея', path: '/gallery' },
    ]
  },
  {
    key: 2, label: 'Набор', subItems: [
      { key: 1, label: 'О наборе', path: '/about-rehersal' },
      { key: 2, label: 'Форма набора', path: '/form-rehersal' },
    ]
  },
  { key: 3, label: 'Новости', path: '/news' },
  { key: 4, label: 'Мероприятия', path: '/events' },
  { key: 5, label: 'Сотрудничество', path: '/partnership' },
];

// Страница с подробной информацией о мероприятии
export default function EventDetailed() {
  const { id } = useParams();
  const { items: neededEvent, loading, error } = useEventsOne(id);
  // Проверка на загрузку и ошибки
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Проверка на пустоту
  if (!neededEvent) {
    return <p>Нет мероприятий</p>;
  }
  // Проверка на наличие регистрации
  const hasRegistration = neededEvent.has_registration;

  const date = new Date(neededEvent.event_time);
  // Форматирование даты мероприятия
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;

  return (
    <Layout style={{ marginTop: '-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%' }}>
      <Header style={{ display: 'flex', alignItems: 'flex-start', padding: '0px' }}>
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ flex: 1, display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '160%', marginRight: '15%', fontFamily: 'pragmatica', fontWeight: 'lighter' }}
        >
          {menuitems.map(item => (
            item.subItems ? (
              <Menu.SubMenu key={item.key} title={item.label} icon={<DownOutlined />}>
                {item.subItems.map(subItem => (
                  <Menu.Item key={subItem.key} style={{ fontFamily: 'pragmatica', fontSize: '120%', fontWeight: 'lighter' }}>
                    <Link to={subItem.path}>{subItem.label}</Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ) : (
              <Menu.Item key={item.key}>
                <Link to={item.path}>{item.label}</Link>
              </Menu.Item>
            )
          ))}
        </Menu>
      </Header>
      <Content>
        <div style={{ justifySelf: 'center', justifyItems: 'center', textAlign: 'center', marginTop: '4%', marginBottom: '2%' }}>
          <img src={neededEvent.photo} style={{ maxWidth: '50%' }} />
          <div style={{ width: '70%', marginBottom: '2%', marginTop: '3%' }}>
            <Title style={{ fontFamily: 'pragmatica', fontWeight: 'lighter', fontSize: '2vw' }}>{neededEvent.name_event}</Title>
            <Text style={{ fontFamily: 'pragmatica', fontWeight: 'lighter', fontSize: '1.2vw' }}>{neededEvent.description}</Text>
            <Title style={{ fontFamily: 'pragmatica', fontWeight: 'lighter', marginBottom: '3%', fontSize: '1.5vw' }}>Дата мероприятия: {formattedDate}</Title>
            <div style={{ justifySelf: 'center', justifyItems: 'center', textAlign: 'center', marginTop: '4%', marginBottom: '2%' }}>
              {hasRegistration ? (
                <Button
                  color="pink"
                  variant="outlined"
                  style={{ width: '100%', fontFamily: 'pragmatica', fontSize: '1.3vw', height: '3vw', fontWeight: 'lighter', marginTop: '3%', marginBottom: '5%' }}>
                  <Link to={`/events/registration/${id}`} style={{ fontSize: '140%' }}>
                    Регистрация
                  </Link>
                </Button>
              ) : (
                <></>
              )}
            </div>
          </div>
          <Flex gap="small" wrap justify='center'>
            <Button
              color="orange"
              variant="solid"
              style={{ width: '100%', fontFamily: 'pragmatica', fontSize: '1.5vw', height: '3.5vw', fontWeight: 'lighter', marginTop: '3%', marginBottom: '5%' }}>
              <Link to='/events'>Все мероприятия</Link>
            </Button>
          </Flex>
        </div>
      </Content>
      <Footer />
    </Layout>
  )
}
