---
title: Arbitrage - Quillctf
image: 'https://quillctf.super.site/_next/image?url=https%3A%2F%2Fassets.super.so%2Fa799195c-7c08-410a-9254-50dd9f21a772%2Fimages%2F6e1d60ba-8a0b-4588-9413-fb30d1dfee82%2F1374FC4A-D8B8-4767-B951-ED874164BB64.png&w=1920&q=80'
created: 2023-05-10
tags:
    - 'smart contracts'
    - 'web3'
    - 'brownie'
    - 'quillctf'
---


## Objective
Admin has gifted you `5e18` `Btokens` on your birthday. Using A,B,C,D,E token pairs on swap contracts, increase your BTokens. _(See Foundry SetUp)_

- For this challenge we have an interface `ISwapV2Router02.sol` which is the interface `IUniswapV2Router02.sol`. But it has only methods that is relevant for this challenge. 
```js
pragma solidity ^0.8;

interface ISwapV2Router02 {
    function factory() external pure returns (address);

    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);

    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    )
        external
        payable
        returns (uint amountToken, uint amountETH, uint liquidity);

    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB);

    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountToken, uint amountETH);

    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint amountA, uint amountB);

    function removeLiquidityETHWithPermit(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint amountToken, uint amountETH);

    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function swapExactETHForTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable returns (uint[] memory amounts);

    function swapTokensForExactETH(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function swapExactTokensForETH(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function swapETHForExactTokens(
        uint amountOut,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable returns (uint[] memory amounts);

    function quote(
        uint amountA,
        uint reserveA,
        uint reserveB
    ) external pure returns (uint amountB);

    function getAmountOut(
        uint amountIn,
        uint reserveIn,
        uint reserveOut
    ) external pure returns (uint amountOut);

    function getAmountIn(
        uint amountOut,
        uint reserveIn,
        uint reserveOut
    ) external pure returns (uint amountIn);

    function getAmountsOut(
        uint amountIn,
        address[] calldata path
    ) external view returns (uint[] memory amounts);

    function getAmountsIn(
        uint amountOut,
        address[] calldata path
    ) external view returns (uint[] memory amounts);
}
```

- And we have the foundry setup file.
```js
// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "forge-std/Test.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ISwapV2Router02} from "v2-periphery/interfaces/ISwapV2Router02.sol";

contract Token is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint initialMint
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialMint);
    }
}

contract Arbitrage is Test {
    address[] tokens;
    Token Atoken;
    Token Btoken;
    Token Ctoken;
    Token Dtoken;
    Token Etoken;
    Token Ftoken;
    address owner = makeAddr("owner");
    address arbitrageMan = makeAddr("arbitrageMan");
    ISwapV2Router02 router =
        ISwapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);

    function addL(address first, address second, uint aF, uint aS) internal {
        router.addLiquidity(
            address(first),
            address(second),
            aF,
            aS,
            aF,
            aS,
            owner,
            block.timestamp
        );
    }

    function setUp() public {
        vm.createSelectFork("https://eth-mainnet.g.alchemy.com/v2/...");
        vm.startPrank(owner);
        Atoken = new Token("Atoken", "ATK", 100 ether);
        tokens.push(address(Atoken));
        Btoken = new Token("Btoken", "BTK", 100 ether);
        tokens.push(address(Btoken));
        Ctoken = new Token("Ctoken", "CTK", 100 ether);
        tokens.push(address(Ctoken));
        Dtoken = new Token("Dtoken", "DTK", 100 ether);
        tokens.push(address(Dtoken));
        Etoken = new Token("Etoken", "ETK", 100 ether);
        tokens.push(address(Etoken));

        Atoken.approve(address(router), 100 ether);
        Btoken.approve(address(router), 100 ether);
        Ctoken.approve(address(router), 100 ether);
        Dtoken.approve(address(router), 100 ether);
        Etoken.approve(address(router), 100 ether);

        addL(address(Atoken), address(Btoken), 17 ether, 10 ether);
        addL(address(Atoken), address(Ctoken), 11 ether, 7 ether);
        addL(address(Atoken), address(Dtoken), 15 ether, 9 ether);
        addL(address(Atoken), address(Etoken), 21 ether, 5 ether);
        addL(address(Btoken), address(Ctoken), 36 ether, 4 ether);
        addL(address(Btoken), address(Dtoken), 13 ether, 6 ether);
        addL(address(Btoken), address(Etoken), 25 ether, 3 ether);
        addL(address(Ctoken), address(Dtoken), 30 ether, 12 ether);
        addL(address(Ctoken), address(Etoken), 10 ether, 8 ether);
        addL(address(Dtoken), address(Etoken), 60 ether, 25 ether);

        Btoken.transfer(arbitrageMan, 5 ether);
        vm.stopPrank();
    }

    function testHack() public {
        vm.startPrank(arbitrageMan);
        uint tokensBefore = Btoken.balanceOf(arbitrageMan);
        Btoken.approve(address(router), 5 ether);

        // solution
 
        uint tokensAfter = Btoken.balanceOf(arbitrageMan);
        assertGt(tokensAfter, tokensBefore);
    }
}
```

