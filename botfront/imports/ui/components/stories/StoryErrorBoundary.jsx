import { Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import React from 'react';

import i18n from 'meteor/universe:i18n';

class StoryErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch() {
        // TODO: log error somewhere
    }

    render() {
        const { hasError } = this.state;
        if (hasError) {
            return (
                <div className='story-error-wrapper'>
                    <Message
                        icon='warning'
                        header={i18n.__('something_wrong_with_story')}
                        content={i18n.__('refresh_the_page')}
                        negative
                    />
                </div>
            );
        }

        const { children } = this.props;
        return children;
    }
}

StoryErrorBoundary.propTypes = {
    children: PropTypes.element.isRequired,
};

export default StoryErrorBoundary;
