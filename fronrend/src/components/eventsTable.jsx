import './Table.css'
import { Link } from 'react-router-dom';
import EventAdmin from './EventAdmin';
import { Card } from 'antd';
import add from '/src/assets/add.jpg'

const { Meta } = Card;

// Компонента списка мероприятий
const EventstsTable = (props) => {
    const { events, status } = props;
    const currentDate = new Date();
    return (
        <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5%', justifyContent: 'center', justifySelf: 'center', width: '80%', marginBottom: '3%', marginTop: '4%' }}>
                {status === 'Future' ? (
                    <Link to={`/add-event`}>
                        <Card
                            hoverable
                            style={{ width: '17vw', marginBottom: '4%' }}
                            cover={<img alt="Add" src={add} />}
                        >
                            <Meta title='Добавить мероприятие' />
                        </Card>
                    </Link>
                ) : (
                    <></>
                )}
                {events.map(event => (
                    <EventAdmin
                        id={event.id}
                        title={event.name_event}
                        text={event.description}
                        date={event.event_time}
                        has_registration={event.has_registration}
                        registration_is_open={new Date(event.date_time_close) >= currentDate}
                        open_date={event.date_time_open}
                        close_date={event.date_time_close}
                        limit={event.limit_people}
                        photo={event.photo}
                    />
                ))}

            </div>
        </>
    );
};
export default EventstsTable;