// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// ============================================================
// LOST AND FOUND SMART CONTRACT
// Deploy this in Remix IDE (remix.ethereum.org)
// Connect to Ganache local blockchain
// ============================================================

contract LostAndFound {

    // ---- STRUCTS ----
    struct Item {
        uint256 itemId;
        address poster;
        string itemType;       // "lost" or "found"
        string name;
        string category;
        string description;
        string location;
        string dateLost;
        string imagePath;      // stored in XAMPP, path only
        string personName;
        string mobile;
        bool isResolved;
        uint256 timestamp;
    }

    struct ClaimRequest {
        uint256 claimId;
        uint256 itemId;
        address claimant;
        string claimerName;
        string claimerMobile;
        string proofImagePath;  // stored in XAMPP, path only
        string status;          // "pending", "approved", "rejected"
        uint256 timestamp;
    }

    struct Feedback {
        uint256 feedbackId;
        address user;
        string message;
        uint256 rating;
        uint256 timestamp;
    }

    // ---- STATE VARIABLES ----
    address public admin;
    uint256 public itemCounter;
    uint256 public claimCounter;
    uint256 public feedbackCounter;

    mapping(uint256 => Item) public items;
    mapping(uint256 => ClaimRequest) public claims;
    mapping(uint256 => Feedback) public feedbacks;
    mapping(address => bool) public registeredUsers;
    mapping(address => string) public userNames;
    mapping(address => string) public userMobiles;

    // ---- EVENTS ----
    event ItemPosted(uint256 itemId, address poster, string itemType, string name);
    event ClaimSubmitted(uint256 claimId, uint256 itemId, address claimant);
    event ClaimUpdated(uint256 claimId, string status);
    event ItemResolved(uint256 itemId);
    event UserRegistered(address user, string name);
    event FeedbackPosted(uint256 feedbackId, address user);

    // ---- MODIFIERS ----
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyRegistered() {
        require(registeredUsers[msg.sender], "User not registered");
        _;
    }

    // ---- CONSTRUCTOR ----
    constructor() {
        admin = msg.sender;
        registeredUsers[admin] = true;
        userNames[admin] = "Admin";
    }

    // ---- USER FUNCTIONS ----

    function registerUser(string memory _name, string memory _mobile) public {
        require(!registeredUsers[msg.sender], "Already registered");
        registeredUsers[msg.sender] = true;
        userNames[msg.sender] = _name;
        userMobiles[msg.sender] = _mobile;
        emit UserRegistered(msg.sender, _name);
    }

    function updateProfile(string memory _name, string memory _mobile) public onlyRegistered {
        userNames[msg.sender] = _name;
        userMobiles[msg.sender] = _mobile;
    }

    // ---- ITEM FUNCTIONS ----

    function postItem(
        string memory _itemType,
        string memory _name,
        string memory _category,
        string memory _description,
        string memory _location,
        string memory _dateLost,
        string memory _imagePath,
        string memory _personName,
        string memory _mobile
    ) public onlyRegistered returns (uint256) {
        itemCounter++;
        items[itemCounter] = Item({
            itemId: itemCounter,
            poster: msg.sender,
            itemType: _itemType,
            name: _name,
            category: _category,
            description: _description,
            location: _location,
            dateLost: _dateLost,
            imagePath: _imagePath,
            personName: _personName,
            mobile: _mobile,
            isResolved: false,
            timestamp: block.timestamp
        });
        emit ItemPosted(itemCounter, msg.sender, _itemType, _name);
        return itemCounter;
    }

    function updateItem(
        uint256 _itemId,
        string memory _name,
        string memory _category,
        string memory _description,
        string memory _location,
        string memory _dateLost,
        string memory _imagePath
    ) public onlyRegistered {
        require(items[_itemId].poster == msg.sender, "Not your post");
        require(!items[_itemId].isResolved, "Item already resolved");
        items[_itemId].name = _name;
        items[_itemId].category = _category;
        items[_itemId].description = _description;
        items[_itemId].location = _location;
        items[_itemId].dateLost = _dateLost;
        items[_itemId].imagePath = _imagePath;
    }

    function deleteItem(uint256 _itemId) public onlyRegistered {
        require(items[_itemId].poster == msg.sender || msg.sender == admin, "Not authorized");
        delete items[_itemId];
    }

    function resolveItem(uint256 _itemId) public {
        require(items[_itemId].poster == msg.sender || msg.sender == admin, "Not authorized");
        items[_itemId].isResolved = true;
        emit ItemResolved(_itemId);
    }

    function getItem(uint256 _itemId) public view returns (Item memory) {
        return items[_itemId];
    }

    function getTotalItems() public view returns (uint256) {
        return itemCounter;
    }

    // ---- CLAIM FUNCTIONS ----

    function submitClaim(
        uint256 _itemId,
        string memory _claimerName,
        string memory _claimerMobile,
        string memory _proofImagePath
    ) public onlyRegistered returns (uint256) {
        require(items[_itemId].itemId != 0, "Item does not exist");
        require(!items[_itemId].isResolved, "Item already resolved");
        require(items[_itemId].poster != msg.sender, "Cannot claim your own post");

        claimCounter++;
        claims[claimCounter] = ClaimRequest({
            claimId: claimCounter,
            itemId: _itemId,
            claimant: msg.sender,
            claimerName: _claimerName,
            claimerMobile: _claimerMobile,
            proofImagePath: _proofImagePath,
            status: "pending",
            timestamp: block.timestamp
        });
        emit ClaimSubmitted(claimCounter, _itemId, msg.sender);
        return claimCounter;
    }

    function updateClaimStatus(uint256 _claimId, string memory _status) public onlyAdmin {
        require(claims[_claimId].claimId != 0, "Claim does not exist");
        claims[_claimId].status = _status;
        if (keccak256(bytes(_status)) == keccak256(bytes("approved"))) {
            items[claims[_claimId].itemId].isResolved = true;
        }
        emit ClaimUpdated(_claimId, _status);
    }

    function getClaim(uint256 _claimId) public view returns (ClaimRequest memory) {
        return claims[_claimId];
    }

    function getTotalClaims() public view returns (uint256) {
        return claimCounter;
    }

    // ---- FEEDBACK FUNCTIONS ----

    function postFeedback(string memory _message, uint256 _rating) public onlyRegistered {
        require(_rating >= 1 && _rating <= 5, "Rating must be 1-5");
        feedbackCounter++;
        feedbacks[feedbackCounter] = Feedback({
            feedbackId: feedbackCounter,
            user: msg.sender,
            message: _message,
            rating: _rating,
            timestamp: block.timestamp
        });
        emit FeedbackPosted(feedbackCounter, msg.sender);
    }

    function getFeedback(uint256 _feedbackId) public view returns (Feedback memory) {
        return feedbacks[_feedbackId];
    }

    function getTotalFeedbacks() public view returns (uint256) {
        return feedbackCounter;
    }

    // ---- ADMIN FUNCTIONS ----

    function getAllUsers() public view onlyAdmin returns (address[] memory) {
        // Note: In a real app you'd track all addresses in an array
        // This is simplified - use events to track users off-chain
        address[] memory empty = new address[](0);
        return empty;
    }

    function isAdmin(address _addr) public view returns (bool) {
        return _addr == admin;
    }

    function isRegistered(address _addr) public view returns (bool) {
        return registeredUsers[_addr];
    }
}
