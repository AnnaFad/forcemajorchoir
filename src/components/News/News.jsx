import './News.css'
import { Card } from 'antd';
const { Meta } = Card;

export default function News(props) {
    const {title, text, img} = props; // эта фигня нужна чтобы передавать заголовок новости и картинку в качестве параметров
    return (
        <Card
        hoverable
        style={{ width: 380, marginBottom: '4%'}}
        cover={<img alt="News photo" src={img} />}
      >
        <Meta title={title} description={text.length > 100 ? text.slice(0, 100) + '...' : text} />
      </Card>
    )
}
