import { useRef } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import AdminHeaderFunc from '../../components/adminHeader';
import { Col, Row, Typography, Button, Divider, Layout, Carousel, Empty, message } from 'antd';
import './Carousel.css'
import { API_URL } from '../../main';
import axios from 'axios';
import { useApplicantsAll } from '../../hooks/useApplicants';

const { Title, Text } = Typography;
const { Content } = Layout;

// Страница Анкета
// Доступна только администраторам
export default function ApplicantDetailed() {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const status = queryParams.get('status');
  const rehersal_id = queryParams.get('rehersal_id');

  const { items: applicants, loading, error } = useApplicantsAll(rehersal_id);

  const carouselRef = useRef(null);

  // Обновление статуса анкеты - Прошел/Не прошел/Новый
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(API_URL + `admin_applicant/${id}`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

      message.success(
        newStatus === 'Pass'
          ? 'Заявка принята'
          : newStatus === 'New'
            ? 'Анкета перемещена в "Новые"'
            : 'Заявка отклонена'
      );

      if (carouselRef.current) {
        carouselRef.current.next();
      }

    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);
      message.error('Не удалось обновить статус');
    }
  };

  if (applicants.length === 0) {
    return (
      <>
        <AdminHeaderFunc back={`admin-rehersals/${rehersal_id}`} />
        <Content>
          <Title level={3} style={{ justifySelf: 'center', marginBottom: '1.5%', fontFamily: 'pragmatica', fontSize: '1.5vw', color: '#4b6db7' }}>
            {status === 'New' ? 'НОВЫЕ' : status === 'Pass' ? 'ПРОШЕДШИЕ' : status === 'Fail' ? 'НЕ ПРОШЕДШИЕ' : 'Заявки'}
          </Title>
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            styles={{ image: { height: 100 } }}
            description={
              <Typography.Text style={{ fontSize: '1.5vw', fontFamily: 'pragmatica' }}>
                {status === 'New' ? 'Нет новых анкет' : status === 'Pass' ? 'Нет принятых заявок' : status === 'Fail' ? 'Нет отклоненных заявок' : 'Заявки'}
              </Typography.Text>
            }
          >
            <Link to={`/admin-rehersals/${rehersal_id}`}><Button type="primary">К спискам</Button></Link>
          </Empty>
        </Content>
      </>
    );
  }
  return (
    <Layout style={{ margin: '-0.5%' }}>
      <AdminHeaderFunc back={`admin-rehersals/${rehersal_id}`} />
      <Content>
        <Title level={3} style={{ justifySelf: 'center', marginBottom: '1.5%', fontFamily: 'pragmatica', fontSize: '1.5vw', color: '#4b6db7' }}>
          {status === 'New' ? 'НОВЫЕ' : status === 'Pass' ? 'ПРОШЕДШИЕ' : status === 'Fail' ? 'НЕ ПРОШЕДШИЕ' : 'Заявки'}
        </Title>
        <Carousel
          arrows
          draggable
          infinite={false}
          ref={carouselRef}
          style={{ marginTop: '1%', backgroundColor: 'rgba(138, 153, 186, 0.8)', marginRight: '10%', marginLeft: '10%', marginBottom: '5%', textAlign: 'center', borderRadius: '4vw' }}>
          {applicants.map(applicant => (
            <div key={applicant.id}>
              <Title level={3} style={{ color: 'white', fontSize: '2vw', fontFamily: 'pragmatica' }}>{applicant.data_applicant.name}</Title>
              <>
                {applicant.data_applicant.program === undefined ? (
                  <></>
                ) : (
                  <>
                    <Divider plain><Title style={{ color: 'white', fontSize: '1.3vw', fontFamily: 'pragmatica' }}>Программа обучения и курс/должность:</Title></Divider>
                    <Text style={{ color: 'white', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}> {applicant.data_applicant.program}</Text>
                  </>
                )}
                <br />
              </>
              <>
                <Divider plain><Title style={{ color: 'white', fontSize: '1.3vw', fontFamily: 'pragmatica' }}>Есть пропуск в Вышку:</Title></Divider>

                {applicant.data_applicant.hasPass ? (
                  <Text style={{ color: 'white', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}>Да</Text>
                ) : (
                  <Text style={{ color: 'white', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}>Нет</Text>
                )}
                <br />
              </>
              <Divider plain><Title style={{ color: 'white', fontSize: '1.3vw', fontFamily: 'pragmatica' }}>Откуда Вы узнали о хор-бэнде:</Title></Divider>
              <Text style={{ color: 'white', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}>{applicant.data_applicant.source}</Text>
              <br />
              <Divider plain><Title style={{ color: 'white', fontSize: '1.3vw', fontFamily: 'pragmatica' }}>Музыкальное образование:</Title></Divider>
              <Text style={{ color: 'white', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}>{applicant.data_applicant.education}</Text>
              <br />

              <>
                {applicant.data_applicant.otherEducation === "" ? (
                  <></>
                ) : (
                  <Text style={{ color: 'white', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}>{applicant.data_applicant.otherEducation}</Text>
                )}
                <br />
              </>
              <Divider plain><Title style={{ color: 'white', fontSize: '1.3vw', fontFamily: 'pragmatica' }}>Игра на музыкальном инструменте:</Title></Divider>
              <Text style={{ color: 'white', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}>{applicant.data_applicant.musicalInstrument}</Text>
              <br />

              <>
                <Divider plain><Title style={{ color: 'white', fontSize: '1.3vw', fontFamily: 'pragmatica' }}>Есть опыт выступлений:</Title></Divider>
                {applicant.data_applicant.hasPerformanceExperience ? (
                  <Text style={{ color: 'white', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}>Да</Text>
                ) : (
                  <Text style={{ color: 'white', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}>Нет</Text>
                )}
                <br />
              </>

              <Divider plain><Title style={{ color: 'white', fontSize: '1.3vw', fontFamily: 'pragmatica' }}>Творческая деятельность:</Title></Divider>
              <Text style={{ color: 'white', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}>{applicant.data_applicant.creativeExperience.join(', ')} </Text>
              <br />

              <>
                {applicant.data_applicant.otherCreativeExperience === "" ? (
                  <></>
                ) : (
                  <Text style={{ color: 'white', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}>{applicant.data_applicant.otherCreativeExperience}</Text>
                )}
                <br />
              </>

              <Divider plain><Title style={{ color: 'white', fontSize: '1.3vw', fontFamily: 'pragmatica' }}>Какая музыка Вам нравится:</Title></Divider>
              <Text style={{ color: 'white', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}>{applicant.data_applicant.musicPreferences}</Text>
              <br />

              <Divider plain><Title style={{ color: 'white', fontSize: '1.3vw', fontFamily: 'pragmatica' }}>Чем Вас привлекает возможность петь в хор-бэнде:</Title></Divider>
              <Text style={{ color: 'white', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}>{applicant.data_applicant.reasons}</Text>
              <br />

              <Divider plain><Title style={{ color: 'white', fontSize: '1.3vw', fontFamily: 'pragmatica' }}>Сможете ли Вы регулярно посещать репетиции:</Title></Divider>
              <Text style={{ color: 'white', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}>{applicant.data_applicant.rehersalsTime}</Text>
              <br />
              <Divider />
              <div style={{ marginBottom: '3%' }}>
                {applicant.data_applicant.vk === undefined ? (
                  <Row >
                    <Col span={8}>
                      <Title level={4} style={{ color: 'white', fontSize: '1.3vw', fontFamily: 'pragmatica' }}>Почта:</Title>
                      <Text style={{ color: 'white', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}> {applicant.data_applicant.email}</Text>
                    </Col>
                    <Col span={8}>
                      <Title level={4} style={{ color: 'white', fontSize: '1.3vw', fontFamily: 'pragmatica' }}>Telegram: </Title>
                      <Text style={{ color: 'white', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}>{applicant.data_applicant.telegram}</Text>
                    </Col>
                    <Col span={8}>
                      <Title level={4} style={{ color: 'white', fontSize: '1.3vw', fontFamily: 'pragmatica' }}>Телефон: </Title>
                      <Text style={{ color: 'white', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}>{applicant.data_applicant.phone}</Text>
                    </Col>
                  </Row>
                ) : (
                  <Row >
                    <Col span={6}>
                      <Title level={4} style={{ color: 'white', fontSize: '1.3vw', fontFamily: 'pragmatica' }}>Почта:</Title>
                      <Text style={{ color: 'white', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}> {applicant.data_applicant.email}</Text>
                    </Col>
                    <Col span={6}>
                      <Title level={4} style={{ color: 'white', fontSize: '1.3vw', fontFamily: 'pragmatica' }}>Telegram: </Title>
                      <Text style={{ color: 'white', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}>{applicant.data_applicant.telegram}</Text>
                    </Col>
                    <Col span={6}>
                      <Title level={4} style={{ color: 'white', fontSize: '1.3vw', fontFamily: 'pragmatica' }}>Телефон: </Title>
                      <Text style={{ color: 'white', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}>{applicant.data_applicant.phone}</Text>
                    </Col>
                    <Col span={6}>
                      <Title level={4} style={{ color: 'white', fontSize: '1.3vw', fontFamily: 'pragmatica' }}>ВК: </Title>
                      <Text style={{ color: 'white', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}>{applicant.data_applicant.vk}</Text>
                    </Col>
                  </Row>
                )}
                <br />
              </div>
              <video
                src={applicant.video}
                style={{ maxWidth: '60%', marginBottom: '3%' }}
                controls
              />
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>

                <>
                  {status === "New" ? (
                    <>
                      <Button
                        type="primary"
                        style={{ marginRight: '20px', backgroundColor: 'green', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter', height: '3vw' }}
                        onClick={() => handleStatusUpdate(applicant.id, 'Pass')}
                      >
                        Принять
                      </Button>
                      <Button
                        type="primary"
                        style={{ backgroundColor: 'red', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter', height: '3vw' }}
                        onClick={() => handleStatusUpdate(applicant.id, 'Fail')}
                      >
                        Отклонить
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="primary"
                      style={{ backgroundColor: 'blue', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter', height: '3vw' }}
                      onClick={() => handleStatusUpdate(applicant.id, 'New')}
                    >
                      Отменить
                    </Button>
                  )}
                </>

              </div>
            </div>

          ))}
        </Carousel>
      </Content>
    </Layout>
  )
}
