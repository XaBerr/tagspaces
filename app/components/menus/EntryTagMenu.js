/**
 * TagSpaces - universal file and folder organizer
 * Copyright (C) 2017-present TagSpaces UG (haftungsbeschraenkt)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License (version 3) as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @flow
 */

import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import ShowEntriesWithTagIcon from '@material-ui/icons/Launch';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ConfirmDialog from '../dialogs/ConfirmDialog';
import DateCalendarDialog from '../dialogs/DateCalendarDialog';
import i18n from '../../services/i18n';
import { type Tag } from '../../reducers/taglibrary';
import { actions as LocationIndexActions } from '../../reducers/location-index';
import { type SearchQuery } from '../../services/search';
import { getMaxSearchResults } from '../../reducers/settings';
import { actions as AppActions } from '../../reducers/app';

type Props = {
  classes: Object,
  open?: boolean,
  onClose: () => void,
  anchorEl?: Object | null,
  selectedTag?: Tag | null,
  currentEntryPath?: string,
  removeTags: (paths: Array<string>, tags: Array<Tag>) => void,
  editTagForEntry: (path: string, tag: Tag) => void,
  searchLocationIndex: (searchQuery: SearchQuery) => void,
  maxSearchResults: number,
  isReadOnlyMode: boolean
};

const EntryTagMenu = (props: Props) => {
  // const [isEditTagDialogOpened, setIsEditTagDialogOpened] = useState(false);
  const [isDateCalendarDialogOpened, setIsDateCalendarDialogOpened] = useState(false);
  const [isDeleteTagDialogOpened, setIsDeleteTagDialogOpened] = useState(false);

  function showEditTagDialog() {
    props.onClose();
    // setIsEditTagDialogOpened(true);
    const tag = props.selectedTag;
    tag.path = props.currentEntryPath;
    props.toggleEditTagDialog(tag);
  }

  function showDeleteTagDialog() {
    props.onClose();
    setIsDeleteTagDialogOpened(true);
  }

  /* function showDateCalendarDialog() {
    props.onClose();
    setIsDateCalendarDialogOpened(true);
  } */

  function showFilesWithThisTag() {
    if (props.selectedTag) {
      // this.props.togglePanel(AppVerticalPanels.search);
      props.searchLocationIndex({
        tagsAND: [props.selectedTag],
        maxSearchResults: props.maxSearchResults
      });
    }
    props.onClose();
  }

  function handleCloseDialogs() {
    // setIsEditTagDialogOpened(false);
    setIsDateCalendarDialogOpened(false);
    setIsDeleteTagDialogOpened(false);
  }

  function confirmRemoveTag() {
    props.removeTags(
      [props.currentEntryPath],
      [props.selectedTag]
    );
    handleCloseDialogs();
  }

  return (
    <div style={{ overflowY: 'hidden !important' }}>
      <Menu
        anchorEl={props.anchorEl}
        open={props.open}
        onClose={props.onClose}
      >
        <MenuItem
          data-tid="showFilesWithThisTag"
          onClick={showFilesWithThisTag}
        >
          <ListItemIcon>
            <ShowEntriesWithTagIcon />
          </ListItemIcon>
          <ListItemText primary={i18n.t('core:showFilesWithThisTag')} />
        </MenuItem>
        {!props.isReadOnlyMode && (
          <div>
            <MenuItem data-tid="deleteTagMenu" onClick={showDeleteTagDialog}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText primary={i18n.t('core:removeTag')} />
            </MenuItem>
            <Divider />
            <MenuItem data-tid="editTagDialogMenu" onClick={showEditTagDialog}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary={i18n.t('core:tagProperties')} />
            </MenuItem>
          </div>
        )}
      </Menu>
      <ConfirmDialog
        open={isDeleteTagDialogOpened}
        onClose={handleCloseDialogs}
        title={i18n.t('core:removeTag')}
        content={i18n.t('core:removeTagTooltip')}
        confirmCallback={result => {
          if (result) {
            confirmRemoveTag();
          }
        }}
        cancelDialogTID={'cancelDeleteTagDialogTagMenu'}
        confirmDialogTID={'confirmRemoveTagFromFile'}
        confirmDialogContent={'confirmDialogContent'}
      />
      <DateCalendarDialog
        open={isDateCalendarDialogOpened}
        onClose={handleCloseDialogs}
        editTagForEntry={props.editTagForEntry}
        currentEntryPath={props.currentEntryPath}
        selectedTag={props.selectedTag}
      />
    </div>
  );
};

function mapStateToProps(state) {
  return {
    maxSearchResults: getMaxSearchResults(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    searchLocationIndex: LocationIndexActions.searchLocationIndex,
    toggleEditTagDialog: AppActions.toggleEditTagDialog,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryTagMenu);
