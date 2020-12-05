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

  it("order two products and pay", async () => {
    // order product
    await instance.order(10,  { from: paul});
    // advance 2 blocks
    for (var i = 0; i < 2; i++)
    {
        await instance.checkPayments({from: owner});
    }
    // order second product
    await instance.order(8,  { from: paul});
    // check payments
    await instance.checkPayments({from: owner});

    // calculate the price for both products
    var price = await instance.price() * 18;
    // pay the products
    await instance.pay.sendTransaction({from: paul, value: price});
    // check if the total open amount is 0
    assert.equal(await instance.totalOpenBalance({from: eve}), 0);
  })

  it("order two products, check balance and pay one", async () => {
    // order product
    await instance.order(3,  { from: jakob});
    // check payments
    await instance.checkPayments({from: owner});

    // order second product
    await instance.order(11,  { from: jakob});
    // check payments
    await instance.checkPayments({from: owner});

    // calculate the price for only one product
    var price = await instance.price() * 3;
    // pay only one product
    await instance.pay.sendTransaction({from: paul, value: price});
    // check if the total open amount is 0
    assert.equal(await instance.totalOpenBalance({from: eve}), 0);
    // check if the total open amount is 11
    assert.equal(await instance.totalOpenBalance({from: eve}), 11);
  })

  it("two different people order product and two pay", async () => {
    // order product with first account
    await instance.order(8,  { from: phil});
    // check payments
    await instance.checkPayments({from: owner});

    // order product with second account
    await instance.order(1,  { from: josh});
    // check payments
    await instance.checkPayments({from: owner});

    // calculate the price for both products individually
    var priceAccount1 = await instance.price() * 8;
    var priceAccount2 = await instance.price() * 18;
    // pay both products
    await instance.pay.sendTransaction({from: phil, value: priceAccount1});
    await instance.pay.sendTransaction({from: josh, value: priceAccount2});
    // check if the total open amount for both accounts 
    assert.equal(await instance.totalOpenBalance({from: phil}), 0);
    assert.equal(await instance.totalOpenBalance({from: josh}), 0);
  })

  it("two different people and only one pays in time", async () => {
    // order product with first account
    await instance.order(2,  { from: jay});
    // advance 10 blocks
    for (var i = 0; i < 10; i++)
    {
        await instance.checkPayments({from: owner});
    }

    // order product with second account
    await instance.order(4,  { from: allesha});
    // check payments
    await instance.checkPayments({from: owner});

    // calculate the price for on product
    var price = await instance.price() * 4;
    // pay both products
    await instance.pay.sendTransaction({from: allesha, value: price});

    // advance 10 blocks
    for (var i = 0; i < 10; i++)
    {
        await instance.checkPayments({from: owner});
    }

    // check if the total open amount for both accounts 
    assert.equal(await instance.totalOpenBalance({from: jay}), 0);
  })
});
