import requests
import os
import json
import sys

def add2gird(address) :
    # address = '경기도 성남시 분당구 판교로 264'
    url = f'''https://apis.openapi.sk.com/tmap/geo/convertAddress?version=1&searchTypCd=NtoO&reqAdd={address}&reqMulti=S&resCoordType=WGS84GEO'''

    headers = {
        "accept": "application/json",
        "appKey": "e8wHh2tya84M88aReEpXCa5XTQf3xgo01aZG39k5"
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200 :
        json_data = response.text
        add_dict = json.loads(json_data)
        # print(add_dict)
        # 위도 정보
        latitude = add_dict['ConvertAdd']['newAddressList']['newAddress'][0]['newLat']
        # 경도 정보
        longitude = add_dict['ConvertAdd']['newAddressList']['newAddress'][0]['newLon']
        
        result_dict = {}
        result_dict['address'] = address
        result_dict['lat'] = latitude
        result_dict['lon'] = longitude

        json_string = json.dumps(result_dict)
        print(json_string)
    
if __name__ == "__main__" :
    address = sys.argv[1]
    add2gird(address)