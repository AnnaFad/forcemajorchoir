import React from 'react';
import { Layout, theme } from 'antd';
import { Link } from 'react-router-dom'; // Импортируем Link

import { Image } from 'antd';
import Header from '/src/components/Header/Header'
import Footer from '/src/components/Footer/Footer'
import backgroundphoto from '/src/assets/partnership-background.jpg'
import { Col, Row } from 'antd';
import { Typography } from 'antd';
const { Title, Text} = Typography;
import { Button, Flex } from 'antd';
const { Content } = Layout;
import { data } from './partnership_list';

import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Avatar, List, Space } from 'antd';

const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );
export default function Partnership() {

    return (
        <Layout style={{marginTop:'-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%'}}>
        <Header img={backgroundphoto} title="" mainTitle="СОТРУДНИЧЕСТВО"/>
        <Content>
        <Title style={{fontFamily:'pragmatica', textAlign:'center', marginBottom: '3%', fontWeight: 'lighter'}}>Опыт сотрудничества</Title>
        <List
        style={{marginRight: '20%', marginLeft: '20%', fontSize: '130%', fontFamily:'pragmatica'}}
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
            width={450}
            alt="logo"
            src={item.photo}
          />
        }
      >
        <List.Item.Meta
          avatar={<Avatar src={item.avatar} size={80}/>}
          title={item.title}
          description={item.description}
        />
        {item.content}
      </List.Item>
    )}
  />

        <div>
        <Title style={{fontFamily:'pragmatica', textAlign:'center', marginBottom: '3%'}}>Для выступления нам понадобятся: </Title>
        <Row gutter={70} style={{marginRight:'15%', marginLeft: '15%'}}>
          <Col span={12} style={{fontFamily:'pragmatica', fontSize:'140%'}}>
          <div>
          <ul style={{lineHeight:'180%'}}>
            <li>5-6 конденсаторных микрофонов для хора и стойки для них. Вместо конденсаторных микрофонов подойдут хорошие подвесные микрофоны</li>
            <li>2-3 монитора на сцене для хора</li>
            <li>Синтезатор или фортепиано для распевки</li>
            
            <li>Помещения, где хор сможет распеться и оставить вещи</li>
          </ul>
          </div>
          </Col>
          <Col span={12} style={{fontFamily:'pragmatica', fontSize:'140%'}}>
          <div>
            <ul style={{lineHeight:'180%'}}>
              
              <li>Возможность включить фонограмму</li>
              <li>Микшерный пульт минимум 8 каналов + встроенная, либо внешняя пространственная обработка</li>
              <li>Портальные колонки</li>
              <li>Комплект коммутации для подключения всего вышеобозначенного</li>
            </ul>
          </div>
          </Col>
        </Row>
        </div>
        
        <Title style={{fontFamily:'pragmatica', textAlign:'center', marginBottom: '3%'}}>Наш репертуар</Title>
        <Row gutter={24} style={{textAlign: 'start', marginRight: '5%', marginLeft: '5%'}}>
            <Col className="gutter-row" span={6}>
                <Flex gap="small" wrap justify='center'>
                    <Button 
                        color="green" 
                        variant="solid" 
                        style={{width: '90%', fontFamily: 'pragmatica', fontSize:'180%', height:'70px', fontWeight: 'lighter', marginTop: '5%', marginBottom: '5%'}}>
                        <Link to='/about-us'>О нас</Link>
                    </Button>
                </Flex>
            </Col>
            <Col className="gutter-row" span={6}>
                <Flex gap="small" wrap justify='center'>
                    <Button 
                    color="blue" 
                    variant="solid" 
                    style={{width: '90%', fontFamily: 'pragmatica', fontSize:'180%', height:'70px', fontWeight: 'lighter', marginTop: '5%', marginBottom: '5%'}}>
                    <Link to='https://vk.com/hsechoir'>ВКонтакте</Link>
                    </Button>
                    <Button 
                    color="red" 
                    variant="solid" 
                    style={{width: '90%', fontFamily: 'pragmatica', fontSize:'180%', height:'70px', fontWeight: 'lighter', marginTop: '5%', marginBottom: '5%'}}>
                    <Link to='https://youtube.com/@forcemajorchoir?si=A3JW9XNMFuKb8rCt'>YouTube</Link>
                    </Button>
                </Flex>
            </Col>
        </Row>
    </Content>
    <Footer/>
    </Layout>
      )
  }
  