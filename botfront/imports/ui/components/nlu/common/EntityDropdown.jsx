import { Dropdown } from 'semantic-ui-react';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { entityPropType } from '../../utils/EntityUtils';

import i18n from 'meteor/universe:i18n';


// eslint-disable-next-line no-control-regex
const asciiChar = /^[\x21-\x7E]+$/;

function EntityDropdown({
    entity, onAddItem, onChange, options, autofocus, allowAdditions,
}) {
    const uniqueOptions = [...new Set(options.map(option => option.value))].map(value => ({
        text: value,
        value,
    }));

    const [searchInputState, setSearchInputState] = useState('');

    const handleSearchChange = (_e, { searchQuery }) => {
        // !searchQuery means emtpy string
        if (asciiChar.test(searchQuery) || !searchQuery) {
            setSearchInputState(searchQuery);
        }
    };

    return (
        <Dropdown
            searchInput={{ autoFocus: (!entity || !entity.entity) && autofocus }}
            icon='code'
            basic
            fluid
            button
            labeled
            className='icon entity-dropdown'
            placeholder={i18n.__('select_entity')}
            search
            selection
            value={entity && entity.entity}
            allowAdditions={allowAdditions}
            additionLabel={i18n.__('add_entity') + ': '}
            onAddItem={onAddItem}
            onChange={onChange}
            onSearchChange={handleSearchChange}
            searchQuery={searchInputState}
            options={uniqueOptions}
            data-cy='entity-dropdown'
        />
    );
}

EntityDropdown.propTypes = {
    entity: PropTypes.shape(entityPropType).isRequired,
    onAddItem: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    autofocus: PropTypes.bool,
    allowAdditions: PropTypes.bool,
};

EntityDropdown.defaultProps = {
    autofocus: false,
    allowAdditions: true,
};


export default EntityDropdown;
