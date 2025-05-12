import './TextPhotoStyle.css'
import { Image } from 'antd';
import photo1 from '/src/assets/main-page-2.jpg'
import photo2 from '/src/assets/main-page-3.jpg'
import { Button, Flex } from 'antd';
import { Link } from 'react-router-dom';
export default function PhotoLeft() {
    return (
      <>
    <div class="text_photo" >
    <img src={photo1} style={{maxWidth:'40%'}}/>
        <div class="description">
            <p class="text"><b>Как стать частью нашего коллектива</b></p>
            <p class="text">Мы всегда рады новым талантливым участникам!</p>
            <p class="text">Если вы любите петь и готовы развиваться творчески - приходите на прослушивание. Нам важны не только вокальные данные, но и ваша энергия, открытость новому и желание быть частью команды.</p>
            <p class="text"> Отбор проходит в два этапа: подача онлайн-заявки и очное прослушивание на Старой Басманной</p>
           

        </div>
    </div>
    <div class="text_photo">
    <div class="description">
    <p class="text"><b>Что нужно для участия?</b></p>
            <p class="text">Заполнить анкету</p>
            <p class="text">Записать видео с исполнением куплета+припева любимой песни (а капелла или с аккомпанементом, но не под плюс)</p>
            <p class="text">Убедиться, что вас хорошо видно и слышно на записи</p>
            <p class="text">Репетиции проходят по вторникам и четвергам с 19:00 до 22:30, и иногда по субботам - учитывайте это при подаче заявки. Мы ждём именно тех, кто сможет полноценно участвовать в жизни коллектива!</p>

            <p class="text">P.S. Дополнительные творческие навыки (танцы, игра на инструментах и так далее) будут большим плюсом, но главное - ваша любовь к музыке и готовность развиваться!</p>
            </div>
            <img src={photo2} style={{maxWidth:'40%'}}/>
    </div>
    </>
    )
}
