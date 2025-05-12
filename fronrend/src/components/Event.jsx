import { Card } from 'antd';
import { Link } from 'react-router-dom';
const { Meta } = Card;


// Карточка мероприятия для неавторизованного пользователя
export default function Event(props) {
  const { id, title, text, date, has_registration, img } = props;
  return (
    <div>
      {has_registration ? (
        <Card
          hoverable
          style={{ width: '22vw', marginBottom: '4%' }}
          cover={<img alt="Event photo" src={img} />}
        >
          <Meta title={title} description={text.length > 100 ? text.slice(0, 100) + '...' : text} style={{ fontSize: '1vw' }} />
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Link to={`/events/registration/${id}`} style={{ fontSize: '1vw' }}>
              Регистрация
            </Link>
          </div>
        </Card>
      ) : (
        <Card
          hoverable
          style={{ width: '22vw', marginBottom: '4%' }}
          cover={<img alt="Event photo" src={img} />}
        >
          <Meta title={title} description={text.length > 100 ? text.slice(0, 100) + '...' : text} style={{ fontSize: '1vw' }} />
        </Card>
      )}
    </div>

  )
}
