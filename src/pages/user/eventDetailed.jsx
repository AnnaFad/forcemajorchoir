import React from 'react';
import { Link, useParams } from 'react-router-dom'; // Импортируем Link
import { Col, Row } from 'antd';

import Footer from '/src/components/Footer/Footer'
import News from '/src/components/News/News'
import backgroundphoto from '/src/assets/news-background.jpg'
import {events} from './events_list'
import { Typography } from 'antd';
const { Title, Text} = Typography;
import { Button, Flex } from 'antd';
const { Content, Header} = Layout;

import { Image } from 'antd';
import { Layout, Menu, theme } from 'antd';

import logo from '/src/assets/logo.svg'

import { DownOutlined } from '@ant-design/icons';

const items = [
    {
        key: 'logo',
        label: (
            <Link to="/" style={{ display: 'flex'}}>
            <img src={logo} alt="Лого" style={{ height: '64px' }} />
          </Link>
        )
    },
    { key: 1, label: 'О нас', subItems: [
        { key: 1, label: 'О хоре', path: '/about-us' },
        { key: 2, label: 'Галерея', path: '/gallery' },
      ] 
    },
    { key: 2, label: 'Набор', subItems: [
        { key: 1, label: 'О наборе', path: '/about-rehersal' },
        { key: 2, label: 'Форма набора', path: '/form-rehersal' },
      ] 
    },
    { key: 3, label: 'Новости', path: '/news' },
    { key: 4, label: 'Мероприятия', path: '/events' },
    { key: 5, label: 'Сотрудничество', path: '/partnership' },
];


export default function EventDetailed() {
    const {id} = useParams();
    const neededEvent = events.find(item => item.id === Number(id))
    const hasRegistration = neededEvent.has_registration;
    return (
    <Layout style={{marginTop:'-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%'}}>
         <Header style={{ display: 'flex', alignItems: 'flex-start', padding: '0px'}}>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        style={{flex: 1, display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '160%', marginRight: '15%', fontFamily: 'pragmatica', fontWeight: 'lighter'}}
                    >
                    {items.map(item => (
                    item.subItems ? (
                    <Menu.SubMenu key={item.key} title={item.label} icon={<DownOutlined />}>
                    {item.subItems.map(subItem => (
                      <Menu.Item key={subItem.key} style={{fontFamily:'pragmatica', fontSize:'120%', fontWeight: 'lighter'}}>
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
        <div style={{justifySelf: 'center', justifyItems:'center', textAlign: 'center', marginTop:'4%', marginBottom:'2%'}}>
            <Image
                width={600}
                src={neededEvent.photo}
                justify='center'
            />
          <div style={{width: '70%', marginBottom: '2%', marginTop: '3%'}}>
          <Title style={{fontFamily:'pragmatica', fontWeight:'lighter'}}>{neededEvent.name_event}</Title>
          <Text style={{fontSize: '150%', fontFamily:'pragmatica', fontWeight:'lighter'}}>{neededEvent.description}</Text>
          <Title style={{fontSize: '120%', fontFamily:'pragmatica', fontWeight:'lighter', marginBottom:'3%'}}>Дата мероприятия: {neededEvent.event_time}</Title>
          <div style={{justifySelf: 'center', justifyItems:'center', textAlign: 'center', marginTop:'4%', marginBottom:'2%'}}>
            {hasRegistration ? (
              <Button 
                color="pink" 
                variant="outlined" 
                style={{width: '100%', fontFamily: 'pragmatica', fontSize:'150%', height:'60px', fontWeight: 'lighter', marginTop: '3%', marginBottom: '5%'}}>
                <Link to={`/events/registration/${id}`} style={{fontSize:'140%'}}>
                  Регистрация
                </Link>
              </Button>
            ):(
              <></>
            )}
            </div>
            </div>
            <Flex gap="small" wrap justify='center'>
                    <Button 
                    color="orange" 
                    variant="solid" 
                    style={{width: '100%', fontFamily: 'pragmatica', fontSize:'180%', height:'70px', fontWeight: 'lighter', marginTop: '3%', marginBottom: '5%'}}>
                    <Link to='/events'>Все мероприятия</Link>
                    </Button>
            </Flex>
        </div> 
      </Content>
      <Footer/>
    </Layout>
    )
}
  