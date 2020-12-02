const product = artifacts.require("product");
//const { time } = require("@openzeppelin/test-helpers");

contract("product", (accounts) => {
  const owner = accounts[0];
  const bob = accounts[1];
  const carol = accounts[2];
  const daniel = accounts[3];
  const eve = accounts[4];
  const friedrich = accounts[5];
  const gans = accounts[6];
  const hans = accounts[7];

  let instance;

  beforeEach(async () => {
    instance = await product.deployed();
  });

  it("order product and check balance", async () => {
      // order product
      await instance.order(5, {from: bob});
      // check balance
      assert.equal(await instance.getBalance({from: bob}), 5);
  });

  it("order product and check balance from different account", async () => {
      // order product
      await instance.order(6, {from: carol});
      // check balance from different account
      assert.notEqual(await instance.getBalance({from: daniel}), 6);
  });

  it("order product and pay", async () => {
      // order product
      await instance.order(7,  { from: eve});
      // advance 5 blocks
      for (var i = 0; i < 5; i++)
      {
          await instance.checkPayments({from: owner});
          //await time.advanceBlock();
      }
      // calculate the price
      var price = await instance.price() * 7;
      // pay the products
      await instance.pay.sendTransaction({from: eve, value: price});
      // check if the total open amount is 0
      //var open = await instance.totalOpenAmount({from: eve});
      assert.equal(await instance.totalOpenBalance({from: eve}), 0);
  });

  it("total open amount", async () => {
    // check if total open amount is 0
    assert.equal(await instance.totalOpenBalance({from: friedrich}), 0);
    // order product
    await instance.order(9, { from: friedrich });
    // check if total open amount is 9
    assert.equal(await instance.totalOpenBalance({from: friedrich}), 9*7);
  });

  it("order product and don't pay in time", async () => {
      // order product
      await instance.order(8, { from: gans });
      // check balance
      assert.equal(await instance.getBalance({from: gans}), 8);
      // advance 11 blocks
      for (var i = 0; i < 20; i++)
      {
          await instance.checkPayments({from: owner});
      }
      await instance.checkPayments({from: owner});
      // check balance which should be 0
      assert.equal(await instance.getBalance({from: gans}), 0);
  });

  it("order product two times and pay", async () => {
    // order product first time
    await instance.order(9, { from: hans});
    // advance one block
    await instance.checkPayments({from: owner});
    // order product second time
    await instance.order(11, { from: hans});
    //advance one block
    await instance.checkPayments({from: owner});
    // check balance
    assert.equal(await instance.getBalance({from: hans}), 20);
    // pay both purchases
    var price = await instance.price() * 20;
    await instance.pay.sendTransaction({from: hans, value: price});
    // check if totalOpenBalance is 0
    assert.equal(await instance.totalOpenBalance({from: hans}), 0);
  })
  // todo remove
  /*it("test block advancing", async () => {
      // get first block number
      var first = await instance.getBlock.call();
      // advance 11 blocks
      for (var i = 0; i < 11; i++)
      {
          await instance.checkPayments({from: owner});
          //await time.advanceBlock();
          //console.log(await instance.getBlock());
      }
      // get second block number
      var second = await instance.getBlock();
      //console.log(first);
      //console.log(second);
      //console.log("test");
      assert.equal(first, second - 11);
  });*/
});
