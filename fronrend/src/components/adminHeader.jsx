import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom'; // Импортируем Link
import { API_URL } from '../main';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const { Header } = Layout;

// Шапка страниц для авторизованного пользователя
export default function AdminHeaderFunc(props) {
  const { back } = props;
  const navigate = useNavigate();
  const handleLogOut = () => {

    axios.post(API_URL + 'logout/', {
      refresh_token: localStorage.getItem('refreshToken'),
    })

      .then(response => {
        if (response.status != 200) return
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        navigate('/admin-auth');
      })
      .catch(error => console.error(error))
  }
  return (
    <>
      <Header style={{ display: 'flex', alignItems: 'flex-start', padding: '0px' }}>
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ display: 'flex', justifyContent: 'center', width: '100%', fontSize: '1.5vw', fontFamily: 'pragmatica', fontWeight: 'lighter', gap: '35%' }}
        >
          <Link to={`/${back}`} style={{ color: 'white' }}>Назад</Link>
          <Link to='/admin-main-page' style={{ color: 'white' }}>Главная</Link>
          <span onClick={handleLogOut} style={{ color: 'white', cursor: 'pointer' }}>Выйти</span>

        </Menu>
      </Header>
    </>
  )
}
