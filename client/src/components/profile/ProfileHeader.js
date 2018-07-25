import React, { Component } from 'react';
import isEmpty from '../../validation/isEmpty';


class ProfileHeader extends Component {
  render() {
    const {profile} = this.props
    
    const renderSocialLinks = socObj => {
      if (!isEmpty(socObj)) {
        return Object.keys(socObj).map(key => {
          if (socObj[key]) {
            const link = `https://${socObj[key]}`;
            return (
              <a key={key} className="text-white p-2" href={link} rel="noopener noreferrer" target="_blank">
              <i className={`fab fa-${key} fa-2x`} />
              </a>
            );
          } else return null;
        });
      }
    };

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-info text-white mb-3">
            <div className="row">
              <div className="col-4 col-md-3 m-auto">
                <img src={ profile.user.avatar } alt="gravatar" className="rounded-circle"/>
              </div>
            </div>
            <div className="text-center">
              <h1 className="display-4 text-center">{profile.user.name}</h1>
              <p className="lead text-center">
                { profile.status }
                { isEmpty(profile.company) ? 
                null : (<span> @{ profile.company} </span>) }
              </p>
              <p>
                { isEmpty(profile.location) ? 
                null : (<span>{ profile.location }</span>) }
              </p>
              <p>
                <a 
                  href={`https://${profile.website}`} 
                  target="_blank" 
                  className="text-white p-2"
                  rel="noopener noreferrer"
                >
                  <i className="fas fa-globe fa-2x"></i>
                </a>
                {renderSocialLinks(profile.social)}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProfileHeader