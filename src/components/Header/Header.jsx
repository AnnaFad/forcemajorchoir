import logo from '/src/assets/logo.svg'
import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'; // Импортируем Link
import './Header.css'

const { Header } = Layout;


const items = [
    {
        key: 'logo',
        label: (
            <Link to="/" style={{ display: 'flex'}}>
            <img src={logo} alt="Лого" style={{ height: '64px' }} />
          </Link>
        )
    },
    { key: 1, label: 'О нас', subItems: [
        { key: 1, label: 'О хоре', path: '/about-us' },
        { key: 2, label: 'Галерея', path: '/gallery' },
      ] 
    },
    { key: 2, label: 'Набор', subItems: [
        { key: 1, label: 'О наборе', path: '/about-rehersal' },
        { key: 2, label: 'Форма набора', path: '/form-rehersal' },
      ] 
    },
    { key: 3, label: 'Новости', path: '/news' },
    { key: 4, label: 'Мероприятия', path: '/events' },
    { key: 5, label: 'Сотрудничество', path: '/partnership' },
];

export default function HeaderFunc(props) {
  const {img, title, mainTitle} = props;
  return (
    <>
    <Header style={{ display: 'flex', alignItems: 'flex-start', padding: '0px'}}>
    <Menu
      theme="dark"
      mode="horizontal"
      style={{flex: 1, display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '160%', marginRight: '15%', fontFamily: 'pragmatica', fontWeight: 'lighter'}}
      
    >
      {items.map(item => (
        item.subItems ? (
          <Menu.SubMenu key={item.key} title={item.label} icon={<DownOutlined />}>
            {item.subItems.map(subItem => (
              <Menu.Item key={subItem.key} style={{fontFamily:'pragmatica', fontSize:'120%', fontWeight: 'lighter'}}>
                <Link to={subItem.path}>{subItem.label}</Link>
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        ) : (
          <Menu.Item key={item.key}>
            <Link to={item.path}>{item.label}</Link>
          </Menu.Item>
        )
      ))}
    </Menu>
    </Header>

    <div style={{backgroundImage: `url(${img})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height:'1000px'}}>
        <div class='page-title' style={{textShadow:'1% 1% 2% black'}}>
            <h2>{mainTitle}</h2>
            <h1>{title}</h1>
        </div>
    </div>


</>
  )
}
