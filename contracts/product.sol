pragma solidity ^0.7.2;
//SPDX-License-Identifier: Apache-2.0

// purchase struct
struct purchase
{
    uint256 balance;
    uint block_number;
    uint256 amount;
    bool failed;
}

contract product
{
    // the purchases
    mapping (address => purchase[]) private _purchases;

    // the balance of the product token
    mapping (address => uint256) private _balance;

    // flag indicating if the address is in the _openCustomers array
    // not required but improves speed and gas cost for some functions
    mapping (address => bool) private _open;

    // array containing all customers who have an open target to pay
    address[] private _openCustomers;

    // name of the product
    string private _name;

    // description of the product
    string private _description;

    // price of the product in wei (ether / 1e18)
    uint private _price;
    
    // owner of the product
    address private _owner;

    // the number of blocks that can pass till a customer has to pay for the product
    uint private _payTime;

    // concstructor
    /* name: the name of the product
     * description: the description of the product
     * price: the price in wei
     * payTime: the number of blocks that can pass till ca customer has to pay for the product
    */
    constructor (string memory name, string memory description, uint price, uint payTime)
    {
        _name = name;
        _description = description;
        _price = price;
        _payTime = payTime;
        _owner = msg.sender;
    }

    // public function for the name
    function name() public view returns (string memory)
    {
        return _name;
    }

    // public function for the description
    function description() public view returns (string memory)
    {
        return _description;
    }

    // public function for the price
    function price() public view returns (uint256)
    {
        return _price;
    }

    // public function for the payTime
    function payTime() public view returns (uint)
    {
        return _payTime;
    }

    // returns the balance of the product token for the sender
    function getBalance() public view returns (uint256)
    {
        return _balance[msg.sender];
    }

    // return the total open balance the given customer still has to pay
    // !!! not the balance of the product token !!!
    function totalOpenBalance(address customer) private view returns (uint256)
    {
        uint256 sum = 0;
        // iterate through all purchases of the sender
        for (uint i = 0; i < _purchases[customer].length; i++)
        {
            // check if a purchase has failed, because then it should not be counted
            if (_purchases[customer][i].failed == false)
            {
                sum += _purchases[customer][i].balance;
            }
        }
        return sum;
    }

    // public function for the total open balance the sender still has to pay
    // !!! not the balance of the product token !!!
    function totalOpenBalance() public view returns (uint)
    {
        return totalOpenBalance(msg.sender);
    }

    // removes the given address from the _openCustomer array and sets the flag _open to false
    function removeFromOpenCustomers(address customer) private
    {
        // remove the customer from the open customer array
        // find the customer in the array
        for (uint i = 0; i < _openCustomers.length; i++)
        {
            if (_openCustomers[i] == customer)
            {
                // switch the entry with the last
                _openCustomers[i] = _openCustomers[_openCustomers.length - 1];
                delete _openCustomers[_openCustomers.length - 1];
                //_openCustomers.length--;
            }
        }
        // reset the flag
        _open[customer] = false;
    }

    // public function for ordering a product token with the given amount
    // return the price to pay in wei
    function order(uint amount) public returns (uint)
    {
        // create a new entry in the purchases array
        _purchases[msg.sender].push();
        // write the balance the customer has to pay
        _purchases[msg.sender][_purchases[msg.sender].length - 1].balance = amount * _price;
        // write the current block number
        _purchases[msg.sender][_purchases[msg.sender].length - 1].block_number = block.number;
        // write the amount this purchase contains
        _purchases[msg.sender][_purchases[msg.sender].length - 1].amount = amount;
        // set the failed flag to false
        _purchases[msg.sender][_purchases[msg.sender].length - 1].failed = false;

        // check if the customer is already in the open customer array
        if (!_open[msg.sender])
        {
            // add the customer to the array
            _openCustomers.push();
            _openCustomers[_openCustomers.length - 1] = msg.sender;
            // set the flag to true
            _open[msg.sender] = true;
        }

        // increase the balance by the given amount
        _balance[msg.sender] += amount;

        // return the price to pay in wei
        return amount * _price;
    }

    // public function for paying the open targets
    // returns the total open balance that still needs to be payed
    function pay() public payable returns (uint)
    {
        // check if the customer has an open balance
        require(totalOpenBalance(msg.sender) != 0);
        // create a local copy of the purchases of the customer
        purchase[] storage purchases = _purchases[msg.sender];
        uint balance = msg.value;
        // iterate through the purchases
        for (uint i = 0; i < purchases.length; i++)
        {
            // if the amount of a purchase is 0 then this purchase has already been payed
            // if the amount of a purchase is smaller than the amount of this purchase that is remaining then this purchase can be payed
            if (balance >= purchases[i].balance && purchases[i].balance > 0)
            {
                // substract the balance of the purchase from the remaining amount
                balance -= purchases[i].balance;
                // set the balance of the purchase to 0 to mark it as payed
                purchases[i].balance = 0;
            }
        }
        // check if the total open amount is 0
        if (totalOpenBalance(msg.sender) == 0)
        {
            removeFromOpenCustomers(msg.sender);
        }
        // write the purchases back
        _purchases[msg.sender] = purchases;

        // return the open balance
        return totalOpenBalance(msg.sender);
    }

    // function only for the owner of the contract
    // checks if there are unpaid purchases where the customers missed the payment target
    // should be executed every block or at least periodically
    function checkPayments() public
    {
        // let only the owner execute this function
        require(msg.sender == _owner);
        // iterate through all customers who have a payment target
        for (uint i = 0; i < _openCustomers.length; i++)
        {
            purchase[] storage purchases = _purchases[_openCustomers[i]];
            // iterate through all payments
            for (uint i2 = 0; i2 < purchases.length; i2++)
            {
                // check if the customer missed the target
                if (block.number - purchases[i2].block_number > _payTime && purchases[i2].failed == false && purchases[i2].balance > 0)
                {
                    purchase storage localPurchase = purchases[i2];
                    // customer missed the payment target
                    // substract the balance
                    _balance[_openCustomers[i]] -= localPurchase.amount;
                    // set the purchase to failed
                    localPurchase.failed = true;
                    // write back the purchase
                    purchases[i2] = localPurchase;
                }
            }
            // write back the purchases
            _purchases[_openCustomers[i]] = purchases;
            // if the customer has no open targets remove him from the openCustomers array
            if (totalOpenBalance(_openCustomers[i]) == 0)
            {
                removeFromOpenCustomers(_openCustomers[i]);
            }
        }
    }
}