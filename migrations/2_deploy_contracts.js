const DocumentIdentifier = artifacts.require("DocumentIdentifier");

module.exports = function(deployer) {
  deployer.deploy(DocumentIdentifier);
};