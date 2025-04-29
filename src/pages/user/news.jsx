import React from 'react';
import { Layout, theme } from 'antd';
import { Link } from 'react-router-dom'; // Импортируем Link
import { Col, Row } from 'antd';

import { Image } from 'antd';
import Header from '/src/components/Header/Header'
import Footer from '/src/components/Footer/Footer'
import News from '/src/components/News/News'
import backgroundphoto from '/src/assets/news-background.jpg'
import {news} from './news_list'
import { Typography } from 'antd';
const { Title, Text} = Typography;
import { Button, Flex } from 'antd';
const { Content } = Layout;




export default function NewsPage() {

    return (
    <Layout style={{marginTop:'-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%'}}>
      <Header img={backgroundphoto} title="" mainTitle="НОВОСТИ FORCE МАЖОРА"/>
      <Content>
        <Link to={`/news/${news[0].id}`}>
          <div class="text_photo" style={{justifyContent: 'center'}}>
            <img src={news[0].photo} alt="Logo" style={{width:'40%'}}/>
              <div class="description">
                <p class="text" style={{color: 'black'}}><b>{news[0].title}</b></p>
                <p class="text" style={{color: 'black'}}>{news[0].text_news}</p>
                <p class="text" style={{fontSize: '70%', color:'black'}}>{news[0].create_at}</p>
              </div>
          </div>
        </Link>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5%', justifyContent: 'center', justifySelf:'center', width: '80%', marginBottom:'3%'}}>
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
      <Footer/>
    </Layout>
    )
}
  