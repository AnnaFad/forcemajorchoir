import { Layout } from 'antd';
import { Link } from 'react-router-dom';

import Header from '/src/components/Header/Header'
import Footer from '/src/components/Footer/Footer'
import backgroundphoto from '/src/assets/about-rehersal-background.jpg'

import { Typography } from 'antd';
const { Title, Text } = Typography;
import { Button, Flex } from 'antd';
const { Content } = Layout;


export default function RehersalInfo() {
  return (
    <Layout style={{ marginTop: '-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%' }}>
      <Header img={backgroundphoto} title="" mainTitle="О НАБОРЕ" />
      <Content style={{ marginTop: '1%' }}>
        <div class="text_photo" >
          <div class="description">
            <p class="text"><b>Набор проходит в два этапа:</b></p>
            <p class="text">
              1-й этап – онлайн. Нужно заполнить <Link to='/form-rehersal'>анкету на прослушивание</Link> на сайте и прикрепить к ней своё видео, где вы исполняете кусочек песни.
            </p>
            <p class="text">2-й этап – оффлайн (приглашаются те, кто прошел по результатам онлайн этапа): прослушивания будут проходить в корпусе на Старой Басманной до репетиций вт/чт/сб с 18:00/18:30 до 19:00/19:30. В случае успеха предложим остаться на репетицию, которая у нас до 22:00/22:30.</p>
          </div>
          <img src={'/src/assets/rehersal1.jpg'} style={{ maxWidth: '50%' }} />
        </div>
        <div class="text_photo" >
          <img src={'/src/assets/rehersal2.jpg'} style={{ maxWidth: '50%' }} />
          <div class="description">
            <p class="text"><b>Как правильно записать видео для 1-го этапа?</b></p>
            <p class="text">
              Вы можете петь песню а капелла, аккомпанируя себе на инструменте или под любой другой аккомпанемент. Вас должно быть хорошо видно и слышно. Исполняете куплет + припев (сохраним вместе много полезных ресурсов: силы, нервы, время, гигабайты и т.п.). Желательно петь наизусть.</p>
            <p class="text"><b>Какие видео мы попросим перезаписать?</b></p>
            <p class="text">Где вы поёте под плюс, вас плохо видно/не видно совсем или очень плохо слышно.</p>
          </div>
        </div>
        <div style={{ justifySelf: 'center', justifyItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '60%', marginBottom: '2%', marginTop: '3%' }}>
            <Title style={{ fontFamily: 'pragmatica', fontWeight: 'lighter', fontSize: '2vw' }}>Репетиции</Title>
            <Text style={{ fontSize: '150%', fontFamily: 'pragmatica', fontWeight: 'lighter', fontSize: '1.1vw' }}>Репетиции проходят 19:00 - 22:00 по вторникам, четвергам и иногда субботам по адресу Старая Басманная ул., 21/4с1.
              Активное участие в репетициях очень важно из-за большого объема материала!
              На занятиях помимо пения бывают различные тренинги по актёрскому мастерству, движению и звучанию,  а также занятия с хореографом для постановки номеров.</Text>
          </div>
          <img src={'/src/assets/about-rehersal3.jpg'} style={{ maxWidth: '20%', marginRight: '0.5%' }} />
          <img src={'/src/assets/about-rehersal-4.jpg'} style={{ maxWidth: '20%', marginLeft: '0.5%' }} />
          <Flex gap="small" wrap justify='center'>
            <Button
              color="green"
              variant="solid"
              style={{ width: '100%', fontFamily: 'pragmatica', fontSize: '1.5vw', height: '4vw', fontWeight: 'lighter', marginTop: '5%', marginBottom: '5%' }}>
              <Link to='/form-rehersal'>Заполнить анкету на прослушивание</Link>
            </Button>
          </Flex>
        </div>
      </Content>
      <Footer />
    </Layout>
  )
}
