## TODO:

- [ ] express best practices
- [ ] письмо сброса пароля
- [ ] шарить общие ресурсы между фронтом и бэком
- [ ] сохранять табу в урле для страницы "Мои события"
- [ ] Отправка фото на сервак только при сохранении формы
- [ ] Ошибки бэка на UI формах
- [ ] Responsive
- [ ] process.env на UI
- [ ] типизация всего и вся
- [ ] JSDoc везде
- [ ] деплой
- [ ] build переносит все файлы public в ui/build
- [ ] Пробежаться по коду и убрать говнокод
- [ ] Пробежаться по коду и убрать неиспользуемый код
- [ ] Отлавливать Not allowed by CORS
- [ ] GZIP
- [ ] Создавать папку для изображений, если ее нет

### Формат запросов:

- Данные отправляются в поле `data`.
- Данные для сортировки в поле `sort`.
- Данные для фильтрации в поле `filter`.

### Формат ответов:

#### Успешные

Данные отправляются в поле `data`:
1. Списки как массив (либо пустой, либо с данными);
2. Экземпляр либо как объект с данными, либо `null`.

#### С ошибкой

Данные отправляются в объекте с ключом `error` со следующими полями:
1. `status` HTTP Status Code;
2. `message` Краткое сообщение об ошибке;
3. `stack` Стэк вызовов. Только в `env === development`;
4. `error` Оригинальный объект ошибки. Только в `env === development`.