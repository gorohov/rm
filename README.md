## TODO:

- [ ] Список для согласования брони
- [ ] Выбирать именно участников, а не email (ФИО в 1 поле, индекс, поиск по подстроке)
- [ ] Посмотреть расположение переговорки на карте
- [ ] Responsive
- [ ] Убрать дефолтное значение здания
- [ ] Ошибки бэка на UI формах
- [ ] Вынести список полей в переменные
- [ ] сохранять табу в урле для страницы "Мои события"
- [ ] типизация всего и вся
- [ ] JSDoc везде
- [ ] Пробежаться по коду и убрать говнокод
- [ ] Пробежаться по коду и убрать неиспользуемый код
- [ ] шарить общие ресурсы между фронтом и бэком
- [ ] убрать синхронный код с бэка
- [ ] загрузка шаблона QR-code.

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