//這個合約還沒經過但測試，修改token過期時間之檢查
//編譯指令
//solcjs -o ../migrate --bin --abi uma20191218.sol
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
    function registerResourceSet(string memory _name,string memory _scope) public isResourceServer(msg.sender) returns(bytes32) {
        bytes32 identifier = (keccak256(abi.encodePacked(now, _name, _scope)));
        resources[identifier] = ResourceSet(now, _name, _scope);
        identifierCheck[identifier] = true;
        emit addedResourceSet(now, _name, identifier);
        return identifier;
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
    
    function checkScope(bytes32 _identifier) public view returns(string memory){
        return resources[_identifier].scope;
    }
    
    function checkName(bytes32 _identifier) public view returns(string memory){
        return resources[_identifier].name;
    }
    
    function checkReresourceServer(address _resourceServer
    ) public view returns(bool){
        return resourceServers[_resourceServer];
    }
    
}



contract Authorization_contract {
    address public resourceOwner;
    address public RM_Address;
    //uint public random_number; //private
  
    mapping(bytes32 => bool) participantsOfIdentifier;
    mapping(address => bytes32) access_token;
    mapping(bytes32 => Policy_info) policies; //不同的identifier 應該要對應到不同的claim_info
    mapping(bytes32 => bytes32) ticket_identifier; //ticket => identifier
    mapping(bytes32 => bytes32)token_identifier;
    mapping(bytes32 => uint)token_vaildTime;
    
    event participantAdd(bytes32 identifier,address newParticipant);
    event tokenRelease(address msg_sender,bytes32 access_token,uint iat, uint exp);
    event ticket_generated(bytes32 identifier, bytes32 ticket, address msg_sender,string claim_hint,bool isParticipant);
    event introspectEvent(bytes32 indexed identifier,string scope,address rqpAddress);
    event introspectFailed(string condition);
    
    struct Policy_info{
        string claim;  //Claim：用來比對rqp所傳的claim是否與設定的相同
        string hint;    //Hint:若claim收集未完整時，需要給相對的提示
        string scope;
        bool isSet;
        mapping(string => bool)scopes; //透過mapping的方法將scope分別對應到true或false
       // address participant;  //participant: 最高權限使用者
    }
    
    constructor(address _RM_Address) public{
        resourceOwner=msg.sender;
        RM_Address = _RM_Address;
    }
    
    //set policy
    //step3: resource owner利用identifier註冊policy至authorization contract
    function setParticipantOfIdentifier(bytes32 _identifier,address _address) public{
        require(msg.sender == resourceOwner,"Access deny, not resourceOwner");//only creator can access
        bytes32 _hash= (keccak256(abi.encodePacked(_identifier, _address))) ;
        participantsOfIdentifier[_hash]= true;
        emit participantAdd(_identifier,_address);
    }
    
    //step3: the user can set the policy such as hint , claim
    function setPolicy(bytes32 _identifier,string memory _claim,string memory _hint) public returns(bool) {
        Resource_management_contract rm = Resource_management_contract(RM_Address);
        require(rm.checkIdentifier(_identifier) == true ,"identifier or account invaild");
        require(msg.sender == resourceOwner,"Access deny, not owner"); //only creator can access
        string memory _scope_ = rm.checkScope(_identifier);
        policies[_identifier] = Policy_info(_claim, _hint,_scope_,true);
        return true;
    }
    
    //a little wird
    function setScopeIndividual(bytes32 _identifier, string memory _scope) public returns(bytes32){
        Resource_management_contract rm = Resource_management_contract(RM_Address);
        require(rm.checkIdentifier(_identifier) == true ,"identifier or account invaild");
        require(msg.sender == resourceOwner,"Access deny, not owner"); //only creator can access
        Policy_info storage PI = policies[_identifier];
        PI.scopes[_scope] = true;
        return _identifier;
    }

    //step5 resource server向contract請求ticket
    function requestPermission(bytes32 _identifier,address _rqpAddress) public{
        Resource_management_contract rm = Resource_management_contract(RM_Address);
        Policy_info storage PI = policies[_identifier];
        //要先檢查msg.sender(resource server)與identifier是否存在
        require(rm.checkIdentifier(_identifier) == true &&  rm.checkReresourceServer(msg.sender) == true ,"identifier or account invaild");
        require(PI.isSet == true, "The policy has not been set");
        bytes32 ticket = (keccak256(abi.encodePacked(now, msg.sender, _identifier))) ;
        bool isParticipant = false;
        bytes32 checkParticipantHash = keccak256(abi.encodePacked(_identifier, _rqpAddress));
        if(participantsOfIdentifier[checkParticipantHash] == true){
            isParticipant = true; 
        }
        
        //用ticket mapping到identifier 以利查詢ticket是要對應到什麼resource
        ticket_identifier[ticket] = _identifier;
        emit ticket_generated(_identifier, ticket,msg.sender, PI.hint,isParticipant);
    }
    
    //step8 智能合約驗證過後，將ticket交換成token，並透過event回傳至cilent
    function requestAccessToken(bytes32 _ticket, string memory _claim) public {
        //ticket mapping到identifier 以查詢ticket是要對應到什麼resource
        require(ticket_identifier[_ticket] != 0, "invaild ticket");
        Policy_info storage PI = policies[ticket_identifier[_ticket]];
        bytes32 checkParticipantHash = keccak256(abi.encodePacked(ticket_identifier[_ticket], msg.sender)); //identifier,rqpAddress
        if(participantsOfIdentifier[checkParticipantHash] == true){
            uint random_number = uint(keccak256(abi.encodePacked(block.timestamp)))%100 +1;
            access_token[msg.sender] = (keccak256(abi.encodePacked(now, msg.sender, random_number))) ;
            token_identifier[access_token[msg.sender]] = ticket_identifier[_ticket];
            token_vaildTime[access_token[msg.sender]] = now+ 1 days;
            delete ticket_identifier[_ticket];//發布token後刪除ticket
            emit tokenRelease(msg.sender, access_token[msg.sender],now,token_vaildTime[access_token[msg.sender]]);
        }
        else if((keccak256(abi.encodePacked(PI.claim))) == (keccak256(abi.encodePacked(_claim)))){ //(keccak256(abi.encodePacked(PI.claim)))
            // Token透過msg.sender/timestamp/random number/隨機生成
            uint random_number = uint(keccak256(abi.encodePacked(block.timestamp)))%100 +1;
            access_token[msg.sender] = (keccak256(abi.encodePacked(now, msg.sender, random_number))) ;
            token_identifier[access_token[msg.sender]] = ticket_identifier[_ticket];
            token_vaildTime[access_token[msg.sender]] = now+ 1 days;
            delete ticket_identifier[_ticket];//發布token後刪除ticket
            emit tokenRelease(msg.sender, access_token[msg.sender],now,token_vaildTime[access_token[msg.sender]] );
        }else{
            require( 0==1 , "invaild claim");
        }
    }
    
    //step9: introspectAccessToken，用來檢查rqp所傳送之token是否正確
    function introspectAccessToken(
        bytes32 _token,
        uint8 _v,
        bytes32 _r,
        bytes32 _s) public view returns(bool){
        require(_token != 0, "invaildToken");
        require(token_identifier[_token] !=0,"invaildToken");
        
        //檢查token是否已經過期
        if(now > token_vaildTime[_token]){
            //emit introspectFailed("token expire");
            return false;
        }
        
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        address signer = ecrecover(
            (keccak256(abi.encodePacked(prefix,_token))),
            _v, _r, _s
        );
        
        if(access_token[signer] != 0 && access_token[signer] == _token){
           //Policy_info storage PI = policies[token_identifier[_token]];
           //emit introspectEvent(token_identifier[_token],PI.scope,msg.sender);
           return true;
           //event introspectEvent(bytes32 indexed identifier,string scope,address rqpAddress,uint iat, uint exp);
        }else{
           //require(1 == 0, "invaild_signer");
           //invaild_signer
           return false;
        }
    }
    
    function checkIdentifierByToken(bytes32 _token) public view returns(bytes32){
        require(token_identifier[_token] != 0 ,"token invaild");
        return token_identifier[_token];
    }
    
    function checkScopeByIdentifier(bytes32 _identifier,string memory _scope) public view returns(bool){
        Resource_management_contract rm = Resource_management_contract(RM_Address);
        require(rm.checkIdentifier(_identifier) == true ,"identifier or account invaild");
        Policy_info storage PI = policies[_identifier];
        return PI.scopes[_scope];
    }
}