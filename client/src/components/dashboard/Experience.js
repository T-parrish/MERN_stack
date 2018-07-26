import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { deleteExperience } from '../../actions/profileActions';

import Moment from 'react-moment';


class Experience extends Component {
  constructor(props) {
    super(props)

    this.onDeleteClick = this.onDeleteClick.bind(this)
  }

  onDeleteClick = (id) => {
    this.props.deleteExperience(id);
  }

  render() {
    const experience = this.props.experience.map(exp => (
      <tr key={exp._id}>
        <td>{exp.company}</td>
        <td>{exp.title}</td>
        <td>
          <Moment format="MM/DD/YYYY">{exp.from}</Moment> {' - '} 
          {exp.to === null ? 
            ('Now') : 
            <Moment format="MM/DD/YYYY">{exp.to}</Moment>
          }
        </td>
        <td><button onClick={this.onDeleteClick} className="btn btn-danger">Delete </button></td>
      </tr>
    ))
    return (
      <div>
        <h4 className="mb-4">Experience</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Title</th>
              <th>Years</th>
              <th></th>
            </tr>
              {experience}
          </thead>
        </table>
      </div>
    )
  }
}

Experience.propTypes = {
  deleteExperience: PropTypes.func.isRequired
}

export default connect(null, {deleteExperience})(Experience)