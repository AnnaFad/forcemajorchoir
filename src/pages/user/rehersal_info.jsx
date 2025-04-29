import React from 'react';
import { Layout, theme } from 'antd';
import { Link } from 'react-router-dom'; 

import { Image } from 'antd';
import Header from '/src/components/Header/Header'
import Footer from '/src/components/Footer/Footer'
import backgroundphoto from '/src/assets/about-rehersal-background.jpg'

import { Typography } from 'antd';
const { Title, Text} = Typography;
import { Button, Flex } from 'antd';
const { Content } = Layout;
import photo from '/src/assets/choirister.jpg'


export default function RehersalInfo() {
    return (
    <Layout style={{marginTop:'-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%'}}>
        <Header img={backgroundphoto} title="" mainTitle="О НАБОРЕ"/>
          <Content style={{marginTop:'1%'}}>
             <div class="text_photo" >
                    <div class="description">
                        <p class="text"><b>Набор в хор-бэнд проходит так:</b></p>
                        <p class="text">бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла</p>
                    </div>
                    <Image
                    height={420}
                    width={600}
                    src={'/src/assets/rehersal1.jpg'}
                    />
                </div>
                <div class="text_photo" >
                <Image
                    height={450}
                    width={600}
                    src={'/src/assets/rehersal2.jpg'}
                    />
                    <div class="description">
                        <p class="text"><b>еще чето про подачу заявок</b></p>
                        <p class="text">ля ля ля ля ля ля ля ля ля ля ля ля записывайте видео одетые ради бога</p>
                    </div>
                </div>
                 <div style={{justifySelf: 'center', justifyItems:'center', textAlign: 'center'}}>
                          <div style={{width: '60%', marginBottom: '2%', marginTop: '3%'}}>
                          <Title style={{fontFamily:'pragmatica', fontWeight:'lighter'}}>Репетиции</Title>
                          <Text style={{fontSize: '150%', fontFamily:'pragmatica', fontWeight:'lighter'}}>Репетиции проходят по вт/чт 19:00-22:30 и иногда по субботам </Text>
                          </div>
                        <Image
                          width={350}
                          src={'/src/assets/about-rehersal3.jpg'}
                          justify='center'
                        />
                        <Image
                        style={{marginLeft:'3%'}}
                          width={350}
                          src={'/src/assets/about-rehersal-4.jpg'}
                          justify='center'
                        />
                        <Flex gap="small" wrap justify='center'>
                          <Button 
                            color="green"
                            variant="solid" 
                            style={{width: '100%', fontFamily: 'pragmatica', fontSize:'180%', height:'70px', fontWeight: 'lighter', marginTop: '5%', marginBottom: '5%'}}>
                            <Link to='/form-rehersal'>Заполнить анкету на прослушивание</Link>
                          </Button>
                        </Flex>
                        </div>
          </Content>
        <Footer/>
    </Layout>
    )
  }
  