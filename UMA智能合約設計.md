# UMA智能合約設計

## 簡介 UMA Blockchain的使用範圍為大部分節點都需要先有
- 一組私鑰(RO, resource server RqP)

## note
* 目前實作地址
    * RM_contract:0xd16f826bacf40f79f3bcc61f17ce2b5d56e019b6
    * Authorization_contract : 0x429edcd3502a4108552c16188a6bcb05deed4456

## Resource set
## resource server端細項

- 過程中要記得的值
    - Identifier
    - Resource server的私鑰

## client端細項
- client端必須要事先知道Authorization contract的ABI
- 由於區塊鏈的公開透明性，事先知道abi具有相對應的可行性

## resource management contract
- resource owner 負責部署
- resource owner 負責加入resource server之權限

## Authorization contract

## 每個步驟詳細細節與

### 第一步，在智能合約中註冊resource server
- participants
    - 增加resource server註冊resource set 的權限

- PAT目的
    - 用來識別resource server需要被AS保護的範圍，並用來管理註冊的resource，ticket與token內部檢查等等

- 在B-UMA中替代方案
    - 由於區塊鏈中iot之身存有私鑰，故在這裡以resource owner在智能合約中註冊iot的身分，替代PAT的發送

### 第二步， 註冊後的resource server開始註冊其需要被保護的資源（resource set）

- Resource set：註冊要被保護資料的內容，包含
    - Name
    - Scope : 例如： post - update，read- public
- 回傳id: 在智能合約中這個受保護的resoure set所代表的指標
    - 做法：將註冊時間，resource名字，scope hash過後，得到identifier，之後resource owner可以用這個identifier去註冊對應的policy，或取得對應的ticket等等····
- 合約預設scope
    - 擁有對應公鑰的人：有權力更新resource
    - 擁有對應claim的人：有權力存取protected resource
    - 什麼都沒有的人：有權力存取public resource

### 第三步：resource owner利用identifier註冊policy至authorization contract
- 擁有對應私鑰的人(participant)可以update resource
- 持有相對應claim的人可以查看protected resource
    - 使用mapping方式設定claim
- 如果什麼都沒有的人，可以查看public resource
- 選擇對應resource managed合約中的identity
- 在policy設定中，不同的identifier 應該要對應到不同的Policy_info
    - RO需要在設定policy是挑選特定的info去做設定
    - claim_info為一個struct，裡面包含了一個claim與hit，其中皆為在設定時需要設定
        - Hint:若claim收集未完整時，需要給相對的提示
        - Claim：用來比對rqp所傳的claim是否與設定的相同
        - participant: 最高權限使用者
- 註冊的時候要檢查RM contract是否有對應的identifier

### 第四部： rqp向resource server發出資料請求（無帶任何狀態或參數）
- Resource server使用identifier向智能合約求取ticket
- ticket代表這次請求
- 智能合約要確定，請求ticket的事resource server的身分

### 第五步：resource server向contract請求ticket
- 理由
    - 這一步一方面代表contract 以RO的身分授權這一次的請求，一方面要檢查請求是否是先經由resource server經手而非惡意第三方發送。
- 如果沒有resource server經手過會怎麼樣？
    - 主要是因為此時rqp-client還不知道contract的正確位置，需要以resource server來經手
    - 要將每一次的請求區分
    - resource不儲存ticket也不儲存claim
- Ticket:
    - 可以設定日期並拋棄
    - 以timestamp，msg.sender address，identifier 值雜湊hash
    - 用ticket mapping到identifier 以利查詢ticket是要對應到什麼resource
- 要先檢查msg.sender(resource server)與identifier是否存在

### 第六步：resource server將client address，identifier, ticket, hint,傳回client

### 第七步（尚未實作） ： client收到hint之後，依據hint的提示收集相對應的資料，並透過client講收集的資料，ticket，claim，回傳給智能合約驗證

### 第八部(release_token)：智能合約驗證過後，將ticket交換成token，並透過event回傳至cilent
- 會遇到一個問題：知道智能合約的人，大家都可以挖出所有的token看？
    - token使用msg,sender資料做mapping儲存？
        - 放在區塊鏈上是透明的，但是token是不可以洩漏給別人的
        - 解決方法：要token要經過rqp簽章才能使用
- Token透過msg.sender/timestamp/random number/隨機生成
- Claim的比較方法
    - 透過智能合約中，將string利用keccak256過後在做比較
### 第九步：introspectAccessToken，用來檢查rqp所傳送之token是否正確
- 當resource server收到簽名過後的access token之後，要向智能合約確認access token是rqp所擁有，所以講簽章過後的密文，分割成v,r,s送至智能合約還原成簽章人
- 最後透過mapping查詢簽章人的token與簽名過後的token是否相符
- 保持原則：
    - Resource server不需要持有token
    - Resource server不需要知道rqp與RO之身分
    - Resource server不需要持有ticket
- 使用web3.personal.sign加密的話，智能合約在ecrecover中一定要有prefix，message關鍵字


###### tags: `OAuth2`

