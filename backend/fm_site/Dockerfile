# Стартовый образ
# Use the official Python runtime image
FROM python:3.11-alpine 
 
# Create the app directory
RUN mkdir /usr/src/app/
 
# Set the working directory inside the container
WORKDIR /usr/src/app/
 
RUN mkdir -p $WORKDIR/static
RUN mkdir -p $WORKDIR/media

# переменные окружения для python
#не создавать файлы кэша .pyc
ENV PYTHONDONTWRITEBYTECODE 1
# не помещать в буфер потоки stdout и stderr
ENV PYTHONUNBUFFERED 1

# обновим pip
RUN pip install --upgrade pip

# скопируем и установим зависимости. эта операция закешируется 
# и будет перезапускаться только при изменении requirements.txt
COPY ./fm_site/requirements.txt /usr/src/app/
RUN apk update 
RUN apk add --no-cache postgresql-dev gcc musl-dev python3-dev libffi-dev
RUN pip install -r requirements.txt

# копируем всё что осталось.
COPY . /usr/src/app/

ENTRYPOINT ["/usr/src/app/entrypoint.sh" ]
#EXPOSE 8000
 
# Run Django’s development server
#CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]