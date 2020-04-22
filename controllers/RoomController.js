const {isEmpty} = require('lodash');
const RoomModel = require('../models/RoomModel');
const EventModel = require('../models/EventModel');
const {catchAsync, getFieldsFromObject} = require('../utils/controllersUtils');
const {AppError} = require('../utils/errorUtils');

/**
 * Контроллер создания документа "Переговорная комната".
 */
exports.create = catchAsync(async function (req, res) {
    const room = await RoomModel.create(
        getFieldsFromObject(req.body.data, [
            'name',
            'description',
            'seats',
            'floor',
            'tv',
            'projector',
            'whiteboard',
            'flipchart',
            'building',
        ]),
    );

    res.status(201).send({
        data: room,
    });
});

const getRoomsFilter = (filter) => {
    let result = {
        ...getFieldsFromObject(filter, [
            'tv',
            'projector',
            'whiteboard',
            'flipchart',
            'building',
        ]),
        seats: {$gte: filter.seats || 1},
    };

    if (!isEmpty(filter.floors)) {
        result.floor = {$in: filter.floors};
    }

    return result;
};

/**
 * Контроллер получения списка документов "Переговорная комната".
 */
exports.getAll = catchAsync(async function (req, res) {
    const {filter} = req.body.data;
    const findFilter = filter ? getRoomsFilter(filter) : {};
    const rooms = await RoomModel.find(findFilter);

    if (!filter || rooms.length === 0 || !filter.notReserved) {
        return res.status(200).send({
            data: rooms,
        });
    }

    const ids = rooms.map((item) => item._id);
    const events = await EventModel.find({
        room: {$in: ids},
        date: filter.date,
        $or: [
            {
                $and: [
                    {from: {$gte: filter.dateFrom}},
                    {from: {$lt: filter.dateTo}},
                ],
            },
            {from: {$lt: filter.dateFrom}, to: {$gt: filter.dateFrom}},
        ],
    });

    const notReservedRooms = rooms.filter(
        (item) =>
            !events.find((event) => {
                return event.room.toString() === item._id.toString();
            }),
    );

    res.status(200).json({
        data: notReservedRooms,
    });
});

/**
 * Контроллер получения детальной информации документа "Переговорная комната".
 */
exports.getDetails = catchAsync(async function (req, res, next) {
    const {id} = req.params;

    const room = await RoomModel.findById(id);
    if (!room) {
        return next(new AppError('Документ не найден', 404));
    }

    res.status(200).send({
        data: room,
    });
});

/**
 * Контроллер удаления документов "Переговорная комната".
 */
exports.delete = catchAsync(async function (req, res) {
    const {ids} = req.body.data;

    await RoomModel.deleteMany({
        _id: {$in: ids},
    });

    res.status(200).send();
});

/**
 * Контроллер обновление документа "Переговорная комната".
 */
exports.update = catchAsync(async function (req, res, next) {
    const {_id} = req.body.data;

    const room = await RoomModel.findById(_id);
    if (!room) {
        return next(new AppError('Документ не найден', 404));
    }

    await room.update(
        getFieldsFromObject(req.body.data, [
            'name',
            'description',
            'seats',
            'floor',
            'tv',
            'projector',
            'whiteboard',
            'flipchart',
            'building',
        ]),
        {
            runValidators: true,
        },
    );

    res.status(200).send();
});
