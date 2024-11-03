// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DigitalTimeCapsule {
    struct Capsule {
        address creator;
        string encryptedMessage;
        uint256 unlockTime;
        bool isRevealed;
        string title;
        string description;
    }

    // Mapping from capsule ID to Capsule struct
    mapping(uint256 => Capsule) public capsules;
    
    // Mapping to track capsules created by each address
    mapping(address => uint256[]) public userCapsules;
    
    // Counter for generating unique capsule IDs
    uint256 private _capsuleIdCounter;

    // Events
    event CapsuleCreated(
        uint256 indexed capsuleId,
        address indexed creator,
        uint256 unlockTime,
        string title
    );
    event CapsuleRevealed(uint256 indexed capsuleId, address indexed revealer);
    event CapsuleUpdated(uint256 indexed capsuleId);

    constructor() {
        _capsuleIdCounter = 1;
    }

    /**
     * @dev Creates a new time capsule
     * @param _encryptedMessage The encrypted message to be stored
     * @param _unlockTime The timestamp when the capsule can be opened
     * @param _title Brief title for the capsule
     * @param _description Brief description of the capsule
     */
    function createCapsule(
        string memory _encryptedMessage,
        uint256 _unlockTime,
        string memory _title,
        string memory _description
    ) external returns (uint256) {
        require(_unlockTime > block.timestamp, "Unlock time must be in the future");
        require(bytes(_encryptedMessage).length > 0, "Message cannot be empty");
        require(bytes(_title).length > 0, "Title cannot be empty");

        uint256 capsuleId = _capsuleIdCounter++;

        capsules[capsuleId] = Capsule({
            creator: msg.sender,
            encryptedMessage: _encryptedMessage,
            unlockTime: _unlockTime,
            isRevealed: false,
            title: _title,
            description: _description
        });

        userCapsules[msg.sender].push(capsuleId);

        emit CapsuleCreated(capsuleId, msg.sender, _unlockTime, _title);
        return capsuleId;
    }

    /**
     * @dev Reveals the message in a time capsule if the unlock time has passed
     * @param _capsuleId The ID of the capsule to reveal
     */
    function revealCapsule(uint256 _capsuleId) external view returns (string memory) {
        Capsule storage capsule = capsules[_capsuleId];
        require(capsule.creator != address(0), "Capsule does not exist");
        require(block.timestamp >= capsule.unlockTime, "Capsule is still locked");
        
        return capsule.encryptedMessage;
    }

    /**
     * @dev Updates a capsule's message before it's unlocked
     * @param _capsuleId The ID of the capsule to update
     * @param _newEncryptedMessage The new encrypted message
     */
    function updateCapsule(uint256 _capsuleId, string memory _newEncryptedMessage) external {
        Capsule storage capsule = capsules[_capsuleId];
        require(capsule.creator == msg.sender, "Only creator can update");
        require(!capsule.isRevealed, "Cannot update revealed capsule");
        require(block.timestamp < capsule.unlockTime, "Cannot update after unlock time");

        capsule.encryptedMessage = _newEncryptedMessage;
        emit CapsuleUpdated(_capsuleId);
    }

    /**
     * @dev Gets all capsules created by a specific address
     * @param _user The address to query
     */
    function getCapsulesByUser(address _user) external view returns (uint256[] memory) {
        return userCapsules[_user];
    }

    /**
     * @dev Gets details of a specific capsule
     * @param _capsuleId The ID of the capsule
     */
    function getCapsuleDetails(uint256 _capsuleId) external view returns (
        address creator,
        uint256 unlockTime,
        bool isRevealed,
        string memory title,
        string memory description
    ) {
        Capsule storage capsule = capsules[_capsuleId];
        require(capsule.creator != address(0), "Capsule does not exist");
        
        return (
            capsule.creator,
            capsule.unlockTime,
            capsule.isRevealed,
            capsule.title,
            capsule.description
        );
    }

    /**
     * @dev Checks if a capsule is ready to be revealed
     * @param _capsuleId The ID of the capsule to check
     */
    function isCapsuleReady(uint256 _capsuleId) external view returns (bool) {
        Capsule storage capsule = capsules[_capsuleId];
        require(capsule.creator != address(0), "Capsule does not exist");
        return block.timestamp >= capsule.unlockTime;
    }
}