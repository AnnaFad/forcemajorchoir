import './TextPhotoStyle.css'
import { Image } from 'antd';
import photo from '/src/assets/photo2.jpg'

export default function PhotoRight(props) {
    const {photo} = props;
    return (
    <div class="text_photo" >
        <div class="description">
            <p class="text"><b>Хор-бэнд Force Мажор — это сообщество тех, кто искренне любит музыку и рад делиться ею с другими.</b></p>
            <p class="text">В репертуаре коллектива — популярные песни различных жанров в хоровой аранжировке, песни из мюзиклов и фильмов, классические произведения. Хор-бэнд развивается в направлении show choir, а значит, на сцене хор не только поет, но и танцует и использует элементы актерской игры, создавая полноценное шоу.</p>
            <p class="text">Force Мажор существует в Вышке с 2006 года и активно выступает на различных мероприятиях как в университете, так и за его пределами.</p>
        </div>
        <Image
        height={430}
        width={3000}
        src={photo}
        />
    </div>
    )
}
