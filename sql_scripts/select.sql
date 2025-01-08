--Возвращение списка всех хористов
SELECT * FROM choristers
WHERE  is_deleted = FALSE;

-- Возвращение списка всех прослушиваний
SELECT * FROM rehersals;

-- Возвращение списка анкет на прослушивание с заданным статусом
CREATE OR REPLACE FUNCTION GetApplicantsByStatus(p_ID_rehersal INTEGER, p_status applicant_status)
RETURNS TABLE (
    name_applicant VARCHAR(100),
    status applicant_status
) AS $$
BEGIN
    RETURN QUERY
    SELECT data_applicant->>'name', status 
    FROM applicants
    WHERE status = p_status
    AND rehersal_ID = p_ID_rehersal;
END;
$$ LANGUAGE plpgsql;

-- Возвращение списка регистраций на мероприятие
CREATE OR REPLACE FUNCTION GetEventVisitors(input INT)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT visitors.data INTO result
    FROM visitors
    WHERE visitors.event_ID = input;
    RETURN COALESCE(result, 'null'::JSONB);
END;
$$ LANGUAGE plpgsql;

-- Возвращение информации о прослушивании
CREATE OR REPLACE FUNCTION GetRehersalInfo(input INTEGER)
RETURNS TABLE (
    title VARCHAR(400),
    date_start TIMESTAMP,
    days_for_registration INTEGER,
    is_last BOOLEAN
) AS $$
BEGIN
    RETURN  QUERY
        SELECT *
        FROM rehersals
        WHERE ID = input;
END;
$$ LANGUAGE plpgsql;

--Возвращение  не более N последних по дате публикации новостей, упорядоченных по убыванию даты публикации.
CREATE OR REPLACE FUNCTION GetLatestNews(N INTEGER)
RETURNS TABLE (
    title VARCHAR(400),
    text_ TEXT,
    photo TEXT, -- ссылка на S3
    publication_time TIMESTAMP   
) AS $$
BEGIN
    RETURN QUERY
        SELECT *
        FROM news
        WHERE is_deleted = FALSE
        ORDER BY publication_time DESC
        LIMIT N;
END;
$$ LANGUAGE plpgsql;


-- Возвращение данных анкеты
CREATE OR REPLACE FUNCTION GetApplicantData(input INTEGER)
RETURNS JSONB AS
$$
DECLARE
    result JSONB;
BEGIN
    SELECT applicants.data INTO result
    FROM applicants
    WHERE applicants.ID = input;
    RETURN COALESCE(result, 'null'::JSONB);
END;
$$ LANGUAGE plpgsql;

-- Возвращение информации о конкретном мероприятии
CREATE OR REPLACE FUNCTION GetEventInfo(input INTEGER)
RETURNS TABLE ( 
  	id integer, 
    name_event VARCHAR(500),
    description_ TEXT,
    event_time TIMESTAMP,
    photo TEXT,
    has_registration BOOLEAN,
    registration_is_open BOOLEAN,
    limit_people INTEGER,
    date_time_open TIMESTAMP,
    hour_for_registration INTEGER,
    is_deleted BOOLEAN,
  	create_add TIMESTAMP,
  	update_add TIMESTAMP
) AS $$
BEGIN	
	SELECT CheckIsOpenReg(INPUT);
    RETURN QUERY
        SELECT *
        FROM rehersals
        WHERE ID = input;
END;
$$ LANGUAGE plpgsql;

--Возвращение всех прошедших мероприятий по убыванию даты проведения
CREATE OR REPLACE FUNCTION GetPastEvents()
RETURNS TABLE ( 
  	id integer, 
    name_event VARCHAR(500),
    description_ TEXT,
    event_time TIMESTAMP,
    photo TEXT,
    has_registration BOOLEAN,
    registration_is_open BOOLEAN,
    limit_people INTEGER,
    date_time_open TIMESTAMP,
    hour_for_registration INTEGER,
    is_deleted BOOLEAN,
  	create_add TIMESTAMP,
  	update_add TIMESTAMP)
AS $$
BEGIN
RETURN QUERY
    SELECT *
    FROM events
    WHERE event_time < CURRENT_TIMESTAMP AND is_deleted = FALSE
    ORDER BY event_time DESC;

END;
$$ LANGUAGE plpgsql;

--Возвращение всех предстоящих мероприятий,  упорядоченных по возрастанию даты проведения
CREATE OR REPLACE FUNCTION GetUpcomingEvents()
RETURNS TABLE ( 
  	id integer, 
    name_event VARCHAR(500),
    description_ TEXT,
    event_time TIMESTAMP,
    photo TEXT,
    has_registration BOOLEAN,
    registration_is_open BOOLEAN,
    limit_people INTEGER,
    date_time_open TIMESTAMP,
    hour_for_registration INTEGER,
    is_deleted BOOLEAN,
  	create_add TIMESTAMP,
  	update_add TIMESTAMP)
AS $$
BEGIN
RETURN QUERY
    SELECT *
    FROM events
    WHERE event_time > CURRENT_TIMESTAMP AND is_deleted = FALSE
    ORDER BY event_time ASC;

END;
$$ LANGUAGE plpgsql;

--Возвращение не более 10-ти ближайших предстоящих мероприятий по дате проведения мероприятия
CREATE OR REPLACE FUNCTION GetTenUpcomingEvents()
RETURNS TABLE ( 
  	id integer, 
    name_event VARCHAR(500),
    description_ TEXT,
    event_time TIMESTAMP,
    photo TEXT,
    has_registration BOOLEAN,
    registration_is_open BOOLEAN,
    limit_people INTEGER,
    date_time_open TIMESTAMP,
    hour_for_registration INTEGER,
    is_deleted BOOLEAN,
  	create_add TIMESTAMP,
  	update_add TIMESTAMP)
AS
$$
BEGIN
RETURN QUERY
    SELECT *
    FROM events
    WHERE event_time > CURRENT_TIMESTAMP AND is_deleted = FALSE
    ORDER BY event_time ASC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;