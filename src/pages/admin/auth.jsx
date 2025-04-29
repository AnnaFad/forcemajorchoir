import React from 'react';
import { Link } from 'react-router-dom'; 

import { Typography } from 'antd';
const { Title, Text} = Typography;
import { Flex } from 'antd';
import { Layout, Menu, theme } from 'antd';

const { Header, Content} = Layout;
import logo from '/src/assets/logo.svg'
import './Auth.css'
import { DownOutlined } from '@ant-design/icons';
import { Button, Form, Input} from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios'

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
    axios.post('ваш url указанный в urlpatterns', {

      username: values.login,

      password: values.password,

  })

  .then(response => {

      if (response.status != 201) return

      localStorage.setItem('accessToken', response.data.access);

      localStorage.setItem('refreshToken', response.data.refresh);

  })

  .catch(error => console.error(error))
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

async function getSHA256Hash(str) {
  const buf = new TextEncoder().encode(str);
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
// Вот так можно этот код применить:
getSHA256Hash('example').then(console.log);


const { TextArea } = Input;
export default function AdminAuth() {

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
        <Content >
            <div className='appBg'>
               <Form className='loginForm' size='large'>
                <Typography.Title> Вход в аккаунт</Typography.Title>
                <Form.Item label='Логин' name={'email'} rules={[{required: true, message:'Пожалуйста, введите логин'}]}>
                    <Input placeholder='email'/>
                </Form.Item>
                <Form.Item label='Пароль' name={'password'} rules={[{required: true, message:'Пожалуйста, введите пароль'}]}>
                    <Input.Password placeholder='password'/>
                </Form.Item>
                <Button style={{marginBottom:'5%'}} type='primary' htmlType='submit' block>
                    Войти
                </Button>
                <div style={{justifyItems:'center', justifySelf:'center'}}>
                <Link to='/' style={{marginBottom:'3%', color:'white', fontSize:'120%', textDecoration:'underline'}}>
                    Не помню пароль
                </Link>
                </div>
               </Form>
            </div>
   
        </Content>
      </Layout>
    )
  }
  
  