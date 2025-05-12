import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '/src/assets/logo.svg'
import './Auth.css'
import { DownOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Typography, Layout, Menu } from 'antd';
import axios from 'axios'
import { API_URL } from '../../main';

const { Header, Content } = Layout;

// Элементы для отображения шапки 
const items = [
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
// Хеширование 
async function getSHA256Hash(str) {
  const buf = new TextEncoder().encode(str);
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Страница аутентификации администратора
export default function AdminAuth() {
  const navigate = useNavigate();

  // Отправка данных на сервер и получение токенов
  const onFinish = async (values) => {
    axios.post(API_URL + 'login/', {
      email: values.email,
      password: await getSHA256Hash(values.password),
    })
      .then(response => {
        if (response.status !== 200 && response.status !== 201) return
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);

        // Перенаправление на главную страницу админа
        navigate('/admin-main-page');
      })
      .catch(error => message.error("Неверный логин или пароль"))
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleResetPassword = async () => {
    const password = Math.random().toString(36).slice(-8); //генерация временного пароля
    try {
      await axios.put(API_URL + 'email_change_pass/', {
        email: resetEmail,
        password: await getSHA256Hash(password),
        body_email: `Ваш новый пароль для авторизации на сайте Force МАЖОР: ${password}. Рекомендуем как можно скорее сменить его в целях безопасности.`
      });
      message.success('Письмо с восстановлением отправлено');
      setIsModalVisible(false);
    } catch (error) {
      message.error('Ошибка при отправке письма. Проверьте корректность введенной почты.');
    }
  };

  return (
    <Layout style={{ marginTop: '-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%' }}>
      <Header style={{ display: 'flex', alignItems: 'flex-start', padding: '0px' }}>
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ flex: 1, display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '160%', marginRight: '15%', fontFamily: 'pragmatica', fontWeight: 'lighter' }}

        >
          {items.map(item => (
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
      <Content >
        <div className='appBg'>
          <Form
            className='loginForm'
            size='large'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Typography.Title> Вход в аккаунт</Typography.Title>
            <Form.Item label='Логин' name={'email'} rules={[{ required: true, type: "email", message: 'Пожалуйста, введите логин' }]}>
              <Input placeholder='email' />
            </Form.Item>
            <Form.Item label='Пароль' name={'password'} rules={[{ required: true, message: 'Пожалуйста, введите пароль' }]}>
              <Input.Password placeholder='password' />
            </Form.Item>
            <Button style={{ marginBottom: '5%' }} type='primary' htmlType='submit' block>
              Войти
            </Button>
            <div style={{ justifyItems: 'center', justifySelf: 'center' }}>
              <Typography.Text
                onClick={showModal}
                style={{ marginBottom: '3%', color: 'white', fontSize: '120%', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Не помню пароль
              </Typography.Text>
            </div>
          </Form>
        </div>
        <Modal
          title="Восстановление пароля"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              Отмена
            </Button>,
            <Button key="submit" type="primary" onClick={handleResetPassword}>
              Восстановить пароль
            </Button>,
          ]}
        >
          <Input
            placeholder="Введите вашу почту"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />
        </Modal>
      </Content>
    </Layout>
  )
}

