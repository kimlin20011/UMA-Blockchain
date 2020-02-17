pragma solidity ^0.5.2;
contract Authorization_contract {
    
    address public resourceOwner;
    mapping(bytes32 => bool) isParticipantsOfIdentifier;
    
    constructor() public{
        resourceOwner=msg.sender;
    }
    
        //step3: resource owner利用identifier註冊policy至authorization contract
    function setParticipantOfIdentifier(bytes32 _identifier,address _address) public{
        require(msg.sender == resourceOwner,"Access deny, not resourceOwner");//only creator can access
        bytes32 _hash= (keccak256(abi.encodePacked(_identifier, _address))) ;
        isParticipantsOfIdentifier[_hash]= true;
    }
    
    
    modifier isParticipantOfIdentifier(bytes32 _identifier, address _rqpAddress) {
        bytes32 hash = keccak256(abi.encodePacked(_identifier, _rqpAddress));
        require(isParticipantsOfIdentifier[hash] == true, "not vaild account");
        _;
    }
    
    function generateTicket(bytes32 _identifier,address _rqpAddress) public isParticipantOfIdentifier(_identifier, _rqpAddress){
        // ...code
    }
}