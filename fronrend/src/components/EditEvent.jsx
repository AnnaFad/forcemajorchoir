import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout, Typography, Form, Input, DatePicker, Checkbox, Upload, Button, message } from 'antd';
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

// Страница редактирования мероприятия
// Доступна только администартору хора
const EditEvent = () => {
  const location = useLocation();
  const {
    id,
    description,
    name,
    photo,
    datetime,
    has_registration,
    datetime_open,
    datetime_close,
    limit_people
  } = location.state || {};

  const [form] = Form.useForm();
  const [showRegistrationFields, setShowRegistrationFields] = useState(has_registration);
  const [changedFields, setChangedFields] = useState(new Set());
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      name_event: name,
      description: description,
      event_time: datetime ? dayjs(datetime).utc() : null,
      has_registration: has_registration,
      registration_closes_at: datetime_close ? dayjs(datetime_close).utc() : null,
      registration_limit: limit_people,
      photo: photo
        ? [{
          uid: '-1',
          name: 'фото.jpg',
          status: 'done',
          url: photo,
        }] : [],
    });
  }, [form, name, description, datetime, has_registration, datetime_close, limit_people, photo]);


  const onFinish = async (values) => {
    try {
      const file = values.photo?.[0]?.originFileObj;
      const hasOldPhoto = photo !== null && photo !== undefined;

      const data = new FormData();
      // Если нет ни нового файла, ни старого фото — это ошибка
      if (!file && !hasOldPhoto) {
        message.error('Пожалуйста, загрузите фотографию');
        return;
      }
      if (!file && photo) {
        const response = await fetch(photo);
        const blob = await response.blob();
        const filename = photo.split('/').pop(); // берём имя из URL
        const fileFromUrl = new File([blob], filename, { type: blob.type });
        data.append('photo', fileFromUrl);
      } else if (file) {
        data.append('photo', file);
      }

      data.append('id', id);
      data.append('name_event', values.name_event);
      data.append('description', values.description);
      data.append('event_time', values.event_time.toISOString());
      data.append('has_registration', values.has_registration);
      data.append('limit_people', values.registration_limit || null);
      data.append('date_time_open', new Date().toISOString());
      data.append('date_time_close', values.registration_closes_at
        ? values.registration_closes_at.toISOString()
        : null);


      const token = localStorage.getItem('accessToken');
      console.log(data)
      await axios.put(API_URL + `edit_event/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Новость успешно обновлена');
      form.resetFields();
      window.location.reload();
    } catch (err) {
      console.error(err);
      message.error('Ошибка при обновлении новости');
    }
  };

  return (
    <Layout style={{ margin: '-0.5%' }}>
      <AdminHeaderFunc back='admin-registrations' />
      <Content style={{ minHeight: '52vw' }}>
        <div style={{ width: '100%', justifyItems: 'center', marginBottom: '2%' }}>
          <Title style={{ fontSize: '1.5vw', marginTop: '2%', marginBottom: '2%', fontFamily: 'pragmatica' }}>Редактирование мероприятия</Title>
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
            onValuesChange={(changed, allValues) => {
              const changedKey = Object.keys(changed)[0];
              setChangedFields(prev => new Set(prev).add(changedKey));
              setSaveSuccess(false); // Скрытие сообщения при новых изменениях
            }}
          >
            <Form.Item
              label="Название мероприятия"
              name="name_event"
              rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}
              hasFeedback={changedFields.has('name_event')}
              validateStatus={changedFields.has('name_event') && saveSuccess ? 'success' : ''}
              help={changedFields.has('name_event') && saveSuccess ? 'Изменения успешно сохранены' : ''}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Описание мероприятия"
              name="description"
              rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}
              hasFeedback={changedFields.has('description')}
              validateStatus={changedFields.has('description') && saveSuccess ? 'success' : ''}
              help={changedFields.has('description') && saveSuccess ? 'Изменения успешно сохранены' : ''}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              label="Фотография мероприятия"
              hasFeedback={changedFields.has('photo')}
              validateStatus={changedFields.has('photo') && saveSuccess ? 'success' : ''}
              help={changedFields.has('photo') && saveSuccess ? 'Изменения успешно сохранены' : ''}
              required
            >
              <Form.Item name="photo" rules={[{ required: true, message: 'Пожалуйста, загрузите фото' }]} valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                <Upload.Dragger
                  name="photo"
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
              label="Дата и время"
              rules={[{ required: true, message: 'Выберите дату и время' }]}
              hasFeedback={changedFields.has('event_time')}
              validateStatus={changedFields.has('event_time') && saveSuccess ? 'success' : ''}
              help={changedFields.has('event_time') && saveSuccess ? 'Изменения успешно сохранены' : ''}
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
                  name="registration_closes_at"
                  label="Дата и время закрытия регистрации"
                  rules={[{ required: true, message: 'Укажите дату и время' }]}
                  hasFeedback={changedFields.has('registration_closes_at')}
                  validateStatus={changedFields.has('registration_closes_at') && saveSuccess ? 'success' : ''}
                  help={changedFields.has('registration_closes_at') && saveSuccess ? 'Изменения успешно сохранены' : ''}
                >
                  <DatePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DDTHH:mm"
                    minuteStep={5}
                  />
                </Form.Item>

                <Form.Item
                  name="registration_limit"
                  label="Лимит участников"
                  rules={[
                    {
                      type: 'number',
                      min: 1,
                      transform: (value) => value ? Number(value) : undefined,
                      message: 'Введите число больше 0',
                    }
                  ]}
                  hasFeedback={changedFields.has('registration_limit')}
                  validateStatus={changedFields.has('registration_limit') && saveSuccess ? 'success' : ''}
                  help={changedFields.has('registration_limit') && saveSuccess ? 'Изменения успешно сохранены' : ''}
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
      </Content>
    </Layout>
  );
};

export default EditEvent;