//編譯指令
//solcjs -o ../migrate --bin --abi uma.sol
pragma solidity ^0.5.2;

contract Resource_management_uma {
    address public owner;

    struct ResourceSet{
        uint registerTime;
        string name;
        string scope;
    }

    mapping(address => bool) resourceServers; //增加resource server註冊resource set的權限
    mapping(bytes32 => ResourceSet) resources;

    event resourceServerAdd(address newParticipant);
    event addedResourceSet(uint registerTime,string name,bytes32 identifier);


    modifier isResourceServer(address _account) {
        require(resourceServers[_account] == true,"account forbidden");
        _;
    }

    constructor() public{
        owner=msg.sender;
        resourceServers[owner]=true;
    }

    //第二步， 註冊後的resource server開始註冊其需要被保護的資源
    function register_service(string memory _name,string memory _scope) public isResourceServer(msg.sender) returns(bytes32) {
        bytes32 identifier = (keccak256(abi.encodePacked(now, _name, _scope)));
        resources[identifier] = ResourceSet(now, _name, _scope);
        emit addedResourceSet(now, _name, identifier);
        return identifier;
    }

    function delete_resource() public isResourceServer(msg.sender){

    }

    //由於區塊鏈中iot之身存有私鑰，故在這裡以resource owner在智能合約中註冊iot的身分，替代PAT的發送
    function addResourceServer(address _newResourceServer) public returns(bool){
        require(msg.sender == owner,"Access deny");//only creator can access
        require(_newResourceServer != address(0));
        resourceServers[_newResourceServer] = true;
        emit resourceServerAdd(_newResourceServer);
        return true;
    }

}



contract Authorization_uma {
    function generate_ticket() public{

    }

    function release_token() public{

    }

    function set_policy() public{

    }

    function revise_policy() public{

    }
}