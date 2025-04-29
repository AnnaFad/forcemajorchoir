import React from 'react';
import { Layout, theme } from 'antd';
import { Link } from 'react-router-dom'; // Импортируем Link
import { Col, Row } from 'antd';

import { Image } from 'antd';
import Header from '/src/components/Header/Header'
import Footer from '/src/components/Footer/Footer'
import Event from '/src/components/Event'
import backgroundphoto from '/src/assets/events-background.jpg'

import { Typography } from 'antd';
const { Title, Text} = Typography;
import { Button, Flex } from 'antd';
const { Content } = Layout;
import {events} from './events_list'



export default function Events() {

    return (
    <Layout style={{marginTop:'-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%'}}>
      <Header img={backgroundphoto} title="" mainTitle="МЕРОПРИЯТИЯ"/>
      <Content>
        <Link to={`/events/${events[0].id}`}>
        <div class="text_photo" style={{justifyContent: 'center'}}>
                  <img src={events[0].photo} alt="Logo" style={{width:'40%'}}/>
                <div class="description">
                    <p class="text" style={{color: 'black'}}><b>{events[0].name_event}</b></p>
                    <p class="text" style={{color: 'black'}}>{events[0].description}</p>
                    <p class="text" style={{fontSize: '70%', color:'black'}}>{events[0].event_time}</p>
                    <>
                    { events[0].has_registration ? (
                      <Button 
                        color="blue" 
                        variant="solid" 
                        style={{width: '30%', fontFamily: 'pragmatica', fontSize:'100%', height:'50px', fontWeight: 'lighter', marginTop: '3%', marginBottom: '5%'}}>
                        <Link to={`/events/registration/${events[0].id}`} style={{fontSize:'140%'}}>
                          Регистрация
                        </Link>
                      </Button>
                    ):(
                      <></>
                    )}
                    </>
                    
                </div>
              </div>
        </Link>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5%', justifyContent: 'center', justifySelf:'center', width: '80%' }}>
                  {events.slice(1, 31).map(event => (
                    <Link to={`/events/${event.id}`}>
                      <Event
                      id={event.id}
                      title={event.name_event}
                      text={event.description}
                      img={event.photo} 
                      has_registration={event.has_registration}
                      />
                    </Link>
                  ))}
                </div>
      </Content>
      <Footer/>
    </Layout>
    )
}
  
  