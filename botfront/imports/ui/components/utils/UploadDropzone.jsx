import React, { useState, useRef } from 'react';
import { NativeTypes } from 'react-dnd-html5-backend-cjs';
import { useDrop } from 'react-dnd-cjs';

import i18n from 'meteor/universe:i18n';

import {
    Message, Icon, Button, Segment,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Loading } from './Utils';

export default function UploadDropzone(props) {
    const {
        onDropped, accept: acceptString = '', onError, successMessage, success, loading, binary, maxSizeInMb,
    } = props;
    const [processing, setProcessing] = useState(false);
    const fileField = useRef();

    const handleError = (string) => {
        setProcessing(false);
        return onError(string);
    };

    const loadFiles = (files) => {
        setProcessing(true);

        const accept = acceptString.split(/,\s*/);
        let acceptedFiles = files.filter(f => accept.includes(f.type) || accept.some(t => f.name.match(new RegExp(`${t}$`))));
        let rejectedFiles = files.filter(f => !acceptedFiles.includes(f));
        if (!acceptString) {
            acceptedFiles = files;
            rejectedFiles = [];
        }

        if (!acceptedFiles.length && !rejectedFiles.length) return handleError(i18n.__('cant_read_file'));
        if (rejectedFiles.length) return handleError(i18n.__('file_type_error', [rejectedFiles[0].name, accept]));
        if (acceptedFiles.length > 1) return handleError(i18n.__('error_upload_multy_file'));
        if (acceptedFiles[0].size > maxSizeInMb * 1000000) return handleError(i18n.__(error_huge_file, [maxSizeInMb]));

        const file = acceptedFiles[0];

        const reader = new FileReader();
        reader.onload = () => {
            setProcessing(false);
            try {
                onDropped(reader.result, file);
            } catch (e) {
                throw e;
            }
        };

        reader.onabort = () => handleError(i18n.__('error_file_reading_aborted'));
        reader.onerror = () => handleError(i18n.__('error_file_reading_faild'));
        return binary ? reader.readAsBinaryString(file) : reader.readAsText(file);
    };

    const [{ canDrop, isOver }, drop] = useDrop({
        accept: [NativeTypes.FILE],
        drop: item => loadFiles(Array.from(item.files)),
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    return (
        <Loading loading={loading || processing}>
            {!success ? (
                <Segment className={`import-box ${canDrop && isOver ? 'upload-target' : ''}`}>
                    <div ref={drop} className='align-center' data-cy='upload-dropzone'>
                        <Icon name='file' size='huge' color='grey' style={{ marginBottom: '8px' }} />
                        <input
                            type='file'
                            ref={fileField}
                            style={{ display: 'none' }}
                            onChange={e => loadFiles(Array.from(e.target.files))}
                        />
                        <Button
                            primary
                            basic
                            content='Upload file'
                            size='small'
                            onClick={() => fileField.current.click()}
                        />
                        <span className='small grey'>or drop a file to upload</span>
                    </div>
                </Segment>
            ) : (
                    <Message
                        positive
                        header='Success!'
                        icon='check circle'
                        content={successMessage}
                    />
                )}
        </Loading>
    );
}

UploadDropzone.propTypes = {
    onDropped: PropTypes.func.isRequired,
    accept: PropTypes.string.isRequired,
    onError: PropTypes.func,
    successMessage: PropTypes.string,
    success: PropTypes.bool,
    loading: PropTypes.bool,
    binary: PropTypes.bool,
    maxSizeInMb: PropTypes.number,
};

UploadDropzone.defaultProps = {
    successMessage: i18n.__('file_is_ready'),
    success: false,
    loading: false,
    binary: true,
    onError: console.log,
    maxSizeInMb: 2,
};
