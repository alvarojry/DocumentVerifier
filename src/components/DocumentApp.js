import React, { Component } from 'react';
import Web3 from 'web3'
import logo from '../logo.png';
import './App.css';
import DocumentIdentifier from '../abis/DocumentIdentifier.json'
import Navbar from './Navbar'
import DocumentForm from './DocumentForm'

class DocumentApp extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = DocumentIdentifier.networks[networkId]
    if(networkData) {
      const documentIdentifier = web3.eth.Contract(DocumentIdentifier.abi, networkData.address)
      this.setState({ documentIdentifier })	  
	  const documentSize = await documentIdentifier.methods.documentHolders(this.props.documentHoldersAddress).call()
      this.setState({ documentsSize })
      // Load products
      for (var i = 0; i < documentHoldersSize; i++) {
        const documentHolderAddress = await documentIdentifier.methods.documentHoldersAddress(i).call()
		const documentHolder = await documentIdentifier.methods.documentHolders(documentHolderAddress).call()
		const documentHolderData = { documentHolderAddress, documentHolder }
        this.setState({
          documentHolders: [...this.state.documentHolders, documentHolderData]
        })
      }
	  
      this.setState({ loading: false})
    } else {
      window.alert('DocumentIdentifier contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      documentsSize: 0,
      documents: [],
      loading: true
    }

    this.createDocumentHolder = this.createDocumentHolder.bind(this)
  }

  createDocumentHolder(documentHolderAddress, documentHolderId, documentHolderName) {
    this.setState({ loading: true })
    this.state.documentIdentifier.methods.createDocumentHolder(documentHolderAddress, documentHolderId, documentHolderName).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <DocumentHolderForm
                  documentHolders={this.state.documentHolders}
                  createDocumentHolder={this.createDocumentHolder} />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default DocumentApp;