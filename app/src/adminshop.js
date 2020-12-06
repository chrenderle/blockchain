import Web3 from "web3";
import product from "../../build/contracts/product.json";

const App = {
  web3: null,
  account: null,
  dhbw: null,
  price: null,
  amount: null,
  balance: null,
  totalOpenAmount: null,
  payable: null,

  start: async function () {
    const { web3 } = this;
    // initialize html elements
    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = product.networks[networkId];
      this.dhbw = new web3.eth.Contract(
        product.abi,
        deployedNetwork.address
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }

  },

  
}

window.App = App;

window.addEventListener("load", function () {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:7545. You should remove this fallback when you deploy live"
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:7545")
    );
  }

  App.start();
});

window.App = App;