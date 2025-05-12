import { useState } from 'react';
import { Card, Modal, Button, Input, message, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import deleteimg from '/src/assets/delete.png';
import axios from 'axios';
import { useRegistrationsAll } from '../hooks/useRegistrations';
import { Form, DatePicker } from 'antd';
import { API_URL } from '../main';

const { Meta } = Card;

// Карточка мероприятия для администратора хора
export default function EventAdmin(props) {
    const { id, title, text, registration_is_open, has_registration, date, open_date, close_date, limit, photo } = props;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);
    const [isMailModalVisible, setIsMailModalVisible] = useState(false);
    const [isCloseRegistrationModalVisible, setIsCloseRegistrationModalVisible] = useState(false);
    const [isResumeRegistrationModalVisible, setIsResumeRegistrationModalVisible] = useState(false);
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [newCloseDate, setNewCloseDate] = useState('');

    const { items: visitors, loadingEvents, errorEvents } = useRegistrationsAll(id);
    console.log(visitors)

    // Показ модального окна для удаления мероприятия
    const showModal = () => {
        setIsModalVisible(true);
    };

    // Удаление мероприятия
    const handleOk = async () => {
        console.log(`Удаление мероприятия с ID: ${id}`);
        try {
            const token = localStorage.getItem('accessToken');
            await axios.delete(API_URL + `edit_event/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

            message.success("Мероприятие удалено");
        } catch (error) {
            console.error('Ошибка при удалении мероприятия:', error);
            message.error('Не удалось удалить мероприятие');
        }
        setIsModalVisible(false);
        //window.location.reload();
    };

    // Отмена удаления - закрытие модального окна
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Показ модального окна с деталями мероприятия
    const showDetails = () => {
        setIsDetailsVisible(true);
    };

    // Закрытие модального окна с деталями
    const handleDetailsCancel = () => {
        setIsDetailsVisible(false);
    };

    // Показ модального окна для рассылки
    const showMailModal = () => {
        setIsMailModalVisible(true);
    };

    // Закрытие модального окна для рассылки
    const handleMailCancel = () => {
        setIsMailModalVisible(false);
        setEmailSubject('');
        setEmailBody('');
    };

    // Показ модального окна для закрытия регистрации
    const showCloseRegistrationModal = () => {
        setIsCloseRegistrationModalVisible(true);
    };

    // Закрытие модального окна для закрытия регистрации
    const handleCloseRegistrationCancel = () => {
        setIsCloseRegistrationModalVisible(false);
    };

    // Подтверждение закрытия регистрации
    const handleCloseRegistrationConfirm = async () => {

        console.log(`Закрытие регистрации на мероприятие с ID: ${id}`);
        try {
            const token = localStorage.getItem('accessToken');

            const data = new FormData();

            const response = await fetch(photo);
            const blob = await response.blob();
            const filename = photo.split('/').pop(); // берём имя из URL
            const fileFromUrl = new File([blob], filename, { type: blob.type });
            data.append('photo', fileFromUrl);

            data.append('id', id);
            data.append('name_event', title);
            data.append('description', text);
            data.append('registration_is_open', registration_is_open);
            data.append('has_registration', has_registration);
            data.append('event_time', date);
            data.append('date_time_open', open_date);
            data.append('date_time_close', new Date().toISOString());
            data.append('limit_people', limit);

            await axios.put(API_URL + `edit_event/${id}`, data,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            message.success("Регистрация закрыта");
        } catch (error) {
            console.error('Ошибка при закрытии регистрации:', error);
            message.error('Не удалось закрыть регистрацию');
        }
        setIsCloseRegistrationModalVisible(false);
        window.location.reload();
    };

    // Показ модального окна для возобновления регистрации
    const showResumeRegistrationModal = () => {
        setIsResumeRegistrationModalVisible(true);
    };

    // Закрытие модального окна для возобновления регистрации
    const handleResumeRegistrationCancel = () => {
        setIsResumeRegistrationModalVisible(false);
        setNewCloseDate('');
    };

    // Подтверждение возобновления регистрации 
    const handleResumeRegistrationConfirm = async () => {
        if (!newCloseDate) {
            message.warning('Пожалуйста, выберите дату');
            return;
        }
        try {
            const token = localStorage.getItem('accessToken');

            const data = new FormData();

            const response = await fetch(photo);
            const blob = await response.blob();
            const filename = photo.split('/').pop(); // берём имя из URL
            const fileFromUrl = new File([blob], filename, { type: blob.type });
            data.append('photo', fileFromUrl);

            data.append('id', id);
            data.append('name_event', title);
            data.append('description', text);
            data.append('registration_is_open', registration_is_open);
            data.append('has_registration', has_registration);
            data.append('event_time', date);
            data.append('date_time_open', open_date);
            data.append('date_time_close', new Date(newCloseDate).toISOString());
            data.append('limit_people', limit);

            await axios.put(API_URL + `edit_event/${id}`, data,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            message.success("Регистрация возобновлена");
        } catch (error) {
            console.error('Ошибка при возобновлении регистрации:', error);
            message.error('Не удалось возобновить регистрацию');
        }
        setIsResumeRegistrationModalVisible(false);
        setNewCloseDate('');
    };

const handleSend = async () => {
    console.log(`Рассылка посетителям мероприятия с ID: ${id}`);
    try {
        const selectedEmails = visitors.map(visitor => visitor.data_visitor.email);

        const data = {
            emails: selectedEmails,
            theme: emailSubject,
            body: emailBody,
        };

        const token = localStorage.getItem('accessToken');
        await axios.post(`${API_URL}email_event/${id}`, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        message.success("Письма успешно отправлены!");
    } catch (error) {
        console.error('Ошибка при отправке писем:', error);
        message.error('Не удалось отправить письма');
    }
    setIsMailModalVisible(false);
};

    const newdate = new Date(date);
    const day = String(newdate.getDate()).padStart(2, '0');
    const month = String(newdate.getMonth() + 1).padStart(2, '0');
    const year = newdate.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;

    const openDate = new Date(open_date);
    const dayOpen = String(openDate.getDate()).padStart(2, '0');
    const monthOpen = String(openDate.getMonth() + 1).padStart(2, '0');
    const yearOpen = openDate.getFullYear();

    const formattedDateOpen = `${dayOpen}.${monthOpen}.${yearOpen}`;

    const closeDate = new Date(close_date);
    const dayClose = String(closeDate.getDate()).padStart(2, '0');
    const monthClose = String(closeDate.getMonth() + 1).padStart(2, '0');
    const yearClose = closeDate.getFullYear();

    const formattedDateClose = `${dayClose}.${monthClose}.${yearClose}`;

    return (
        <div>
            <Card
                hoverable
                style={{ width: '15vw', marginBottom: '4%', minHeight: '32vw' }}
                cover={<img alt="Event photo" src={photo} onClick={showDetails} style={{ cursor: 'pointer' }} />}
                onClick={showDetails}
            >
                <Meta title={title} description={text.length > 100 ? text.slice(0, 100) + '...' : text} style={{ fontSize: '1vw' }} />
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                    {has_registration ? (
                        <div>
                            {registration_is_open ? (
                                <div style={{ display: 'flex' }}>
                                    <p style={{ fontSize: '1vw', color: 'green' }}>Регистрация открыта</p>

                                </div>
                            ) : (
                                <div style={{ display: 'flex' }}>
                                    <p style={{ fontSize: '1vw', color: 'red' }}>Регистрация закрыта</p>

                                </div>
                            )}
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                <img
                    src={deleteimg}
                    onClick={(e) => {
                        e.stopPropagation(); // Останавливает всплытие, предотвращая открытие модального окна с деталями
                        showModal();
                    }}
                    style={{ maxWidth: '15%', marginTop: '2%', cursor: 'pointer' }}
                />
            </Card>

            {/* Модальное окно для подтверждения удаления */}
            <Modal
                title="Подтверждение удаления"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText='Удалить'
                cancelText='Отмена'
            >
                <p>Вы уверены, что хотите удалить мероприятие "{title}"?</p>
            </Modal>

            {/* Модальное окно с деталями мероприятия */}
            <Modal
                title={title}
                open={isDetailsVisible}
                onCancel={handleDetailsCancel}
                footer={[
                    <Button key="edit" type="primary">
                        <Link to={`/edit-event/${id}`}
                            state={{ id: id, name: title, description: text, datetime: date, has_registration: has_registration, datetime_open: open_date, datetime_close: close_date, limit_people: limit, photo: photo }}
                        >
                            Редактировать</Link>
                    </Button>,
                    <Button key="back" onClick={handleDetailsCancel}>
                        Закрыть
                    </Button>
                ]}
            >
                <img alt="Event photo" src={photo} style={{ width: '100%', marginBottom: '10px' }} />
                <p>{text}</p>
                <p><strong>Дата мероприятия:</strong> {formattedDate}</p>
                {has_registration ? (
                    <>
                        <p>Регистрации:</p>
                        <p>{formattedDateOpen}-{formattedDateClose}</p>
                        <p>Лимит регистраций: {limit}</p>
                        <p>Количество посетителей: {visitors.filter(v => v.event_ID === id).length}</p>
                        {registration_is_open ? (
                            <Button onClick={showCloseRegistrationModal} style={{ marginRight: '2%' }}>Закрыть регистрацию</Button>
                        ) : (
                            <Button onClick={showResumeRegistrationModal} style={{ marginRight: '2%' }}>Возобновить регистрацию</Button>
                        )}
                        <Button key="mail" onClick={showMailModal}>
                            Рассылка
                        </Button>
                        {visitors.filter(v => v.event_ID === id).map(visitor => (
                            <>
                                <Row style={{ marginTop: '3%', marginBottom: '2%' }}>
                                    <Col span={12} style={{ fontSize: '1vw' }}>{visitor.data_visitor.name}</Col>
                                    <Col span={12} style={{ fontSize: '1vw' }}>{visitor.data_visitor.email}</Col>
                                </Row>
                            </>

                        ))}
                    </>
                ) : (
                    <></>
                )}
            </Modal>

            {/* Модальное окно для рассылки */}
            <Modal
                title={`Рассылка для "${title}"`}
                open={isMailModalVisible}
                onCancel={handleMailCancel}
                onOk={handleSend}
                okText="Отправить"
                cancelText="Отмена"
                footer={[
                    <Button key="send" type="primary" onClick={() => {
                        // Отправка писем
                        console.log(`Отправка письма с темой: ${emailSubject} и текстом: ${emailBody}`);
                        handleSend();
                    }}>
                        Отправить
                    </Button>,
                    <Button key="back" onClick={handleMailCancel}>
                        Закрыть
                    </Button>,
                ]}
            >
                <Input
                    placeholder="Тема письма"
                    value={emailSubject}
                    onChange={e => setEmailSubject(e.target.value)}
                    style={{ marginBottom: '1rem' }}
                />
                <Input.TextArea
                    rows={6}
                    placeholder="Текст письма"
                    value={emailBody}
                    onChange={e => setEmailBody(e.target.value)}
                />
            </Modal>

            {/* Модальное окно для закрытия регистрации */}
            <Modal
                title="Закрытие регистрации"
                open={isCloseRegistrationModalVisible}
                onOk={handleCloseRegistrationConfirm}
                onCancel={handleCloseRegistrationCancel}
                okText='Закрыть регистрацию'
                cancelText='Отмена'
            >
                <p>Вы точно хотите закрыть регистрацию на мероприятие "{title}"?</p>
            </Modal>

            {/* Модальное окно для возобновления регистрации */}
            <Modal
                title="Возобновление регистрации"
                open={isResumeRegistrationModalVisible}
                footer={[
                    <Button key="send" type="primary" onClick={handleResumeRegistrationConfirm}>
                        Возобновить
                    </Button>,
                    <Button key="back" onClick={handleResumeRegistrationCancel}>
                        Отмена
                    </Button>,
                ]}
            >
                <p>Введите новую дату закрытия регистрации:</p>
                <Form.Item
                    name="date_end"
                    rules={[{ required: true, message: 'Выберите дату' }]}
                >
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        style={{ width: '100%' }}
                        onChange={(date, dateString) => setNewCloseDate(dateString)}
                    />
                </Form.Item>
            </Modal>
        </div>


    );
}
