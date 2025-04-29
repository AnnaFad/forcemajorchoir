import React from 'react'
import { Layout, theme } from 'antd'
import { Link } from 'react-router-dom'
import { Col, Row } from 'antd'
import photo from './assets/about-us.svg'
import newsphoto from './assets/photo.jpg'
import { Image } from 'antd'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import News from './components/News/News'
import PhotoLeft from './components/TextAndPhoto/PhotoLeft'
import PhotoRight from './components/TextAndPhoto/PhotoRight'
import homepagebackground from './assets/homepage-background.jpg'
import { Typography } from 'antd'
const { Title, Text} = Typography
import { Button, Flex } from 'antd'
const { Content } = Layout
import './App.css'
import { Outlet } from 'react-router-dom'
import {news} from './pages/user/news_list'
import ChoiristersList from './components/choiristersList'
const App = () => {
  const {
    token: { colorBgContainer},
  } = theme.useToken();

  return (
    <Layout style={{marginTop:'-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%'}}>
      <Header img={homepagebackground} mainTitle="ХОР-БЭНД НИУ ВШЭ" title="FORCE МАЖОР"/>
      <Content>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
          }}
        >
<ChoiristersList/>
        <PhotoRight photo='/src/assets/photo2.jpg'/>
        
        <Flex gap="small" wrap justify='center'>
          <Button color="pink" variant="solid" style={{width: '15%', fontFamily: 'pragmatica', fontSize:'180%', height:'70px', fontWeight: 'lighter'}}><Link to='/about-us'>Подробнее</Link></Button>
        </Flex>
        
        
        <Row gutter={200} style={{marginTop:'5%', marginBottom: '2%', justifySelf: 'center'}}>
          <Col span={8} >
            <News title={news[0].title} text={news[0].text_news} img={news[0].photo} />
          </Col>
          <Col span={8}>
          <News title={news[1].title} text={news[1].text_news} img={news[1].photo} />
          </Col>
          <Col span={8}>
          <News title={news[2].title} text={news[2].text_news} img={news[2].photo} />
          </Col>
        </Row>

        <Flex gap="small" wrap justify='center'>
          <Button 
            color="blue" 
            variant="solid" 
            style={{width: '15%', fontFamily: 'pragmatica', fontSize:'180%', height:'70px', fontWeight: 'lighter'}}>
            <Link to='/news'>Все новости</Link>
          </Button>
        </Flex>
        <PhotoLeft />
        <Flex gap="small" wrap justify='center'>
          <Button 
            color="green" 
            variant="solid" 
            style={{width: '30%', fontFamily: 'pragmatica', fontSize:'200%', height:'70px', fontWeight: 'lighter'}}>
            <Link to='/about-rehersal'>Подробнее о наборе в хор-бэнд</Link>
          </Button>
        </Flex>
        <div style={{justifySelf: 'center', justifyItems:'center', textAlign: 'center'}}>
          <div style={{width: '60%', marginBottom: '2%', marginTop: '3%'}}>
          <Title style={{fontFamily:'pragmatica', fontWeight:'lighter'}}>Сотрудничество</Title>
          <Text style={{fontSize: '150%', fontFamily:'pragmatica', fontWeight:'lighter'}}> Мы открыты к творческим проектам, совместным выступлениям и нестандартным коллаборациям!

Напишите нам на почту choir.fm@gmail.com или в <a href='https://vk.com/hsechoir'>соцсети</a> с кратким описанием вашего предложения

Укажите формат (концерт, фестиваль, запись, шоу-программа и т. д.), предположите какие номера вы бы хотели услышать.

Обсудим детали — репертуар, технические требования и возможности.

Готовы адаптировать наше шоу под ваше мероприятие или создать что-то новое вместе!</Text>
          </div>
        
        <Image
        height={550}
        width={800}
        src={'/src/assets/main-page-4.jpg'}
        justify='center'
        />
        <Flex gap="small" wrap justify='center'>
          <Button 
            color="orange" 
            variant="solid" 
            style={{width: '100%', fontFamily: 'pragmatica', fontSize:'180%', height:'70px', fontWeight: 'lighter', marginTop: '5%', marginBottom: '5%'}}>
            <Link to='/partnership'>Подробнее о сотрудничестве</Link>
          </Button>
        </Flex>
        </div>
        </div>
      </Content>
      <Footer/>
      <Outlet />
    </Layout>
  );
};

export default App;
