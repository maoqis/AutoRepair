import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

export default function RepairListView(props) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Repair Name</th>
          <th>Date and Time</th>
          <th>Assigned To</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody >
        { props.repairList.map((repair) =>
          (<tr key={repair.id} onClick={() => props.showEditRepair(repair)}>
            <td>{repair.id}</td>
            <td>{repair.repairName}</td>
            <td>{repair.dateTime}</td>
            <td>{props.getUserNameFromId(repair.assignedUserId)}</td>
            <td>{repair.status === 'approve' ? 'need approval' : repair.status}</td>
          </tr>)
        )}
      </tbody>
    </Table>
  );
}

RepairListView.propTypes = {
  repairList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    repairName: PropTypes.string.isRequired,
    dateTime: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  })).isRequired,
  getUserNameFromId: PropTypes.func.isRequired
};
