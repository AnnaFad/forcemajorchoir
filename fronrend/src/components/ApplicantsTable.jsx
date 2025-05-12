import { useState } from 'react';
import { Button, Flex, Table, Space, Tag, Modal, Input, message } from 'antd';
import './Table.css'

import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../main';

// Компонента для отрисовки таблицы с анкетами
const ApplicantsTable = (props) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const { applicants, status } = props;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const columns = [
    { title: 'ФИО', dataIndex: 'name' },
    { title: 'Почта', dataIndex: 'email' },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/admin-rehersals/applicant/${record.key}?status=${status}&rehersal_id=${record.rehersal_id}`}>Открыть</Link>
        </Space>
      ),
    },
  ];
  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = newSelectedRowKeys => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEmailSubject('');
    setEmailBody('');
  };

   // Функция для отправки писем
  const handleSend = async () => {
    console.log(`Рассылка не прошедшим прослушивание`);
    try {
      const selectedEmails = applicants
        .filter(applicant => selectedRowKeys.includes(applicant.id))
        .map(applicant => applicant.data_applicant.email);

      const data = {
        emails: selectedEmails,
        theme: emailSubject,
        body: emailBody,
      };

      const token = localStorage.getItem('accessToken');
      await axios.post(`${API_URL}email_applicants/${applicants[0].rehersal_ID}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      message.success("Письма успешно отправлены!");
    } catch (error) {
      console.error('Ошибка при отправке писем:', error);
      message.error('Не удалось отправить письма');
    }
  };
  const hasSelected = selectedRowKeys.length > 0;

  // Формирование источника данных для таблицы
  const dataSource = applicants.map(applicant => ({
    key: applicant.id,
    name: applicant.data_applicant.name,
    email: applicant.data_applicant.email,
    rehersal_id: applicant.rehersal_ID
  }))
  console.log(applicants)
  return (
    <>
      <div>
        {status === 'Fail' ? (
          <Flex gap="middle" vertical>
            <Flex align="center" gap="middle">
              <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
                Очистить выбор
              </Button>

              <Button type="primary" disabled={!hasSelected} onClick={showModal}>
                Рассылка
              </Button>

              {hasSelected ? `Выбрано: ${selectedRowKeys.length}` : null}
            </Flex>

            <Table
              style={{ maxWidth: '90%' }}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={dataSource}
            />

            <Modal
              title="Рассылка письма"
              open={isModalVisible}
              onCancel={handleCancel}
              onOk={handleSend}
              okText="Отправить"
              cancelText="Отмена"
            >
              <Input
                placeholder="Тема письма"
                value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
                style={{ marginBottom: '1rem' }}
              />
              <Input.TextArea
                rows={6}
                placeholder="Текст письма"
                value={emailBody}
                onChange={e => setEmailBody(e.target.value)}
              />
            </Modal>
          </Flex>
        ) : (
          <Flex gap="middle" vertical>
            <Table style={{ maxWidth: '90%' }} size='large' columns={columns} dataSource={dataSource} />
          </Flex>
        )}
      </div>
    </>
  );
};
export default ApplicantsTable;