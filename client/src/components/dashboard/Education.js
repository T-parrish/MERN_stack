import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { deleteEducation } from '../../actions/profileActions';

import Moment from 'react-moment';


class Education extends Component {
  constructor(props) {
    super(props)

    this.onDeleteClick = this.onDeleteClick.bind(this)
  }

  onDeleteClick = (id) => {
    this.props.deleteEducation(id);
  }

  render() {
    const education = this.props.education.map(edu => (
      <tr key={edu._id}>
        <td>{edu.school}</td>
        <td>{edu.degree}</td>
        <td>{edu.fieldofstudy}</td>
        <td>
          <Moment format="MM/DD/YYYY">{edu.from}</Moment> {' - '} 
          {edu.to === null ? 
            ('Now') : 
            <Moment format="MM/DD/YYYY">{edu.to}</Moment>
          }
        </td>
        <td><button onClick={this.onDeleteClick} className="btn btn-danger">Delete </button></td>
      </tr>
    ))
    return (
      <div>
        <h4 className="mb-4">Education</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Title</th>
              <th>Field of Study</th>
              <th>Years</th>
              <th></th>
            </tr>
              {education}
          </thead>
        </table>
      </div>
    )
  }
}

Education.propTypes = {
  deleteEducation: PropTypes.func.isRequired
}

export default connect(null, {deleteEducation})(Education)