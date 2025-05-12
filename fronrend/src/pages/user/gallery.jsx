import { Layout, Image } from 'antd';
import Header from '/src/components/Header/Header'
import Footer from '/src/components/Footer/Footer'
import backgroundphoto from '/src/assets/galery-background.jpg'
import { useGallery } from '../../hooks/useGallery';

import { Typography } from 'antd';
const { Title } = Typography;
const { Content } = Layout;


export default function Galery() {
  const { items: photos, loading, error } = useGallery();

  // Проверка на загрузку и ошибки
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Проверка на пустоту
  if (photos.length === 0) {
    return <p>Нет фотографий</p>;
  }
  return (
    <Layout style={{ marginTop: '-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%' }}>
      <Header img={backgroundphoto} title="" mainTitle="ФОТОГАЛЕРЕЯ" />
      <Content style={{ marginTop: '1%' }}>
        <div style={{ justifySelf: 'center', justifyItems: 'center', textAlign: 'center', marginBottom: '2%' }}>
          <Title style={{ fontFamily: 'pragmatica', fontWeight: 'lighter', fontSize: '3vw' }}>Наши фотографии</Title>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Image.PreviewGroup
            preview={{
              onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
            }}
          >
            {photos.map(photo => (
              <Image src={photo.photo} style={{ height: '20vw' }} />
            ))}
          </Image.PreviewGroup>
        </div>
      </Content>
      <Footer />
    </Layout>
  )
}
