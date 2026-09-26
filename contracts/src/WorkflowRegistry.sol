// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title WorkflowRegistry
/// @notice Non-custodial registry for user-visible workflow templates.
/// @dev This contract stores metadata and emits events only. It does not hold,
///      approve, transfer, or execute user assets.
contract WorkflowRegistry {
    struct Template {
        bool active;
        string name;
        string version;
        bytes32 metadataHash;
        address publisher;
    }

    address public owner;
    uint256 public nextTemplateId = 1;
    mapping(uint256 => Template) private templates;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event TemplatePublished(
        uint256 indexed templateId,
        address indexed publisher,
        string name,
        string version,
        bytes32 metadataHash
    );
    event TemplateStatusChanged(uint256 indexed templateId, bool active);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "zero owner");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function publishTemplate(
        string calldata name,
        string calldata version,
        bytes32 metadataHash
    ) external onlyOwner returns (uint256 templateId) {
        require(bytes(name).length > 0, "empty name");
        require(bytes(version).length > 0, "empty version");

        templateId = nextTemplateId++;
        templates[templateId] = Template({
            active: true,
            name: name,
            version: version,
            metadataHash: metadataHash,
            publisher: msg.sender
        });

        emit TemplatePublished(templateId, msg.sender, name, version, metadataHash);
    }

    function setTemplateStatus(uint256 templateId, bool active) external onlyOwner {
        require(templates[templateId].publisher != address(0), "unknown template");
        templates[templateId].active = active;
        emit TemplateStatusChanged(templateId, active);
    }

    function getTemplate(uint256 templateId) external view returns (Template memory) {
        require(templates[templateId].publisher != address(0), "unknown template");
        return templates[templateId];
    }
}