- So the admin has minted 5 ERC20 tokens & created `11` liquidity pools using those `5` tokens. He has gifted us `5 ETH` worth of `Btoken`. We have to do swaps such that we end up making more tokens that he had before. To do this we first have to find out value of each token with respect of our `Btoken`. We can use the `getAmountsOut()` function of the router contract like this

```js
// suppose we want to ceck the value of token D with respect to B
address[] memory path = new address[](2);
path[0] = address(Btoken);
path[1] = address(Dtoken);

uint[] memory amounts = router.getAmountsOut(1, path)
for (uint8 i = 0; i < amounts.length; i++) {

	console.log(amounts[i]);

}
>> 1 // value of B
>> 3 // Send 3 B tokens to get 1 D token
```
- We can see from the code above to get `1 Dtoken` we need to swap `3 Btokens`. Similarly we can check for all tokens like this
```js
address[] memory path = new address[](5);
path[0] = address(Btoken);
path[1] = address(Dtoken);
path[2] = address(Ctoken);
path[3] = address(Dtoken);
path[4] = address(Etoken);
uint[] memory amounts = router.getAmountsOut(1, path)
for (uint8 i = 0; i < amounts.length; i++) {

	console.log(amounts[i]);

}
>> 1
>> 1
>> 10
>> 3
>> 9
```
- From this we can calculate what swaps would be profitable. Here are the 3 swaps I found profitable. 
```js
1st tech: B->D->C->B :       FINAL AMOUNT -> 17129647787090471315
2nd tech: B->D-C->E->B :     FINAL AMOUNT -> 10364824430416470130
3rd tech: B->D->A->C->E->B : FINAL AMOUNT -> 5601325289877443917
```
- This solution is not general. This will not work if the liquidity changes. I'm working on a general solution. But for now I'm hardcoding the swaps. Here is my solution
```js
// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
/*
Admin has gifted you 5e18 Btokens on your birthday. Using A,B,C,D,E token pairs on swap contracts, increase your BTokens. (See Foundry SetUp)
*/

import "forge-std/Test.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ISwapV2Router02} from "src/ISwapV2Router02.sol";
// imports
import "forge-std/console.sol";

contract Token is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint initialMint
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialMint);
    }
}

contract Arbitrage is Test {
    address[] tokens;
    Token Atoken;
    Token Btoken;
    Token Ctoken;
    Token Dtoken;
    Token Etoken;
    Token Ftoken;
    address owner = makeAddr("owner");
    address arbitrageMan = makeAddr("arbitrageMan");
    ISwapV2Router02 router =
        ISwapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);

    // solution
    address private FACTORY;
    address private ROUTER;
    address private WETH;

    function addL(address first, address second, uint aF, uint aS) internal {
        router.addLiquidity(
            address(first),
            address(second),
            aF,
            aS,
            aF,
            aS,
            owner,
            block.timestamp
        );
    }

    function setUp() public {
        vm.createSelectFork(
            "https://eth-mainnet.g.alchemy.com/v2/<api_key>"
        );
        vm.startPrank(owner);
        Atoken = new Token("Atoken", "ATK", 100 ether);
        tokens.push(address(Atoken));
        Btoken = new Token("Btoken", "BTK", 100 ether);
        tokens.push(address(Btoken));
        Ctoken = new Token("Ctoken", "CTK", 100 ether);
        tokens.push(address(Ctoken));
        Dtoken = new Token("Dtoken", "DTK", 100 ether);
        tokens.push(address(Dtoken));
        Etoken = new Token("Etoken", "ETK", 100 ether);
        tokens.push(address(Etoken));

        Atoken.approve(address(router), 100 ether);
        Btoken.approve(address(router), 100 ether);
        Ctoken.approve(address(router), 100 ether);
        Dtoken.approve(address(router), 100 ether);
        Etoken.approve(address(router), 100 ether);

        addL(address(Atoken), address(Btoken), 17 ether, 10 ether);
        addL(address(Atoken), address(Ctoken), 11 ether, 7 ether);
        addL(address(Atoken), address(Dtoken), 15 ether, 9 ether);
        addL(address(Atoken), address(Etoken), 21 ether, 5 ether);
        addL(address(Btoken), address(Ctoken), 36 ether, 4 ether);
        addL(address(Btoken), address(Dtoken), 13 ether, 6 ether);
        addL(address(Btoken), address(Etoken), 25 ether, 3 ether);
        addL(address(Ctoken), address(Dtoken), 30 ether, 12 ether);
        addL(address(Ctoken), address(Etoken), 10 ether, 8 ether);
        addL(address(Dtoken), address(Etoken), 60 ether, 25 ether);

        Btoken.transfer(arbitrageMan, 5 ether);
        vm.stopPrank();
    }

    function testHack() public {
        vm.startPrank(arbitrageMan);
        uint tokensBefore = Btoken.balanceOf(arbitrageMan);
        Btoken.approve(address(router), 5 ether);
        Ctoken.approve(address(router), 5 ether);
        Dtoken.approve(address(router), 5 ether);
        Etoken.approve(address(router), 5 ether);
        Atoken.approve(address(router), 5 ether);

        // solution
        FACTORY = router.factory();
        ROUTER = address(router);
        WETH = router.WETH();
        // console.log(FACTORY);
        // console.log(ROUTER);
        // console.log(WETH);

        /*  give 10 C to get 1 B
            1 in B = 
                1  -> A
                10 -> C . 1 C -> 3 D, 1 C -> 2 E 
                3  -> D . 1 D -> 3 E
                9  -> E
            
            !1st tech: B->D->C->B        : FINAL AMOUNT -> 17129647787090471315
            !2nd tech: B->D-C->E->B      : FINAL AMOUNT -> 10364824430416470130
            !3rd tech: B->D->A->C->E->B  : FINAL AMOUNT ->  5601325289877443917
        */

        address[] memory path = new address[](2);
        path[0] = address(Btoken);
        path[1] = address(Dtoken);
        // path[2] = address(Ctoken);
        // path[3] = address(Dtoken);
        // path[4] = address(Etoken);

        // uint[] memory amounts = router.getAmountsOut(9, path);

        uint[] memory amounts = router.swapExactTokensForTokens(
            Btoken.balanceOf(arbitrageMan),
            1,
            path,
            address(arbitrageMan),
            block.timestamp
        );
        for (uint8 i = 0; i < amounts.length; i++) {
            console.log(amounts[i]);
        }

        path[0] = address(Dtoken);
        path[1] = address(Atoken);

        amounts = router.swapExactTokensForTokens(
            amounts[amounts.length - 1],
            1,
            path,
            address(arbitrageMan),
            block.timestamp
        );

        for (uint8 i = 0; i < amounts.length; i++) {
            console.log(amounts[i]);
        }

        path[0] = address(Atoken);
        path[1] = address(Ctoken);

        amounts = router.swapExactTokensForTokens(
            amounts[amounts.length - 1],
            1,
            path,
            address(arbitrageMan),
            block.timestamp
        );

        for (uint8 i = 0; i < amounts.length; i++) {
            console.log(amounts[i]);
        }

        path[0] = address(Ctoken);
        path[1] = address(Etoken);

        amounts = router.swapExactTokensForTokens(
            amounts[amounts.length - 1],
            1,
            path,
            address(arbitrageMan),
            block.timestamp
        );

        for (uint8 i = 0; i < amounts.length; i++) {
            console.log(amounts[i]);
        }

        path[0] = address(Etoken);
        path[1] = address(Btoken);

        amounts = router.swapExactTokensForTokens(
            amounts[amounts.length - 1],
            1,
            path,
            address(arbitrageMan),
            block.timestamp
        );

        for (uint8 i = 0; i < amounts.length; i++) {
            console.log(amounts[i]);
        }

        uint tokensAfter = Btoken.balanceOf(arbitrageMan);
        console.log("B Tokens before the attack:", tokensBefore);
        console.log("B Tokens after the attack :", tokensAfter);
        assertGt(tokensAfter, tokensBefore);
    }
}

```

