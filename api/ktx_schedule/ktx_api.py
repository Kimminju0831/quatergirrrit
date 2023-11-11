# -*- coding: utf-8 -*-

import requests
import bs4
import pymysql
import sys
import json
from datetime import datetime

######################################## Change these variables ########################################
SERVICE_KEY = 'xDhD67tm+ztLeTKXUd/2gTYy8d+KUCSIR8ejj+vxdhdWdNqEjDEvkxYv1anr1qv16UoabjXKFu9mbebwg/Xvwg=='
DB_URL = 'ktxdata.mysql.database.azure.com'
DB_ID = 'getit'
DB_PASSWORD = 'daegu2023!'
PORT = 3306
DB_NAME = 'ktx_plan'
########################################################################################################


def save_all_station(conn, cursor) :
    sql = 'SELECT * FROM city;'
    cursor.execute(sql)
    city_table = cursor.fetchall()

    # print(city_table)

    for city in city_table :
        print(city[0], city[1])
        save_one_station(conn, cursor, int(city[0]), city[1])

def save_one_station(conn, cursor, city_code, city_name) :
    url = 'http://apis.data.go.kr/1613000/TrainInfoService/getCtyAcctoTrainSttnList'
    params ={'serviceKey' : SERVICE_KEY, 'pageNo' : '1', 'numOfRows' : '100', '_type' : 'xml', 'cityCode' : city_code }

    response = requests.get(url, params=params)
    content = response.text
    
    # print(content)

    # xml parsing
    xml_obj = bs4.BeautifulSoup(content,'lxml-xml')
    rows = xml_obj.findAll('item')
    # print(rows)

    # get all infos, save stations in db
    for row in rows : 
        nodeid = row.nodeid.text
        nodename = row.nodename.text

        print(city_code, nodeid, nodename)
        sql = f'''INSERT INTO station (node_id, station_name, city_name) VALUES ("{nodeid}", "{nodename}", "{city_name}");'''
        cursor.execute(sql)
    
    conn.commit()

def save_train(conn, cursor) :

    url = 'http://apis.data.go.kr/1613000/TrainInfoService/getVhcleKndList'
    params ={'serviceKey' : SERVICE_KEY, '_type' : 'xml' }

    response = requests.get(url, params=params) 
    content = response.text
    # print(content)

    xml_obj = bs4.BeautifulSoup(content,'lxml-xml')
    rows = xml_obj.findAll('item')

    for row in rows : 
        train_code = row.vehiclekndid.text
        train_name = row.vehiclekndnm.text
        
        # print(train_code, train_name)
        sql = f'''INSERT INTO train (train_id, train_name) VALUES ("{train_code}", "{train_name}");'''
        cursor.execute(sql)

    conn.commit()

def save_city_code(conn, cursor) :
    url = 'http://apis.data.go.kr/1613000/TrainInfoService/getCtyCodeList'
    params ={'serviceKey' : SERVICE_KEY, '_type' : 'xml' }

    response = requests.get(url, params=params)
    content = response.text
    
    # print(content)

    xml_obj = bs4.BeautifulSoup(content,'lxml-xml')
    rows = xml_obj.findAll('item')

    for row in rows : 
        city_code = row.citycode.text
        city_name = row.cityname.text
        
        # print(city_code, city_name)
        sql = f'''INSERT INTO city (city_code, city_name) VALUES ("{city_code}", "{city_name}");'''
        cursor.execute(sql)

    conn.commit()

def get_ktx_car_num(cursor) :
    sql = f'''SELECT train_id FROM train WHERE train_name LIKE "%KTX%";'''
    cursor.execute(sql)
    train_sql_table = cursor.fetchall()
    train_table = []

    # Separate result
    for train_sql in train_sql_table :
        train_table.append(train_sql[0])

    # print(train_table)
    return train_table

def get_schedule(dep, arr, cursor, date, time_str, train_codes) :
    # Get station id
    sql = f'''SELECT node_id, station_name FROM station WHERE station_name LIKE "%{dep}%";'''
    cursor.execute(sql)
    dep_code = cursor.fetchone()[0]

    # print(dep_code)

    sql = f'''SELECT node_id, station_name FROM station WHERE station_name LIKE "%{arr}%";'''
    cursor.execute(sql)
    arr_code = cursor.fetchone()[0]

    datewithtime = ''.join([date, time_str])
    std_date = datetime.strptime(datewithtime, '%Y%m%d%H%M%S')
    # print(std_date)

    schedule_array = []
    start = 1

    for train_code in train_codes :
        url = 'http://apis.data.go.kr/1613000/TrainInfoService/getStrtpntAlocFndTrainInfo'
        params ={'serviceKey' : SERVICE_KEY, 'pageNo' : '1', 'numOfRows' : '100', '_type' : 'xml', 'depPlaceId' : dep_code, 'arrPlaceId' : arr_code, 'depPlandTime' : date, 'trainGradeCode' : train_code }

        response = requests.get(url, params=params)
        content = response.text

        # print(content)

        xml_obj = bs4.BeautifulSoup(content,'lxml-xml')
        page = int(xml_obj.find('pageNo').text)
        total_count = int(xml_obj.find('totalCount').text)

        # print(f'페이지 번호: {page}, 총 개수: {total_count}')

        rows = xml_obj.findAll('item')

        for row in rows :
            dict = {
                'charge' : row.adultcharge.text,
                'departure' : row.depplacename.text,
                'deptime' : datetime.strptime(row.depplandtime.text, '%Y%m%d%H%M%S'),
                'arrival' : row.arrplacename.text,
                'arrtime' : datetime.strptime(row.arrplandtime.text, '%Y%m%d%H%M%S'),
                'trainname' : row.traingradename.text,
                'trainno' : row.trainno.text
            }
            # print(dict)

            if (dict['deptime'] >= std_date) :
                schedule_array.append(dict)

    schedule_array.sort(key=lambda x:x['deptime'])
    for schedule in schedule_array :
        schedule['deptime'] = schedule['deptime'].strftime("%Y-%m-%d-%H-%M-%S")
        schedule['arrtime'] = schedule['arrtime'].strftime("%Y-%m-%d-%H-%M-%S")
    
    schedule_dict = {}
    for schedule in schedule_array :
        schedule_str = "s" + str(start)
        schedule_dict[schedule_str] = schedule
        start += 1

    json_string = json.dumps(schedule_dict)
    print(json_string)

if __name__ == "__main__":
    conn = pymysql.connect(host=DB_URL, port=PORT, user=DB_ID, password=DB_PASSWORD, db=DB_NAME, charset='utf8')
    cursor = conn.cursor()

    # 열차 정보 저장 완료
    # save_train(conn, cursor)

    # 도시 정보 저장 완료
    # save_city_code(conn, cursor)

    # 역 정보 저장 완료
    # save_all_station(conn, cursor)

    # ktx 열차 정보만 가져오기
    dep = sys.argv[1] # 출발역
    arr = sys.argv[2] # 도착역
    date = sys.argv[3] # 출발 날짜
    time = sys.argv[4] # 출발 시간

    ktx_nums = get_ktx_car_num(cursor)
    # get_schedule("동대구", "서울", cursor, "20231111", time_str,  ktx_nums)
    get_schedule(dep, arr, cursor, date, time, ktx_nums)