import React, { Component } from 'react';

class DocumentHolderForm extends Component {

  render() {
    return (
      <div id="content">
        <h1>Add Document Holder</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const documentHolderAddress = this.documentHolderAddress.value
		  const documentHolderId = this.documentHolderId.value
          const documentHolderName = this.documentHolderName.value
          this.props.createdocumentHolder(documentHolderAddress, documentHolderId, documentHolderName)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="documentHolderAddress"
              type="text"
              ref={(input) => { this.documentHolderAddress = input }}
              className="form-control"
              placeholder="documentHolder Address"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="documentHolderId"
              type="text"
              ref={(input) => { this.documentHolderId = input }}
              className="form-control"
              placeholder="Id"
              required />
          </div>
		  <div className="form-group mr-sm-2">
            <input
              id="documentHolderName"
              type="text"
              ref={(input) => { this.documentHolderName = input }}
              className="form-control"
              placeholder="Name"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add document holder</button>
        </form>
        <p>&nbsp;</p>
        
		<h2>Document Holder List</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Address</th>
              <th scope="col">Id</th>
              <th scope="col">Name</th>
            </tr>
          </thead>
          <tbody id="documentHolderList">
            { this.props.documentHolders.map((documentHolderData, index) => {
              return(
                <tr key={index}>
                  <td>{documentHolderData.documentHolderAddress}</td>
				  <td>{documentHolderData.documentHolder.id}</td>
                  <td>{documentHolderData.documentHolder.name}</td>                  
                </tr>
              )
            })}
          </tbody>
        </table>
		
      </div>
    );
  }
}
export default DocumentHolderForm;