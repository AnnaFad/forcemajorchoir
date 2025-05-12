import { Link, useParams } from 'react-router-dom';
import Footer from '/src/components/Footer/Footer'
import { Layout, Menu, Typography, Modal } from 'antd';
import logo from '/src/assets/logo.svg'
import { DownOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { useEventsOne } from '../../hooks/useEvents';
import axios from "axios";
import { API_URL } from '../../main';
import { useState } from 'react';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

// Элементы для отображения шапки
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

const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};

// Страница регистрации на мероприятие
export default function EventForm() {
  const { id } = useParams();

  const { items: neededEvent, loading, error } = useEventsOne(id);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const currentDate = new Date();

  const isOpen = (currentDate <= new Date(neededEvent.date_time_close));

  const onFinish = async (values) => {
    const dataToSend = {
      data_visitor: {
        name: values.name,
        email: values.email,
      },
      event_ID: id,
    };
    console.log(dataToSend)

    try {
      await axios.post(API_URL + 'visitors/', dataToSend);
      setIsModalVisible(true); // показать модальное окно
    } catch (error) {
      console.error('Ошибка при регистрации', error);
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
      <Content style={{ marginTop: '3%' }}>
        <div>
          {isOpen ? (
            <div style={{ justifyItems: 'center' }}>
              <Title style={{ marginBottom: '2%', fontFamily: 'pragmatica', fontWeight: 'lighter', fontSize: '2vw' }}>{neededEvent.name_event}</Title>
              <Text style={{ fontSize: '1.5vw', fontFamily: 'pragmatica' }}>Регистрация</Text>
              <Form
                name="basic"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 30 }}
                style={{ maxWidth: '40vw', marginTop: '2%', marginBottom: '7%' }}
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
                  <Button style={{ marginTop: '10%', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter', height: '5.5vh' }} color="pink" variant="solid" type="primary" htmlType="submit" block>
                    Зарегистрироваться
                  </Button>
                </Form.Item>
              </Form>
            </div>
          ) : (
            <div style={{ justifySelf: 'center', justifyItems: 'center', marginTop: '5%' }}>
              <Title style={{ fontFamily: 'pragmatica', marginBottom: '4%', fontSize: '2vw' }}>К сожалению, регистрация на данное мероприятие закрыта</Title>
              <Text style={{ fontFamily: 'pragmatica', fontSize: '1vw' }}>Следите за нашими выступлениями</Text>
              <div style={{ justifySelf: 'center', display: 'flex', marginBottom: '25%', marginTop: '4%' }}>
                <Button
                  color="orange"
                  variant="solid"
                  style={{ width: '80%', fontFamily: 'pragmatica', fontSize: '1.4vw', height: '3.7vw', fontWeight: 'lighter', marginRight: '10%' }}>
                  <Link to='/events'>Мероприятия Force МАЖОР</Link>
                </Button>
                <Button
                  color="blue"
                  variant="solid"
                  style={{ width: '80%', fontFamily: 'pragmatica', fontSize: '1.4vw', height: '3.7vw', fontWeight: 'lighter' }}>
                  <Link to='https://vk.com/hsechoir'>ВК</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
        <Modal
          title="Успешная регистрация"
          open={isModalVisible}
          onOk={() => window.location.reload()} // обновить страницу после нажатия
          onCancel={() => window.location.reload()} // обновить страницу при отмене
          okText="До встречи!"
          cancelButtonProps={{ style: { display: 'none' } }} // скрыть кнопку отмены
        >
          <p>Спасибо, Вы успешно зарегистрировались!</p>
        </Modal>
      </Content>
      <Footer />
    </Layout>
  )
}
