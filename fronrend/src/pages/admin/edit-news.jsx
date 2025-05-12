import { Layout, theme } from 'antd'
import AdminHeaderFunc from '../../components/adminHeader'
import { InboxOutlined } from '@ant-design/icons';
import { Modal, Form, Input, Upload, Card, message } from 'antd'
import { Button } from 'antd'
import { useReducer, useState } from "react";
import { newsReducer, initialState } from "/src/reducers/newsReducer";
import NewsAdmin from '/src/components/NewsAdmin/NewsAdmin'
import axios from "axios";
import add from '/src/assets/add.jpg'
import { useNewsAll } from '../../hooks/useNews'
import { API_URL } from '../../main'

const { Meta } = Card;
const { Content } = Layout

const normFile = e => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e === null || e === void 0 ? void 0 : e.fileList;
};

// Страница редактирования новостей
// Доступна только администраторам
const EditNews = () => {
  const { items: news, loading, error } = useNewsAll();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [state, dispatch] = useReducer(newsReducer, initialState);

  console.log(news, loading, error);

  // Проверка на загрузку и ошибки
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Проверка на пустоту
  if (news.length === 0) {
    return <p>Нет новостей</p>;
  }

  const handleCreateNews = async (values) => {
    try {
      const file = values.photo?.[0]?.originFileObj;

      if (file) {
        const data = new FormData(); // Используем FormData для отправки
        data.append('title', values.title);
        data.append('text_news', values.text_news);
        data.append('photo', file);

        const token = localStorage.getItem('accessToken');

        await axios.post(API_URL + 'news_post/', data, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        form.resetFields();
        setImageUrl('');
        setIsCreateModalVisible(true);
        setIsModalVisible(false);
      }
    } catch (err) {
      console.error(err);
      message.error('Ошибка при добавлении новости');
    }
  };

  return (
    <Layout style={{ marginTop: '-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%' }}>
      <AdminHeaderFunc back='admin-edit' />
      <Content>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5%', justifyContent: 'center', justifySelf: 'center', width: '80%', marginBottom: '3%', marginTop: '4%' }}>
          {/* Виджет для добавления новости*/}
          <Card
            hoverable
            style={{ width: '17vw', marginBottom: '4%' }}
            cover={<img alt="Add news" src={add} />}
            onClick={() => setIsModalVisible(true)}
          >
            <Meta title="Добавить новость" />
          </Card>
          {news.slice(0, 33).map(news_ => (
            <NewsAdmin
              id={news_.id}
              title={news_.title}
              text={news_.text_news}
              photo={news_.photo}
            />
          ))}
        </div>
        {/* Модальное окно создания новости*/}
        <Modal
          title="Создание новости"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleCreateNews}>
            <Form.Item
              name="title"
              label="Заголовок"
              rules={[{ required: true, message: 'Введите заголовок' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="text_news"
              label="Текст новости"
              rules={[{ required: true, message: 'Введите текст' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item name="photo" rules={[{ required: true, message: 'Пожалуйста, загрузите фото' }]} valuePropName="fileList" getValueFromEvent={normFile} required>
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

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ marginTop: '1rem' }}>
                Создать
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        {/*Модальное окно с сообщением об успешном создании новости */}
        <Modal
          title="Успешное создание новости"
          open={isCreateModalVisible}
          onOk={() => window.location.reload()} // обновить страницу после нажатия
          onCancel={() => window.location.reload()} // обновить страницу при отмене
          okText="ОК"
          cancelButtonProps={{ style: { display: 'none' } }} // скрыть кнопку отмены
        >
          <p>Новость успешно добавлена!</p>
        </Modal>
      </Content>
    </Layout>
  );
};

export default EditNews;
