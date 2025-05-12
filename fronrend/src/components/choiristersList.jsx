import ChoiristerAvatar from "./ChoiristerAvatar";

import { Typography } from 'antd';
import { useChoiristers } from "../hooks/useChoiristers";

const { Title } = Typography;


// Компонента для отображения состава хора
const ChoiristersList = () => {

  const { items: choiristers, loading, error } = useChoiristers();

  console.log(choiristers, loading, error);

  return (
    <div className="flex flex-col m-8 w-2/5">
      {
        loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
            <div style={{justifySelf: 'center', justifyItems:'center', textAlign: 'center'}}>
                <Title style={{fontFamily:'pragmatica', marginBottom: '2%', fontSize:'2.5vw'}}>Состав хор-бэнда</Title>
                <Title style={{fontFamily:'pragmatica', fontWeight:'lighter', marginBottom: '2%', fontSize:'2vw'}}>Сопрано</Title>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap:'5%', justifyContent: 'center', width: '80%'}}>
                    {choiristers.filter(choirister => (choirister.voice === 'Первое сопрано' || choirister.voice === 'Второе сопрано' )).map(choirister => (
                        <ChoiristerAvatar first_name={choirister.first_name} last_name={choirister.last_name} voice={choirister.voice} img={choirister.photo} />
                    ))}
                </div>
                <Title style={{fontFamily:'pragmatica', fontWeight:'lighter', marginBottom: '2%', fontSize:'2vw'}}>Альты</Title>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap:'5%', justifyContent: 'center', width: '80%'}}>
                    {choiristers.filter(choirister => (choirister.voice === 'Первый альт' || choirister.voice === 'Второй альт' )).map(choirister => (
                    <ChoiristerAvatar first_name={choirister.first_name} last_name={choirister.last_name} voice={choirister.voice} img={choirister.photo} />
                    ))}
                </div>
                <Title style={{fontFamily:'pragmatica', fontWeight:'lighter', marginBottom: '2%', fontSize:'2vw'}}>Тенора</Title>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap:'5%', justifyContent: 'center', width: '80%'}}>
                    {choiristers.filter(choirister => (choirister.voice === 'Первый тенор' || choirister.voice === 'Второй тенор' )).map(choirister => (
                    <ChoiristerAvatar first_name={choirister.first_name} last_name={choirister.last_name} voice={choirister.voice} img={choirister.photo} />
                    ))}
                </div>
                <Title style={{fontFamily:'pragmatica', fontWeight:'lighter', marginBottom: '2%', fontSize:'2vw'}}>Басы и баритоны</Title>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap:'5%', justifyContent: 'center', width: '80%'}}>
                    {choiristers.filter(choirister => (choirister.voice === 'Бас' || choirister.voice === 'Баритон' )).map(choirister => (
                    <ChoiristerAvatar first_name={choirister.first_name} last_name={choirister.last_name} voice={choirister.voice} img={choirister.photo} />
                    ))}
                </div>
            </div>
        )
      }

    </div>
  )
}

export default ChoiristersList