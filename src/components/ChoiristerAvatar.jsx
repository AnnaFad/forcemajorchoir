import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
import { Typography } from 'antd';
const { Title, Text} = Typography;

export default function ChoiristerAvatar(props) {
    const {first_name, last_name, voice, img} = props; 
    return (
        <div style={{marginBottom:'3%'}}>
            <Avatar size={290} src={img} />
            <p style={{fontSize: '160%', fontFamily:'pragmatica'}}> {first_name} {last_name}</p> 
            <p style={{fontSize: '140%', fontFamily:'pragmatica', fontWeight:'lighter'}}> {voice}</p> 
        </div>
    )
}
