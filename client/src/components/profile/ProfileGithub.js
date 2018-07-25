import React, { Component } from 'react'
import PropTypes from 'prop-types';

class ProfileGithub extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clientId: 'c623d2620b9cb822964b',
      clientSecret: '8aa04356fac591de5521fbb151c9ed8b0ca1f63a',
      repoCount: '',
      count: 5,
      sort: 'created:asc',
      repos: []
    };

  }

  componentDidMount() {
    const { userName } = this.props;
    const {count, sort, clientId, clientSecret} = this.state;

    fetch(`https://api.github.com/users/${userName}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`)
      .then(res => res.json())
      .then(data => {
        if(this.refs.myref) {
          this.setState({
            repos: data
          })
        }  
      })
      .catch(err => console.log(err))
  }

  render() {
    const { repos } = this.state
    let repoItems

    if(repos.length > 0) {
      repoItems = repos.map(repo => (
        <div key={repo.id} className="card card-body mb-2">
          <div className="row">
            <div className="col-md-6">
              <h4>
                <a href={repo.html_url} className="text-info" target="_blank">{repo.name}</a>
                <p>{repo.description}</p>
              </h4>
            </div>
            <div className="col-md-6">
              <span className="badge badge-info mr-1">Stars: {repo.stargazers_count}</span>
              <span className="badge badge-secondary mr-1">Watchers: {repo.watchers_count}</span>
              <span className="badge badge-success mr-1">Forks: {repo.forks_count}</span>
            </div>
          </div>
        </div>
      ))
    } else {
      repoItems = (<span>No Repositories Found...</span>)
    }
    
    
    return (
      <div ref="myref">
        <hr/>
        <h3 className="mb-4">Latest Github Repos</h3>
        {repoItems}
      </div>
    )
  }
}

ProfileGithub.propTypes = {
  userName: PropTypes.string.isRequired
}

export default ProfileGithub