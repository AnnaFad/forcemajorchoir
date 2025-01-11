--Обновление информации о хористе. Если его нет, ничего не меняется
CREATE OR REPLACE FUNCTION UpdateChorister(p_ID integer, p_first_name VARCHAR(200), 
                                           p_last_name VARCHAR(200), p_description TEXT, p_photo TEXT)   
	RETURNS VOID AS $$
    UPDATE choristers
        SET first_name = p_first_name,
        	last_name = p_last_name,
            description = p_description,
            photo = p_photo,
            update_at = CURRENT_TIMESTAMP
        WHERE choristers.ID = p_ID;
	$$ LANGUAGE SQL;
    
--"Удаление" хориста
CREATE OR REPLACE FUNCTION DeleteChorister(p_ID integer)   
	RETURNS VOID AS $$
    BEGIN 
    ASSERT is_deleted = FALSE, 'Хорист % уже удалён', p_ID;
    UPDATE choristers
        SET is_deleted = TRUE,
        	update_at = CURRENT_TIMESTAMP
        WHERE choristers.ID = p_ID;
	END $$ LANGUAGE plpgSQL;
    
--Обновление пароля администратора или хормейстера
CREATE OR REPLACE FUNCTION UpdateUserPassward(p_ID integer, p_password_hash varchar(100))   
	RETURNS VOID AS $$
    UPDATE users
        SET password_hash = p_password_hash,
        	update_at = CURRENT_TIMESTAMP
        WHERE users.ID = p_ID;
	$$ LANGUAGE SQL;

--Обновление новости
CREATE OR REPLACE FUNCTION UpdateNews(p_ID integer, p_title VARCHAR(400), p_text TEXT, p_photo TEXT)
    RETURNS VOID AS $$
    UPDATE news
        SET title  = p_title,
        	text_news = p_text,
            photo = p_photo,
            update_at = CURRENT_TIMESTAMP
        WHERE news.ID = p_ID;
$$ LANGUAGE SQL;

--"Удаление" новости
CREATE OR REPLACE FUNCTION DeleteNews(p_ID integer)   
	RETURNS VOID AS $$
    BEGIN 
    ASSERT is_deleted = FALSE, 'Новость % уже удалёна', p_ID;
    UPDATE news
        SET is_deleted = TRUE,
        	update_at = CURRENT_TIMESTAMP
        WHERE news.ID = p_ID;
	END $$ LANGUAGE plpgSQL;
    
--Изменение данных мероприятия
CREATE OR REPLACE FUNCTION UpdateEvent(p_ID integer, p_name_event VARCHAR(500), p_description TEXT, p_event_time TIMESTAMP, p_photo TEXT,
                                       p_has_registration BOOLEAN, p_limit_people INT, p_date_time_open TIMESTAMP, p_hours_for_registration INTEGER,
                                       p_registration_is_open BOOLEAN) 
    RETURNS VOID AS $$
    UPDATE events
        SET name_event  = p_name_event,
        	description = p_description,
            event_time = p_event_time,
            photo = p_photo,
            has_registration = p_has_registration,
            limit_people = p_limit_people,
            date_time_open = p_date_time_open,
            hours_for_registration = p_hours_for_registration,
            registration_is_open = p_registration_is_open,
            update_at = CURRENT_TIMESTAMP
        WHERE events.ID = p_ID;
$$ LANGUAGE SQL;

--Удаление мероприятия
CREATE OR REPLACE FUNCTION DeletуEvent(p_ID integer)   
	RETURNS VOID AS $$
    BEGIN 
    ASSERT is_deleted = FALSE, 'Мероприятие % уже удалёно', p_ID;
    UPDATE events
        SET is_deleted = TRUE,
        	update_at = CURRENT_TIMESTAMP
        WHERE events.ID = p_ID;
	END;
$$ LANGUAGE plpgSQL;
    
--Изменение данных прослушивания
CREATE OR REPLACE FUNCTION UpdateRehersal(p_ID integer, p_title VARCHAR(400), p_date_start TIMESTAMP, p_days_for_registration INTEGER, p_is_last BOOLEAN) 
    
    RETURNS VOID AS $$
    UPDATE rehersals
        SET title  = p_title,
        	date_start = p_date_start,
            days_for_registration = p_days_for_registration,
            is_last = p_is_last,
            update_at = CURRENT_TIMESTAMP
        WHERE rehersals.ID = p_ID;
$$ LANGUAGE SQL;

--Изменение статуса анкеты
CREATE OR REPLACE FUNCTION ChangeStatus(p_ID integer, p_status applicant_status)
RETURNS VOID AS $$
BEGIN
    UPDATE applicants
    SET status = p_status
    WHERE applicants.ID = p_ID;
END;
$$ LANGUAGE plpgsql;

--обновление статуса, открыта ли регистрация
CREATE OR REPLACE FUNCTION CheckIsOpenReg(p_event_ID integer)
	RETURNS VOID
    $$
    BEGIN
    if (SELECT COUNT(*) FROM visitors WHERE event_id = p_event_ID) >= (SELECT limit_people FROM events WHERE Id = p_event_ID)
    THEN UPDATE events
    		SET registration_is_open = FALSE
            WHERE ID = p_event_ID;
    END IF;
    IF (SELECT SELECT date_time_open + INTERVAL'% hours', hours_for_registration FROM events WHERE Id = p_event_ID) < CURRENT_TIMESTAMP 
    THEN UPDATE events
    		SET registration_is_open = FALSE
            WHERE ID = p_event_ID;
    END IF;
    END;
    $$ LANGUAGE plpgsql;
