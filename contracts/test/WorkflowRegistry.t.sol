// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {WorkflowRegistry} from "../src/WorkflowRegistry.sol";

contract WorkflowRegistryTest {
    function testPublishAndRead() public {
        WorkflowRegistry registry = new WorkflowRegistry();
        uint256 id = registry.publishTemplate("Example", "1.0.0", keccak256("metadata"));
        WorkflowRegistry.Template memory item = registry.getTemplate(id);
        require(item.active, "template inactive");
        require(keccak256(bytes(item.name)) == keccak256(bytes("Example")), "wrong name");
    }
}
