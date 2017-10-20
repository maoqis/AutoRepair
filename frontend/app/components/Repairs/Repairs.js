import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToolbar } from 'react-bootstrap';

import RepairFilterView from './RepairFilterView';
import RepairListView from './RepairListView';
import CreateEditRepairView from './CreateEditRepairView';
import CommentView from './CommentView';
import './Repairs.css';

class Repairs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      userIdNameMap: {},
      repairList: [],
      filterredRepairList: [],
      showEditRepair: false,
      saveButtonText: 'Save',
      saveButtonClickable: false,
      deleteButtonText: 'Delete',
      deleteButtonClickable: false,
      showCreateRepair: false,

      repairName: '',
      repairDescription: '',
      repairDateTime: '',
      assignedUserId: -1,
      status: 'incomplete',
      validateionMessage: '',
      dateIsValid: false,

      isEditRepair: false,
      currentEditRepair: null,
      isUser: props.getRole() === 'user',

      filterDate: '',
      filterTime: '',
      filterUser: '',
      filterStatus: 'all',

      showCommentView: false,
      comments: [],
      commentText: ''
    };

    this.showEditRepair = this.showEditRepair.bind(this);
    this.showCreateRepair = this.showCreateRepair.bind(this);
    this.handleCreateRepairChange = this.handleCreateRepairChange.bind(this);
    this.validateNewRepairForm = this.validateNewRepairForm.bind(this);
    this.validateDateTime = this.validateDateTime.bind(this);
    this.handleCreateRepairSubmit = this.handleCreateRepairSubmit.bind(this);
    this.closeCreateRepair = this.closeCreateRepair.bind(this);
    this.createRepair = this.createRepair.bind(this);
    this.isStatusDisable = this.isStatusDisable.bind(this);
    this.deleteRepair = this.deleteRepair.bind(this);
    this.parseDateString = this.parseDateString.bind(this);
    this.getUserNameFromId = this.getUserNameFromId.bind(this);

    this.filterRepair = this.filterRepair.bind(this);
    this.handlerFilterInputChange = this.handlerFilterInputChange.bind(this);
    this.closeCommentView = this.closeCommentView.bind(this);
    this.showCommentView = this.showCommentView.bind(this);
    this.getComments = this.getComments.bind(this);
    this.addComment = this.addComment.bind(this);
  }

  componentWillMount() {
    this.getRepairs();
    this.getUsers();
  }

  getComments() {
    this.props.restMethods.getComments(this.state.currentEditRepair.id)
      .then((comments) => {
        this.setState({
          comments
        });
        return Promise.resolve();
      }).catch(() => {
      });
  }

  getUsers() {
    this.props.restMethods.getAllUser()
      .then((users) => {
        const userIdNameMap = {};
        users.forEach((user) => {
          userIdNameMap[user.id] = user.username;
        });
        this.setState({ userList: users, userIdNameMap });
        return Promise.resolve();
      }).catch(() => {});
  }

  getRepairs() {
    this.props.restMethods.getRepairs()
      .then((repairs) => {
        this.setState({ repairList: repairs });
        this.filterRepair(repairs);
        return Promise.resolve();
      }).catch(() => {});
  }

  filterRepair(repairList, event) {
    const filterredList = repairList.filter((repair) => {
      let filterUser = this.state.filterUser;
      if (event && event.target.id === 'filterUser') { filterUser = event.target.value; }
      if (filterUser.length === 0) return true;
      if (this.state.userIdNameMap[repair.assignedUserId]) {
        return this.state.userIdNameMap[repair.assignedUserId].startsWith(filterUser);
      }
      return false;
    }).filter((repair) => {
      let filterStatus = this.state.filterStatus;
      if (event && event.target.id === 'filterStatus') { filterStatus = event.target.value; }
      if (filterStatus === 'all') return true;
      return repair.status === filterStatus;
    }).filter((repair) => {
      let filterDate = this.state.filterDate;
      if (event && event.target.id === 'filterDate') { filterDate = event.target.value; }
      if (filterDate.length === 0) return true;
      return repair.dateTime.startsWith(filterDate);
    }).filter((repair) => {
      let filterTime = this.state.filterTime;
      if (event && event.target.id === 'filterTime') { filterTime = event.target.value; }
      if (filterTime.length === 0) return true;
      return repair.dateTime.split(' ')[1].startsWith(filterTime);
    });

    this.setState({
      filterredRepairList: filterredList
    });
  }

  parseDateString() {
    const dateTime = new Date(this.state.repairDateTime);
    let day = String(dateTime.getDate());
    let month = `${dateTime.getMonth() + 1}`;
    const year = `${dateTime.getFullYear()}`;
    let hour = String(dateTime.getHours());
    let minute = String(dateTime.getMinutes());

    if (day.length < 2) {
      day = `0${day}`;
    }
    if (month.length < 2) {
      month = `0${month}`;
    }
    if (hour.length < 2) {
      hour = `0${hour}`;
    }
    if (minute.length < 2) {
      minute = `0${minute}`;
    }
    const fullDate = `${year}-${month}-${day} ${hour}:${minute}`;
    return fullDate;
  }

  createRepair(isUpdate) {
    const fullDate = this.parseDateString();
    const method = isUpdate ? this.props.restMethods.updateRepair :
      this.props.restMethods.createRepair;
    const cId = isUpdate ? this.state.currentEditRepair.id : -1;
    method({
      id: cId,
      repairName: this.state.repairName,
      description: this.state.repairDescription,
      dateTime: fullDate,
      status: this.state.status,
      assignedUserId: parseInt(this.state.assignedUserId, 10) !== -1 ?
        parseInt(this.state.assignedUserId, 10) : null
    })
      .then(() => {
        this.setState({
          saveButtonText: isUpdate ? 'Repair Updated' : 'Repair Created'
        });
        this.getRepairs();
        setTimeout(() => { this.closeCreateRepair(); }, 1000);
        return Promise.resolve();
      }).catch((status) => {
        if (status.message === '409') {
          this.setState({
            saveButtonText: 'Time Overlap',
            saveButtonClickable: true,
          });
        } else {
          this.setState({
            savebuttontext: isUpdate ? 'unable to update' : 'unable to create',
            savebuttonclickable: true,
            deleteButtonClickable: true
          });
        }
      });
  }

  showCreateRepair() {
    this.setState({
      showCreateRepair: true,
      saveButtonClickable: true,
      repairName: '',
      repairDescription: '',
      repairDateTime: '',
      saveButtonText: 'Create',
      status: 'incomplete',
      assignedUserId: -1,
      dateIsValid: false,
      isEditRepair: false
    });
  }

  closeCreateRepair() {
    this.setState({
      showCreateRepair: false
    });
  }


  deleteRepair() {
    this.setState({
      deleteButtonClickable: false,
      saveButtonClickable: false,
      deleteButtonText: 'Deleting'
    });
    this.props.restMethods.deleteRepair(this.state.currentEditRepair.id)
      .then(() => {
        this.setState({
          deleteButtonText: 'Deleted Successfully'
        });
        this.getRepairs();
        setTimeout(() => { this.closeCreateRepair(); }, 1000);
        return Promise.resolve();
      }).catch(() => {
        this.setState({
          deleteButtonText: 'Unable to Delete'
        });
        this.getRepairs();
        setTimeout(() => { this.closeCreateRepair(); }, 1000);
      });
  }

  handleCreateRepairSubmit(event) {
    event.preventDefault();

    this.setState({
      deleteButtonClickable: false,
      saveButtonClickable: false,
      saveButtonText: this.state.isEditRepair ? 'Updating...' : 'Creating...',
    });
    this.createRepair(this.state.isEditRepair);
  }

  handleCreateRepairChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
      saveButtonText: this.state.isEditRepair ? 'Update' : 'Create'
    });
    if (event.target.id === 'repairDateTime') {
      this.validateDateTime(event);
    }
  }

  validateNewRepairForm() {
    if (this.isStatusDisable()) return false;
    if (!this.state.saveButtonClickable) return false;
    return this.state.repairName.length > 0 && this.state.dateIsValid;
  }

  validateDateTime(event) {
    const repairDateTime = event.target.value;
    const datetime = new Date(repairDateTime);
    if (repairDateTime.length === 0 || isNaN(datetime.getTime())) {
      this.setState({
        validateionMessage: 'Date is invalid',
        dateIsValid: false
      });
    } else {
      this.setState({
        validateionMessage: '',
        dateIsValid: true
      });
    }
  }

  showEditRepair(repair) {
    this.setState({
      showCreateRepair: true,
      saveButtonClickable: true,
      repairName: repair.repairName,
      repairDescription: repair.description,
      repairDateTime: repair.dateTime.replace(' ', 'T'),
      status: repair.status,
      assignedUserId: repair.assignedUserId === null ? -1 : parseInt(repair.assignedUserId, 10),
      saveButtonText: 'Update',
      dateIsValid: true,
      isEditRepair: true,
      currentEditRepair: repair,
      deleteButtonClickable: true,
      deleteButtonText: 'Delete'
    });
  }

  isStatusDisable() {
    if (this.state.isEditRepair === false) return false;
    if (this.state.isUser) {
      if (this.state.currentEditRepair.status === 'complete' ||
        this.state.currentEditRepair.status === 'approve') {
        return true;
      }
    }
    return false;
  }

  getUserNameFromId(userId) {
    if (userId === null) return 'None';
    const userIdNameMap = this.state.userIdNameMap;
    const username = userIdNameMap[userId];
    if (username) return username;
    return 'None';
  }


  handlerFilterInputChange(event) {
    this.filterRepair(this.state.repairList, event);
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  closeCommentView() {
    this.setState({
      showCommentView: false
    });
  }

  showCommentView() {
    this.setState({
      showCommentView: true
    });
    this.getComments();
  }

  addComment(event) {
    event.preventDefault();
    if (this.state.commentText.length > 0) {
      this.props.restMethods.createComment(this.state.currentEditRepair.id, this.state.commentText)
        .then(() => {
          this.getComments();
          return Promise.resolve();
        }).catch();
    }

    this.setState({ commentText: '' });
  }

  render() {
    return (
      <div>
        { this.state.isUser ? null :
          (<ButtonToolbar>
            <Button bsStyle="primary" className="buttonBar" onClick={this.showCreateRepair}>Create New Repair</Button>
          </ButtonToolbar>) }
        <RepairFilterView
          handlerFilterInputChange={this.handlerFilterInputChange}
          isUser={this.state.isUser}
          filterStatus={this.state.filterStatus}
        />
        <RepairListView
          repairList={this.state.filterredRepairList}
          getUserNameFromId={this.getUserNameFromId}
          showEditRepair={this.showEditRepair}
        />
        <CreateEditRepairView
          showModal={this.state.showCreateRepair}
          onModalHide={this.closeCreateRepair}
          isEditRepair={this.state.isEditRepair}
          handleCreateRepairSubmit={this.handleCreateRepairSubmit}
          repairName={this.state.repairName}
          handleCreateRepairChange={this.handleCreateRepairChange}
          isUser={this.state.isUser}
          repairDescription={this.state.repairDescription}
          repairDateTime={this.state.repairDateTime}
          assignedUserId={this.state.assignedUserId}
          userList={this.state.userList}
          status={this.state.status}
          isStatusDisable={this.isStatusDisable}
          showCommentView={this.showCommentView}
          validateNewRepairForm={this.validateNewRepairForm}
          saveButtonText={this.state.saveButtonText}
          deleteButtonClickable={this.state.deleteButtonClickable}
          deleteRepair={this.deleteRepair}
          deleteButtonText={this.state.deleteButtonText}
          validationMessage={this.state.validateionMessage}
        />
        <CommentView
          showModal={this.state.showCommentView}
          onModalHide={this.closeCommentView}
          currentEditRepair={this.state.currentEditRepair}
          comments={this.state.comments}
          handleCreateRepairChange={this.handleCreateRepairChange}
          commentText={this.state.commentText}
          addComment={this.addComment}
          userIdNameMap={this.state.userIdNameMap}
        />
      </div>);
  }
}

Repairs.propTypes = {
  restMethods: PropTypes.shape({
    getRepairs: PropTypes.func.isRequired,
    updateRepair: PropTypes.func.isRequired,
    createRepair: PropTypes.func.isRequired,
    getUsers: PropTypes.func.isRequired,
    deleteRepair: PropTypes.func.isRequired,
    getComments: PropTypes.func.isRequired,
    getAllUser: PropTypes.func.isRequired,
    createComment: PropTypes.func.isRequired
  }).isRequired,
  getRole: PropTypes.func.isRequired,
};
export default Repairs;
