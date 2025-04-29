import React, { useState } from 'react';

import { Link } from 'react-router-dom'; 

import { Image } from 'antd';

import Footer from '/src/components/Footer/Footer'
import backgroundphoto from '/src/assets/about-us-background.jpg'
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
const { Title, Text} = Typography;
import { Flex } from 'antd';
import { Layout, Menu, theme } from 'antd';

const { Header, Content} = Layout;
import logo from '/src/assets/logo.svg'

import { DownOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Select, Upload} from 'antd';
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

const onFinish = values => {
    console.log('Success:', values);
};
const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
};
const normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e === null || e === void 0 ? void 0 : e.fileList;
};
const { TextArea } = Input;
export default function RehersalForm() {
    const [formData, setFormData] = useState({});
    const isOpen = true;

    const onFinish = (values) => {
        // Преобразование данных формы в JSON
        const jsonData = JSON.stringify(values);
        console.log(jsonData); // Вывод JSON в консоль
        // Здесь вы можете отправить jsonData на сервер
    };
    return (
        <Layout style={{marginTop:'-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%'}}>
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
        <Content style={{marginTop:'1%'}}>
            <div>
            {isOpen ? ( 
                <div style={{justifyItems: 'center'}}>
                <Title style={{fontFamily:'pragmatica', fontWeight:'lighter'}}>Заявка на прослушивание в хор-бэнд</Title>
                <Form
                    name="basic"
                    labelCol={{ span: 30 }}
                    wrapperCol={{ span: 30 }}
                    style={{ maxWidth: 800}}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    layout='vertical'
                    size='large'
                >
                <Form.Item
                    label="Фамилия Имя Отчество. Если нет отчества, ставьте после имени прочерк (-)"
                    name="name"
                    rules={[{ required: true, message: 'Пожалуйста, введите Ваши ФИО' }]}
                >
                <Input />
                </Form.Item>
    
                <Form.Item
                    label="Если вы из Вышки - у кажите программу, курс обучения/должность."
                    name="course"
                    rules={[{ required: false}]}
                >
                <Input/>
                </Form.Item>
    
                <Form.Item 
                name="has_pass" 
                label="У меня есть пропуск в Вышку (любой - студенческий, сотрудника, пропуск выпускника и т.д.)" 
                rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}>
            <Select
              placeholder="Выберите одно из предложенных значений"
            >
              <Option value="Yes">Да</Option>
              <Option value="No">Нет</Option>
            </Select>
          </Form.Item>
    
                <Form.Item
                    label="Откуда Вы о нас узнали?"
                    name="know_from"
                    rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}
                >
                <TextArea rows={4} />
                </Form.Item>
    
                <Form.Item 
                    name="has_music_education"
                    label="Есть ли у Вас музыкальное образование?"
                    rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}
                    >
                    <Select
                        placeholder="Выберите одно из предложенных значений"
                    >
                        <Option value="music_school">Музыкальная школа</Option>
                        <Option value="learned_myself">Самостоятельное обучение</Option>
                        <Option value="individual_training">Индивидуальные занятия (вокал/инструмент/сольфеджио/теория музыки)</Option>
                        <Option value="ojther">Другое</Option>
                    </Select>
                </Form.Item>
    
                <Form.Item
                    label="Играете ли Вы на каком-либо музыкальном инструменте? Если да, уточните, на каком."
                    name="instrument"
                    rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}
                >
                <Input />
                </Form.Item>
                
                <Form.Item 
                    name="has_performance_experience"
                    label="Есть ли у Вас опыт выступлений?"
                    rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}>
                    <Select
                    placeholder="Выберите одно из предложенных значений"
                    >
                        <Option value="Yes">Да</Option>
                        <Option value="No">Нет</Option>
                    </Select>
                </Form.Item>
    
                <Form.Item
                    name="has_creative_experience"
                    label="Пели ли Вы до этого в хоре или занимались любой другой творческой деятельностью? "
                    rules={[{ required: true, message: 'Пожалуйста, заполните это поле', type: 'array' }]}
                >
                    <Select mode="multiple" placeholder="Выберите одно или несколько из предложенных значений">
                        <Option value="choir">Пение в хоре</Option>
                        <Option value="dance">Танцы</Option>
                        <Option value="theatre">Игра в театре</Option>
                        <Option value="poems">Чтение стихов</Option>
                        <Option value="no_experience">Не имею подобного опыта</Option>
                        <Option value="other">Другое</Option>
                    </Select>
                </Form.Item>
    
                <Form.Item
                    label="Какая музыка Вам нравится? Можете перечислить любимые направления, жанры, исполнителей, названия конкретных композиций."
                    name="fovourite_music"
                    rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}
                >
                <TextArea rows={4} />
                </Form.Item>
    
                <Form.Item
                    label="Чем Вас привлекает возможность петь в хор-бэнде? Почему Вам хочется стать хористом Force Мажора?"
                    name="interested_because"
                    rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}
                >
                <TextArea rows={4} />
                </Form.Item>
    
                <Form.Item
                    label="Сможете ли Вы регулярно посещать репетиции (вт, чт 19:00 - 22:00/22:30 и иногда сб вечер)? Укажите ограничения по времени посещения, если есть."
                    name="can_visit_repetition"
                    rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}
                >
                <Input />
                </Form.Item>
    
                <Form.Item
                    label="e-mail"
                    name="email"
                    rules={[{ required: true, type: "email", message: 'Пожалуйста, укажите валидный e-mail' }]}
                >
                <Input />
                </Form.Item>
                <Form.Item
                    label="Ник в Telegram"
                    name="telegram"
                    rules={[{ required: true, message: 'Пожалуйста, укажите свой telegram' }]}
                >
                <Input />
                </Form.Item>
    
                <Form.Item
                    label="Контактный номер телефона"
                    name="phone_number"
                    rules={[{ required: true, message: 'Пожалуйста, укажите свой номер телефона' },
    
                        {
                            validator: (_, value) => {
                                if (!value || /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(value)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Неверный формат номера телефона'));
                            },
                        },
                    ]}
                >
                <Input />
                </Form.Item>
    
                <Form.Item
                    label="ВКонтакте"
                    name="vk"
                    rules={[{ required: false}]}
                >
                <Input/>
                </Form.Item>
    
                <Form.Item label="Прикрепите файл с видеозаписью песни с расширением .mp4. Название напишите по образцу: Фамилия_Имя_Оригинальный_исполнитель_Название_песни. Например: Иванов_Иван_Queen_Show_must_go_on.">
                    <Form.Item name="video" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                        <Upload.Dragger name="videofile" action="/upload.do">
                            <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Для загрузки нажмите или перетащите файл в эту область</p>
                        </Upload.Dragger>
                    </Form.Item>
                </Form.Item>
    
                <Form.Item name="confirm_video" valuePropName="checked"
                rules={[
                    {
                        validator: async (_, checked) => {
                            if (!checked) {
                                return Promise.reject(
                                    new Error("Пожалуйста, подтвердите, что Вас хорошо видно на видео"),
                                );
                            }
                        },
                    },
                ]}
                >
                <Checkbox>
                    Я подтверждаю, что на видео хорошо видно мое лицо
                </Checkbox>
                </Form.Item>
                
                <Form.Item name="confirm_voice" valuePropName="checked"
                rules={[
                    {
                        validator: async (_, checked) => {
                            if (!checked) {
                                return Promise.reject(
                                    new Error("Пожалуйста, подтвердите, что на видео хорошо слышно Ваш голос"),
                                );
                            }
                        },
                    },
                ]}
                >
                <Checkbox>
                    Я подтверждаю, что на видео хорошо слышно мой голос, и его не перекрывает музыкальное сопровождение и посторонние звуки
                </Checkbox>
                </Form.Item>
    
                <Form.Item name="confirm_personal_data" valuePropName="checked"
                rules={[
                    {
                        validator: async (_, checked) => {
                            if (!checked) {
                                return Promise.reject(
                                    new Error("Пожалуйста, предоставьте согласие на обработку ваших данных"),
                                );
                            }
                        },
                    },
                ]}
                >
                <Checkbox>
                Я предоставляю согласие на обработку своих персональных данных. Я ознакомился(-ась) с <a href="https://disk.yandex.ru/i/ZLFtEH-maY7hrQ">соглашением о работе с персональными данными</a>
                </Checkbox>
                </Form.Item>
    
                <Form.Item label={null} style={{marginBottom: '4%'}}>
                <Button type="primary" htmlType="submit">
                    Отправить
                </Button>
                </Form.Item>
                </Form>
                </div>
                ):(
                <>
                <div style={{fontFamily:'pragmatica', fontWeight: 'lighter', justifyItems: 'center', marginTop: '10%'}}>
                    <p style={{fontSize: '250%'}}>К сожалению, сейчас набор в хор-бэнд закрыт</p>
                    <p style={{fontSize: '150%'}}>Следите за нашими новостями, чтобы не пропустить открытие набора и другие интересные мероприятия</p>    
                </div>  
                <div style={{justifySelf:'center', display:'flex', marginBottom:'13%', marginTop:'2%'}}>
                    <Button 
                        color="pink" 
                        variant="solid" 
                        style={{width: '80%', fontFamily: 'pragmatica', fontSize:'180%', height:'70px', fontWeight: 'lighter', marginRight: '10%'}}>
                        <Link to='/news'>Все новости</Link>
                    </Button>
                    <Button 
                        color="blue" 
                        variant="solid" 
                        style={{width: '80%', fontFamily: 'pragmatica', fontSize:'180%', height:'70px', fontWeight: 'lighter'}}>
                        <Link to='https://vk.com/hsechoir'>ВК</Link>
                    </Button>
                </div> 
                </>      
                )}
            </div>

            
        </Content>
        <Footer/>
      </Layout>
    )
  }
  