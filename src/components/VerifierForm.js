import React, { Component } from 'react';

class VerifierForm extends Component {

  render() {
    return (
      <div id="content">
        <h1>Add Verifier</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const verifierAddress = this.verifierAddress.value
		  const verifierId = this.verifierId.value
          const verifierName = this.verifierName.value
          this.props.createverifier(verifierAddress, verifierId, verifierName)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="verifierAddress"
              type="text"
              ref={(input) => { this.verifierAddress = input }}
              className="form-control"
              placeholder="verifier Address"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="verifierId"
              type="text"
              ref={(input) => { this.verifierId = input }}
              className="form-control"
              placeholder="Id"
              required />
          </div>
		  <div className="form-group mr-sm-2">
            <input
              id="verifierName"
              type="text"
              ref={(input) => { this.verifierName = input }}
              className="form-control"
              placeholder="Name"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add verifier</button>
        </form>
        <p>&nbsp;</p>
        
		<h2>Verifier List</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Address</th>
              <th scope="col">Id</th>
              <th scope="col">Name</th>
            </tr>
          </thead>
          <tbody id="verifierList">
            { this.props.verifiers.map((verifierData, index) => {
              return(
                <tr key={index}>
                  <td>{verifierData.verifierAddress}</td>
				  <td>{verifierData.verifier.id}</td>
                  <td>{verifierData.verifier.name}</td>                  
                </tr>
              )
            })}
          </tbody>
        </table>
		
      </div>
    );
  }
}
export default VerifierForm;