import { Avatar } from 'antd';

// Компонента для отрисовки аватара хориста
export default function ChoiristerAvatar(props) {
    const { first_name, last_name, voice, img } = props;
    return (
        <div style={{ marginBottom: '3%' }}>
            <Avatar style={{ height: '16vw', width: '16vw' }} src={img} />
            <p style={{ fontSize: '1.3vw', fontFamily: 'pragmatica' }}> {first_name} {last_name}</p>
            <p style={{ fontSize: '1.1vw', fontFamily: 'pragmatica', fontWeight: 'lighter' }}> {voice}</p>
        </div>
    )
}
