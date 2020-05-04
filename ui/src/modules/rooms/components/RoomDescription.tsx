import {
    CheckSquareOutlined,
    MinusSquareOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {Typography} from 'antd';
import i18n from 'i18next';
import React from 'react';
import {IRoomProp} from 'src/Modules/rooms/models';

export const RoomDescription = ({item}: IRoomProp) => {
    return (
        <React.Fragment>
            <Typography.Paragraph className="room-description">
                {item.description}
            </Typography.Paragraph>
            <Typography.Paragraph className="room-options">
                <Typography.Text>
                    <UserOutlined />{' '}
                    {i18n.t('Rooms:common.seats', {num: item.seats})}
                </Typography.Text>
                <Typography.Text>
                    {item.tv ? (
                        <CheckSquareOutlined />
                    ) : (
                        <MinusSquareOutlined />
                    )}{' '}
                    {i18n.t('Rooms:common.tv')}
                </Typography.Text>
                <Typography.Text>
                    {item.projector ? (
                        <CheckSquareOutlined />
                    ) : (
                        <MinusSquareOutlined />
                    )}{' '}
                    {i18n.t('Rooms:common.projector')}
                </Typography.Text>
                <Typography.Text>
                    {item.whiteboard ? (
                        <CheckSquareOutlined />
                    ) : (
                        <MinusSquareOutlined />
                    )}{' '}
                    {i18n.t('Rooms:common.whiteboard')}
                </Typography.Text>
                <Typography.Text>
                    {item.flipchart ? (
                        <CheckSquareOutlined />
                    ) : (
                        <MinusSquareOutlined />
                    )}{' '}
                    {i18n.t('Rooms:common.flipchart')}
                </Typography.Text>
            </Typography.Paragraph>
        </React.Fragment>
    );
};
