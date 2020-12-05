import Web3 from "web3";
import product from "../../build/contracts/product.json";

const App = {
  web3: null,
  account: null,
  dhbw: null,

  start: async function () {
    const { web3 } = this;
    document.getElementById("price1").innerHTML = 500;
    document.getElementById("price2").innerHTML = 200;
    document.getElementById("price3").innerHTML = 100;
    document.getElementById("balance").innerHTML = -100;
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

      this.refreshBalance();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  refreshBalance: async function () {
    /*
    const { balanceOf, decimals } = this.dhbw.methods;
    const balance = await balanceOf(this.account).call();
    const decimal = await decimals().call();

    const balanceElement = document.getElementsByClassName("balance")[0];
    balanceElement.innerHTML = `${balance / Math.pow(10, decimal)}.${(
      balance % 100
    )
      .toString()
      .padStart(2, "0")}`;
    */
  },

  order: async function (productid) {
    
    //whatever should happen if somebody presses "Bestellen"

    /*
    const amount = parseInt(document.getElementById("amount").value);
    const receiver = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    const { transfer } = this.dhbw.methods;
    await transfer(receiver, amount * 100).send({ from: this.account });

    this.setStatus("Transaction complete!");
    this.refreshBalance();
    */
  },

  setStatus: function (message) {
    /*
    const status = document.getElementById("status");
    status.innerHTML = message;
    */
  },
};

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