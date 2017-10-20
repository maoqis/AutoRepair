import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, Form } from 'react-bootstrap';

export default function RepairFilterView(props) {
  return (
    <Form inline>
      <FormGroup controlId="filterDate">
        <FormControl type="text" placeholder="Date (yyyy-mm-dd)" onChange={props.handlerFilterInputChange} />
      </FormGroup>
      {' '}
      <FormGroup controlId="filterTime">
        <FormControl type="text" placeholder="Time (hh:mm)" onChange={props.handlerFilterInputChange} />
      </FormGroup>
      {' '}
      { props.isUser ? null : (
        <FormGroup controlId="filterUser">
          <FormControl type="text" placeholder="Assigned User" onChange={props.handlerFilterInputChange} />
        </FormGroup>)}
      {' '}
      <FormGroup controlId="filterStatus">
        <FormControl componentClass="select" value={props.filterStatus} onChange={props.handlerFilterInputChange}>
          <option value="all">Status</option>
          <option value="incomplete">Incomplete</option>
          <option value="approve">Need Approval</option>
          <option value="complete">Complete</option>
        </FormControl>
      </FormGroup>
    </Form>
  );
}

RepairFilterView.propTypes = {
  handlerFilterInputChange: PropTypes.func.isRequired,
  isUser: PropTypes.bool.isRequired,
  filterStatus: PropTypes.string.isRequired
};
