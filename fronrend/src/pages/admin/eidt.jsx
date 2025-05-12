import { Layout, theme } from 'antd'
import { Link } from 'react-router-dom'
import AdminHeaderFunc from '../../components/adminHeader'
import { Button } from 'antd'

const { Content } = Layout

// Страница редактирования информации
// Доступна только администраторам
const Edit = () => {
  return (
    <Layout style={{marginTop:'-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%'}}>
      <AdminHeaderFunc back='admin-main-page'/>
      <Content>
        <div style={{justifySelf:'center', marginTop:'7%', paddingBottom:'25%'}}>
          <div style={{justifySelf:'center'}}>
            <Button 
              color="orange" 
              variant="solid" 
              style={{maxWidth: '100%', fontFamily: 'pragmatica', fontSize:'2vw', height:'4vw', fontWeight: 'lighter', marginTop: '2%', marginBottom: '3%'}}>
                <Link to='/edit-news'>Редактировать новости</Link>
            </Button>
          </div>
          <div style={{justifySelf:'center'}}>
            <Button 
              color="blue" 
              variant="solid" 
              style={{maxWidth: '100%', fontFamily: 'pragmatica', fontSize:'2vw', height:'4vw', fontWeight: 'lighter', marginTop: '2%', marginBottom: '3%'}}>
              <Link to='/edit-choir'>Редактировать список хористов</Link>
            </Button>
          </div>
          <div style={{justifySelf:'center'}}>
            <Button 
              color="pink" 
              variant="solid" 
              style={{maxWidth: '100%', fontFamily: 'pragmatica', fontSize:'2vw', height:'4vw', fontWeight: 'lighter', marginTop: '2%', marginBottom: '2%'}}>
              <Link to='/edit-gallery'>Редактировать галерею</Link>
            </Button>
          </div>
        </div>
      </Content>

    </Layout>
  );
};

export default Edit;
