import { useState } from 'react';
import { Layout, Typography, Form, Input, DatePicker, Checkbox, Upload, Button, Modal, message } from 'antd';
import AdminHeaderFunc from './adminHeader';
import { InboxOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import axios from 'axios';

import { API_URL } from '../main';
dayjs.extend(utc);

const { Title } = Typography;
const { Content } = Layout;

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

// Страница добавления мероприятия
// Доступна только администратору хора
const AddEvent = () => {

  const [form] = Form.useForm();
  const [showRegistrationFields, setShowRegistrationFields] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onFinish = async (values) => {
    try {
      const file = values.video?.[0]?.originFileObj;

      if (file) {
        const data = new FormData();
        data.append('name_event', values.name_event);
        data.append('description', values.description);
        data.append('event_time', values.event_time.toISOString());
        data.append('photo', file);
        data.append('has_registration', showRegistrationFields);
        data.append('is_deleted', false);
        if (showRegistrationFields) {
          data.append('date_time_open', values.registration_starts_at.toISOString());
          data.append('date_time_close', values.registration_closes_at.toISOString());
          console.log(values.registration_limit)
          if (values.registration_limit !== undefined) {
            data.append('limit_people', values.registration_limit);
          }
        }
        const token = localStorage.getItem('accessToken');

        await axios.post(API_URL + 'events_post/', data, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      message.success('Мероприятие добавлено');
      form.resetFields();
      setIsModalVisible(true); // показать модальное окно
    } catch (err) {
      console.error(err);
      message.error('Ошибка при добавлении мероприятия');
    }
  };

  return (
    <Layout style={{ margin: '-0.5%' }}>
      <AdminHeaderFunc back='admin-registrations' />
      <Content style={{ minHeight: '52vw' }}>
        <div style={{ width: '100%', justifyItems: 'center', marginBottom: '2%' }}>
          <Title style={{ fontSize: '1.5vw', marginTop: '2%', marginBottom: '2%', fontFamily: 'pragmatica' }}>Добавление мероприятия</Title>
          <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            name="rehersal_form"
            labelCol={{ span: 30 }}
            wrapperCol={{ span: 30 }}
            style={{ maxWidth: '50%', minWidth: '40%' }}
            autoComplete="off"
            layout='vertical'
            size='large'
          >
            <Form.Item
              label="Название мероприятия"
              name="name_event"
              rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Описание мероприятия"
              name="description"
              rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item label="Фотография мероприятия" required>
              <Form.Item name="video" rules={[{ required: true, message: 'Пожалуйста, загрузите видео' }]} valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                <Upload.Dragger
                  name="video"
                  beforeUpload={() => false}
                  maxCount={1}
                  listType='picture'
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Для загрузки нажмите или перетащите файл в эту область</p>
                </Upload.Dragger>
              </Form.Item>
            </Form.Item>

            <Form.Item
              name="event_time"
              label="Дата и время проведения мероприятия"
              rules={[{ required: true, message: 'Выберите дату и время' }]}
            >
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DDTHH:mm"
                minuteStep={5}
              />
            </Form.Item>

            <Form.Item
              name="has_registration"
              valuePropName="checked"
            >
              <Checkbox onChange={(e) => setShowRegistrationFields(e.target.checked)}>
                Требуется регистрация
              </Checkbox>
            </Form.Item>
            {showRegistrationFields && (
              <>
                <Form.Item
                  name="registration_starts_at"
                  label="Дата и время начала регистрации"
                  rules={[{ required: true, message: 'Укажите дату и время' }]}
                >
                  <DatePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DDTHH:mm"
                    minuteStep={5}
                  />
                </Form.Item>

                <Form.Item
                  name="registration_closes_at"
                  label="Дата и время закрытия регистрации"
                  rules={[{ required: true, message: 'Укажите дату и время' }]}
                >
                  <DatePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DDTHH:mm"
                    minuteStep={5}
                  />
                </Form.Item>

                <Form.Item
                  name="registration_limit"
                  label="Лимит зрителей"
                  rules={[
                    {
                      type: 'number',
                      min: 1,
                      transform: (value) => value ? Number(value) : undefined,
                      message: 'Введите число больше 0',
                    }
                  ]}
                >
                  <Input type="number" />
                </Form.Item>
              </>
            )}
          </Form>
          <Button type="primary" onClick={() => form.submit()} style={{ minHeight: '2.5vw', minWidth: '6vw', fontSize: '1.5vw', fontFamily: 'pragmatica' }}>
            Сохранить
          </Button>
        </div>
                <Modal
          title="Успешное создание мероприятия"
          open={isModalVisible}
          onOk={() => window.location.reload()} // обновить страницу после нажатия
          onCancel={() => window.location.reload()} // обновить страницу при отмене
          okText="ОК"
          cancelButtonProps={{ style: { display: 'none' } }} // скрыть кнопку отмены
        >
          <p>Мероприятие успешно добавлено!</p>
        </Modal>
      </Content>
    </Layout>
  );
};

export default AddEvent;