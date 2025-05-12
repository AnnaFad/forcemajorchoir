import { useState } from 'react';
import { Layout, Typography, Button, Empty, Modal, DatePicker, message } from 'antd';
import { Link, useParams } from 'react-router-dom';
import AdminHeaderFunc from '../../components/adminHeader';

import { useRehersalsOne } from '../../hooks/useRehersals';
import { useApplicantsNew } from '../../hooks/useApplicants';
import { useApplicantsPassed } from '../../hooks/useApplicants';
import { useApplicantsFailed } from '../../hooks/useApplicants';

import ApplicantsTable from '../../components/ApplicantsTable';
import dayjs from 'dayjs';
import { API_URL } from '../../main';
import axios from 'axios';

const { Text } = Typography;
const { Content } = Layout;

// Страница Спиок анкет
// Доступна только администраторам
const ApplicantsList = () => {
  const { id } = useParams();

  const { items: rehersal, loadingRehersals, errorRehersals } = useRehersalsOne(id);

  const { items: newApplicants, loadingNewApplicants, errorNewApplicants } = useApplicantsNew(id);
  const { items: rejectedApplicants, loadingFailedApplicants, errorFailedApplicants } = useApplicantsFailed(id);
  const { items: passedApplicants, loadingPassedApplicants, errorPassedApplicants } = useApplicantsPassed(id);


  const [selectedTab, setSelectedTab] = useState('New');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newDate, setNewDate] = useState(null);
  console.log(rehersal)
  if (!rehersal || (newApplicants.length === 0 && rejectedApplicants.length === 0 && passedApplicants.length === 0)) {
    return (
      <>
        <AdminHeaderFunc back='admin-rehersals' />
        <Content>
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            description={<Typography.Text style={{ fontSize: '1.5vw', fontFamily: 'pragmatica' }}>Нет данных</Typography.Text>}
          >
            <Link to={`/admin-main-page`}><Button type="primary">На главную</Button></Link>
          </Empty>
        </Content>
      </>
    );
  }
  const currentDate = new Date();

  const handleDateUpdate = async () => {
    if (!newDate) {
      message.warning('Выберите дату!');
      return;
    }
    try {
      const endOfDay = new Date(newDate);
      endOfDay.setHours(23, 59, 59, 999); // Устанавливаем конец дня

      const data = new FormData();
      data.append('title', rehersal.title);
      data.append('date_start', rehersal.date_start);
      data.append('date_end', endOfDay.toISOString());
      data.append('is_last', rehersal.is_last);
      const token = localStorage.getItem('accessToken');
      await axios.put(API_URL + `edit_rehersal/${rehersal.id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Дата окончания успешно обновлена');
      rehersal.date_end = endOfDay.toISOString(); // обновить локально
      setIsModalVisible(false);
      setNewDate(null);
    } catch (error) {
      console.error('Ошибка при обновлении даты окончания:', error);
      message.error('Не удалось обновить дату окончания');
    }
  };

  return (
    <Layout style={{ marginTop: '-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%' }}>
      <AdminHeaderFunc back='admin-rehersals' />
      <Content style={{ minHeight: '52vw' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3%', marginRight: '5%', marginLeft: '5%' }}>
            <Text style={{ fontFamily: 'pragmatica', fontSize: '1.6vw' }}>{rehersal.title}</Text>
            <Text style={{ fontFamily: 'pragmatica', fontSize: '1.6vw', color: new Date(rehersal.date_end) > currentDate ? 'green' : 'red' }}>
              {new Date(rehersal.date_end) > currentDate ? 'Набор открыт' : 'Набор закрыт'}
            </Text>
            <Button
              style={{ maxWidth: '50%', fontFamily: 'pragmatica', fontSize: '1.6vw', height: '4vw', fontWeight: 'lighter' }}
              onClick={() => setIsModalVisible(true)}
            >
              Изменить дату окончания
            </Button>
          </div>

          <Modal
            title="Изменить дату окончания"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            onOk={handleDateUpdate}
            okText="Подтвердить"
            cancelText="Отменить"
          >
            <p>Текущая дата окончания: {dayjs(rehersal.date_end).format('DD.MM.YYYY')}</p>
            <DatePicker
              value={newDate ? dayjs(newDate) : null}
              onChange={(date) => setNewDate(date.toDate())}
              disabledDate={(current) => current && current < dayjs().startOf('day')}
              format="DD.MM.YYYY"
            />
          </Modal>

          <div style={{ marginLeft: '5%', marginTop: '1%' }}>
            <Button
              onClick={() => setSelectedTab('New')}
              type={selectedTab === 'New' ? 'primary' : 'default'}
              style={{ fontFamily: 'pragmatica', fontSize: '1.6vw', height: '3vw', fontWeight: 'lighter', marginRight: '1%' }}
            >
              Новые
            </Button>
            <Button
              onClick={() => setSelectedTab('Pass')}
              type={selectedTab === 'Pass' ? 'primary' : 'default'}
              style={{ fontFamily: 'pragmatica', fontSize: '1.6vw', height: '3vw', fontWeight: 'lighter', marginRight: '1%' }}
            >
              Прошли
            </Button>
            <Button
              onClick={() => setSelectedTab('Fail')}
              type={selectedTab === 'Fail' ? 'primary' : 'default'}
              style={{ fontFamily: 'pragmatica', fontSize: '1.6vw', height: '3vw', fontWeight: 'lighter' }}
            >
              Не прошли
            </Button>
          </div>

          <div style={{ marginLeft: '5%', marginTop: '2%' }}>
            {selectedTab === 'New' && (
              <>
                <Text style={{ fontSize: '1.3vw' }}>Новые заявки</Text>
                <ApplicantsTable applicants={newApplicants} status='New' />
              </>
            )}

            {selectedTab === 'Pass' && (
              <>
                <Text style={{ fontSize: '1.3vw' }}>Принятые заявки</Text>
                <ApplicantsTable applicants={passedApplicants} status='Pass' />
              </>
            )}

            {selectedTab === 'Fail' && (
              <>
                <Text style={{ fontSize: '1.3vw' }}>Отклоненные заявки</Text>
                <ApplicantsTable applicants={rejectedApplicants} status='Fail' />
              </>
            )}
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ApplicantsList;