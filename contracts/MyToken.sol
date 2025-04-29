// contracts/MyToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    // 初始化铸造 1000000 个代币
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    // 公开铸造函数（仅示例，正式环境需要权限控制）
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}