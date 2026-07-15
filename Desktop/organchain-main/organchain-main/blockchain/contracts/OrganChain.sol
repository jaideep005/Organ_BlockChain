// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract OrganChain {
    address[] public admins;
    mapping(address => bool) public isAdmin;
    bool public isHalted; // Multi-sig halt state
    uint256 public haltSignatures;
    mapping(address => bool) public hasVotedHalt;
    uint8 constant MAX_SUPPORTED_ORGANS = 8;

    struct PledgeRecord {
        bytes32 abhaHash;
        bytes32 documentHash;
        string ipfsCid;
        uint8 organBitmap;
        bytes witnessSignature;
        bool isMatched;
        address creator;
    }

    mapping(bytes32 => PledgeRecord) public pledges;

    event PledgeRegistered(bytes32 indexed abhaHash, string ipfsCid);
    event MatchExecuted(bytes32 indexed donorHash, bytes32 indexed recipientHash, uint8 organId);
    event ContractHalted();

    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Not an admin");
        _;
    }

    modifier notHalted() {
        require(!isHalted, "Contract is currently halted");
        _;
    }

    constructor(address[] memory _initialAdmins) {
        require(_initialAdmins.length >= 3, "Require at least 3 initial admins for 2/3 multi-sig");

        for (uint256 i = 0; i < _initialAdmins.length; i++) {
            require(_initialAdmins[i] != address(0), "Invalid admin address");
            require(!isAdmin[_initialAdmins[i]], "Duplicate admin");
            admins.push(_initialAdmins[i]);
            isAdmin[_initialAdmins[i]] = true;
        }
    }

    function registerPledge(
        bytes32 _abhaHash,
        bytes32 _documentHash,
        string memory _ipfsCid,
        uint8 _organBitmap,
        bytes memory _witnessSignature
    ) public notHalted {
        require(_abhaHash != bytes32(0), "Invalid ABHA hash");
        require(_documentHash != bytes32(0), "Invalid document hash");
        require(bytes(_ipfsCid).length > 0, "IPFS CID required");
        require(_witnessSignature.length > 0, "Witness signature required");
        require(_organBitmap != 0, "Invalid organ bitmap");
        require(pledges[_abhaHash].abhaHash == bytes32(0), "Pledge already exists for this ABHA hash");

        pledges[_abhaHash] = PledgeRecord({
            abhaHash: _abhaHash,
            documentHash: _documentHash,
            ipfsCid: _ipfsCid,
            organBitmap: _organBitmap,
            witnessSignature: _witnessSignature,
            isMatched: false,
            creator: msg.sender
        });

        emit PledgeRegistered(_abhaHash, _ipfsCid);
    }

    function executeMatch(bytes32 _donorHash, bytes32 _recipientHash, uint8 _organId) public onlyAdmin notHalted {
        // Basic checks
        require(_donorHash != _recipientHash, "Donor and recipient cannot be the same");
        require(pledges[_donorHash].abhaHash != bytes32(0), "Donor pledge does not exist");
        require(pledges[_recipientHash].abhaHash != bytes32(0), "Recipient pledge does not exist");
        require(!pledges[_donorHash].isMatched, "Donor organ already matched");
        require(!pledges[_recipientHash].isMatched, "Recipient already matched");

        // Ensure organBitmap has the organId bit set
        require(_organId < MAX_SUPPORTED_ORGANS, "Invalid organ ID");
        require((pledges[_donorHash].organBitmap & (1 << _organId)) != 0, "Donor did not pledge this organ");
        require((pledges[_recipientHash].organBitmap & (1 << _organId)) != 0, "Recipient not registered for this organ");

        // Update status
        pledges[_donorHash].isMatched = true;
        pledges[_recipientHash].isMatched = true;

        emit MatchExecuted(_donorHash, _recipientHash, _organId);
    }

    // 2/3 Multi-sig Halt Mechanism
    function voteHalt() public onlyAdmin {
        require(!isHalted, "Already halted");
        require(!hasVotedHalt[msg.sender], "Admin already voted to halt");

        hasVotedHalt[msg.sender] = true;
        haltSignatures++;

        // Require 2/3 of admins to halt.
        if (haltSignatures * 3 >= admins.length * 2) {
            isHalted = true;
            emit ContractHalted();
        }
    }
}
