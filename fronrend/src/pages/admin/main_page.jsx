import { useState } from 'react';
import { Layout, Menu, Row, Col, Button, Modal, Form, Input, message } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import photo1 from '/src/assets/admin-main1.jpg';
import photo2 from '/src/assets/admin-main2.jpg';
import { API_URL } from '../../main';
import { useNavigate } from 'react-router-dom';

const { Content, Header } = Layout;

// Хеширование 
async function getSHA256Hash(str) {
  const buf = new TextEncoder().encode(str);
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Главная страница для администратора хора
// Доступна только администраторам
const MainPage = () => {
  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [adminForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const navigate = useNavigate();
  const handleLogOut = () => {

    axios.post(API_URL + 'logout/', {
      refresh_token: localStorage.getItem('refreshToken'),
    })

      .then(response => {
        if (response.status != 200) return
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        navigate('/admin-auth');
      })
      .catch(error => console.error(error))
  }
  // Добавление нового администратора сайта
  const handleAddAdmin = async (values) => {
    const password = Math.random().toString(36).slice(-8); //генерация временного пароля
    const emailBody = `Вы были добавлены в список администраторов хор-бэнда Force МАЖОР. Ваш временный пароль: ${password}. Рекомендуем сменить его в целях безопасности.`;

    try {
      const data = new FormData(); // Используем FormData для отправки
      data.append('email', values.email);
      data.append('password', await getSHA256Hash(password));
      data.append('role_user', 'Admin');
      data.append('body_email', emailBody);

      const token = localStorage.getItem('accessToken');
      await axios.post(API_URL + 'registration/', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Администратор добавлен');
      setAdminModalVisible(false);
      adminForm.resetFields();
    } catch (error) {
      message.error('Ошибка при добавлении администратора');
    }
  };

  // Изменение пароля
  const handleChangePassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('Пароли не совпадают');
      return;
    }

    try {
      const data = new FormData(); // Используем FormData для отправки
      data.append('old_password', await getSHA256Hash(values.oldPassword));
      data.append('new_password', await getSHA256Hash(values.newPassword));

      const token = localStorage.getItem('accessToken');
      await axios.put(API_URL + 'change_pass/', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Пароль успешно изменён');
      setPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      console.log(error.message)
      message.error('Ошибка при смене пароля');
    }
  };

  return (
    <Layout style={{ marginTop: '-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%' }}>
      <Header style={{ display: 'flex', alignItems: 'flex-start', padding: '0px' }}>
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ width: '100%', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter', marginLeft: '4%' }}
        >
          <span onClick={handleLogOut} style={{ color: 'white', cursor: 'pointer' }}>Выйти</span>

        </Menu>
      </Header>
      <Content>
        <Row style={{ marginTop: '3%' }}>
          <Col span={12}>
            <div style={{ textAlign: 'center' }}>
              <img src={photo1} style={{ maxWidth: '80%' }} />
              <Button
                color="blue"
                variant="solid"
                style={{ maxWidth: '50%', fontFamily: 'pragmatica', fontSize: '2vw', height: '4vw', fontWeight: 'lighter', marginTop: '5%', marginBottom: '5%' }}>
                <Link to='/admin-rehersals'>Прослушивания</Link>
              </Button>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ textAlign: 'center' }}>
              <img src={photo2} style={{ maxWidth: '80%', position: 'center' }} />
              <Button
                color="pink"
                variant="solid"
                style={{ maxWidth: '60%', fontFamily: 'pragmatica', fontSize: '2vw', height: '4vw', fontWeight: 'lighter', marginTop: '5%', marginBottom: '5%' }}>
                <Link to='/admin-registrations'>Мероприятия и регистрации</Link>
              </Button>
            </div>
          </Col>
        </Row>

        <div style={{ textAlign: 'center' }}>
          <Button
            color="orange"
            variant="solid"
            style={{ maxWidth: '50%', fontFamily: 'pragmatica', fontSize: '2vw', height: '4vw', fontWeight: 'lighter', marginTop: '2%', marginBottom: '2%' }}>
            <Link to='/admin-edit'>Редактировать информацию</Link>
          </Button>
        </div>

        <Row gutter={0} style={{ marginTop: '3vw', marginBottom: '2vw' }}>
          <Col span={12} style={{ textAlign: 'center' }}>
            <a style={{ fontSize: '1vw' }} onClick={() => setPasswordModalVisible(true)}>Сменить пароль</a>
          </Col>
          <Col span={12} style={{ textAlign: 'center' }}>
            <a style={{ fontSize: '1vw' }} onClick={() => setAdminModalVisible(true)}>Добавить администратора</a>
          </Col>
        </Row>

        {/* Модальное окно для смены пароля */}
        <Modal
          title="Сменить пароль"
          open={passwordModalVisible}
          onCancel={() => setPasswordModalVisible(false)}
          onOk={() => passwordForm.submit()}
          okText="Сменить пароль"
          cancelText="Отмена"
        >
          <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
            <Form.Item name="oldPassword" label="Старый пароль" rules={[{ required: true, message: 'Пожалуйста, введите текущий пароль' }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item name="newPassword" label="Новый пароль" rules={[{ required: true, message: 'Пожалуйста, введите новый' }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item name="confirmPassword" label="Повторите ввод нового пароля" rules={[{ required: true, message: 'Пожалуйста, подтвердите новый пароль' }]}>
              <Input.Password />
            </Form.Item>
          </Form>
        </Modal>

        {/* Модальное окно добавления админа */}
        <Modal
          title="Добавить администратора"
          open={adminModalVisible}
          onCancel={() => setAdminModalVisible(false)}
          onOk={() => adminForm.submit()}
          okText="Добавить администратора"
          cancelText="Отмена"
        >
          <Form form={adminForm} layout="vertical" onFinish={handleAddAdmin}>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Пожалуйста, введите e-mail' }]}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default MainPage;