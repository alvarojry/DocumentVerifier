const DocumentIdentifier = artifacts.require('./DocumentIdentifier.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('DocumentIdentifier', ([deployer]) => {
  let documentIdentifier

  before(async () => {
    documentIdentifier = await DocumentIdentifier.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await documentIdentifier.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
  })

  describe('issuers', async () => {
    let result, issuersSize

    before(async () => {
      result = await documentIdentifier.createIssuer('0xfE3991C2Ab07A7064205cC2365b34Ce5f79f876a', 'UN', 'Uninorte', { from: deployer })
      issuersSize = await documentIdentifier.issuersSize()
    })

    it('creates issuer', async () => {
      // SUCCESS
	  assert.equal(issuersSize, 1)
	  const event = result.logs[0].args 
	  assert.equal(event.issuer, '0xfE3991C2Ab07A7064205cC2365b34Ce5f79f876a')
	  assert.equal(event.id, 'UN')
	  assert.equal(event.name, 'Uninorte')
    })
  })
  
  describe('documentHolders', async () => {
    let result, documentHoldersSize

    before(async () => {
      result = await documentIdentifier.createDocumentHolder('0xcB4f76d58da3379f20ffA7A41e4cab8e03e96BCd', 'CU', '200036787', { from: deployer })
      documentHoldersSize = await documentIdentifier.documentHoldersSize()
    })

    it('creates document holder', async () => {
      // SUCCESS
	  assert.equal(documentHoldersSize, 1)
	  const event = result.logs[0].args 
	  assert.equal(event.issuer, '0xcB4f76d58da3379f20ffA7A41e4cab8e03e96BCd')
	  assert.equal(event.id, 'CU')
	  assert.equal(event.name, '200036787')
    })
  })
  
  describe('document', async () => {
    let result

    before(async () => {
	  result = await documentIdentifier.createDocument('0xcB4f76d58da3379f20ffA7A41e4cab8e03e96BCd', 'CU', { from: '0xfE3991C2Ab07A7064205cC2365b34Ce5f79f876a' })
    })

    it('creates document', async () => {
      // SUCCESS
	  const event = result.logs[0].args 
	  assert.equal(event.issuerId, 'UN')
	  assert.equal(event.id, 'CU')
    })
  })
  
  describe('document attributes', async () => {
    let resultFirstName, resultSecondName, resultLastName, resultSecondLastName

	before(async () => {
	  resultFirstName = await documentIdentifier.createDocumentAttribute('0xcB4f76d58da3379f20ffA7A41e4cab8e03e96BCd', 'CU', 'FirstName', 'Alvaro', { from: '0xfE3991C2Ab07A7064205cC2365b34Ce5f79f876a' })
	  resultSecondName = await documentIdentifier.createDocumentAttribute('0xcB4f76d58da3379f20ffA7A41e4cab8e03e96BCd', 'CU', 'SecondName', 'Alvaro', { from: '0xfE3991C2Ab07A7064205cC2365b34Ce5f79f876a' })
	  resultLastName = await documentIdentifier.createDocumentAttribute('0xcB4f76d58da3379f20ffA7A41e4cab8e03e96BCd', 'CU', 'LastName', 'Alvaro', { from: '0xfE3991C2Ab07A7064205cC2365b34Ce5f79f876a' })
	  resultSecondLastName = await documentIdentifier.createDocumentAttribute('0xcB4f76d58da3379f20ffA7A41e4cab8e03e96BCd', 'CU', 'SecondLastName', 'Alvaro', { from: '0xfE3991C2Ab07A7064205cC2365b34Ce5f79f876a' })
    })
	
	it('creates first name', async () => {
      // SUCCESS
	  const event = resultFirstName.logs[0].args 
	  assert.equal(event.documentAttribute, 'FirstName')
	  assert.equal(event.documentValue, 'Alvaro')
    })
	
	it('creates second name', async () => {
      // SUCCESS
	  const event = resultSecondName.logs[0].args 
	  assert.equal(event.documentAttribute, 'SecondName')
	  assert.equal(event.documentValue, 'Alvaro')
    })
	
	it('creates last name', async () => {
      // SUCCESS
	  const event = resultLastName.logs[0].args 
	  assert.equal(event.documentAttribute, 'LastName')
	  assert.equal(event.documentValue, 'Alvaro')
    })
	
	it('creates second last name', async () => {
      // SUCCESS
	  const event = resultSecondLastName.logs[0].args 
	  assert.equal(event.documentAttribute, 'SecondLastName')
	  assert.equal(event.documentValue, 'Alvaro')
    })
  })
  
  describe('verifiers', async () => {
    let result, verifiersSize

    before(async () => {
      result = await documentIdentifier.createVerifier('0xfE3991C2Ab07A7064205cC2365b34Ce5f79f876a', 'UN', 'Uninorte', { from: deployer })
      verifiersSize = await documentIdentifier.verifiersSize()
    })

    it('creates verifier', async () => {
      // SUCCESS
	  assert.equal(verifiersSize, 1)
	  const event = result.logs[0].args 
	  assert.equal(event.issuer, '0xfE3991C2Ab07A7064205cC2365b34Ce5f79f876a')
	  assert.equal(event.id, 'UN')
	  assert.equal(event.name, 'Uninorte')
    })
  })
  
  describe('verify', async () => {
    let result, verifiersSize

    before(async () => {
      result = await documentIdentifier.createVerifier('0xfE3991C2Ab07A7064205cC2365b34Ce5f79f876a', 'UN', 'Uninorte', { from: deployer })
      verifiersSize = await documentIdentifier.verifiersSize()
    })

    it('creates verifier', async () => {
      // SUCCESS
	  assert.equal(verifiersSize, 1)
	  const event = result.logs[0].args 
	  assert.equal(event.issuer, '0xfE3991C2Ab07A7064205cC2365b34Ce5f79f876a')
	  assert.equal(event.id, 'UN')
	  assert.equal(event.name, 'Uninorte')
    })
  })
})