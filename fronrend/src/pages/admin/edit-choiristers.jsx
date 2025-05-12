import { useState, useEffect } from 'react';
import { Layout } from 'antd'
import AdminHeaderFunc from '../../components/adminHeader'
import { Table, Space, Tag, Modal, Form, Input, Upload, Select, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import photo from '/src/assets/photo1.jpg'
import { Typography } from 'antd'

import { Button } from 'antd'

import { useChoiristers } from '../../hooks/useChoiristers'
import axios from "axios";
import { API_URL } from '../../main';
import { Col, Row } from 'antd';

const { Title } = Typography
const { Content } = Layout

const normFile = e => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e === null || e === void 0 ? void 0 : e.fileList;
};

// Страница редактирования списка хористов
// Доступна только администраторам
const EditChoiristers = () => {
  const { items: choiristers, loading, error } = useChoiristers();

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedChoirist, setSelectedChoirist] = useState(choiristers[0]);

  const columns = [
    { title: 'Фамилия', dataIndex: 'last_name' },
    { title: 'Имя', dataIndex: 'first_name' },
    { title: 'Партия', dataIndex: 'voice' },
    {
      title: '',
      key: 'edit',
      render: (_, record) => (
        <Space size="middle">
          <span
            style={{ color: '#1677ff', cursor: 'pointer' }}
            onClick={() => {
              setSelectedChoirist(record);
              setEditModalVisible(true);
            }}
          >
            Редактировать описание
          </span>
        </Space>
      ),
    },
    {
      title: '',
      key: 'delete',
      render: (_, record) => (
        <Space size="middle">
          <span
            style={{ color: 'red', cursor: 'pointer' }}
            onClick={() => {
              setSelectedChoirist(record);
              setDeleteModalVisible(true);
            }}
          >
            Удалить
          </span>
        </Space>
      ),
    },
  ];


  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();


  useEffect(() => {
    if (isEditModalVisible && selectedChoirist) {
      editForm.setFieldsValue({
        first_name: selectedChoirist.first_name,
        last_name: selectedChoirist.last_name,
        voice: selectedChoirist.voice,
        photo: selectedChoirist.photo
          ? [{
            uid: '-1',
            name: 'фото.jpg',
            status: 'done',
            url: selectedChoirist.photo,
          }]
          : [],
      });
    }
  }, [isEditModalVisible, selectedChoirist]);

  const dataSource = choiristers.map(choirister => ({
    key: choirister.id,
    first_name: choirister.first_name,
    last_name: choirister.last_name,
    voice: choirister.voice,
    photo: choirister.photo
  }));

  const handleCreateChoirister = async (values) => {
    try {
      const file = values.photo?.[0]?.originFileObj;

      if (file) {
        const data = new FormData(); // Используем FormData для отправки файла
        data.append('first_name', values.first_name);
        data.append('last_name', values.last_name);
        data.append('voice', values.voice);
        data.append('photo', file);

        const token = localStorage.getItem('accessToken');

        await axios.post(API_URL + 'choiristers/', data, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        message.success('Хорист добавлен');
        createForm.resetFields();
        setAddModalVisible(false);
        window.location.reload(); // обновление страницы
      }
    } catch (err) {
      console.error(err);
      message.error('Ошибка при добавлении хориста');
    }
  };

  // Подтверждение редактирования хориста
  const handleEditChoirister = async (values) => {
    try {
      const file = values.photo?.[0]?.originFileObj;
      const hasOldPhoto = photo !== null && photo !== undefined;

      console.log(file)
      console.log(hasOldPhoto)
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

      data.append('id', selectedChoirist?.key);
      data.append('first_name', values.first_name);
      data.append('last_name', values.last_name);
      data.append('voice', values.voice);
      data.append('is_deleted', false);

      if (file) {
        data.append('photo', file);
      } else {
        data.append('photo', photo);
      }
      const token = localStorage.getItem('accessToken');
      console.log(data)
      await axios.put(API_URL + `edit_choirister/${selectedChoirist?.key}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Данные хориста успешно обновлены');
      editForm.resetFields();
      setEditModalVisible(false);
      //window.location.reload();

    } catch (err) {
      console.error(err);
      message.error('Ошибка при обновлении хориста');
    }
  };

  return (
    <Layout style={{ marginTop: '-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%' }}>
      <AdminHeaderFunc back='admin-edit' />
      <Content>
        <Title style={{ fontFamily: 'pragmatica', fontSize: '2vw', fontWeight: 'lighter', justifySelf: 'center', marginTop: '2%' }}>Состав хор-бэнда Force МАЖОР</Title>
        <Title style={{ fontFamily: 'pragmatica', fontSize: '1.5vw', fontWeight: 'lighter', marginLeft: '5%' }}>Руководитель:</Title>
        <div style={{ display: 'flex' }}>
          <p style={{ fontFamily: 'pragmatica', fontSize: '1.5vw', marginLeft: '5%' }}>Светлана Сперанская</p>
        </div>
        <Title style={{ fontFamily: 'pragmatica', fontSize: '1.5vw', fontWeight: 'lighter', marginLeft: '5%' }}>Состав:</Title>
        <Button
          color="pink"
          variant="solid"
          style={{ maxWidth: '50%', fontFamily: 'pragmatica', fontSize: '1.3vw', height: '3vw', fontWeight: 'lighter', marginTop: '1%', marginBottom: '3%', marginLeft: '5%' }}
          onClick={() => setAddModalVisible(true)}
        >
          Добавить хориста
        </Button>

        <Table
          style={{ maxWidth: '100%', marginLeft: '5%', marginRight: '5%' }}
          size="large"
          columns={columns}
          dataSource={dataSource}
        />

        {/* Модальные окна */}
        <Modal
          title="Добавление хориста"
          open={isAddModalVisible}
          onCancel={() => setAddModalVisible(false)}
          footer={null}
          style={{ minWidth: '40%' }}
          cancelText="Отмена"
        >
          <Form
            form={createForm}
            layout="vertical"
            onFinish={handleCreateChoirister}
          >
            <Row gutter={30}>
              <Col span={12}>
                <Form.Item
                  label="Фотография хориста"
                  required
                  name="photo"
                  rules={[{ required: true, message: 'Пожалуйста, загрузите фото' }]}
                  valuePropName="fileList"
                  getValueFromEvent={normFile}>
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
              </Col>
              <Col span={12}>
                <Form.Item name="first_name" label="Имя" rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="last_name" label="Фамилия" rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  name="voice"
                  label="Партия"
                  rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}
                >
                  <Select
                    placeholder="Выберите один из предложенных вариантов"
                  >
                    <Option value="Первое сопрано">Первое сопрано</Option>
                    <Option value="Второе сопрано">Второе сопрано</Option>
                    <Option value="Первый альт">Первый альт</Option>
                    <Option value="Второй альт">Второй альт</Option>
                    <Option value="Первый тенор">Первый тенор</Option>
                    <Option value="Второй тенор">Второй тенор</Option>
                    <Option value="Баритон">Баритон</Option>
                    <Option value="Бас">Бас</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ marginTop: '1rem' }}>
                Создать
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Редактировать хориста"
          open={isEditModalVisible}
          onCancel={() => setEditModalVisible(false)}
          footer={null}
        >
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleEditChoirister}
          >
            <Row gutter={30}>
              <Col span={12}>
                <Form.Item
                  label="Фотография хориста"
                  required
                >
                  <Form.Item
                    name="photo"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]} noStyle>
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
              </Col>
              <Col span={12}>
                <Form.Item name="first_name" label="Имя" rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="last_name" label="Фамилия" rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  name="voice"
                  label="Партия"
                  rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}
                >
                  <Select placeholder="Выберите партию">
                    <Option value="Первое сопрано">Первое сопрано</Option>
                    <Option value="Второе сопрано">Второе сопрано</Option>
                    <Option value="Первый альт">Первый альт</Option>
                    <Option value="Второй альт">Второй альт</Option>
                    <Option value="Первый тенор">Первый тенор</Option>
                    <Option value="Второй тенор">Второй тенор</Option>
                    <Option value="Баритон">Баритон</Option>
                    <Option value="Бас">Бас</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ marginTop: '1rem' }}>
                Сохранить изменения
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Подтверждение удаления"
          open={isDeleteModalVisible}
          onCancel={() => setDeleteModalVisible(false)}
          onOk={() => {
            console.log(`Удаление хориста с ID: ${selectedChoirist?.key}`);
            try {
              const token = localStorage.getItem('accessToken');
              axios.delete(API_URL + `edit_choirister/${selectedChoirist?.key}`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                  },
                });

              message.success("Хорист удален");
            } catch (error) {
              console.error('Ошибка при удалении хориста:', error);
              message.error('Не удалось удалить хориста');
            }
            setDeleteModalVisible(false);
            window.location.reload();
          }}
          okText="Удалить"
          cancelText="Отмена"
        >
          <p>Вы уверены, что хотите удалить хориста {selectedChoirist?.first_name} {selectedChoirist?.last_name}?</p>
        </Modal>
      </Content>
    </Layout>
  );
};
export default EditChoiristers;