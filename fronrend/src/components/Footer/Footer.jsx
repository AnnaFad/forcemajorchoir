import logo from '/src/assets/logo.svg'
import { Layout } from 'antd';
import { Link } from 'react-router-dom'; 
import './Footer.css'
import { Col, Row } from 'antd';
const { Footer } = Layout;

// Футер
export default function FooterFunc() {

  return (

    <Footer style={{ textAlign: 'center', backgroundColor: '#0c0d40', paddingTop: '3%', paddingBottom: '3%' }}>
      <Row gutter={24} style={{ textAlign: 'start', marginRight: '5%', marginLeft: '5%' }}>
        <Col className="gutter-row" span={6}>
          <div>
            <Link to="/" style={{ display: 'flex' }}>
              <img src={logo} alt="Лого" style={{ height: '4vw' }} />
            </Link>
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div>
            <p><Link to='/about-us' class='footer-text'>О нас</Link><p /></p>
            <p><Link to='/news' class='footer-text'>Новости</Link><p /></p>
            <p><Link to='/partnership' class='footer-text'>Сотрудничество</Link><p /></p>
            <p><Link to='/gallery' class='footer-text'>Галерея</Link><p /></p>
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div>
            <p><Link to='/events' class='footer-text'>Ближайшие мероприятия</Link></p>
            <p><Link to='/about-rehersal' class='footer-text'>Набор в хор-бэнд</Link></p>
            <p><Link to='/form-rehersal' class='footer-text'>Форма набора</Link></p>
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div >
            <p><Link to='https://vk.com/hsechoir' style={{ color: 'white', fontFamily: 'pragmatica', fontWeight: 'lighter', fontSize: '2vw' }}>VK</Link></p>
            <p><Link to='https://youtube.com/@forcemajorchoir?si=A3JW9XNMFuKb8rCt' style={{ color: 'white', fontFamily: 'pragmatica', fontWeight: 'lighter', fontSize: '2vw' }}>YouTube</Link></p>
            <p style={{ color: 'white', fontFamily: 'pragmatica', fontWeight: 'lighter', fontSize: '1vw' }} >choir.fm@gmail.com</p>
          </div>
        </Col>
      </Row>
      <div>

        <Row gutter={24} style={{ textAlign: 'start', marginRight: '5%', marginLeft: '5%' }}>
          <Col className="gutter-row" span={6}>
            <div>
              <p style={{ color: 'white', fontFamily: 'pragmatica', fontWeight: 'lighter', fontSize: '0.7vw' }}>Website created by Anna Fadeeva & Anastasiia Romanyuk</p>
              <p style={{ color: 'white', fontFamily: 'pragmatica', fontWeight: 'lighter', fontSize: '0.7vw' }}>Partner designer Ksenia Pichugina</p>
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div>
              <p><Link to='https://docs.yandex.ru/docs/view?url=ya-disk-public%3A%2F%2Fo35GpYp6QFrOl5eiG5edkw6RNBaGPCGj%2FOftEvVefpyS3Vg0%2FRONyZI8Dny1h%2FMlq%2FJ6bpmRyOJonT3VoXnDag%3D%3D%3A%2F%D0%94%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%D0%B4%D0%BB%D1%8F%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%2F%D0%9F%D0%BE%D0%BB%D0%B8%D1%82%D0%B8%D0%BA%D0%B0%20%D0%BA%D0%BE%D0%BD%D1%84%D0%B8%D0%B4%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D1%81%D1%82%D0%B8.pdf&name=%D0%9F%D0%BE%D0%BB%D0%B8%D1%82%D0%B8%D0%BA%D0%B0%20%D0%BA%D0%BE%D0%BD%D1%84%D0%B8%D0%B4%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D1%81%D1%82%D0%B8.pdf&nosw=1'
                class='footer-text' style={{ color: '#bbc0d3' }}>Политика обработки персональных данных</Link><p /></p>
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div>
              <p><Link to='/admin-auth' class='footer-text' style={{ color: '#bbc0d3' }}>Вход для администратора</Link></p>
            </div>
          </Col>
        </Row>
      </div>
    </Footer>
  )
}








