import { Layout, } from 'antd';
import { Link } from 'react-router-dom';

import Header from '/src/components/Header/Header'
import Footer from '/src/components/Footer/Footer'
import News from '/src/components/News/News'
import backgroundphoto from '/src/assets/news-background.jpg'

import { useNewsAll } from '../../hooks/useNews';

const { Content } = Layout;

// Сттраница Все новости
export default function NewsPage() {
  const { items: news, loading, error } = useNewsAll();

  // Проверка на загрузку и ошибки
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Проверка на пустоту
  if (news.length === 0) {
    return <p>Нет новостей</p>;
  }
  const firstNews = news[0];
  const date = new Date(firstNews.create_at);

  // Форматирование даты создания новости
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const formattedDate = `${day}.${month}.${year}`;

  return (
    <Layout style={{ marginTop: '-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%' }}>
      <Header img={backgroundphoto} title="" mainTitle="НОВОСТИ FORCE МАЖОРА" />
      <Content>
        <Link to={`/news/${firstNews.id}`}>
          <div class="text_photo" style={{ justifyContent: 'center' }}>
            <img src={firstNews.photo} alt="Logo" style={{ width: '40%' }} />
            <div class="description">
              <p class="text" style={{ color: 'black' }}><b>{firstNews.title}</b></p>
              <p class="text" style={{ color: 'black' }}>{firstNews.text_news}</p>
              <p class="text" style={{ fontSize: '70%', color: 'black' }}>{formattedDate}</p>
            </div>
          </div>
        </Link>
        {/*Размещение карточек новостей */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5%', justifyContent: 'center', justifySelf: 'center', width: '80%', marginBottom: '3%' }}>
          {news.slice(1, 31).map(news_ => (
            <Link to={`/news/${news_.id}`}>
              <News
                title={news_.title}
                text={news_.text_news}
                img={news_.photo}
              />
            </Link>
          ))}
        </div>
      </Content>
      <Footer />
    </Layout>
  )
}
