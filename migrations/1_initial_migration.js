const product = artifacts.require("product");

module.exports = function (deployer, network, accounts) {
  const owner = accounts[0];
  deployer.deploy(product, "Name", "Description", 7, 20, {from: owner});
};
