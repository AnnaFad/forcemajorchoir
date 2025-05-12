from django.core.management.base import BaseCommand
from back.models import *
import functools
from django.utils import timezone


class Command(BaseCommand):
    help = 'Load initial data into the database'

    def handle(self, *args, **kwargs):

        Choirister.objects.create(first_name ='Александра', last_name='Кисарина',  voice='Первый альт', photo='choiristers/Aleksandra_Kisarina.jpg')
        Choirister.objects.create(first_name ='Александр', last_name='Левин',  voice='Второй тенор', photo='choiristers/Alexandr_Levin.jpg')
        Choirister.objects.create(first_name ='Анастасия', last_name='Куренкова',  voice='Первый альт', photo='choiristers/Anastasiia_Kurenkova.jpeg')
        Choirister.objects.create(first_name ='Андрей', last_name='Ладыгин',  voice='Бас', photo='choiristers/Andrey_Ladygin.JPG')
        Choirister.objects.create(first_name ='Анна', last_name='Фадеева',  voice='Первое сопрано', photo='choiristers/Anna_Fadeeva.jpg')
        Choirister.objects.create(first_name ='Даниил', last_name='Дудин',  voice='Второй тенор', photo='choiristers/Daniil_Dudin.JPG')
        Choirister.objects.create(first_name ='Дарья', last_name='Горшкова',  voice='Второе сопрано', photo='choiristers/Daria_Gorshkova.jpeg')
        Choirister.objects.create(first_name ='Дарья', last_name='Смык',  voice='Первое сопрано', photo='choiristers/Daria_Smyk.jpeg')
        Choirister.objects.create(first_name ='Дмитрий', last_name='Фалин',  voice='Бас', photo='choiristers/Dmitry_Falin.jpg')
        Choirister.objects.create(first_name ='Эмиль', last_name='Карачик',  voice='Бас', photo='choiristers/Emil_Karachik.PNG')
        Choirister.objects.create(first_name ='Евгений', last_name='Таранченко',  voice='Первый тенор', photo='choiristers/Evgeny_Taranchenko.JPG')
        Choirister.objects.create(first_name ='Игорь', last_name='Федоров',  voice='Баритон', photo='choiristers/Igor_Fedorov.JPG')
        Choirister.objects.create(first_name ='Иван', last_name='Глазко',  voice='Второй тенор', photo='choiristers/Ivan_Glazko.JPG')
        Choirister.objects.create(first_name ='Екатерина', last_name='Кичко',  voice='Первый альт', photo='choiristers/Kate_Kichko.jpeg')
        Choirister.objects.create(first_name ='Кира', last_name='Осипова',  voice='Второй альт', photo='choiristers/Kira_Osipova.jpg')
        Choirister.objects.create(first_name ='Елена', last_name='Костикова',  voice='Второй альт', photo='choiristers/kolenochka.jpg')
        Choirister.objects.create(first_name ='Ксения', last_name='Пичугина',  voice='Первый альт', photo='choiristers/Ksenia_Pichugina.jpg')
        Choirister.objects.create(first_name ='Марат', last_name='Мансуров',  voice='Второй тенор', photo='choiristers/Marat_Mansurov.JPG')
        Choirister.objects.create(first_name ='Мария', last_name='Ахматгалеева',  voice='Первый альт', photo='choiristers/Maria_Ahmatgaleeva.jpeg')
        Choirister.objects.create(first_name ='Мария', last_name='Данилова',  voice='Второй альт', photo='choiristers/Maria_Danilova.jpg')
        Choirister.objects.create(first_name ='Махаил', last_name='Тужилин',  voice='Первый тенор', photo='choiristers/Michail_Tuzhilin.PNG')
        Choirister.objects.create(first_name ='Полина', last_name='Тихонова',  voice='Первое сопрано', photo='choiristers/Polina_Tihonova.jpg')
        Choirister.objects.create(first_name ='Степан', last_name='Есин',  voice='Баритон', photo='choiristers/Stepan_Esin.jpg')
        Choirister.objects.create(first_name ='Валерия', last_name='Димитрова',  voice='Второй альт', photo='choiristers/Valeria_Dimitrova.png')
        Choirister.objects.create(first_name ='Юлия', last_name='Тужилина',  voice='Второе сопрано', photo='choiristers/Yulia_Tuzhilina.jpg')
        
        News.objects.create(title = "Успейте проголосовать в «Чугуном яйце»",\
                            text_news ="До конца голосования в номинациях премии «Чугунное яйцо» остаётся меньше суток!\
                            Если вы ещё не успели отдать свой голос любимому проекту, самое время сделать это!\
                            \nНе забудь проголосовать до 15 декабря 23:59 (иначе карета превратится в тыкву)\
                            Нам очень нужна именно твоя поддержка\
                            \nИщите хор-бэнд НИУ ВШЭ «Force МАЖОР» в двух номинациях:\
                            \n «Творческий полёт» — вокально-танцевальный номер «Ла-ла Ленд»\
                            \n «Внеучебка на ладони» — FORCE MAJORITY: Отчётный концерт хор-бэнда НИУ ВШЭ «Force МАЖОР»\
                            \nЧтобы не потеряться, лови инструкцию к голосованию: vk.cc/cFVByJ\
                            \nСледить за тем, как проходит премия «Чугунное яйцо», можно по ссылкам ниже:\
                            \n ВК: vk.cc/cFVByM\
                            \n ТГ: vk.cc/cFVByN\
                            \nДо встречи 19 декабря в Культурном Центре!", photo= 'news/Новость1.jpg')
        News.objects.create(title = "Хор-бэнд «Force МАЖОР» стал призёром «Чугунки»",\
                            text_news ="19 декабря состоялась церемония награждения студенческой внеучебной премии «Чугунное яйцо 2024». По итогам голосования хор-бэнд занял 2 место в номинации «Внеучебка на ладони»\
                            \nМы счастливы и благодарны всем, кто за нас голосовал! Спасибо за вашу поддержку! 🧡🙏\
                            \nНа церемонии хор-бэнд выступил с премьерой номера — попурри из песен мюзикла «Mamma Mia»",\
                            photo= 'news/Новость2.jpg')
        News.objects.create(title = "27 декабря Большой зал ЦК НИУ ВШЭ наполнился музыкой и новогодним настроением",\
                            text_news = "Force-МАЖОР провел новогодний концерт, который превратился в настоящий праздник музыки и волшебства.\
                            \nНа сцене ожили песни из «Реальной любви», «Чародеев», «Бриолина» и мюзикла «Rent». А когда зазвучали ABBA, зал дружно притопывал в такт, будто оказался в центре новогоднего мюзикла. \
                            \nМы желаем вам провести Новый год с магией музыки, которая объединяет и делает праздники теплее.",\
                            photo = 'news/Новость3.jpg')
        
        
        News.objects.create(title = "День рождения у бессменного руководителя нашего хора — Светланы Сперанской!",\
                            text_news = "Именно её неисчерпаемые энергия, радость и любовь к коллективу вдохновляют нас заниматься любимым делом ✨\
                            \n\nСвета! Оставайся такой же доброй, жизнерадостной и сильной! Слушай своё сердце — оно никогда не обманывает 😉 \
                            \n\nС любовью, Force МАЖОР ❤️",\
                            photo = 'news/Новость4.jpg')


        
        Event.objects.create(name_event = "Отчетный концерт хор-бэнда Force МАЖОР 2025",\
                            description = "Очередной музыкальный сезон подошел к концу и мы снова готовы удивлять вас своими номерами. \
                                \n Где: Театр Булгаковский дом (м. Маяковская, ул. Большая Садовая, д. 10)\
                                \n Когда: 26 июня 19:00", 
                            event_time = datetime.datetime(2025, 6, 26, 19, 0, tzinfo=None),\
                            photo = "events/Отчетник2025.jpg",\
                            has_registration = True,\
                            limit_people = 120,\
                            date_time_open = datetime.datetime.now().replace(tzinfo=None),\
                            date_time_close = datetime.datetime(2025, 6, 25, 23, 59, tzinfo=None))
        
        Event.objects.create(name_event = "НОЧЬ Студента 2025",\
                            description = "Друзья, после новогоднего отдыха мы снова готовы радовать вас выступлениями!\
                            \n🌟 На большой сцене Культурного Центра ВШЭ в честь «НОЧИ Студента» выступим мы - хор-бэнд FORCE Мажор. А-капелла и зажигательные танцы, все как вы любите😉\
                            \nПриходите, чтобы стать частью этого волшебного вечера и поддержать нас!\
                            \n⚡️Где: Большой Зал КЦ\
                            \n⚡️Когда: Сегодня в 22:15\
                            \n\nДо встречи на главном студенческом событии года!", \
                            event_time = datetime.datetime(2025,1,24, 22,15, tzinfo=None),\
                            photo = "events/НОЧЬ.jpg",\
                            has_registration = False)
        
        #Переделать на Event объекты
        Visitor.objects.create(data_visitor = {"email": "a2004fa@mail.ru", "name":"Фадеева Анна"}, event_ID=Event.objects.get(id = 1))
        Visitor.objects.create(data_visitor = {"email": "a2004fa@mail.ru", "name":"Вася Пупкин"}, event_ID=Event.objects.get(id = 1))
        
        
        user = CustomUser.objects.create(username='choir.fm@gmail.com', email='choir.fm@gmail.com', role_user = CustomUser.Roles.CONDUCTOR)
        user.set_password('5012f5182061c46e57859cf617128c6f70eddfba4db27772bdede5a039fa7085')
        user.save()
        
        Rehersal.objects.create(title = "Прослушивание осень 2024", \
                                date_start = datetime.datetime(2024,9,7, 15,0, tzinfo=None), \
                                date_end = datetime.datetime(2024,9,21, 23,59, tzinfo=None) , is_last = False)
        Rehersal.objects.create(title = "Прослушивание тестовое текущее", \
                                date_start = datetime.datetime(2025, 5, 7, 15,0, tzinfo=None), \
                                date_end = datetime.datetime(2025,6,21, 23,59, tzinfo=None), is_last = True)
        Applicant.objects.create(data_applicant = {"name": "Дудин Даниил Валерьевич",\
                                        "program":"Бизнес-Информатика, бакалавриат, первый курс",\
                                        "hasPass": True,\
                                        "source": "Друзья",\
                                        "education": ["Музыкальная школа", "Самостоятельное обучение", "Индивидуальные занятия (вокал/инструмент/сольфеджио/теория музыки)"],\
                                        "musicalInstrument": "Играю на фортепиано (но уже около года активно не тренировался), казу, шейкер, тамбурин", \
                                        "hasPerformanceExperience": True, \
                                        "creativeExperience": ["Пение в хоре", "Игра в театре", "Чтение стихов", "Танцы"], \
                                        "otherCreativeExperience": "", \
                                        "musicPreferences": "В основном меломан, но отдельно для себя жанры Рока, Джаза и Комедийной песни", \
                                        "reasons": "Это даст мне возможность и дальше заниматься любимым делом, завести новые знакомства и продолжать выступать на сцене", \
                                        "rehersalsTime": "У меня на данный момент нет точного расписания, потому точно к сожалению ничего не могу сказать", \
                                        "email": "vidlopofficial@gmail.com", \
                                        "phone": "+7 912 858-12-25",\
                                        "vk": "https://vk.com/fabulousfrick", \
                                        "tg": "@fabulousfrick"}, \
                                 video = "rehearsal/Dudin.MOV",\
                                 status = 'Pass',\
                                 rehersal_ID = Rehersal.objects.get(id=1))
        
        Applicant.objects.create(data_applicant = {"name": "Кожушко Маргарита Викторовна",\
                                        "program":"\"Когнитивные науки и технологии\", магистр 1-ого курса",\
                                        "hasPass": True,\
                                        "source": "нашла по запросу хор вшэ",\
                                        "education": "Индивидуальные занятия (вокал/инструмент/сольфеджио/теория музыки)",\
                                        "musicalInstrument": "Фортепиано (уровень до-мажор Баха)", \
                                        "hasPerformanceExperience": True, \
                                        "creativeExperience": "Пение в хоре", \
                                        "otherCreativeExperience": "занятия в студии эстрадного вокала, индивидуальные занятия вокалом", \
                                        "musicPreferences": "Слушать люблю современную американскую попсу, петь могу что угодно", \
                                        "reasons": "Перестала заниматься вокалом около двух лет назад, т.к. ушла любимая преподавательница. Очень хочется вернуться к вокалу.  Хочу стать частью хор-бэнда, п.ч. нравится репертуар песен и стиль исполнения [узнала об отборе достаточно поздно, поэтому загрузила видео с квартирника в Школе 21, я сижу посередине в чёрном платье и белой рубашке]", \
                                        "rehersalsTime": "Смогу регулярно посещать", \
                                        "email": "margaretkozh@gmail.com", \
                                        "phone": "+7 952 285-93-99",\
                                        "vk": "", \
                                        "tg": "@margaretko"}, \
                                 video = "rehearsal/Кожушко_Маргарита_Бумбокс_Вахтёры.MOV",\
                                 status = 'Pass',\
                                 rehersal_ID = Rehersal.objects.get(id=1))
        
        Applicant.objects.create(data_applicant = {"name": "Щурова Татьяна Игоревна",\
                                        "program":"Государственное и муниципальное управление, 1 курс",\
                                        "hasPass": True,\
                                        "source": "из тг экстры",\
                                        "education": "Музыкальная школа",\
                                        "musicalInstrument": "Да, балалайка", \
                                        "hasPerformanceExperience": True, \
                                        "creativeExperience": ["Пение в хоре","Танцы","Чтение стихов"], \
                                        "otherCreativeExperience": "игра на балалайке", \
                                        "musicPreferences": "на балалайке играю от народных песен и классики до егора крида и КиШ", \
                                        "reasons": "я на балалайке играть хочу", \
                                        "rehersalsTime": "скорее да, чем нет", \
                                        "email": "tasbafra@gmail.com", \
                                        "phone": "+7 951 086-99-46",\
                                        "vk": "https://vk.com/tasbafra", \
                                        "tg": "tasbafra"}, \
                                 video = "rehearsal/video5316532452833906773.mp4",\
                                 status = 'Fail',\
                                 rehersal_ID = Rehersal.objects.get(id=1))
        
        # Прослушка прошедшая расфасованные участники
        # Прослушка текушая и участники
        Applicant.objects.create(data_applicant = {"name": "Смык Дарья Лукинична",\
                                        "program":"Филология, 2 курс",\
                                        "hasPass": True,\
                                        "source": "Приложение хсе апп",\
                                        "education":"Индивидуальные занятия (вокал/инструмент/сольфеджио/теория музыки)",\
                                        "musicalInstrument": "Фортепиано, гитара", \
                                        "hasPerformanceExperience": True, \
                                        "creativeExperience": ["Пение в хоре","Танцы","Игра в театре"], \
                                        "otherCreativeExperience": "", \
                                        "musicPreferences": "Рок, классика, авторская, академическая", \
                                        "reasons": "Возможность развития вокальных навыков, выступления, коммьюнити", \
                                        "rehersalsTime": "Да", \
                                        "email": "M_shamne@mail.ru", \
                                        "phone": "+7 963 995-42-82",\
                                        "vk": "", \
                                        "tg": "Dasha_shusha"}, \
                                 video = "rehearsal/Смык_Дарья_Никитины_Я леплю из пластилина.MOV",\
                                 status = 'Pass',\
                                 rehersal_ID = Rehersal.objects.get(id=2))
        
        Applicant.objects.create(data_applicant = {"name": "Комиссарова Полина",\
                                        "program":"Социология 1курс",\
                                        "hasPass": True,\
                                        "source": "Ваш Концерт",\
                                        "education": "Музыкальная школа",\
                                        "otherEducation": "Студия вокала",\
                                        "musicalInstrument": "базовые навеки фортепиано", \
                                        "hasPerformanceExperience": True, \
                                        "creativeExperience": ["Пение в хоре","Танцы","Игра в театре","Чтение стихов"],\
                                        "otherCreativeExperience": "", \
                                        "musicPreferences": "Рок, поп (британские - Боуи, Радиохед, Нью ордер) , русские - Хадн-дадн, Краснознаменская дивизия имени моей бабушки, аквариум", \
                                        "reasons": "Возможность применить навыки, реализовать потребности в творческой деятельности, получить опыт работы в творческом коллективе вуза", \
                                        "rehersalsTime": "смогу", \
                                        "email": "polinaviktorovna1507@gmail.com", \
                                        "phone": "+7 913 491-39-18",\
                                        "vk": "https://vk.com/injenu", \
                                        "tg": "@injenu"}, \
                                 video = "rehearsal/Комиссарова_Полина_Краснознаменская дивизия имени моей бабушки_Ядовитый плющ.mp4",\
                                 status = 'New',\
                                 rehersal_ID = Rehersal.objects.get(id=2))


        Applicant.objects.create(data_applicant = {"name": "Ильина Анастасия Алексеевна",\
                                        "program":"Мировая экономика, 2 курс",\
                                        "hasPass": True,\
                                        "source": "хсе апп Х",\
                                        "education": "Музыкальная школа",\
                                        "musicalInstrument": "на всех по чуть-чуть, мои навыки слишком низкие", \
                                        "hasPerformanceExperience": True, \
                                        "creativeExperience": ["Пение в хоре", "Танцы","Чтение стихов","Игра в театре"], \
                                        "otherCreativeExperience": "Всего по чуть-чуть :) Если поможете развить навыки, буду только рада ", \
                                        "musicPreferences": "Люблю мюзиклы, песни из дисгеевских мультиков, Адель, Уитни Хьюстон, Селин Дион, Оливия Родриго,  Кристина Агилера и т д", \
                                        "reasons": "Была частью хора большую часть жизни и мне очень нравится. Хор - это коллектив, творческие люди. Я всегда хотела заниматься творчеством, на любом уровне. Не могу без музыки. Ну и мне кажется, что ваш коллектив больше похож на хор - актерскую труппу, готовую ставить мюзиклы и постановки, что-то большее, чем школьный хор.", \
                                        "rehersalsTime": "вторник и четверг точно, суббота, к сожалению, занята", \
                                        "email": "aailina_8@edu.hse.ru", \
                                        "phone": "+7 908 226-11-41",\
                                        "vk": "", \
                                        "tg": "@bakazhaba"}, \
                                 video = "rehearsal/Ильина_Анастасия_Cynthia_Erivo_Defying_Gravity.mp4",\
                                 status = 'Fail',\
                                 rehersal_ID = Rehersal.objects.get(id=2))

        PhotoGallery.objects.create(photo = "gallery/_RTlA3o1_sP_HCgNcdlQXFtkwYX8VVYavLDUxZskuDVBmF_JIEIJZ7Jmr0LytnS.jpg")
        PhotoGallery.objects.create(photo = "gallery/2J9A9126.jpg")
        PhotoGallery.objects.create(photo = "gallery/2J9A9236.jpg")
        PhotoGallery.objects.create(photo = "gallery/2J9A9255.jpg")
        PhotoGallery.objects.create(photo = "gallery/20240124_221849.jpg")
        PhotoGallery.objects.create(photo = "gallery/5242601136819663307.jpg")
        PhotoGallery.objects.create(photo = "gallery/5262603606970987458.jpg")
        PhotoGallery.objects.create(photo = "gallery/5262664505312277258.jpg")
        PhotoGallery.objects.create(photo = "gallery/5440771821210299667.jpg")
        PhotoGallery.objects.create(photo = "gallery/5440771821210299668.jpg")
        PhotoGallery.objects.create(photo = "gallery/5440771821210299669.jpg")
        PhotoGallery.objects.create(photo = "gallery/5440771821210299672.jpg")
        PhotoGallery.objects.create(photo = "gallery/DSC_0630.JPG")
        PhotoGallery.objects.create(photo = "gallery/DSC_0631.JPG")
        PhotoGallery.objects.create(photo = "gallery/DSC_0644.JPG")
        PhotoGallery.objects.create(photo = "gallery/gpal0qCIKBj2JEw1kUio37DB_54Ru0ed49hdXX9afUkeJ1Bd0P_FktiUX_9eVh_.jpg")
        PhotoGallery.objects.create(photo = "gallery/IMG_4292.JPG")
        PhotoGallery.objects.create(photo = "gallery/IMG_8709.jpg")
        PhotoGallery.objects.create(photo = "gallery/IMG_20250422_193247_548.jpg")
        PhotoGallery.objects.create(photo = "gallery/Новость1.jpg")
        PhotoGallery.objects.create(photo = "gallery/Новость2.jpg")
        PhotoGallery.objects.create(photo = "gallery/Новость3.jpg")
        PhotoGallery.objects.create(photo = "gallery/Новость4.jpg")
        PhotoGallery.objects.create(photo = "gallery/НОЧЬ.jpg")
        PhotoGallery.objects.create(photo = "gallery/Отчетник2025.jpg")
