import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

// allows conditional classnames
import classnames from 'classnames';

import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      errors: {}
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.errors) {
      this.setState({errors: nextProps.errors})
    }
  }

  onChange = (e) => {
    this.setState({[e.target.name] : e.target.value});
  }

  onSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    }

    // takes the newUser object to register, gives us
    // access to this.props.history.push from action
    this.props.registerUser(newUser, this.props.history);

  }

  render() {
    const { errors } = this.state;
    
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your DevConnector account</p>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input 
                    type="text" 
                    className= {
                      classnames('form-control form-control-lg', 
                        {'is-invalid': errors.name})
                    }
                    placeholder="Name" 
                    name="name" 
                    value={this.state.name}
                    onChange={this.onChange}
                  />
                  {errors.name 
                    && (<div className="invalid-feedback">{errors.name}</div>)}
                </div>
                <div className="form-group">
                  <input 
                    type="email" 
                    className= {
                      classnames('form-control form-control-lg', 
                        {'is-invalid': errors.email})
                    }
                    placeholder="Email Address" 
                    value={this.state.email}
                    onChange={this.onChange}
                    name="email" 
                  />
                  {errors.name 
                    && (<div className="invalid-feedback">{errors.email}</div>)}
                  <small className="form-text text-muted">
                  This site uses Gravatar so if you want a profile image, use a Gravatar email
                  </small>
                </div>
                <div className="form-group">
                  <input 
                    type="password" 
                    className= {
                      classnames('form-control form-control-lg', 
                        {'is-invalid': errors.password})
                    }
                    placeholder="Password"
                    value={this.state.password} 
                    onChange={this.onChange}
                    name="password" 
                  />
                  {errors.name 
                    && (<div className="invalid-feedback">{errors.password}</div>)}

                </div>
                <div className="form-group">
                  <input 
                    type="password" 
                    className= {
                      classnames('form-control form-control-lg', 
                        {'is-invalid': errors.password2})
                    }
                    placeholder="Confirm Password"
                    value={this.state.password2} 
                    onChange={this.onChange}
                    name="password2" 
                  />
                  {errors.name 
                    && (<div className="invalid-feedback">{errors.password2}</div>)}

                </div>
                <input 
                  type="submit" 
                  className="btn btn-info btn-block mt-4" 
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, {registerUser})(withRouter(Register));