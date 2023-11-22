# -*- coding: utf-8 -*-

import os
import requests
import openai
import sys
import json
import apikey

def create_script(departure, arrival, datetime):

    CONTENT = departure + "에서 " + arrival + "으로 " + datetime + " 에 가는 기차 승차권을 예매하는 말을 1줄로 해줘" 

    openai.api_key = apikey.apikey

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": "동대구역에서 서울역으로 2023-11-12-16-23-00 에 가는 기차 승차권을 예매하는 말을 1줄로 해줘."},
            {"role": "assistant", "content": "동대구역에서 서울역으로 11월 12일 16시 23분에 출발하는 기차 승차권을 예매하고 싶어요."},
            {"role": "user", "content": CONTENT},
        ],
        temperature=0,
    )

    result = "안녕하세요, 원콜 서비스를 이용하려 합니다. "
    result += response['choices'][0]['message']['content']

    #print(result)

    result_json = json.dumps({"result": result})

    print(result_json)
    #return result_json

if __name__ == "__main__":
    sys.stdout.reconfigure(encoding='utf-8')
    
    dep = sys.argv[1] # 출발역
    arr = sys.argv[2] # 도착역
    datetime = sys.argv[3] # 출발 날짜

    create_script(dep, arr, datetime)