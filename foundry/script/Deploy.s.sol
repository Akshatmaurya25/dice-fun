// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {DiceTipping} from "../src/DiceTipping.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying DiceTipping contract from address:", deployerAddress);

        DiceTipping diceTipping = new DiceTipping();

        console.log("DiceTipping contract deployed at:", address(diceTipping));

        vm.stopBroadcast();
    }
}