---
title: 'Welcome Web3'
image: '/assets/info.png'
created: 2022-12-19
updated: 2022-12-19
tags:
  - 'ctf'
  - 'web3'
  - 'nahamcon EU ctf 22'
---

[Challenge Code](https://github.com/Aviksaikat/WalkThroughs/tree/master/nahamcon_EU_22/web3/Welcome_DONE)

- So we have the challenge file in the [eth_welcome.zip](https://github.com/Aviksaikat/WalkThroughs/tree/master/nahamcon_EU_22/web3/Welcome_DONE) file. As after extracting we have the following files

```py
% tree
.
├── contracts
│   └── Welcome.sol
├── eth_welcome.zip
├── interfaces
└── scripts
    └── challenge.py

3 directories, 3 files

```

- Authors used [brownie](https://eth-brownie.readthedocs.io/en/stable/python-package.html) framework setting up this CTF challenges. So we can use this dir structure directly for our testing. So we have the target contract `Welcome.sol` & `challenge.py` to check what are the requirements to solve this CTF, because there is no flag for these challenges. Instead when we have to use the given RPC url to submit our solution. So let's get started.

- So let's start by reading the `challenge.py` file.

```py
from brownie import *

def deploy(state, deployer, player):
    Welcome.deploy({'from': deployer[0]})

def solved():
    if Welcome[-1].balance() > 0:
        return True, "Solved!"
    else:
        return False, "Need more coins!"

CONFIG = {
    # "RPC": '',
    # "BLOCK_NUMBER": '',
    # 'FLAGS': '',
    'MNEMONIC': 'test test test test test test test test test test test junk',
    # 'RUNNABLES': [],
    'ALLOWED_RPC_METHODS': []
}

```

- So we have 2 functions; `deploy` & `solved`. By the names you can understand what they do. So let's skip the deploy one & see the `solved()`.
- It's simple `if Welcome[-1].balance() > 0:` checks wether the balance of the contract is more than 0 or not. The `-1` indicates take the latest deployed contract instance. And lastly we have a `CONFIG` dictionary which has the `mnemonic` i.e. our private key for the given wallet. We can use this address to solve the challenge.

- So it's simple send money to the contract & make it's balance more than `0` & solve the challenge. Hmmm how can we do that. Let's look at the contract now.

- `Welcome.sol`

```js
pragma solidity ^0.8.10;

contract Welcome {

    receive() external payable {
        
    }

}
```

- So the first line is the `pragma solidity` which defines the compiler version we should be using for this contract. Next, we have the `contract` keyword with the contract name `Welcome` & inside this contract there is a odd function/method i.e. called `receive()` & it has no body. Odd....hmmm.... not quite. Actually it's pretty common in solidity.

- This `receive()` fu. is called a `Fallback function`. Wait. What are those!!??.
- According to Learn Ethereum [Book] - O'Reilly, `A fallback function is an unnamed external function without any input or output parameters. EVM executes the fallback function on a contract if none of the other functions match the intended function calls`.
- In terms of english, a fallback function is fn. which is used to receive tokens (ETH or anything) from other sources (other contract/wallet etc.). It has no body, it doesn't take any input parameter and it doesn't return anything. This method is the latest way of receiving money(tokens) from other sources. In older version of solidity this can be done by just specifying the `function` keyword like this `function() external payable {}`.
- The `external` specifies that the fn. can be called from other contracts or wallets.
- Lastly the `payable` keyword. It's very important as without this keyword this contract can't receive any payments. It tells the `EVM` that this function is capable of receiving eth.

- Ok let's make our attack script. We have started our instance. We can run this locally as well because by the time I publish this writeup the site will be pretty much taken down.

![](/assets/challenge_start.png)

- To run the contract in the challenge environment from brownie fist we have to add it to the `brownie networks list`. To do this we have to use this command. To know more always read the docs.

```py
brownie networks add Ethereum 1337 host=<RPC URL> chainid=1
```

- And we'll get something like this.
![](/assets/networks-add.png)

- Cool let's start writing our script.

```py
#!/usr/bin/python3
from brownie import *

def solved(welcome_address):
    if Welcome.at(welcome_address).balance() > 0:
        return "Solved!"
    else:
        return "Need more coins!"

def main(welcome_address=None):
    if welcome_address:
        # print("Yo")
        CONFIG = {
            "RPC": "https://ctf.nahamcon.com/challenge/39/4b1c3f26-f849-4ead-b563-6ddc5f5d477b",
            # "BLOCK_NUMBER": '',
            # 'FLAGS': '',
            "MNEMONIC": "test test test test test test test test test test test junk",
            # 'RUNNABLES': [],
            "ALLOWED_RPC_METHODS": [],
        }
        # welcome_address = "0x0cB8C2Fe5f94B3b9a569Df43a9155AC008c9884b"
        attacker = accounts.from_mnemonic(CONFIG["MNEMONIC"])
        tx = attacker.transfer(to=welcome_address, amount="0.01 ether")
        tx.wait(1)

        print(f"Solved: {solved(welcome_address)}")
```

- So we have defined our `main` fn. There is if part because I'm going to pass the contract address as a command line argument to make it more generic you can just uncomment the `welcome_address` variable. The `else` part is to test the contract locally. We'll get into in later. We have the `CONFIG` dictionary which has the `mnemonic` key.
- Next loads the wallet from the mnemonic. `accounts.from_mnemonic(CONFIG["MNEMONIC"])`.So we're pulling the `mnemonic` from `CONFIG` dictionary & saving it as the `attacker` variable.

```py
tx = attacker.transfer(to=welcome_address, amount="0.1 ether")
tx.wait(1)
```

- Next we're sending `0.1 ETH` from our wallet to the target contract & the next line is not necessary but we're waiting for the transaction.

- Lastly we're calling the `solved()` fn. to get check wether all these code makes any sense or not.

- Now let's do the magic. To run we have to use the following command.

```py
brownie run scripts/attack.py main <address of the contract> --network <network name>
```

![](/assets/run.png)

- Done! We have solved the challenge!!!

- Now the bonus part. If we want to test this locally we can do this with just a few tweaks. Let's see how we can do that. So to do that fist we have to deploy the contract locally. So let's add the `else`.

```py
def deploy_local():
    return Welcome.deploy({"from": accounts[0]})
    [...]
    else:
        welcome = deploy_local()
        welcome_address = welcome.address
        # print(address)

        # send ether forcefully
        attacker = accounts[1]
        tx = attacker.transfer(to=welcome_address, amount="0.001 ether")
        tx.wait(1)

        print(f"Solved: {solved_locally()}")
```

- The `deploy_local` fn. is going to deploy the contract locally & this is the syntax to do that. Notice the `{"from": accounts[0]}` which is the defined way of deploying smart contracts in brownie. We're specifying the account from which the contract is being deployed. `accounts` is a list provided by brownie that contains 10 test accounts indexed from 0-9. We can use any of them. Then we're setting the address of the deployed contract to the `welcome_address` variable & we're using the 2nd test account as the attacker account. It can be anything other than the fist account otherwise it's worthless if we're the admin then everything is pointless. Apart from that everything is same. So the final script looks like this.

- `attack.py`

```py
#!/usr/bin/python3
from brownie import *

def deploy(state, deployer, player):
    Welcome.deploy({"from": deployer[0]})


def solved(welcome_address):
    if Welcome.at(welcome_address).balance() > 0:
        return "Solved!"
    else:
        return "Need more coins!"

# ------------------------------------------------

def deploy_local():
    return Welcome.deploy({"from": accounts[0]})

def solved_locally():
    if Welcome[-1].balance() > 0:
        return True, "Solved!"
    else:
        return False, "Need more coins!"


def main(welcome_address=None):
    if welcome_address:
        # print("Yo")
        CONFIG = {
            "RPC": "https://ctf.nahamcon.com/challenge/39/4b1c3f26-f849-4ead-b563-6ddc5f5d477b",
            # "BLOCK_NUMBER": '',
            # 'FLAGS': '',
            "MNEMONIC": "test test test test test test test test test test test junk",
            # 'RUNNABLES': [],
            "ALLOWED_RPC_METHODS": [],
        }
        # welcome_address = "0x0cB8C2Fe5f94B3b9a569Df43a9155AC008c9884b"
        attacker = accounts.from_mnemonic(CONFIG["MNEMONIC"])
        tx = attacker.transfer(to=welcome_address, amount="0.01 ether")
        tx.wait(1)

        print(f"{solved(welcome_address)}")

    else:
        welcome = deploy_local()
        welcome_address = welcome.address
        # print(address)

        # send ether forcefully
        attacker = accounts[1]
        tx = attacker.transfer(to=welcome_address, amount="0.001 ether")
        tx.wait(1)

        print(f"Solved: {solved_locally()}")

```

- We can run this as before but we don't have to specify anything now.

```py
brownie run scripts/attack.py
```

![](/assets/solved.png)

- And it's done. I hope you liked this writeup. Thanks for reading. See ya!!
