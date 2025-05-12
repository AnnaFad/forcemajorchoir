import { Link, useParams } from 'react-router-dom';
import Footer from '/src/components/Footer/Footer'
import { Typography } from 'antd';
import { Button, Flex } from 'antd';

import { Layout, Menu, theme } from 'antd';
import logo from '/src/assets/logo.svg'
import { DownOutlined } from '@ant-design/icons';
import { useNewsOne } from '../../hooks/useNews';

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

// Страница Новость
export default function NewsDetailed() {
  const { id } = useParams();
  const { items: neededNews, loading, error } = useNewsOne(id);
  console.log(neededNews, loading, error);

  // Проверка на загрузку и ошибки
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Проверка на пустоту
  if (neededNews.length === 0) {
    return <p>Нет новостей</p>;
  }
  const date = new Date(neededNews.create_at);

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
          <img src={neededNews.photo} style={{ maxWidth: '50%' }} />
          <div style={{ width: '60%', marginBottom: '2%', marginTop: '3%' }}>
            <Title style={{ fontFamily: 'pragmatica', fontWeight: 'lighter', fontSize: '2.3vw' }}>{neededNews.title}</Title>
            <Text style={{ fontSize: '150%', fontFamily: 'pragmatica', fontWeight: 'lighter', fontSize: '1.3vw' }}>{neededNews.text_news}</Text>
            <Title style={{ fontSize: '120%', fontFamily: 'pragmatica', fontWeight: 'lighter', fontSize: '1vw' }}>{formattedDate}</Title>
          </div>
          <Flex gap="small" wrap justify='center'>
            <Button
              color="orange"
              variant="solid"
              style={{ width: '100%', fontFamily: 'pragmatica', fontSize: '2vw', height: '4vw', fontWeight: 'lighter', marginTop: '5%', marginBottom: '5%' }}>
              <Link to='/news'>Все новости</Link>
            </Button>
          </Flex>
        </div>
      </Content>
      <Footer />
    </Layout>
  )
}
