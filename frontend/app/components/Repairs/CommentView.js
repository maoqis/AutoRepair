import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, FormGroup, FormControl, ControlLabel, Panel } from 'react-bootstrap';

export default function CommentView(props) {
  return (
    <Modal show={props.showModal} onHide={props.onModalHide} bsSize="large">
      <Modal.Header closeButton>
        <Modal.Title>Comments for Repair: {props.currentEditRepair ?
          props.currentEditRepair.repairName : null}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          props.comments.map((comment) =>
            (<Panel key={comment.id} footer={`Date: ${comment.dateTime} by ${props.userIdNameMap[comment.userId]}`}>
              {comment.comment}
            </Panel>)
          )
        }
        <FormGroup controlId="commentText">
          <ControlLabel>New Comment...</ControlLabel>
          <FormControl
            onChange={props.handleCreateRepairChange}
            componentClass="textarea"
            placeholder="Write your comment"
            value={props.commentText}
          />
        </FormGroup>
        <Button
          onClick={props.addComment}
        >
              Add Comment
        </Button>
      </Modal.Body>
    </Modal>
  );
}

CommentView.propTypes = {
  showModal: PropTypes.bool.isRequired,
  onModalHide: PropTypes.func.isRequired,
  currentEditRepair: PropTypes.shape({
    repairName: PropTypes.string.isRequired
  }),
  comments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    dateTime: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired
  })).isRequired,
  handleCreateRepairChange: PropTypes.func.isRequired,
  commentText: PropTypes.string.isRequired,
  addComment: PropTypes.func.isRequired,
  userIdNameMap: PropTypes.objectOf(PropTypes.string).isRequired
};

CommentView.defaultProps = {
  currentEditRepair: null
};

