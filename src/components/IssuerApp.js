import React, { Component } from 'react';
import Web3 from 'web3'
import logo from '../logo.png';
import './App.css';
import DocumentIdentifier from '../abis/DocumentIdentifier.json'
import Navbar from './Navbar'
import Main from './Main'
import IssuerForm from './IssuerForm'

class IssuerApp extends Component {

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
	  const issuerSize = await documentIdentifier.methods.issuersSize().call()
      this.setState({ issuerSize })
      // Load products
      for (var i = 0; i < issuerSize; i++) {
        const issuerAddress = await documentIdentifier.methods.issuersAddress(i).call()
		const issuer = await documentIdentifier.methods.issuers(issuerAddress).call()
		const issuerData = { issuerAddress, issuer }
        this.setState({
          issuers: [...this.state.issuers, issuerData]
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
      issuerSize: 0,
      issuers: [],
      loading: true
    }

    this.createIssuer = this.createIssuer.bind(this)
  }

  createIssuer(issuerAddress, issuerId, issuerName) {
    this.setState({ loading: true })
    this.state.documentIdentifier.methods.createIssuer(issuerAddress, issuerId, issuerName).send({ from: this.state.account })
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
                : <IssuerForm
                  issuers={this.state.issuers}
                  createIssuer={this.createIssuer} />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default IssuerApp;