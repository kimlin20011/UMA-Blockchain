pragma solidity ^0.5.2;
contract Authorization_contract {
    
    address public resourceOwner;
    address public RM_Address;
    address[] previousRM_address;
    
    constructor(address _RM_Address) public{
        resourceOwner=msg.sender;
        RM_Address = _RM_Address;
    }
    
    function changeRM(address _RM_Address, address _new_RM_address) public 
    returns(address){
        require(resourceOwner == msg.sender, "Access deny, not resourceOwner");
        require(_RM_Address == RM_Address,"invaild RM_Address");
        RM_Address = _new_RM_address;
        previousRM_address.push(_RM_Address);
        return _new_RM_address;
    }
}
