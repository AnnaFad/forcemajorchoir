-- Добавление нового хориста в таблицу 
CREATE OR REPLACE FUNCTION AddChorister(p_first_name VARCHAR(200), p_last_name VARCHAR(200), p_is_conductor BOOLEAN, p_description TEXT, p_photo TEXT) 
    RETURNS VOID AS $$
BEGIN
    INSERT INTO choristers (first_name, last_name, is_conductor, description, photo, is_deleted, create_at, update_at) 
    VALUES (p_first_name, p_last_name, p_is_conductor, p_description, p_photo, False, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) ;
END;
$$ LANGUAGE plpgsql;

--Добавление администратора в таблицу
CREATE OR REPLACE FUNCTION AddAdmin(p_email varchar(100), p_password_hash varchar(100)) 
    RETURNS VOID AS $$
BEGIN
    INSERT INTO users (email, password_hash, role_user, create_at, update_at) 
    VALUES (p_email, p_password_hash, 'Admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) ;
END;
$$ LANGUAGE plpgsql;

--Добавление новости в таблицу 
CREATE OR REPLACE FUNCTION AddNews(p_title VARCHAR(400), p_text TEXT, p_photo TEXT) 
    RETURNS VOID AS $$
BEGIN
    INSERT INTO news(title, text_news, photo,  is_deleted, create_at, update_at) 
    VALUES (p_title, p_text, p_photo, False, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) ;
END;
$$ LANGUAGE plpgsql;

--Добавление мероприятия в таблицу 
CREATE OR REPLACE FUNCTION AddEvent(p_name_event VARCHAR(500), p_description TEXT, p_event_time TIMESTAMP, p_photo TEXT, p_has_registration BOOLEAN, p_limit_people INT, p_date_time_open TIMESTAMP, p_hours_for_registration INT) 
    RETURNS VOID AS $$
BEGIN
    INSERT INTO events(name_event, description_, event_time, photo, has_registration, registration_is_open, limit_people, date_time_open, hours_for_registration, is_deleted, create_at, update_at) 
    VALUES (p_name_event, p_description, p_event_time, p_photo, p_has_registration, p_registration_is_open, p_limit_people, p_date_time_open, p_hours_for_registration, False, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    
END;
$$ LANGUAGE plpgsql;

--Добавление прослушивания в таблицу 
CREATE OR REPLACE FUNCTION AddRehersal(p_title VARCHAR(400), p_date_start TIMESTAMP, p_days_for_registration INTEGER) 
    RETURNS VOID AS $$
BEGIN
	Update rehersals
    SET is_last = FALSE;
    	
    INSERT INTO rehersals(title, date_start, days_for_registration, is_last, create_at, update_at) 
    VALUES (p_title, p_date_start, p_days_for_registration, True, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) ;
   	
END;
$$ LANGUAGE plpgsql;


 --Добавление регистрации на мероприятие при условии, что она открыта
 CREATE OR REPLACE FUNCTION AddVisitor(p_event_ID integer, p_data_visitor jsonb)
 	RETURNS VOID AS $$
    BEGIN
    ASSERT (SELECT registration_is_open FROM events WHERE is_deleted = FALSE AND event.ID = p_event_ID) = True, 
    		'Невозможно добавить регистрацию на мероприятие id = %', p_event_ID;
    INSERT INTO visitors(data_visitor, event_ID, is_deleted, create_at, update_at) 
    VALUES (p_data_visitor, p_event_ID,  False, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    IF (SELECT COUNT(*) FROM visitors WHERE event_id = p_event_ID) >= (SELECT limit_people FROM events WHERE Id = p_event_ID)
    THEN UPDATE events
    		SET registration_is_open = FALSE
            WHERE ID = p_event_ID;
    END IF;
	END;
$$ LANGUAGE plpgsql;

--Добавление анкеты со статусом “Не прослушан” на последнее по дате открытия прослушивание, при условии, что оно открыто
CREATE OR REPLACE FUNCTION AddApplicant(p_data_applicant jsonb)
 	RETURNS VOID AS $$
    BEGIN
    ASSERT (SELECT date_start + INTERVAL'% days', days_for_registration FROM rehersals WHERE is_last = TRUE) < CURRENT_TIMESTAMP, 
    		'Невозможно добавить регистрацию на мероприятие id = %', p_event_ID;
    INSERT INTO applicants(data_applicant, status, rehersal_id, create_at, update_at) 
    VALUES (p_data_applicant, 'New', (SELECT id From rehersals WHERE is_last = TRUE), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) ;
	END;
$$ LANGUAGE plpgsql;
