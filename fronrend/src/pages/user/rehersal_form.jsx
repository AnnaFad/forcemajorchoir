import { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../main';
import Footer from '/src/components/Footer/Footer'
import { InboxOutlined } from '@ant-design/icons';
import { Typography, Layout, Menu, message, Modal } from 'antd';
import logo from '/src/assets/logo.svg'
import { DownOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Select, Upload } from 'antd';
import axios from 'axios';
import { useRehersalsActive } from '../../hooks/useRehersals';

const { Title } = Typography;
const { Header, Content } = Layout;

const menuitems = [
    {
        key: 'logo',
        label: (
            <Link to="/" style={{ display: 'flex' }}>
                <img src={logo} alt="Лого" style={{ height: '64px' }} />
            </Link>
        )
    },
    {
        key: 1, label: 'О нас', subItems: [
            { key: 1, label: 'О хоре', path: '/about-us' },
            { key: 2, label: 'Галерея', path: '/gallery' },
        ]
    },
    {
        key: 2, label: 'Набор', subItems: [
            { key: 1, label: 'О наборе', path: '/about-rehersal' },
            { key: 2, label: 'Форма набора', path: '/form-rehersal' },
        ]
    },
    { key: 3, label: 'Новости', path: '/news' },
    { key: 4, label: 'Мероприятия', path: '/events' },
    { key: 5, label: 'Сотрудничество', path: '/partnership' },
];


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
    const { items: lastRehersal, loading, error } = useRehersalsActive();
const [isModalVisible, setIsModalVisible] = useState(false);
    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>Произошла ошибка при загрузке данных.</p>;

    // Проверка: есть ли активное прослушивание и не истёк ли срок
    const isOpen = lastRehersal && new Date() <= new Date(lastRehersal.date_end);
    

    if (!isOpen) {
        return (
            <>
                <Header style={{ display: 'flex', alignItems: 'flex-start', margin: '-0.5%' }}>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        style={{ flex: 1, display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '160%', marginRight: '15%', fontFamily: 'pragmatica', fontWeight: 'lighter' }}
                    >
                        {menuitems.map(item => (
                            item.subItems ? (
                                <Menu.SubMenu key={item.key} title={item.label} icon={<DownOutlined />}>
                                    {item.subItems.map(subItem => (
                                        <Menu.Item key={subItem.key} style={{ fontFamily: 'pragmatica', fontSize: '120%', fontWeight: 'lighter' }}>
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
                <div style={{ fontFamily: 'pragmatica', fontWeight: 'lighter', justifyItems: 'center', marginTop: '10%' }}>
                    <p style={{ fontSize: '2vw' }}>К сожалению, сейчас набор в хор-бэнд закрыт</p>
                    <p style={{ fontSize: '1.3vw' }}>Следите за нашими новостями, чтобы не пропустить открытие набора и другие интересные мероприятия</p>
                </div>
                <div style={{ justifySelf: 'center', display: 'flex', marginBottom: '13%', marginTop: '2%' }}>
                    <Button
                        color="pink"
                        variant="solid"
                        style={{ width: '80%', fontFamily: 'pragmatica', fontSize: '1.5vw', height: '3.6vw', fontWeight: 'lighter', marginRight: '10%' }}>
                        <Link to='/news'>Все новости</Link>
                    </Button>
                    <Button
                        color="blue"
                        variant="solid"
                        style={{ width: '80%', fontFamily: 'pragmatica', fontSize: '1.5vw', height: '3.6vw', fontWeight: 'lighter' }}>
                        <Link to='https://vk.com/hsechoir'>ВК</Link>
                    </Button>
                </div>
                <Footer style={{ margin: '-1%' }} />
            </>
        );
    }
    const date = new Date(lastRehersal.date_end.replace(' ', 'T'));

    // Форматирование даты
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    // Форматирование итоговой строки
    const formattedDate = `${day}.${month}.${year}`;

    const onFinish = async (values) => {
        try {
            const data = new FormData();
            const videoFile = values.video?.[0]?.originFileObj;

            if (videoFile) {
                // Загружаем видео
                data.append('video', videoFile);

                data.append('rehersal_ID', lastRehersal.id);
                data.append('status', 'New');

                // Формируем JSON
                const data_applicant = { ...values };
                delete data_applicant.video;

                data.append('data_applicant', JSON.stringify(data_applicant));

                await axios.post(API_URL + 'applicants/', data);
                setIsModalVisible(true); // показать модальное окно
            } else {
                message.error("Пожалуйста, загрузите видео");
            }
        } catch (err) {
            console.error(err);
            message.error("Ошибка при отправке данных");
        }
    };
    return (
        <Layout style={{ marginTop: '-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%' }}>
            <Header style={{ display: 'flex', alignItems: 'flex-start', padding: '0px' }}>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    style={{ flex: 1, display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '160%', marginRight: '15%', fontFamily: 'pragmatica', fontWeight: 'lighter' }}
                >
                    {menuitems.map(item => (
                        item.subItems ? (
                            <Menu.SubMenu key={item.key} title={item.label} icon={<DownOutlined />}>
                                {item.subItems.map(subItem => (
                                    <Menu.Item key={subItem.key} style={{ fontFamily: 'pragmatica', fontSize: '120%', fontWeight: 'lighter' }}>
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
            <Content style={{ marginTop: '1%' }}>
                <div>
                    {isOpen ? (
                        <div style={{ justifyItems: 'center' }}>

                            <Title style={{ fontFamily: 'pragmatica', fontWeight: 'lighter', fontSize: '3vw' }}>Заявка на прослушивание в хор-бэнд</Title>
                            <Title style={{ fontFamily: 'pragmatica', fontWeight: 'lighter', fontSize: '1.5vw', marginBottom: '2%' }}>Вы можете подать заявку до {formattedDate} включительно</Title>
                            <Form
                                name="rehersal_form"
                                labelCol={{ span: 30 }}
                                wrapperCol={{ span: 30 }}
                                style={{ maxWidth: '50vw' }}
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
                                    name="program"
                                    rules={[{ required: false }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="hasPass"
                                    label="У меня есть пропуск в Вышку (любой - студенческий, сотрудника, пропуск выпускника и т.д.)"
                                    rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}>
                                    <Select
                                        placeholder="Выберите один из предложенных вариантов"
                                    >
                                        <Option value={true}>Да</Option>
                                        <Option value={false}>Нет</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Откуда Вы о нас узнали?"
                                    name="source"
                                    rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}
                                >
                                    <TextArea rows={4} />
                                </Form.Item>

                                <Form.Item
                                    name="education"
                                    label="Есть ли у Вас музыкальное образование?"
                                    rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}
                                >
                                    <Select
                                        placeholder="Выберите один из предложенных вариантов"
                                    >
                                        <Option value="Музыкальная школа">Музыкальная школа</Option>
                                        <Option value="Самостоятельное обучение">Самостоятельное обучение</Option>
                                        <Option value="Индивидуальные занятия">Индивидуальные занятия (вокал/инструмент/сольфеджио/теория музыки)</Option>
                                        <Option value="Другое">Другое</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Если у Вас другое музыкальное образование, пожалуйста, уточните, какое именно."
                                    name="otherEducation"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Играете ли Вы на каком-либо музыкальном инструменте? Если да, уточните, на каком."
                                    name="musicalInstrument"
                                    rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="hasPerformanceExperience"
                                    label="Есть ли у Вас опыт выступлений?"
                                    rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}>
                                    <Select
                                        placeholder="Выберите один из предложенных вариантов"
                                    >
                                        <Option value={true}>Да</Option>
                                        <Option value={false}>Нет</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="creativeExperience"
                                    label="Пели ли Вы до этого в хоре или занимались любой другой творческой деятельностью? "
                                    rules={[{ required: true, message: 'Пожалуйста, заполните это поле', type: 'array' }]}
                                >
                                    <Select mode="multiple" placeholder="Выберите один из предложенных вариантов">
                                        <Option value="Пение в хоре">Пение в хоре</Option>
                                        <Option value="Танцы">Танцы</Option>
                                        <Option value="Игра в театре">Игра в театре</Option>
                                        <Option value="Чтение стихов">Чтение стихов</Option>
                                        <Option value="Не имею подобного опыта">Не имею подобного опыта</Option>
                                        <Option value="Другое">Другое</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Если Вы занимались другой творческой деятельностью, пожалуйста, уточните, какой именно."
                                    name="otherCreativeExperience"
                                >
                                    <TextArea rows={4} />
                                </Form.Item>

                                <Form.Item
                                    label="Какая музыка Вам нравится? Можете перечислить любимые направления, жанры, исполнителей, названия конкретных композиций."
                                    name="musicPreferences"
                                    rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}
                                >
                                    <TextArea rows={4} />
                                </Form.Item>

                                <Form.Item
                                    label="Чем Вас привлекает возможность петь в хор-бэнде? Почему Вам хочется стать хористом Force Мажора?"
                                    name="reasons"
                                    rules={[{ required: true, message: 'Пожалуйста, заполните это поле' }]}
                                >
                                    <TextArea rows={4} />
                                </Form.Item>

                                <Form.Item
                                    label="Сможете ли Вы регулярно посещать репетиции (вторник, четверг 19:00 - 22:00/22:30, и иногда вечером субботы)? Укажите ограничения по времени посещения, если есть."
                                    name="rehersalsTime"
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
                                    name="phone"
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
                                    rules={[{ required: false }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item label="Прикрепите файл с видеозаписью песни с расширением .mp4. Название напишите по образцу: Фамилия_Имя_Оригинальный_исполнитель_Название_песни. Например: Иванов_Иван_Queen_Show_must_go_on." required>
                                    <Form.Item name="video" rules={[{ required: true, message: 'Пожалуйста, загрузите видео' }]} valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                                        <Upload.Dragger name="video" accept=".mp4" beforeUpload={() => false} maxCount={1}>
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined />
                                            </p>
                                            <p className="ant-upload-text">Для загрузки нажмите или перетащите файл в эту область</p>
                                        </Upload.Dragger>
                                    </Form.Item>
                                </Form.Item>

                                <Form.Item name="confirmVideo" valuePropName="checked"
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
                                    <Checkbox >
                                        Я подтверждаю, что на видео хорошо видно мое лицо
                                    </Checkbox>
                                </Form.Item>

                                <Form.Item name="confirmVoice" valuePropName="checked"
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

                                <Form.Item name="confirmPersonalData" valuePropName="checked"
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

                                <Form.Item label={null} style={{ marginBottom: '4%' }}>
                                    <Button type="primary" htmlType="submit" style={{ maxHeight: '3vw', fontSize: '1.3vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}>
                                        Отправить
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    ) : (
                        <>
                            <div style={{ fontFamily: 'pragmatica', fontWeight: 'lighter', justifyItems: 'center', marginTop: '10%' }}>
                                <p style={{ fontSize: '2vw' }}>К сожалению, сейчас набор в хор-бэнд закрыт</p>
                                <p style={{ fontSize: '1.3vw' }}>Следите за нашими новостями, чтобы не пропустить открытие набора и другие интересные мероприятия</p>
                            </div>
                            <div style={{ justifySelf: 'center', display: 'flex', marginBottom: '13%', marginTop: '2%' }}>
                                <Button
                                    color="pink"
                                    variant="solid"
                                    style={{ width: '80%', fontFamily: 'pragmatica', fontSize: '1.5vw', height: '3.6vw', fontWeight: 'lighter', marginRight: '10%' }}>
                                    <Link to='/news'>Все новости</Link>
                                </Button>
                                <Button
                                    color="blue"
                                    variant="solid"
                                    style={{ width: '80%', fontFamily: 'pragmatica', fontSize: '1.5vw', height: '3.6vw', fontWeight: 'lighter' }}>
                                    <Link to='https://vk.com/hsechoir'>ВК</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </div>
                                            <Modal
                                title="Успешная отправка заявки"
                                open={isModalVisible}
                                onOk={() => window.location.reload()} // обновить страницу после нажатия
                                onCancel={() => window.location.reload()} // обновить страницу при отмене
                                okText="Закрыть"
                                cancelButtonProps={{ style: { display: 'none' } }} // скрыть кнопку отмены
                                >
                                <p>Спасибо, Ваша анкета отправлена!</p>
                                </Modal>
            </Content>
            <Footer />
        </Layout>
    )
}
