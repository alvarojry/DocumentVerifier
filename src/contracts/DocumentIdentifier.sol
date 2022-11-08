// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract DocumentIdentifier {

    event OwnerSet(
        address indexed oldOwner, 
        address indexed newOwner
    );

    struct Issuer {
        string id;
        string name;
    }
	
	event IssuerCreated(
		address issuer,
        string id,
        string name
    );

    struct DocumentHolder {
        string id;
        string name;
		uint token;
		bool tokenUsed;
        uint tokenExpiration;
        mapping(string => Document) documents;
		mapping(uint => string) documentIds;
		uint documentsSize;
    }
	
	event DocumentHolderCreated(
		address documentHolder,
        string id,
        string name
    );

    event DocumentHolderTokenRefreshed(
		address documentHolder,
        uint token
    );

    struct Document {
        Issuer issuer;
        mapping(string=>string) attributes;
    }

    event DocumentCreated(
        string issuerId,
        string id
    );

    event DocumentAttributeCreated(
        address documentHolder,
        string documentId,
        string documentAttribute,
        string documentValue
    );

    struct Verifier {
        string id;
        string name;
    }
	
	event VerifierCreated(
		address verifier,
        string id,
        string name
    );

    mapping(address => Issuer) public issuers;
	mapping(uint => address) public issuersAddress;
    uint public issuersSize = 0;

    mapping(address => DocumentHolder) public documentHolders;
	mapping(uint => address) public documentHoldersAddress;
    uint public documentHoldersSize = 0;

    mapping(address => Verifier) public verifiers;
	mapping(uint => address) public verifiersAddress;
    uint public verifiersSize = 0;

    address private owner;
    uint private nonce;

    constructor() public {
        owner = msg.sender;
        emit OwnerSet(address(0), owner);
    }

    function createIssuer(address _issuer, string memory _id, string memory _name) public {
        Issuer storage issuer = issuers[_issuer];
        string memory empty = "";
        require(keccak256(abi.encodePacked(issuer.id)) == keccak256(abi.encodePacked(empty)));
		issuer.id = _id;
        issuer.name = _name;
		issuersAddress[issuersSize] = _issuer;
		issuersSize++;
		emit IssuerCreated(_issuer, _id, _name);
    }

    function createDocumentHolder(address _documentHolder, string memory _id, string memory _name) public {
        DocumentHolder storage documentHolder = documentHolders[_documentHolder];
        string memory empty = "";
        require(keccak256(abi.encodePacked(documentHolder.id)) == keccak256(abi.encodePacked(empty)));
        documentHolder.id = _id;
        documentHolder.name = _name;
		documentHolder.token = 0;
		documentHolder.tokenUsed = true;
        documentHolder.tokenExpiration = now;
		documentHoldersAddress[documentHoldersSize] = _documentHolder;
        documentHoldersSize++;
		emit IssuerCreated(_documentHolder, _id, _name);
    }

    function createDocument(address _documentHolder, string memory _documentId) public {
        Issuer storage issuer = issuers[msg.sender];
        string memory empty = "";
        require(keccak256(abi.encodePacked(issuer.id)) != keccak256(abi.encodePacked(empty)));
        DocumentHolder storage documentHolder = documentHolders[_documentHolder];
        require(keccak256(abi.encodePacked(documentHolder.id)) != keccak256(abi.encodePacked(empty)));
        Document storage document = documentHolder.documents[_documentId];
        document.issuer = issuer;
        emit DocumentCreated(issuer.id, _documentId);
    }

    function createDocumentAttribute(address _documentHolder, string memory _documentId, 
        string memory _attributeIdentifier, string memory _attributeValue) public {
        Issuer storage issuer = issuers[msg.sender];
        string memory empty = "";
        require(keccak256(abi.encodePacked(issuer.id)) != keccak256(abi.encodePacked(empty)));
        DocumentHolder storage documentHolder = documentHolders[_documentHolder];
        require(keccak256(abi.encodePacked(documentHolder.id)) != keccak256(abi.encodePacked(empty)));
        Document storage document = documentHolder.documents[_documentId];
        require(keccak256(abi.encodePacked(document.issuer.id)) == keccak256(abi.encodePacked(issuer.id)));
        document.attributes[_attributeIdentifier] = _attributeValue;
        emit DocumentAttributeCreated(_documentHolder, _documentId, _attributeIdentifier, _attributeValue);
    }
	
	function refreshToken() public {
		DocumentHolder storage documentHolder = documentHolders[msg.sender];
		documentHolder.token = random();
		documentHolder.tokenUsed = false;
        documentHolder.tokenExpiration = now + 10 minutes;
        emit DocumentHolderTokenRefreshed(msg.sender, documentHolder.token);
	}

    function createVerifier(address _verifier, string memory _id, string memory _name) public {
        Verifier storage verifier = verifiers[_verifier];
        string memory empty = "";
        require(keccak256(abi.encodePacked(verifier.id)) == keccak256(abi.encodePacked(empty)));
        verifier.id = _id;
        verifier.name = _name;
		verifiersAddress[verifiersSize] = _verifier;
        verifiersSize++;
		emit IssuerCreated(_verifier, _id, _name);
    }
	
	function random() internal returns (uint amount) {
        amount = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, block.number, nonce))) % (999999-100000);
        amount = amount + 100000;
        nonce++;
        return amount;
    }
	
	function verifyDocument(address _documentHolder, string memory documentId, uint token, string[] memory rules) public view returns (bool) {
        Verifier storage verifier = verifiers[msg.sender];        
        bool isValid;
        string memory empty = "";
        DocumentHolder storage documentHolder = documentHolders[_documentHolder];
		if (rules.length % 3 != 0 || keccak256(abi.encodePacked(documentHolder.id)) == keccak256(abi.encodePacked(empty)) || keccak256(abi.encodePacked(verifier.id)) == keccak256(abi.encodePacked(empty))
            || documentHolder.token != token || documentHolder.tokenUsed == true || documentHolder.tokenExpiration >= now) {
            isValid = false;
        } else {
            isValid = true;
        }
        Document storage document = documentHolder.documents[documentId];        
        uint i = 0;
        while (isValid ==  true || i < rules.length / 3)
        {
            string memory identifier = rules[i];
            string memory rule = rules[i+1];
            string memory value = rules[i+2];
            string memory documentAttribute = document.attributes[identifier];
            if (keccak256(abi.encodePacked(rule)) == keccak256(abi.encodePacked("<"))) {
				if ((keccak256(abi.encodePacked(documentAttribute)) < keccak256(abi.encodePacked(value)))) 
                {
                    isValid = false;
                }
            } else if (keccak256(abi.encodePacked(rule)) == keccak256(abi.encodePacked(">"))) {
				if ((keccak256(abi.encodePacked(documentAttribute)) > keccak256(abi.encodePacked(value)))) 
                {
                    isValid = false;
                }
            } else if (keccak256(abi.encodePacked(rule)) == keccak256(abi.encodePacked("<="))) {
				if ((keccak256(abi.encodePacked(documentAttribute)) <= keccak256(abi.encodePacked(value)))) 
                {
                    isValid = false;
                }
            } else if ((keccak256(abi.encodePacked(rule)) == keccak256(abi.encodePacked(">=")))) {
				if ((keccak256(abi.encodePacked(documentAttribute)) >= keccak256(abi.encodePacked(value)))) 
                {
                    isValid = false;
                }
            } else if ((keccak256(abi.encodePacked(rule)) == keccak256(abi.encodePacked("=")))) {
                if ((keccak256(abi.encodePacked(documentAttribute)) != keccak256(abi.encodePacked(value)))) 
                {
                    isValid = false;
                }
            } else {
                isValid = false;
            }
            i++;
        }
        return isValid;
    }
}