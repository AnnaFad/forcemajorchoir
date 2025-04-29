import React from 'react';
import { Layout, theme } from 'antd';
import { Link } from 'react-router-dom'; // Импортируем Link

import { Image } from 'antd';
import Header from '/src/components/Header/Header'
import Footer from '/src/components/Footer/Footer'
import backgroundphoto from '/src/assets/about-us-background.jpg'
import photo from '/src/assets/about-us-background.jpg'
import { Col, Row } from 'antd';
import { Typography } from 'antd';
const { Title, Text} = Typography;
import { Button, Flex } from 'antd';
const { Content } = Layout;
import sveta from '/src/assets/sveta.jpg'
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Avatar, List, Space } from 'antd';
import ChoiristerAvatar from '../../components/ChoiristerAvatar';
import avatar from '/src/assets/choirister.jpg'

import { soprano, alto, tenor, bass } from './choiristers';

export default function AboutUs() {

  return (
  <Layout style={{marginTop:'-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%'}}>
    <Header img={backgroundphoto} title="" mainTitle="О ХОР-БЭНДЕ"/>
      <Content>

    <div class="text_photo" >
        <div class="description">
            <p class="text"><b>Наши выступления</b></p>
            <p class="text"> Хор-бэнд Force Мажор исполняет хиты из мюзиклов, джаза и рока в оригинальных хоровых аранжировках. В нашем репертуаре вы найдёте как короткие песни, так и полноценные шоу-номера с хореографией и театральными элементами, такие как "Mamma Mia!" и "La La Land" – идеальное решение для любого мероприятия!</p>
        </div>
        <Image
        height={440}
        width={3000}
        src={'/src/assets/about-us-1.jpg'}
        />
    </div>

    <div class="description" style={{textAlign:'center', marginBottom: '2%'}}>
            <p class="text"><b>Немного истории</b></p>
            <p class="text">В репертуаре коллектива — популярные песни различных жанров в хоровой аранжировке, песни из мюзиклов и фильмов, классические произведения. Хор-бэнд развивается в направлении show choir, а значит, на сцене хор не только поет, но и танцует и использует элементы актерской игры, создавая полноценное шоу.</p>
            <p class="text">Force Мажор существует в Вышке с 2006 года и активно выступает на различных мероприятиях как в университете, так и за его пределами.</p>
    </div>
    <div style={{display:'flex', gap: '3%', marginLeft:'3%', marginRight:'3%'}}>
        <Image
        height={420}
        width={2900}
        src={'/src/assets/about_us_2.jpg'}
        />
          <Image
        height={420}
        width={2900}
        src={'/src/assets/about_us_3.jpg'}
        />
                <Image
        height={420}
        width={2900}
        src={'/src/assets/about_us_4.jpg'}
        />  
    </div>
        <div class="text_photo" >
        <Image
        height={450}
        width={2500}
        src={'/src/assets/about_us_5.jpg'}
        />
        <div class="description">
            <p class="text"><b>Force Мажор - это не просто хор</b></p>
            <p class="text">Force Мажор ежегодно выезжает в Бобры, создавая новые аранжировки на природе, а спектакль «Мастер и Маргарита» раскрывает их актёрский потенциал. Вне сцены хористы сплачиваются за настолками, совместными мероприятиями и творческими инициативами, сохраняя дружбу даже после активных репетиций.</p>
        </div>

    </div>
    <div class="text_photo" >
        <div class="description">
            <p class="text"><b>Наш руководитель - Светлана Сергеевна Сперанская</b></p>
            <p class="text">Светлана Сперанская «Дирижирует не только голосами, но и сердцами». Выпускница дирижерско-хорового факультета Академического Музыкального Училища при Московской Государственной Консерватории им.Чайковского и актерского факультета Российской Академии Театрального Искусства (РАТИ-ГИТИС). Прошла различные обучения по повышению квалификации как певица и педагог по вокалу и не останавливается по сей день.</p>
            <p class="text">Актриса театра и кино, певица, участница многочисленных театральных постановок и концертных программ, руководитель и дирижер. Помимо профессиональной музыкальной и актерской деятельности получила образование больничного клоуна и музыкального терапевта международного уровня. Организатор, автор и преподаватель курса тренингов по больничной клоунаде, работы с голосом и актерскому мастерству.</p>
        </div>
        <Image
        height={500}
        width={2000}
        src={sveta}
        />
    </div>

    <div style={{justifySelf: 'center', justifyItems:'center', textAlign: 'center'}}>
    <Title style={{fontFamily:'pragmatica', marginBottom: '2%'}}>Состав хор-бэнда</Title>
    <Title style={{fontFamily:'pragmatica', fontWeight:'lighter', marginBottom: '2%'}}>Сопрано</Title>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap:'5%', justifyContent: 'center', width: '80%'}}>
            {soprano.map(choirister => (
                <ChoiristerAvatar first_name={choirister.first_name} last_name={choirister.last_name} voice={choirister.voice} img={choirister.photo} />
            ))}
      </div>
    <Title style={{fontFamily:'pragmatica', fontWeight:'lighter', marginBottom: '2%'}}>Альты</Title>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap:'5%', justifyContent: 'center', width: '80%'}}>
        {alto.map(choirister => (
          <ChoiristerAvatar first_name={choirister.first_name} last_name={choirister.last_name} voice={choirister.voice} img={choirister.photo} />
        ))}
      </div>
    <Title style={{fontFamily:'pragmatica', fontWeight:'lighter', marginBottom: '2%'}}>Тенора</Title>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap:'5%', justifyContent: 'center', width: '80%'}}>
        {tenor.map(choirister => (
          <ChoiristerAvatar first_name={choirister.first_name} last_name={choirister.last_name} voice={choirister.voice} img={choirister.photo} />
        ))}
      </div>
    <Title style={{fontFamily:'pragmatica', fontWeight:'lighter', marginBottom: '2%'}}>Басы и баритоны</Title>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap:'5%', justifyContent: 'center', width: '80%'}}>
        {bass.map(choirister => (
          <ChoiristerAvatar first_name={choirister.first_name} last_name={choirister.last_name} voice={choirister.voice} img={choirister.photo} />
        ))}
      </div>
    </div>

      </Content>
    <Footer/>
  </Layout>
  )
}
