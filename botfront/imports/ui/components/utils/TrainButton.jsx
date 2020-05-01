import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Button, Popup } from 'semantic-ui-react';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import { isTraining } from '../../../api/nlu_model/nlu_model.utils';
import { StoryGroups } from '../../../api/storyGroups/storyGroups.collection';

import {i18n} from 'meteor/universe:i18n';


class TrainButton extends React.Component {
    train = () => {
        const { instance, projectId } = this.props;
        Meteor.call('project.markTrainingStarted', projectId);
        Meteor.call('rasa.train', projectId, instance, (err) => {
            if (err) {
                Alert.error(i18n.__('train_failed', [JSON.stringify(err.reason)]), {
                    position: 'top-right',
                    timeout: 'none',
                });
            }
        });
    }

    renderButton = (project, instance, popupContent) => (
        !popupContent ? (
            <Button
                color='blue'
                icon='grid layout'
                content={i18n.__('train_everything')}
                labelPosition='left'
                disabled={isTraining(project) || !instance}
                loading={isTraining(project)}
                onClick={this.train}
                compact
                data-cy='train-button'
            />
        ) : (
                <Popup
                    content={popupContent}
                    trigger={
                        (
                            <Button
                                color='yellow'
                                icon='eye'
                                content={i18n.__('partial_training')}
                                labelPosition='left'
                                disabled={isTraining(project) || !instance}
                                loading={isTraining(project)}
                                onClick={this.train}
                                data-cy='train-button'
                            />
                        )
                    }
                    // Popup is disabled while training
                    disabled={project.training && project.training.status === 'training'}
                    inverted
                    size='tiny'
                />
            )
    );

    render() {
        const {
            project,
            instance,
            popupContent,
            ready,
        } = this.props;
        return ready && this.renderButton(project, instance, popupContent);
    }
}

TrainButton.propTypes = {
    project: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    instance: PropTypes.object,
    popupContent: PropTypes.string,
    ready: PropTypes.bool.isRequired,
};

TrainButton.defaultProps = {
    instance: null,
    popupContent: '',
};

export default withTracker((props) => {
    // Gets the required number of selected storygroups and sets the content and popup for the train button
    const { projectId } = props;
    const storyGroupHandler = Meteor.subscribe('storiesGroup', projectId);
    const ready = storyGroupHandler.ready();
    let storyGroups;
    let selectedStoryGroups;
    let popupContent;
    if (ready) {
        storyGroups = StoryGroups.find({ projectId }, { field: { _id: 1 } }).fetch();
        selectedStoryGroups = storyGroups.filter(storyGroup => (storyGroup.selected));

        if (selectedStoryGroups && selectedStoryGroups.length > 1) popupContent = i18n.__('train_nlu_from_focused_group', [selectedStoryGroups.length]);
        else if (selectedStoryGroups && selectedStoryGroups.length === 1) popupContent = i18n.__('train_nlu_from_focused_group', ['1']);
    }

    return {
        ready,
        popupContent,
    };
})(TrainButton);
