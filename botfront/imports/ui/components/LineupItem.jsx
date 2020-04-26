import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Header, Icon, Image, Modal } from 'semantic-ui-react';
import TableModal from './TableModal'
import Confirm from './Confirm';
import moment from 'moment';
export default class LineupItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            seatModalOpen: false,
            removeModalOpen: false,
            editModalOpen: false
        }
    }

    getAddedInfo() {
        return (
            <div>
                {this.props.table.type === 'messenger' && <span style={{ color: '#2185D0' }}>{i18n.__('from_messenger')} </span>}
                {this.props.table.type === 'manual' && <span>{i18n.__('add_by_staff')} </span>}
                {moment(this.props.table.createdAt).fromNow()}
            </div>
        )
    }

    render() {
        return (
            <Card fluid>
                <Card.Content>
                    {this.props.table.profile.profile_pic &&
                        <Image floated='right' size='mini' src={this.props.table.profile.profile_pic} />
                    }
                    <Card.Header>
                        {this.props.table.people}<Icon name='user' />- {this.props.table.profile.first_name}
                    </Card.Header>
                    <Card.Meta>
                        {this.getAddedInfo()}
                    </Card.Meta>
                </Card.Content>
                <Card.Content extra>
                    <div className='ui four buttons'>
                        <Confirm
                            trigger={<Button basic color='green' ><Icon name='food' />{i18n.__('seat')}</Button>}
                            title={i18n.__('give_table_group', [this.props.table.profile.first_name])}
                            pos={i18n.__('yes_give_table')}
                            neg={i18n.__('cancel')}
                            posCb={this.props.onProcess}
                        />
                        <TableModal
                            trigger={<Button basic color='orange' ><Icon name='compose' />Edit</Button>}
                            place={this.props.place}
                            table={this.props.table}
                            title={i18n.__('edit_group')}
                            onSubmit={this.props.onEdit}
                        />
                        <Confirm
                            trigger={<Button basic color='red' ><Icon name='delete' />Remove</Button>}
                            title={i18n.__('remove_from_wait_list_title', [this.props.table.profile.first_name])}
                            message={i18n.__('remove_from_wait_list_message', [this.props.table.profile.first_name])}
                            pos={i18n.__('yes_remove_group')}
                            neg={i18n.__('cancel')}
                            posCb={this.props.onDelete}
                        />
                    </div>
                </Card.Content>
            </Card>
        );
    }
}

LineupItem.propTypes = {
    place: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
    onProcess: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
};