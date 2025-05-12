import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, message, Form, Upload } from 'antd';
import './NewsAdmin.css'
import { Card } from 'antd';
const { Meta } = Card;
import edit from '/src/assets/edit.png'
import deleteimg from '/src/assets/delete.png'
import axios from 'axios';
import { InboxOutlined } from '@ant-design/icons';
import { API_URL } from '../../main';

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

// Карточка новости для администратора хора
export default function NewsAdmin(props) {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [changedFields, setChangedFields] = useState(new Set());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { id, title, text, photo } = props;

  // Показ модального окна для удаления новости
  const showDeleteModal = () => {
    setIsDeleteModalVisible(true);
  };
  // Показ модального окна для редактирования новости
  const showEditModal = () => {
    setIsEditModalVisible(true);
  };
  // Отмена удаления - закрытие модального окна
  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };

  // Отмена редактирования - закрытие модального окна
  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  // Удаление новости
  const handleDeleteOk = async () => {
    console.log(`Удаление новости с ID: ${id}`);
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(API_URL + `edit_news/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

      message.success("Новость удалена");
    } catch (error) {
      console.error('Ошибка при удалении новости:', error);
      message.error('Не удалось удалить новость');
    }
    setIsDeleteModalVisible(false);
    window.location.reload();
  };

  // Подтверждение редактирования новости
  const handleEditConfirm = async (values) => {
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
      data.append('title', values.title);
      data.append('text_news', values.text_news);
      data.append('is_deleted', false);

      if (file) {
        data.append('photo', file);
      } else {
        data.append('photo', photo);
      }
      const token = localStorage.getItem('accessToken');
      console.log(data)
      await axios.put(API_URL + `edit_news/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Новость успешно обновлена');
      form.resetFields();
      setIsEditModalVisible(false);
      window.location.reload();

    } catch (err) {
      console.error(err);
      message.error('Ошибка при обновлении новости');
    }
  };


  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      title: title,
      text_news: text,
      photo: photo
        ? [{
          uid: '-1',
          name: 'фото.jpg',
          status: 'done',
          url: photo,
        }] : [],
    });
  }, [form, title, text, photo]);


  return (
    <>
      <Card
        hoverable
        style={{ width: '17vw', marginBottom: '4%' }}
        cover={<img alt="News photo" src={photo} />}
      >
        <Meta title={title} />
        <div style={{ marginTop: '7%', display: 'flex', gap: '70%' }}>
          <img
            src={edit}
            onClick={(e) => {
              e.stopPropagation(); // Останавливает всплытие, предотвращая открытие модального окна с деталями
              showEditModal();
            }}
            style={{ maxWidth: '15%', marginTop: '2%', cursor: 'pointer' }}
          />
          <img
            src={deleteimg}
            onClick={(e) => {
              e.stopPropagation(); // Останавливает всплытие, предотвращая открытие модального окна с деталями
              showDeleteModal();
            }}
            style={{ maxWidth: '15%', marginTop: '2%', cursor: 'pointer' }}
          />
        </div>
      </Card>
      {/* Модальное окно для подтверждения удаления */}
      <Modal
        title="Подтверждение удаления"
        open={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        okText='Удалить'
        cancelText='Отмена'
      >
        <p>Вы уверены, что хотите удалить новость "{title}"?</p>
      </Modal>

      {/* Модальное окно для редактирования */}
      <Modal
        title="Редактирование новости"
        open={isEditModalVisible}
        onCancel={handleEditCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleEditConfirm}
          onFinishFailed={onFinishFailed}
          name="rehersal_form"
          labelCol={{ span: 30 }}
          wrapperCol={{ span: 30 }}
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
            label="Заголовок новости"
            name="title"
            rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}
            hasFeedback={changedFields.has('title')}
            validateStatus={changedFields.has('title') && saveSuccess ? 'success' : ''}
            help={changedFields.has('title') && saveSuccess ? 'Изменения успешно сохранены' : ''}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Текст новости"
            name="text_news"
            rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}
            hasFeedback={changedFields.has('text_news')}
            validateStatus={changedFields.has('text_news') && saveSuccess ? 'success' : ''}
            help={changedFields.has('text_news') && saveSuccess ? 'Изменения успешно сохранены' : ''}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Фотография новости"
            hasFeedback={changedFields.has('photo')}
            validateStatus={changedFields.has('photo') && saveSuccess ? 'success' : ''}
            help={changedFields.has('photo') && saveSuccess ? 'Изменения успешно сохранены' : ''}
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
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginTop: '1rem' }}>
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </Modal>

    </>
  )
}