- ![](/assets/ab.png)
- This is not a general optimal solution but it works. 


# General Optimal Solution
- So the idea is to iterate through all possible paths to get the most optimal trade. For this I was thinking about making a graph like data structure & use `DFS(depth first search)` to get to the optimal path but I failed terribly. So I tried a simpler approach. First I generated all possible paths then using `getAmountsOut` method of uniswapV2 router checked what will be the trade outcome. If the trade is profitable then only swap. So here is the code for generating all possible path.

- `generate_path.py`

```py
from itertools import permutations, combinations


def generate_path() -> list[list]:
    start_node = "B"
    nodes = ["A", "C", "D", "E"]

    paths = set()

    # Generate combinations of different lengths starting from 1
    for r in range(len(nodes)):
        # Generate combinations without repetition
        for comb in combinations(nodes, r):
            # print(comb)
            # Generate all permutations of the combination
            perms = set(permutations(comb))

            # Generate paths with the start node and permutations
            for perm in perms:
                paths.add(tuple([start_node] + list(perm)))

    # Add individual nodes
    for node in nodes:
        paths.add((start_node, node))

    l = []
    # Print all paths
    for path in paths:
        # print(list(path))
        l.append(path)
    return l


if __name__ == "__main__":
    print(generate_path())
```

- I considered each token as nodes & the rest of the code is self-explanatory. 
- `Sample output`
```bash
[('B', 'D'), ('B', 'E'), ('B', 'C', 'E', 'A'), ('B', 'C', 'D', 'E'), ('B', 'C', 'A'), ('B', 'E', 'D'), ('B', 'C', 'D', 'A'), ('B', 'A', 'E', 'D'), ('B', 'C', 'A', 'D'), ('B', 'C', 'A', 'E'), ('B', 'E', 'C', 'D'), ('B', 'A'), ('B', 'E', 'D', 'C'), ('B', 'E', 'A'), ('B', 'D', 'E'), ('B', 'E', 'A', 'C'), ('B', 'D', 'C', 'E'), ('B', 'E', 'C', 'A'), ('B', 'A', 'D', 'E'), ('B', 'D', 'A'), ('B', 'A', 'D'), ('B', 'A', 'E'), ('B', 'D', 'C', 'A'), ('B', 'D', 'A', 'C'), ('B', 'C'), ('B', 'D', 'E', 'A'), ('B', 'E', 'C'), ('B', 'A', 'E', 'C'), ('B', 'E', 'A', 'D'), ('B', 'D', 'C'), ('B', 'E', 'D', 'A'), ('B', 'A', 'D', 'C'), ('B', 'D', 'A', 'E'), ('B', 'C', 'E', 'D'), ('B',), ('B', 'C', 'D'), ('B', 'A', 'C'), ('B', 'C', 'E'), ('B', 'D', 'E', 'C'), ('B', 'A', 'C', 'D'), ('B', 'A', 'C', 'E')]
```
- We can visualise like this `B->D` & so on.
- Here is the `attack.py` script.
```py
#!/usr/bin/python3
from brownie import web3, chain
from scripts.helpful_scripts import get_account
from scripts.deploy import deploy, approve
from scripts.generate_path import generate_path
from colorama import Fore
from random import shuffle


# * colours
green = Fore.GREEN
red = Fore.RED
blue = Fore.BLUE
magenta = Fore.MAGENTA
reset = Fore.RESET


def getAmountsOut(router, amount: int, path: list) -> tuple:
    return router.getAmountsOut(amount, path)


def swap(router, attacker, amount: int, path: list) -> int:
    tx = router.swapExactTokensForTokens(
        amount,
        1,
        path,
        attacker,
        chain.time() + 10000,
        {"from": attacker},
    )
    swappedAmount = int(web3.eth.getTransactionReceipt(tx.txid)["logs"][2]["data"], 16)
    # print(tx.return_value)

    return swappedAmount


def attack():
    owner, router, tokens, attacker = deploy()
    NODES = {
        "A": tokens[0],
        "B": tokens[1],
        "C": tokens[2],
        "D": tokens[3],
        "E": tokens[4],
    }

    print(f"{green}Approving tokens from attacker{reset}")
    for token in tokens:
        approve(token, attacker, router, "5 ether")

    initial_attacker_balance = tokens[1].balanceOf(attacker)

    possible_paths = generate_path()

    # shuffle the paths for fun i.e. to test different paths
    shuffle(possible_paths)
    shuffle(possible_paths)
    shuffle(possible_paths)

    print(f"{red}Possible paths{reset}")
    # print(possible_paths)

    # path = []
    # path.append(tokens[1])
    # path.append(tokens[0])
    for path in possible_paths:
        if len(path) == 1:
            # skip the path
            continue

        # add token 'B' at the end as it's our final goal
        path = list(path)
        path.append("B")

        print(f"{green}Checking path: {magenta}{'->'.join(path)}{reset}")

        swaps = []
        # path = ("B", "D", "C", "B")
        for i in path:
            swaps.append(NODES.get(i))
        # print(swaps)
        # swaps.append(NODES.get("B"))

        swap_result = getAmountsOut(router, initial_attacker_balance, swaps)

        balance_before_swap = swap_result[0]
        balance_after_swap = swap_result[-1]

        if balance_after_swap > balance_before_swap:
            swap(router, attacker, initial_attacker_balance, swaps)

            print(f"{blue}Balance before swap: {green}{balance_before_swap}")
            print(f"{blue}Balance after swap : {red}{tokens[1].balanceOf(attacker)}")

            assert balance_after_swap > initial_attacker_balance

            print(f"{red}Followed path: {green}{'->'.join(path)}{reset}")
            exit(0)


def main():
    attack()


if __name__ == "__main__":
    main()

```

- So we are first generating possible paths & then in line `73` we are appending the token `B` again so that the final token after swap will be `B` token
```py
path.append("B")
```
- Then the code is pretty much simple we are swapping to get the most profitable trader. 
![](/assets/ab2.png)
![](/assets/ab3.png)
