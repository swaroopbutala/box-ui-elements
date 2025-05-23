import * as React from 'react';
import Modal from 'react-modal';
import { useIntl } from 'react-intl';
import { Modal as BlueprintModal, TextInput } from '@box/blueprint-web';

import {
    CLASS_MODAL_CONTENT,
    CLASS_MODAL_OVERLAY,
    CLASS_MODAL,
    ERROR_CODE_ITEM_NAME_TOO_LONG,
    ERROR_CODE_ITEM_NAME_IN_USE,
} from '../../constants';
import type { BoxItem } from '../../common/types/core';

import messages from '../common/messages';

export interface RenameDialogProps {
    appElement: HTMLElement;
    errorCode: string;
    isLoading: boolean;
    isOpen: boolean;
    item: BoxItem;
    onCancel: () => void;
    onRename: (value: string, extension: string) => void;
    parentElement: HTMLElement;
}

const RenameDialog = ({
    appElement,
    errorCode,
    isOpen,
    isLoading,
    item,
    onCancel,
    onRename,
    parentElement,
}: RenameDialogProps) => {
    const { formatMessage } = useIntl();
    let textInput = null;
    let error;

    const { name = '', extension } = item;
    const ext = extension ? `.${extension}` : '';
    const nameWithoutExt = extension ? name.replace(ext, '') : name;

    /**
     * Appends the extension and calls rename function
     */
    const handleRename = () => {
        if (textInput && textInput.value) {
            if (textInput.value === nameWithoutExt) {
                onCancel();
            } else {
                onRename(textInput.value, ext);
            }
        }
    };

    /**
     * Grabs reference to the input element
     */
    const ref = input => {
        textInput = input;
        if (textInput instanceof HTMLInputElement) {
            textInput.focus();
            textInput.select();
        }
    };

    /**
     * Handles enter key down
     */
    const onKeyDown = ({ key }) => {
        switch (key) {
            case 'Enter':
                handleRename();
                break;
            default:
                break;
        }
    };

    switch (errorCode) {
        case ERROR_CODE_ITEM_NAME_IN_USE:
            error = messages.renameDialogErrorInUse;
            break;
        case ERROR_CODE_ITEM_NAME_TOO_LONG:
            error = messages.renameDialogErrorTooLong;
            break;
        default:
            error = errorCode ? messages.renameDialogErrorInvalid : null;
            break;
    }

    return (
        <Modal
            appElement={appElement}
            className={CLASS_MODAL_CONTENT}
            contentLabel={formatMessage(messages.renameDialogLabel)}
            isOpen={isOpen}
            onRequestClose={onCancel}
            overlayClassName={CLASS_MODAL_OVERLAY}
            parentSelector={() => parentElement}
            portalClassName={`${CLASS_MODAL} be-modal-rename`}
        >
            <BlueprintModal.Body>
                <TextInput
                    defaultValue={nameWithoutExt}
                    error={error && formatMessage(error, { name: nameWithoutExt })}
                    label={formatMessage(messages.renameDialogText, { name: nameWithoutExt })}
                    onKeyDown={onKeyDown}
                    ref={ref}
                    required
                />
            </BlueprintModal.Body>
            <BlueprintModal.Footer>
                <BlueprintModal.Footer.SecondaryButton disabled={isLoading} onClick={onCancel} size="large">
                    {formatMessage(messages.cancel)}
                </BlueprintModal.Footer.SecondaryButton>
                <BlueprintModal.Footer.PrimaryButton
                    loading={isLoading}
                    loadingAriaLabel={formatMessage(messages.loading)}
                    onClick={handleRename}
                    size="large"
                >
                    {formatMessage(messages.rename)}
                </BlueprintModal.Footer.PrimaryButton>
            </BlueprintModal.Footer>
        </Modal>
    );
};

export default RenameDialog;
