import {Col, PageHeader, Row, Skeleton, Typography} from 'antd';
import i18n from 'i18next';
import {find} from 'lodash-es';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {TAppStore} from 'Core/store/model';
import {EventsActions} from 'Modules/events/actions/EventsActions';
import {EventMembers} from 'Modules/events/components/EventMembers';
import {EventOwner} from 'Modules/events/components/EventOwner';
import {IEventModel} from 'Modules/events/models';
import {EventsService} from 'Modules/events/service/EventsService';
import {calculateTimeString} from 'Modules/events/utils';
import {RoomTitle} from 'Modules/rooms/components/RoomTitle';

interface IState {
    eventData: IEventModel;
}

interface IStateProps {
    events: IAsyncData<IEventModel[]>;
    details: IAsyncData<IEventModel>;
}

interface IDispatchProps {
    eventsActions: EventsActions;
}

interface IOwnProps {
    match: any;
}

type TProps = IOwnProps & IStateProps & IDispatchProps;

class EventDetailsPage extends React.Component<TProps, IState> {
    constructor(props: TProps) {
        super(props);

        const {
            events,
            match: {params},
            eventsActions,
        } = props;
        const eventFromList = find(
            events.data,
            (event) => event._id === params.id,
        );

        if (!eventFromList) {
            eventsActions.getById(params.id);
        }

        this.state = {
            eventData: eventFromList,
        };
    }

    handleBack = () => {
        window.history.back();
    };

    render() {
        const {details} = this.props;
        const eventData = this.state.eventData || details.data;
        const isLoading =
            details.status !== EStatusCodes.SUCCESS &&
            details.status !== EStatusCodes.FAIL &&
            !eventData;

        if (isLoading) {
            return (
                <React.Fragment>
                    <PageHeader
                        className="main-header"
                        title={
                            <Skeleton
                                active
                                paragraph={false}
                                title={{width: 300}}
                            />
                        }
                        onBack={this.handleBack}
                    />
                    <Row gutter={{xs: 8, sm: 16, md: 24}}>
                        <Col span={24}>
                            <Skeleton active />
                            <Skeleton active />
                            <Skeleton active />
                        </Col>
                    </Row>
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                <PageHeader
                    className="main-header"
                    title={i18n.t('Events:details.title', {
                        title: eventData.title,
                    })}
                    onBack={this.handleBack}
                />
                <Row gutter={{xs: 8, sm: 16, md: 24}}>
                    <Col span={24}>
                        <Typography.Title level={4}>
                            {i18n.t('Events:details.owner')}
                        </Typography.Title>
                        <Typography.Paragraph>
                            <EventOwner owner={eventData.owner as any} />
                        </Typography.Paragraph>
                        <Typography.Title level={4}>
                            {i18n.t('Events:details.date')}
                        </Typography.Title>
                        <Typography.Paragraph>
                            {eventData.date}, {calculateTimeString(eventData)}
                        </Typography.Paragraph>
                        <Typography.Title level={4}>
                            {i18n.t('Events:details.description')}
                        </Typography.Title>
                        <Typography.Paragraph>
                            {eventData.description}
                        </Typography.Paragraph>
                        <Typography.Title level={4}>
                            {i18n.t('Events:details.members')}
                        </Typography.Title>
                        <Typography.Paragraph>
                            <EventMembers event={eventData} />
                        </Typography.Paragraph>
                        <Typography.Title level={4}>
                            {i18n.t('Events:details.room')}
                        </Typography.Title>
                        <Typography.Paragraph>
                            <RoomTitle item={eventData.room as any} addLink />
                        </Typography.Paragraph>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => ({
    events: state.events.list,
    details: state.events.details,
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    eventsActions: new EventsActions(new EventsService(), dispatch),
});

/**
 * Страница регистрации.
 */
const connected = withRouter(
    connect<IStateProps, IDispatchProps>(
        mapStateToProps,
        mapDispatchToProps,
    )(EventDetailsPage),
);

export {connected as EventDetailsPage};
