import {message} from 'antd';
import i18n from 'i18next';
import {Dispatch} from 'redux';
import {dispatchAsync} from 'src/Core/actions/utils';
import {InterfaceAction} from 'src/Core/actions/InterfaceActions';
import {ROUTER} from 'src/Core/router/consts';
import {
    CLEAR_ROOMS_DATA,
    CREATE_ROOM,
    DELETE_ROOMS,
    FIND_ROOMS,
    GET_ROOM_BY_ID,
    UPDATE_ROOM,
} from 'src/Modules/rooms/actions/actionTypes';
import {
    IGetAllRoomsData,
    IRoomCreateModel,
    IRoomModel,
} from 'src/Modules/rooms/models';
import {RoomsService} from 'src/Modules/rooms/service/RoomsService';

/**
 * Сервис модуля Events.
 */
export class RoomsActions {
    constructor(private service: RoomsService, private dispatch: Dispatch) {
        this.service = service;
        this.dispatch = dispatch;
    }

    /**
     * Найти бронирования переговорных комнат.
     *
     * @param {IGetAllRoomsData} data Данные для поиска.
     */
    find = (data: IGetAllRoomsData) => {
        return dispatchAsync(
            this.dispatch,
            FIND_ROOMS,
            this.service.find(data),
        );
    };

    /**
     * Найти избранные переговорные комнаты.
     */
    getFavourite = () => {
        return dispatchAsync(
            this.dispatch,
            FIND_ROOMS,
            this.service.getFavourite(),
        );
    };

    /**
     * Получить детальную информацию.
     *
     * @param {string} id Идентификатор.
     */
    getById = (id: string) => {
        return dispatchAsync(
            this.dispatch,
            GET_ROOM_BY_ID,
            this.service.getById(id),
        );
    };

    /**
     * Создать бронирование.
     *
     * @param {IRoomCreateModel} data Данные для создания.
     */
    create = (data: IRoomCreateModel) => {
        return dispatchAsync(
            this.dispatch,
            CREATE_ROOM,
            this.service.create(data),
        )
            .then((res) => {
                message.success(i18n.t('Rooms:edit.createSuccess'));
            })
            .catch((error) => {
                message.error(
                    error?.error?.message || i18n.t('Rooms:edit.createError'),
                );
            });
    };

    /**
     * Обновить бронирование.
     *
     * @param {IRoomModel} data Данные для обновления.
     */
    update = (data: IRoomModel) => {
        return dispatchAsync(
            this.dispatch,
            UPDATE_ROOM,
            this.service.update(data),
        )
            .then((res) => {
                message.success(i18n.t('Rooms:edit.updateSuccess'));
                InterfaceAction.redirect(ROUTER.MAIN.ADMIN.ROOMS.FULL_PATH);
            })
            .catch((error) => {
                message.error(
                    error?.error?.message || i18n.t('Rooms:edit.updateError'),
                );
            });
    };

    /**
     * Удалить бронирования переговорных комнат.
     *
     * @param {string[]} ids Данные для удаления.
     */
    delete = (ids: string[]) => {
        return dispatchAsync(
            this.dispatch,
            DELETE_ROOMS,
            this.service.delete({data: {ids}}),
        )
            .then((res) => {
                message.success(i18n.t('Rooms:delete.deleteSuccess'));
            })
            .catch((error) => {
                message.error(
                    error?.error?.message || i18n.t('Rooms:delete.deleteError'),
                );
            });
    };

    /**
     * Очистить стор.
     */
    clear() {
        this.dispatch({
            type: CLEAR_ROOMS_DATA,
        });
    }
}
