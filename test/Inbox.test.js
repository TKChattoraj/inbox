const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');


const provider = ganache.provider();
const web3 = new Web3(provider);
// const web3 = new Web3(ganache.provider());
const {interface, bytecode} = require('../compile');
let accounts;
let inbox;
let INITIAL_MESSAGE = "Hello Tarun"
let new_message = "Tarun is cool!"

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract

  // inbox is a javascript object that represents the
  // contract on the blockchain
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode, arguments: [INITIAL_MESSAGE]})
    .send({ from: accounts[0], gas: '1000000'});
    inbox.setProvider(provider);
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });
  it('creates an initial message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_MESSAGE);
  });
  it('sets a message', async () => {
    await inbox.methods.setMessage(new_message).send({from: accounts[1]});
    check_new_message = await inbox.methods.message().call();
    assert.equal(check_new_message, new_message);
  });

});
