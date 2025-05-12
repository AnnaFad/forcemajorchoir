import { Layout } from 'antd'
import { Image } from 'antd';
import AdminHeaderFunc from '../../components/adminHeader'
import { Typography } from 'antd'
import { useGallery } from '../../hooks/useGallery'
import { Modal, Button, Upload, message } from 'antd'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { API_URL } from '../../main';
import axios from 'axios';
const { Title, Text } = Typography

const { Content } = Layout


// Страница редактирования галереи
// Доступна только администраторам
const EditGallery = () => {
  const { items: photos, loading, error } = useGallery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    setFileList([]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('photo', file.originFileObj);
    });

    try {
      // отправка на сервер
      const token = localStorage.getItem('accessToken');

      await axios.post(API_URL + 'gallery/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Фотография добавлена');
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      message.error('Ошибка при добавлении фотографии');
    }
  }

  const uploadProps = {
    multiple: true,
    fileList,
    onChange: ({ fileList: newFileList }) => setFileList(newFileList),
    beforeUpload: () => false, // предотвращает автоматическую отправку
  };

  return (
    <Layout style={{ marginTop: '-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%' }}>
      <AdminHeaderFunc back='admin-edit' />
      <Content>
        <Title level={3} style={{ justifySelf: 'center', marginBottom: '1.5%', fontFamily: 'pragmatica', fontSize: '1.5vw', fontWeight: 'lighter' }}>
          Редактирование галереи
        </Title>
        <div style={{ justifySelf: 'center' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal} style={{ marginBottom: '10%', minHeight: '2.5vw' }}>
            Добавить фотографию
          </Button>
        </div>

        <Modal
          title="Загрузить фотографию"
          open={isModalOpen}
          onOk={handleUpload}
          onCancel={handleCancel}
          okText="Добавить"
          cancelText="Отмена"
        >
          <Upload {...uploadProps} listType="picture" maxCount={1}>
            <Button icon={<UploadOutlined />}>Выбрать файл</Button>
          </Upload>
        </Modal>
        <div style={{ textAlign: 'center' }}>
          <Image.PreviewGroup
            preview={{
              onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
            }}
          >
            {photos.map(photo => (
              <Image src={photo.photo} style={{ height: '20vw' }} />
            ))}
          </Image.PreviewGroup>
        </div>
      </Content>
    </Layout>
  );
};

export default EditGallery;
