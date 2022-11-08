import React, { Component } from 'react';

class IssuerForm extends Component {

  render() {
    return (
      <div id="content">
        <h1>Add Issuer</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const issuerAddress = this.issuerAddress.value
		  const issuerId = this.issuerId.value
          const issuerName = this.issuerName.value
          this.props.createIssuer(issuerAddress, issuerId, issuerName)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="issuerAddress"
              type="text"
              ref={(input) => { this.issuerAddress = input }}
              className="form-control"
              placeholder="Issuer Address"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="issuerId"
              type="text"
              ref={(input) => { this.issuerId = input }}
              className="form-control"
              placeholder="Id"
              required />
          </div>
		  <div className="form-group mr-sm-2">
            <input
              id="issuerName"
              type="text"
              ref={(input) => { this.issuerName = input }}
              className="form-control"
              placeholder="Name"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add Issuer</button>
        </form>
        <p>&nbsp;</p>
        
		<h2>Issuer List</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Address</th>
              <th scope="col">Id</th>
              <th scope="col">Name</th>
            </tr>
          </thead>
          <tbody id="issuerList">
            { this.props.issuers.map((issuerData, index) => {
              return(
                <tr key={index}>
                  <td>{issuerData.issuerAddress}</td>
				  <td>{issuerData.issuer.id}</td>
                  <td>{issuerData.issuer.name}</td>                  
                </tr>
              )
            })}
          </tbody>
        </table>
		
      </div>
    );
  }
}
export default IssuerForm;