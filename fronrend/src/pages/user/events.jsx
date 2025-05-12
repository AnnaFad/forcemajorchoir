import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import Header from '/src/components/Header/Header'
import Footer from '/src/components/Footer/Footer'
import Event from '/src/components/Event'
import backgroundphoto from '/src/assets/events-background.jpg'
import { Button, Typography } from 'antd';
import { useEventsTen } from '../../hooks/useEvents';
const { Title } = Typography;
const { Content } = Layout;

// Страница мероприятий хора
export default function Events() {
  const { items: events, loading, error } = useEventsTen();

  // Проверка на загрузку и ошибки
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Проверка на наличие мероприятий
  // Если предстоящих мероприятий нет, возвращается страница с сообщением об этом
  if (events.length === 0) {
    return (
      <Layout style={{ marginTop: '-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%' }}>
        <Header img={backgroundphoto} title="" mainTitle="БЛИЖАЙШИЕ МЕРОПРИЯТИЯ" />
        <div style={{ fontFamily: 'pragmatica', fontWeight: 'lighter', justifyItems: 'center', marginTop: '10%' }}>
          <p style={{ fontSize: '2vw' }}>К сожалению, сейчас нет предстоящих мероприятий</p>
          <p style={{ fontSize: '1.3vw' }}>Но они обязательно будут!</p>
          <p style={{ fontSize: '1.3vw' }}>Следите за новостями, чтобы не пропустить наши выступления</p>
        </div>
        <div style={{ justifySelf: 'center', display: 'flex', marginBottom: '13%', marginTop: '2%' }}>
          <Button
            color="pink"
            variant="solid"
            style={{ width: '80%', fontFamily: 'pragmatica', fontSize: '1.5vw', height: '3.6vw', fontWeight: 'lighter', marginRight: '10%', marginLeft: '30%' }}>
            <Link to='/news'>Все новости</Link>
          </Button>
          <Button
            color="blue"
            variant="solid"
            style={{ width: '80%', fontFamily: 'pragmatica', fontSize: '1.5vw', height: '3.6vw', fontWeight: 'lighter', marginRight: '30%' }}>
            <Link to='https://vk.com/hsechoir'>ВК</Link>
          </Button>
        </div>
        <Footer />
      </Layout>

    )
  }
  // Извлечение ближайшего мероприятия
  const firstEvent = events[0];

  // Извлечение даты и времени ближайшего мероприятия
  const date = new Date(firstEvent.event_time.replace(' ', 'T'));// Заменяем пробел на 'T' для корректного парсинга

  // Форматирование даты мероприятия
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  // Извлечение времени в формате UTC
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  const formattedDate = `${day}.${month}.${year}`;
  const formattedTime = `${hours}:${minutes}`;

  return (
    <Layout style={{ marginTop: '-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%' }}>
      <Header img={backgroundphoto} title="" mainTitle="ПРЕДСТОЯЩИЕ МЕРОПРИЯТИЯ" />
      <Content>
        <Title style={{ fontFamily: 'pragmatica', fontWeight: 'lighter', fontSize: '2vw', marginTop: '2%', justifySelf: 'center' }}>Предстоящие мероприятия хор-бэнда</Title>
        <Link to={`/events/${firstEvent.id}`}>
          <div class="text_photo" style={{ justifyContent: 'center' }}>
            <img src={firstEvent.photo} alt="Logo" style={{ width: '40%' }} />
            <div class="description">
              <p class="text" style={{ color: 'black', fontSize: '1.5vw' }}><b>{firstEvent.name_event}</b></p>
              <p class="text" style={{ color: 'black' }}>{firstEvent.description}</p>
              <p class="text" style={{ fontSize: '80%', color: 'black' }}> Мероприятие состоится {formattedDate} в {formattedTime}</p>
              <>
                {/*Если на мероприятие есть регистрация - отрисовываем кнопку регистрации */}
                {firstEvent.has_registration ? (
                  <Button
                    color="blue"
                    variant="solid"
                    style={{ width: '30%', fontFamily: 'pragmatica', fontSize: '1.2vw', height: '3vw', fontWeight: 'lighter', marginTop: '3%', marginBottom: '5%' }}>
                    <Link to={`/events/registration/${firstEvent.id}`} style={{ fontSize: '140%' }}>
                      Регистрация
                    </Link>
                  </Button>
                ) : (
                  <></>
                )}
              </>
            </div>
          </div>
        </Link>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5%', justifyContent: 'center', justifySelf: 'center', width: '80%' }}>
          {events.slice(1, 31).map(event => (
            <Link to={`/events/${event.id}`}>
              {/* Карточка мероприятия */}
              <Event
                id={event.id}
                title={event.name_event}
                text={event.description}
                img={event.photo}
                has_registration={event.has_registration}
              />
            </Link>
          ))}
        </div>
      </Content>
      <Footer />
    </Layout>
  )
}

