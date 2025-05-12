import { Layout, theme, Button, Flex, Typography, Col, Row } from 'antd'
import { Link } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import News from './components/News/News'
import PhotoLeft from './components/TextAndPhoto/PhotoLeft'
import PhotoRight from './components/TextAndPhoto/PhotoRight'
import homepagebackground from './assets/homepage-background.jpg'
import './App.css'
import { Outlet } from 'react-router-dom'
import { useNewsThree } from './hooks/useNews';

const { Title, Text } = Typography
const { Content } = Layout

// Главная страница
const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { items: news, loading, error } = useNewsThree();

  // Проверка на наличие новостей
  if (news.length === 0) {
    return <p>Нет новостей</p>;
  }
  return (
    <Layout style={{ marginTop: '-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%' }}>
      <Header img={homepagebackground} mainTitle="ХОР-БЭНД НИУ ВШЭ" title="FORCE МАЖОР" />
      <Content>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
          }}
        >
          <PhotoRight photo='/src/assets/photo2.jpg' />

          <Flex gap="small" wrap justify='center'>
            <Button color="pink" variant="solid"
              style={{ maxWidth: '50%', fontFamily: 'pragmatica', fontSize: '1.7vw', height: '4.5vw', fontWeight: 'lighter', marginTop: '2%', marginBottom: '3%' }}>
              <Link to='/about-us'>Подробнее</Link>
            </Button>
          </Flex>

          <Row gutter={30} style={{ marginTop: '1%', marginBottom: '2%', justifySelf: 'center', justifyContent: 'center' }}>
            <Col span={7} >
              <Link to={`/news/${news[0].id}`}><News title={news[0].title} text={news[0].text_news} img={news[0].photo} /></Link>
            </Col>
            <Col span={7}>
              <Link to={`/news/${news[1].id}`}><News title={news[1].title} text={news[1].text_news} img={news[1].photo} /></Link>
            </Col>
            <Col span={7}>
              <Link to={`/news/${news[2].id}`}><News title={news[2].title} text={news[2].text_news} img={news[2].photo} /></Link>
            </Col>
          </Row>

          <Flex gap="small" wrap justify='center'>
            <Button
              color="blue"
              variant="solid"
              style={{ maxWidth: '50%', fontFamily: 'pragmatica', fontSize: '1.7vw', height: '4.5vw', fontWeight: 'lighter', marginTop: '2%', marginBottom: '3%' }}>
              <Link to='/news'>Все новости</Link>
            </Button>
          </Flex>
          <PhotoLeft />
          <Flex gap="small" wrap justify='center'>
            <Button
              color="green"
              variant="solid"
              style={{ maxWidth: '50%', fontFamily: 'pragmatica', fontSize: '1.7vw', height: '4.5vw', fontWeight: 'lighter', marginTop: '2%', marginBottom: '3%' }}>
              <Link to='/about-rehersal'>Подробнее о наборе в хор-бэнд</Link>
            </Button>
          </Flex>
          <div style={{ justifySelf: 'center', justifyItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '60%', marginBottom: '2%', marginTop: '3%' }}>
              <Title style={{ fontFamily: 'pragmatica', fontWeight: 'lighter', fontSize: '2.5vw', }}>Сотрудничество</Title>
              <Text style={{ fontSize: '1.1vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}> Мы открыты к творческим проектам, совместным выступлениям и нестандартным коллаборациям!

                Напишите нам на почту choir.fm@gmail.com или в <a href='https://vk.com/hsechoir'>соцсети</a> с кратким описанием вашего предложения

                Укажите формат (концерт, фестиваль, запись, шоу-программа и т. д.), предположите какие номера вы бы хотели услышать.

                Обсудим детали — репертуар, технические требования и возможности.

                Готовы адаптировать наше шоу под ваше мероприятие или создать что-то новое вместе!</Text>
            </div>
            <img src={'/src/assets/main-page-4.jpg'} style={{ maxWidth: '60%' }} />
            <div>
              <Button
                color="orange"
                variant="solid"
                style={{ maxWidth: '100%', fontFamily: 'pragmatica', fontSize: '1.7vw', height: '4.5vw', fontWeight: 'lighter', marginTop: '2%', marginBottom: '3%' }}>
                <Link to='/partnership'>Подробнее о сотрудничестве</Link>
              </Button>
            </div>
          </div>
        </div>
      </Content>
      <Footer />
      <Outlet />
    </Layout>
  );
};

export default App;
