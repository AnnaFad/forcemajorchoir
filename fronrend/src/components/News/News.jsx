import './News.css'
import { Card } from 'antd';
const { Meta } = Card;

// Карточка новости для неавторизованных пользователей
export default function News(props) {
  const { title, text, img } = props; 
  return (
    <Card
      hoverable
      style={{ minWidth: '22vw', marginBottom: '4%', minHeight: '32vw' }}
      cover={<img alt="News photo" src={img} />}
    >
      <Meta title={title} description={text.length > 100 ? text.slice(0, 100) + '...' : text} style={{ fontSize: '1vw' }} />
    </Card>
  )
}
