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
    this.price = document.getElementById("price");
    this.amount = document.getElementById("amount");
    this.balance = document.getElementById("balance");
    this.totalOpenAmount = document.getElementById("totalOpenAmount");
    this.payable = document.getElementById("payable");
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
      this.account = accounts[1];
      //this.test();
      this.refreshPrice();
      this.refreshBalance();
      this.refreshTotalOpenAmount();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }

  },

  start2: async function () {
    const { web3 } = this;
    try {
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = product.networks[networkId];
      this.dhbw = new web3.eth.Contract(
        product.abi,
        deployedNetwork.address);

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
    } catch (error)
    {
      console.error("Could not connect to contract or chain");
    }
  },

  refreshPrice: async function () {
    const { price } = this.dhbw.methods;
    this.price.innerText = await price().call();
  },

  refreshBalance: async function () {
    const { getBalance } = this.dhbw.methods;
    var balance = await getBalance().call({from: this.account});
    this.balance.innerText = balance;
  },

  refreshTotalOpenAmount: async function () {
    // refreshes the balance; the open payment targets
    const { totalOpenBalance } = this.dhbw.methods;
    var balance = await totalOpenBalance().call({from: this.account});
    this.totalOpenAmount.innerText = balance;
  },

  order: async function () {
    
    //whatever should happen if somebody presses "Bestellen"
    var amount = this.amount.value;
    const { order } = this.dhbw.methods;
    await order(amount).send({from: this.account, gas: 999999});
    this.refreshTotalOpenAmount();
    this.refreshBalance();
    console.log("ordered " + amount);
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

  pay: async function () {
    var amount = this.payable.value;
    const { pay } = this.dhbw.methods;
    await pay().send({from: this.account, value: amount, gas: 999999});
    this.refreshTotalOpenAmount();
  },

  setStatus: function (message) {
    /*
    const status = document.getElementById("status");
    status.innerHTML = message;
    */
  },
  test: async function () {
    const { get, set } = this.dhbw.methods;
    await set("test1234").send({from: this.account});
    console.log(await get.call({from: this.account}));
  },
  checkPayments: async function() {
      const { checkPayments } = this.dhbw.methods;
      await checkPayments().send({from: this.account, gas: 999999});
  }
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

  if (state == 0)
  {
    App.start();
  }
  else if (state == 1)
  {
    App.start2();
  }
  //App.start();
});