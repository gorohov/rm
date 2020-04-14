const EventModel = require('../models/EventModel');
const {catchAsync, getFieldsFromObject} = require('../utils/controllersUtils');
const {AppError} = require('../utils/errorUtils');

/**
 * Контроллер создания документа "Встреча".
 */
exports.create = catchAsync(async function (req, res) {
  const room = await EventModel.create(
    getFieldsFromObject(req.body, [
      'room',
      'date',
      'canceled',
      'from',
      'to',
      'title',
      'description',
      'owner',
      'members',
    ]),
  );

  res.status(201).send({
    status: 'success',
    data: {
      room,
    },
  });
});

/**
 * Контроллер получения списка документов "Встреча".
 */
exports.getAll = catchAsync(async function (req, res) {
  const {filter} = req.body;
  const findFilter = filter
    ? getFieldsFromObject(filter, ['room', 'date', 'owner', 'canceled'])
    : {};
  const events = await EventModel.find(findFilter);

  res.status(200).send({
    status: 'success',
    data: {
      events,
    },
  });
});

/**
 * Контроллер получения детальной информации документа "Встреча".
 */
exports.getDetails = catchAsync(async function (req, res, next) {
  const {id} = req.params;

  const event = await EventModel.findById(id);
  if (!event) {
    return next(new AppError('Документ не найден', 404));
  }

  res.status(200).send({
    status: 'success',
    data: {
      event,
    },
  });
});

/**
 * Контроллер обновление документа "Встреча".
 */
exports.update = catchAsync(async function (req, res, next) {
  const {_id} = req.body;

  const event = await EventModel.findById(_id);
  if (!event) {
    return next(new AppError('Документ не найден', 404));
  }

  await event.update(
    getFieldsFromObject(req.body, [
      'room',
      'date',
      'canceled',
      'from',
      'to',
      'title',
      'description',
      'owner',
      'members',
    ]),
    {
      runValidators: true,
    },
  );

  res.status(200).send({
    status: 'success',
  });
});

/**
 * Контроллер удаления документов "Встреча".
 */
exports.delete = catchAsync(async function (req, res) {
  const {ids} = req.body;

  await EventModel.deleteMany({
    _id: {$in: ids},
  });

  res.status(200).send({
    status: 'success',
  });
});