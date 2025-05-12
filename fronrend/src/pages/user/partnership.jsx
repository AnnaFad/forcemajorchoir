import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import Header from '/src/components/Header/Header'
import Footer from '/src/components/Footer/Footer'
import backgroundphoto from '/src/assets/partnership-background.jpg'
import { Col, Row } from 'antd';
import { Button, Flex, Typography, Avatar, List  } from 'antd';

import { data } from './partnership_list'; // Список площадок, с которыми сотрудничал хор


const { Title } = Typography;
const { Content } = Layout;

//Страница "Сотрудничество"
export default function Partnership() {

  return (
    <Layout style={{ marginTop: '-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%' }}>
      <Header img={backgroundphoto} title="" mainTitle="СОТРУДНИЧЕСТВО" />
      <Content>
        <Title style={{ fontFamily: 'pragmatica', textAlign: 'center', marginBottom: '3%', fontWeight: 'lighter', fontSize: '2.5vw' }}>Опыт сотрудничества</Title>
        <List
          style={{ marginRight: '20%', marginLeft: '20%', fontSize: '1vw', fontFamily: 'pragmatica' }}
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: page => {
              console.log(page);
            },
            pageSize: 5,
          }}
          dataSource={data}
          renderItem={item => (
            <List.Item
              key={item.title}
              extra={
                <img
                  style={{ maxWidth: '25vw' }}
                  alt="logo"
                  src={item.photo}
                />
              }
            >
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} size={80} />}
                title={item.title}
                description={item.description}
              />
              {item.content}
            </List.Item>
          )}
        />
        <div>
          <Title style={{ fontFamily: 'pragmatica', textAlign: 'center', marginBottom: '3%', fontWeight: 'lighter', fontSize: '2.5vw' }}>Для выступления нам понадобятся: </Title>
          <Row gutter={70} style={{ marginRight: '15%', marginLeft: '15%' }}>
            <Col span={12} style={{ fontFamily: 'pragmatica', fontSize: '1.2vw' }}>
              <div>
                <ul style={{ lineHeight: '180%' }}>
                  <li>5-6 конденсаторных микрофонов для хора и стойки для них. Вместо конденсаторных микрофонов подойдут хорошие подвесные микрофоны</li>
                  <li>2-3 монитора на сцене для хора</li>
                  <li>Синтезатор или фортепиано для распевки</li>
                  <li>Помещения, где хор сможет распеться и оставить вещи</li>
                </ul>
              </div>
            </Col>
            <Col span={12} style={{ fontFamily: 'pragmatica', fontSize: '1.2vw' }}>
              <div>
                <ul style={{ lineHeight: '180%' }}>
                  <li>Возможность включить фонограмму</li>
                  <li>Микшерный пульт минимум 8 каналов + встроенная, либо внешняя пространственная обработка</li>
                  <li>Портальные колонки</li>
                  <li>Комплект коммутации для подключения всего вышеобозначенного</li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <Title style={{ fontFamily: 'pragmatica', textAlign: 'center', marginBottom: '3%', fontWeight: 'lighter', fontSize: '2.5vw' }}>Наш репертуар</Title>
        <p style={{ textAlign: 'center', fontFamily: 'pragmatica', fontWeight: 'lighter', fontSize: '1.2vw' }}>Основой репертуара являются произведения жанров Мюзикл, Джаз и Поп-музыка. Мы исполняем хоровые аранжировки известных песен, зачастую добавляя в номер танцевальные элементы или body percussion. Однако произведения, с которыми мы выступали достаточно разносторонние: мы исполняли песни на русском, английском, португальском и латыни, пели и средневековые хоралы, и рок.
        </p>
        <p style={{ textAlign: 'center', fontFamily: 'pragmatica', fontWeight: 'lighter', fontSize: '1.2vw' }}>Мы постоянно пополняем репертуар новыми произведениями, здесь указана только его часть.</p>
        <Row gutter={70} style={{ marginRight: '15%', marginLeft: '15%', marginBottom: '4%' }}>
          <Col span={12} style={{ fontFamily: 'pragmatica', fontSize: '1.2vw' }}>
            <div>
              <ul style={{ lineHeight: '180%' }}>
                <Title style={{ fontFamily: 'pragmatica', fontSize: '2vw', fontWeight: 'lighter' }}>Основной репертуар:</Title>
                <li>Umbrella</li>
                <li>You're the one (из мюзикла «Бриолин»)</li>
                <li>Mas que Nada</li>
                <li>Попурри из песен мюзикла «Mamma Mia»</li>
                <li>Superstition</li>
                <li>Season of Love (из мюзикла «Rent»)</li>
                <li>White Winter Hymnal</li>
                <li>When I'm 64</li>
                <li>Попурри из песен мюзикла «La La Land»</li>
                <li>Fly me to the moon </li>
                <li>Perfect</li>
                <li>Dream On</li>
                <li>Rise Up</li>
                <li>Под музыку Вивальди</li>
                <li>Студенческий гимн Gaudeamus в современной обработке</li>
                <li>Хоралы Christe eleison, Quia Respexit, Et_incarnatus</li>
              </ul>
            </div>
          </Col>
          <Col span={12} style={{ fontFamily: 'pragmatica', fontSize: '1.2vw' }}>
            <div>
              <ul style={{ lineHeight: '180%' }}>
                <Title style={{ fontFamily: 'pragmatica', fontSize: '2vw', fontWeight: 'lighter' }}>Новогодний репертуар:</Title>
                <li>Новый год (из мюзикла "Норд-Ост")</li>
                <li>Снежинка (из фильма "Чародеи")</li>
                <li>Jingle Bells</li>
                <li>White Christmas</li>
                <li>Tis the season (по мотивам рождественских песен Here we come a-caroling, deck the hall)</li>
                <li>All I want for Christmas</li>
              </ul>
            </div>
            <Flex gap="small" wrap justify='center'>
              <Button
                color="green"
                variant="solid"
                style={{ width: '60%', fontFamily: 'pragmatica', fontSize: '2vw', height: '4vw', fontWeight: 'lighter', marginTop: '20%', marginBottom: '3%' }}>
                <Link to='/about-us'>О нас</Link>
              </Button>
              <Button
                color="blue"
                variant="solid"
                style={{ width: '60%', fontFamily: 'pragmatica', fontSize: '2vw', height: '4vw', fontWeight: 'lighter', marginBottom: '3%' }}>
                <Link to='https://vk.com/hsechoir'>ВКонтакте</Link>
              </Button>
              <Button
                color="red"
                variant="solid"
                style={{ width: '60%', fontFamily: 'pragmatica', fontSize: '2vw', height: '4vw', fontWeight: 'lighter', marginBottom: '5%' }}>
                <Link to='https://youtube.com/@forcemajorchoir?si=A3JW9XNMFuKb8rCt'>YouTube</Link>
              </Button>
            </Flex>
          </Col>
        </Row>
      </Content>
      <Footer />
    </Layout>
  )
}
