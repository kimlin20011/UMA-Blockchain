//編譯指令
//solcjs -o ../migrate --bin --abi uma.sol
pragma solidity ^0.5.2;

contract Resource_management_contract {
    address public owner;

    struct ResourceSet{
        uint registerTime;
        string name;
        string scope;
    }

    mapping(address => bool) resourceServers; //增加resource server註冊resource set的權限
    mapping(bytes32 => ResourceSet) resources;
    mapping(bytes32 => bool) identifierCheck;

    event resourceServerAdd(address newResourceServer);
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
        identifierCheck[identifier] = true;
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

    function checkIdentifier(bytes32 _identifier) public view returns(bool){
        return identifierCheck[_identifier];
    }

    function checkReresourceServer(address _resourceServer) public view returns(bool){
        return resourceServers[_resourceServer];
    }

}



contract Authorization_contract {
    address public resourceOwner;
    address public RM_Address;
    uint public random_number; //private

    event participantAdd(address newParticipant);

    mapping(address => bool) participants;
    mapping(address => bytes32) access_token;
    mapping(bytes32 => Policy_info) policies; //不同的identifier 應該要對應到不同的claim_info
    mapping(bytes32 => bytes32) tickets; //ticket => identifier

    event tokenRelease(address msg_sender,bytes32 access_token);
    event ticket_generated(bytes32 identifier, bytes32 ticket, address msg_sender,string claim_hint);
    // event claimVerifyResult();

    struct Policy_info{
        string claim;  //Claim：用來比對rqp所傳的claim是否與設定的相同
        string hint;    //Hint:若claim收集未完整時，需要給相對的提示
        // address participant;  //participant: 最高權限使用者
    }

    modifier isParticipant(address _account) {
        require(participants[_account] == true,"account forbidden");
        _;
    }

    constructor(address _RM_Address) public{
        resourceOwner=msg.sender;
        RM_Address = _RM_Address;
        participants[resourceOwner]=true;
    }

    //set policy
    //step3: resource owner利用identifier註冊policy至authorization contract
    function setParticipant(address _address) public{
        require(msg.sender == resourceOwner,"Access deny, not resourceOwner");//only creator can access
        participants[_address]= true;
        emit participantAdd(_address);
    }

    //step3: the user can set the policy such as hint , claim
    function setPolicy(bytes32 _identifier,string memory _claim,string memory _hint) public returns(bool) {
        require(msg.sender == resourceOwner,"Access deny, not owner"); //only creator can access
        policies[_identifier] = Policy_info(_claim, _hint);
        return true;
    }

    //step5 resource server向contract請求ticket
    function generate_ticket(bytes32 _identifier) public{
        Resource_management_contract rm = Resource_management_contract(RM_Address);
        //要先檢查msg.sender(resource server)與identifier是否存在
        require(rm.checkIdentifier(_identifier) == true &&  rm.checkReresourceServer(msg.sender) == true ,"identifier or account invaild");
        bytes32 ticket= (keccak256(abi.encodePacked(now, msg.sender, _identifier))) ;
        //用ticket mapping到identifier 以利查詢ticket是要對應到什麼resource
        tickets[ticket] = _identifier;
        Policy_info storage PI = policies[_identifier];

        emit ticket_generated(_identifier, ticket,msg.sender, PI.hint);
    }

    //step8 智能合約驗證過後，將ticket交換成token，並透過event回傳至cilent
    function release_token(bytes32 _ticket, string memory _claim) public returns(bool) {
        //ticket mapping到identifier 以查詢ticket是要對應到什麼resource
        require(tickets[_ticket] != 0, "invaild_ticket");
        Policy_info storage PI = policies[tickets[_ticket]];
        //(keccak256(abi.encodePacked(PI.claim)))
        if((keccak256(abi.encodePacked(PI.claim))) == (keccak256(abi.encodePacked(_claim)))){
            // Token透過msg.sender/timestamp/random number/隨機生成
            random_number = uint(keccak256(abi.encodePacked(block.timestamp)))%100 +1;
            access_token[msg.sender] = (keccak256(abi.encodePacked(now, msg.sender, random_number))) ;
            emit tokenRelease(msg.sender, access_token[msg.sender]);
            return true;
        }else{
            return false;
        }
    }

    //step9: introspectAccessToken，用來檢查rqp所傳送之token是否正確
    function introspectAccessToken(
        bytes32 _token,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) public view returns(address){
        require(_token != 0, "invaild_signedToken");

        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        address signer = ecrecover(
            (keccak256(abi.encodePacked(prefix,_token))),
            _v, _r, _s
        );

        if(access_token[signer] != 0 && access_token[signer] == _token){
            return signer;
        }else{
            return signer;
        }

    }
}