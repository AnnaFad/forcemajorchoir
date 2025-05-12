import { useState } from "react";
import { InboxOutlined } from '@ant-design/icons';
import axios from "axios";
import { Typography, Button, Modal, Form, Input, DatePicker, Upload, message, Empty } from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { useRehersalsAll } from "../hooks/useRehersals";
import { API_URL } from "../main";
const { Title } = Typography;

const normFile = e => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e === null || e === void 0 ? void 0 : e.fileList;
};

//Компонента со списком прослушиваний
const RehersalsList = () => {
  const [openModalVisible, setOpenModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showOpenModal = () => setOpenModalVisible(true);
  const handleCancel = () => {
    setOpenModalVisible(false);
    form.resetFields();
  };

  // Получение всех прослушиваний из базы
  const { items: rehersals, loading, error } = useRehersalsAll();

  const handleOpenRehersal = async (values) => {
    try {
      const file = values.photo?.[0]?.originFileObj;
      if (!file) return message.error('Фотография не загружена');

      if (file) {
        const data = new FormData(); // Используем FormData для отправки
        data.append('title', values.title);
        data.append('date_start', new Date().toISOString());
        data.append('date_end', values.date_end.toISOString());

        const token = localStorage.getItem('accessToken');

        await axios.post(API_URL + 'rehersals_post/', data, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        // Создаем новость
        const dataNews = new FormData(); // Используем FormData для отправки файла
        dataNews.append('title', values.newsHeader);
        dataNews.append('text_news', values.newsText);
        dataNews.append('photo', file);

        await axios.post(API_URL + 'news_post/', dataNews, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        message.success('Прослушивание успешно открыто и новость добавлена');
        handleCancel();
        form.resetFields();
        setOpenModalVisible(false);
        window.location.reload(); // обновление страницы
      }
    } catch (err) {
      console.error(err);
      message.error('Ошибка при открытии прослушивания');
    }
  };

  // Проверка на загрузку и ошибки
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Проверка на пустоту
  if (rehersals.length === 0) {
    return (
      <>
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          description={<Typography.Text style={{ fontSize: '1.5vw', fontFamily: 'pragmatica' }}>Нет прослушиваний</Typography.Text>}
        >
          <Button onClick={showOpenModal} type="primary">Открыть прослушивание</Button>
        </Empty>
        {/* Модалка открытия прослушивания */}
        <Modal
          title="Открыть прослушивание"
          open={openModalVisible}
          onCancel={handleCancel}
          onOk={() => form.submit()}
          okText="Открыть"
          cancelText="Отмена"
        >
          <Form form={form} layout="vertical" onFinish={handleOpenRehersal}>
            <Form.Item
              name="title"
              label="Название прослушивания"
              rules={[{ required: true, message: 'Введите название' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="date_end"
              label="Дата окончания"
              rules={[{ required: true, message: 'Выберите дату' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="newsHeader"
              label="Заголовок новости"
              rules={[{ required: true, message: 'Введите заголовок' }]}
            >
              <Input />
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
          </Form>
        </Modal>
      </>
    )
  }
  const lastRehersal = rehersals.find(rehersal => rehersal.is_last);
  const otherRehersals = rehersals.filter(rehersal => !rehersal.is_last);
  const currentDate = new Date();
  console.log(lastRehersal)
  console.log(otherRehersals)
  return (
    <div className="flex flex-col m-8 w-2/5">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {lastRehersal && (
            <>
              {(new Date(lastRehersal.date_end) > currentDate) ? (
                <>
                  <div style={{ marginTop: '2%' }}>
                    <Title style={{ fontFamily: 'pragmatica', fontSize: '1.7vw', justifySelf: 'center', color: 'green' }}>Прослушивание открыто</Title>
                  </div>
                  <div style={{ marginLeft: '3%' }}>
                    <Title style={{ fontWeight: 'lighter', fontFamily: 'pragmatica', fontSize: '1.7vw' }}>Текущее прослушивание</Title>
                    <Title style={{ fontFamily: 'pragmatica', fontSize: '2vw' }}>{lastRehersal.title}</Title>
                    <Button
                      color="blue"
                      variant="solid"
                      style={{ maxWidth: '50%', fontFamily: 'pragmatica', fontSize: '2vw', height: '4vw', fontWeight: 'lighter', marginTop: '2%', marginBottom: '2%' }}>
                      <Link to={`/admin-rehersals/${lastRehersal.id}`}>К спискам</Link>
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginTop: '2%' }}>
                    <Title style={{ fontFamily: 'pragmatica', fontSize: '1.7vw', justifySelf: 'center', color: 'red' }}>Прослушивание закрыто</Title>
                  </div>
                  <div style={{ marginLeft: '3%' }}>
                    <Title style={{ fontWeight: 'lighter', fontFamily: 'pragmatica', fontSize: '1.7vw' }}>Последнее прослушивание</Title>
                    <Title style={{ fontFamily: 'pragmatica', fontSize: '2vw' }}>{lastRehersal.title}</Title>
                    <Button
                      color="green"
                      variant="solid"
                      onClick={showOpenModal}
                      style={{ maxWidth: '50%', fontFamily: 'pragmatica', fontSize: '2vw', height: '4vw', fontWeight: 'lighter', marginTop: '2%', marginBottom: '2%' }}>
                      Открыть прослушивание
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
          <div style={{ marginLeft: '3%' }}>
            <Title style={{ fontWeight: 'lighter', fontFamily: 'pragmatica', fontSize: '1.7vw' }}>Прошедшие:</Title>
            {otherRehersals.map(rehersal => (
              <div style={{ marginBottom: '2%', marginTop: '2%' }}>
                <Link to={`/admin-rehersals/${rehersal.id}`} style={{ fontWeight: 'lighter', fontFamily: 'pragmatica', fontSize: '1.3vw' }} key={rehersal.id}>{rehersal.title}</Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Модалка открытия прослушивания */}
      <Modal
        title="Открыть прослушивание"
        open={openModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Открыть"
      >
        <Form form={form} layout="vertical" onFinish={handleOpenRehersal}>
          <Form.Item
            name="title"
            label="Название прослушивания"
            rules={[{ required: true, message: 'Введите название' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="date_end"
            label="Дата окончания"
            rules={[{ required: true, message: 'Выберите дату' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="newsHeader"
            label="Заголовок новости"
            rules={[{ required: true, message: 'Введите заголовок' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="newsText"
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
        </Form>
      </Modal>
    </div>
  );
};

export default RehersalsList;