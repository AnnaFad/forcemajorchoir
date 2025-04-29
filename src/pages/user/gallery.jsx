import React from 'react';
import { Layout, theme } from 'antd';
import { Link } from 'react-router-dom'; 

import { Image } from 'antd';
import Header from '/src/components/Header/Header'
import Footer from '/src/components/Footer/Footer'
import backgroundphoto from '/src/assets/galery-background.jpg'

import { Typography } from 'antd';
const { Title, Text} = Typography;
import { Button, Flex } from 'antd';
const { Content } = Layout;



export const photos = [
    {
      photo: '/src/assets/choirister.jpg',
    },
    {
        photo: '/src/assets/photo1.jpg',
      },
      {
        photo: '/src/assets/photo2.jpg',
      },
      {
        photo: '/src/assets/news-background.jpg',
      },
      {
        photo: '/src/assets/choirister.jpg',
      },
      {
        photo: '/src/assets/choirister.jpg',
      },
];

export default function Galery() {

    return (
  <Layout style={{marginTop:'-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%'}}>
    <Header img={backgroundphoto} title="" mainTitle="ФОТОГАЛЕРЕЯ"/>
      <Content style={{marginTop:'1%'}}>
      <div style={{justifySelf: 'center', justifyItems:'center', textAlign: 'center', marginBottom: '2%'}}>
        <Title style={{fontFamily:'pragmatica', fontWeight:'lighter'}}>Наши фотографии</Title>
      </div>
        <Image.PreviewGroup
            preview={{
            onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
            }}
        >
        {photos.map(photo => (
            <Image src={photo.photo} height={300}/>
        ))}
        </Image.PreviewGroup>
      </Content>
    <Footer/>
  </Layout>
    )
  }
  