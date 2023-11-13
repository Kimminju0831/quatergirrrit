# 팀명

![transparent](https://capsule-render.vercel.app/api?type=transparent&fontColor=04509f&text=QuarterGirit&height=150&fontSize=60&desc=쿼터기릿&descAlignY=75&descAlign=60)

<br>
</br>

# 📚 제출 타입 및 주제
<h3  align="center">[S타입] 디지털 취약 계층을 위한 One-stop 기차 예약 / 안내 서비스</h3>
<br>
</br>

api 중 배포할 경우 실행 환경에 따라 실행되지 않는 오류가 있어, 시연 영상은 localhost 포트 4280 번에서 진행하였음을 알립니다. 

아래는 배포 링크이지만, 실행 운영체제나 시간 / IP 주소에 따라 api 와 일부 기능이 동작하지 않을수도 있음을 알립니다.

https://green-pebble-0f3e30300.4.azurestaticapps.net/html/initial.html
<br>
</br>
# 💡 프로젝트 한 줄 설명
<br>
<p align="center">
🚀 디지털 취약계층 (노년층 등) 의 기차표 인터넷 발권 불편 문제를 해결하기 위해 ktx 공공 api 와 open ai 를 활용해 코레일의 원콜 서비스를 편리하게 제공
</p>
</br>


# 🔧 프로젝트에 활용된 기술
<h2>첫 번째, API</h2>
<h3>1️⃣ 국토교통부 열차 정보 API</h3>
<br>
<a href="https://ibb.co/LCqhmjL"><img src="https://i.ibb.co/mHYFkZL/ktx-api.png" alt="ktx-api" style="width:80%" border="0"></a>
</br>
<br>
<details>
<summary>상세 기술 명세서</summary>
<div markdown="1">
    
**웹 사이트 내에서 동작 방식**
1. 입력받은 출발 장소, 도착 장소에서 경유하는 역을 받음 (이거는 findroad 쪽)
2. 출발역, 도착역, 그리고 입력받은 시간을 파이썬 코드에 입력
    1. 입력받은 시간은 202311151200일 경우, 20231115 / 1200 으로 분리해서 들어감
3. DB에서 출발역, 도착역의 역 코드를 가져옴
4. 역 코드, 처리한 시간을 기반으로 공공 데이터 api에 ktx 노선만을 요청, 받아옴
    1. 받아온 데이터의 처리 형식
    
    ```python
    {
        'charge' : row.adultcharge.text,
        'departure' : row.depplacename.text,
        'deptime' : datetime.strptime(row.depplandtime.text, '%Y%m%d%H%M%S'),
        'arrival' : row.arrplacename.text,
        'arrtime' : datetime.strptime(row.arrplandtime.text, '%Y%m%d%H%M%S'),
        'trainname' : row.traingradename.text,
        'trainno' : row.trainno.text
    }
    ```
    
5. 이를 json 형태로 처리, 웹 사이트에 동적으로 테이블화 해서 나타냄  


**Python 내부 메소드 설명**
| 함수명 | 설명 |
| --- | --- |
| save_train(conn, cursor) | 열차 정보(열차 코드, 종류)를 DB에 저장 |
| save_city_code(conn, cursor) | 도시 코드를 DB에 저장 |
| save_one_station(conn, cursor, city_code, city_name) | city_code에 해당하는 도시의 모든 역을 조회, DB에 저장 |
| save_all_station(conn, cursor) | 모든 도시의 역을 DB에 저장 |
| get_ktx_car_num(conn, cursor) | ktx에 해당하는 열차 코드 배열을 반환 |
| get_schedule(dep, arr, cursor, date, time_str, train_codes) | dep: 출발역, arr: 도착역, date: YYYYMMDD, 조회를 시도하는 날짜, time_str: HHMMSS, 조회의 기준이 되는 시간, train_codes: 열차 종류 배열, dep과 arr 노선, date에 해당하는 모든 time_str 이후 train_codes 열차 조회, 시간 순 정렬 배열 반환. 배열 내부 정보는 dict로 저장 |  



**전역 변수 설정**
| 변수명 | 설명 |
| --- | --- |
| SERVICE_KEY | 공공데이터포털 API 서비스 키 |
| DB_URL | DB 접근 URL |
| PORT | DB 접근 포트 |
| DB_ID | DB 접근 ID |
| DB_PASSWORD | DB 접근 비밀번호 |
| DB_NAME | 사용하는 DB 이름 |  



</div>
</details>
<br>
<br>
<h3>2️⃣ TMAP 지오코딩 / 길찾기 API</h3>
<br>
<a href="https://ibb.co/5cN5xZ4"><img src="https://i.ibb.co/XJhzkHL/tmap-api.png" alt="tmap-api" style="width:80%" border="0"></a>
</br>
<br>
<details>
<summary>상세 기술 명세서</summary>
<div markdown="1">

### Tmap 지오코딩/길찾기 API

- 지오코딩 (REST / GET Method)
    
    request:
    
    version: api의 버전
    
    searchTypCd: 주소검색 방법(신주소/구주소)
    
    reqAdd: 출발지 또는 도착지 등의 장소명
    
    appKey: Tmap Appkey
    
    response:
    
    newLat: 위도 정보
    
    newLon: 경도 정보
    
- 길찾기
    
    request:
    
    startX: 출발지의 경도 정보
    
    startY: 출발지의 위도 정보
    
    endX: 도착지의 경도 정보
    
    endY: 도착지의 위도 정보
    
    response:
    
    totalTime: 총 소요시간
    
    totalDistance: 총 이동거리 (m)
    
    mode: 이동 수단 종류
    
    stationName: 경유하는 곳의 이름 (ex. 동대구역)

</div>
</details>
<br>
<h2>두 번째, 인공지능</h2>
<br>
<a href="https://ibb.co/3hKG4yJ"><img src="https://i.ibb.co/q16X7MZ/image.png" alt="image" style="width:80%" border="0"></a>
</br>
<br>
<br>
<details>
<summary>상세 기술 명세서</summary>
<div markdown="1">

## OpenAi

- dep: 출발역 , arr: 도착역, datetime: 출발시간
- ktx api로부터 위 변수를 전달받아 프롬프트 엔지니어링을 통해 원콜 서비스 전화 스크립트 생성 (생성형 AI)
- Model: GPT turbo 3.5
- request:
    - dep: 출발역
    - arr: 도착역
    - datetime: 출발 시간
    - model, key값, temperature값
- response:
    - message: 원콜 서비스 전화 스크립트

</div>
</details>
<br>
<h2>세 번째, 서버</h2>
<h3> <a href="https://ibb.co/rpYPd4h"><img src="https://i.ibb.co/B6bDnqJ/Microsoft-Azure.png" alt="Microsoft-Azure" border="0" style="width:20px;"></a>  Azure Static Web Apps</h3>

Azure App Service Static Web Apps is a streamlined hosting option for developers building modern full-stack JavaScript web apps on Azure. Static Web Apps is tailored for apps with static front-end and optional dynamic back-end powered by Azure Functions serverless APIs. Static Web Apps feature: 
* A single unified workflow based on GitHub actions from source code to global availability in the cloud
* Integrated serverless APIs powered by Azure Functions to extend and evolve your app 
* Authentication and Authorization with flexible role and access definitions
 
To get started, follow the [Static Web Apps quickstart](https://docs.microsoft.com/en-us/azure/static-web-apps/getting-started?WT.mc_id=staticwebapps-docs-cxa) to build and deploy your first static web app in minutes. For more info about Static Web Apps, see the [Static Web Apps documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/?WT.mc_id=build2020_swa-docs-cxa) and the guided learning paths in Microsoft Learn for [creating and publishing an Angular, React, Svelte, or Vue JavaScript app and API](https://docs.microsoft.com/en-us/learn/modules/publish-app-service-static-web-app-api/?WT.mc_id=build2020_swa-frameworks-cxa) or for [creating and publishing an app with the Gatsby static site generator](https://docs.microsoft.com/en-us/learn/modules/create-deploy-static-webapp-gatsby-app-service/?WT.mc_id=build2020_swa-sitegen-cxa).
<br>
<br>
<h3>Vanilla JavaScript App</h3>

[Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/overview) allows you to easily build JavaScript apps in minutes. Use this repo with the [quickstart](https://docs.microsoft.com/azure/static-web-apps/getting-started?tabs=vanilla-javascript) to build and customize a new static site.

This repo is used as a starter for a _very basic_ HTML web application using no front-end frameworks.

This repo has a dev container. This means if you open it inside a [GitHub Codespace](https://github.com/features/codespaces), or using [VS Code with the remote containers extension](https://code.visualstudio.com/docs/remote/containers), it will be opened inside a container with all the dependencies already installed.

<br>
<br>

<h3>👉🏻 Overview (한 눈에 보기) </h3>
<br>
<br>
<br>
<a href="https://ibb.co/hH8bhkF"><img src="https://i.ibb.co/wC6V3Th/tech-image.png" alt="tech-image" border="0" style="width:80%"></a>
</br>
<br>
<br>
<h3>✦ 개발 환경</h3>

- Python >= 3.10
  
- Node >= v16.xx.xx

- Windows / Mac OS

  
<br/>
<h3>✦ 설치 및 실행 방법</h3>

    // Azure static web app 설치
    npm install -g @azure/static-web-apps-cli

    // node 패키지 설치
    npm shrinkwrap
    npm install

    // 파이썬 모듈 설치
    pip install -r requirements.txt

    // 실행
    swa start src --api-location api
    
<br/>
<h3>✦ 주의사항</h3>
1. DB 접근, API 키 등 실행 과정에서 필요한 주요 변수를 수정할 필요가 있음.<br/><br/>
2. Windows와 Mac에 따라 python 코드 동작이 다르게 됨.<br/>


- Windows
    
    python ./ktx_schedule/ktx_api.py {변수들}


- Mac OS

    python3 ./ktx_schedule/ktx_api.py {변수들}


위와 같이 python을 기반으로 코드 수정이 OS에 맞게 이뤄져야 함.

<br>
</br>

# 💻 시연영상

### 🔥 데모 영상입니다.

[![Video Label](http://img.youtube.com/vi/Xy4zqhwjVgE/0.jpg)](https://youtu.be/Xy4zqhwjVgE)

<br>
</br>

# 🙆‍♀️ Team Info

| 김민주 | 김영효 | 이은지 | 최희정 |
| :---: | :---: | :---: | :---: |
| <a href="https://github.com/Kimminju0831"><img src="https://avatars.githubusercontent.com/u/71652881?v=4" alt="Kimminju0831" width="100" height="100"></a> | <a href="https://github.com/kkyh12180"><img src="https://avatars.githubusercontent.com/u/80297525?v=4" alt="kkyh12180" width="100" height="100"></a> | <a href="https://github.com/leeeeunji"><img src="https://avatars.githubusercontent.com/u/72423836?v=4" alt="leeeeunji" width="100" height="100"></a> | <a href="https://github.com/hdddhdd"><img src="https://avatars.githubusercontent.com/u/71762328?v=4" alt="hdddhdd" width="100" height="100"></a> |
| 팀장 [📨](mailto:nuly08@naver.com)| 팀원 [📨](mailto:kyh12180@gmail.com) | 팀원 [📨](mailto:leeej106@knu.ac.kr) | 팀원 [📨](mailto:nuly08@naver.com) |

