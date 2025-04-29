import React, { useState } from 'react';

import { Link, useParams} from 'react-router-dom'; 

import { Image } from 'antd';

import Footer from '/src/components/Footer/Footer'

import { Typography } from 'antd';
const { Title, Text} = Typography;

import { Layout, Menu, theme } from 'antd';

const { Header, Content} = Layout;
import logo from '/src/assets/logo.svg'

import { DownOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Select, Upload} from 'antd';
import {events} from './events_list'

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

const onFinish = values => {
    console.log('Success:', values);
};
const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
};
const normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e === null || e === void 0 ? void 0 : e.fileList;
};
const { TextArea } = Input;

export default function EventForm() {
    const [formData, setFormData] = useState({});
    const isOpen = true;
    const {id} = useParams();
    const neededEvent = events.find(item => item.id === Number(id))
    const onFinish = (values) => {
        // Преобразование данных формы в JSON
        const jsonData = JSON.stringify(values);
        console.log(jsonData); // Вывод JSON в консоль
        // Здесь вы можете отправить jsonData на сервер
    };
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
        <Content style={{marginTop:'3%'}}>
            <div>
            {isOpen ? (
                <div style={{justifyItems: 'center'}}>
                <Title style={{marginBottom: '2%', fontFamily: 'pragmatica', fontWeight:'lighter'}}>{neededEvent.name_event}</Title>
                <Text style={{fontSize:'150%', fontFamily: 'pragmatica'}}>Регистрация</Text>
                <Form
                name="basic"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 30 }}
                style={{ maxWidth: 500, marginTop: '2%', marginBottom:'7%'}}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout='vertical'
                size='large'
              >
                <Form.Item
                  label="ФИО"
                  name="name"
                  rules={[{ required: true, message: 'Пожалуйста, введите ваши ФИО' }]}
                >
                  <Input />
                </Form.Item>
            
                <Form.Item
                    label="e-mail"
                    name="email"
                    rules={[{ required: true, type: "email", message: 'Пожалуйста, укажите валидный e-mail' }]}
                >
                <Input />
                </Form.Item>
            
                <Form.Item >
                    <Button style={{marginTop:'10%', fontSize:'180%', fontFamily:'pragmatica', fontWeight:'lighter', height:'6vh'}} color="pink" variant="solid"  type="primary" htmlType="submit" block>
                    Зарегистрироваться
                  </Button>
                </Form.Item>
              </Form>
                </div>
            ):(
                <div style={{justifySelf: 'center', justifyItems:'center', marginTop: '5%'}}>
                <Title style={{fontFamily:'pragmatica', marginBottom:'4%'}}>К сожалению, регистрация на данное мероприятие закрыта</Title>
                <Text style={{fontFamily:'pragmatica', fontSize: '130%'}}>Следите за нашими выступлениями</Text>
                                <div style={{justifySelf:'center', display:'flex', marginBottom:'25%', marginTop:'4%'}}>
                                    <Button 
                                        color="orange" 
                                        variant="solid" 
                                        style={{width: '80%', fontFamily: 'pragmatica', fontSize:'180%', height:'70px', fontWeight: 'lighter', marginRight: '10%'}}>
                                        <Link to='/events'>Мероприятия Force МАЖОР</Link>
                                    </Button>
                                    <Button 
                                        color="blue" 
                                        variant="solid" 
                                        style={{width: '80%', fontFamily: 'pragmatica', fontSize:'180%', height:'70px', fontWeight: 'lighter'}}>
                                        <Link to='https://vk.com/hsechoir'>ВК</Link>
                                    </Button>
                                </div> 
                </div>
                )}
            </div>
        </Content>
        <Footer/>
      </Layout>
    )
  }
  