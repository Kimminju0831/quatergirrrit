# ChatGPT turbo 3.5 이용하여 챗봇 구현

"""
pip install requests
"""
import os
import requests
import openai

MODEL = "gpt-3.5-turbo"

# 출발역, 도착역, 출발 날짜, 열차 번호, 이름, 발권 매수

departure = "물금역"
arrival = "대전역"
time = "12/11 12:23"
ticket_num = "3"
name = "홍길동"

CONTENT = departure + "에서 " + arrival + "으로 " + time + " 에 가는 기차 승차권을 " + ticket_num + "매 예매하는 말을 1줄로 해줘" 

response = openai.ChatCompletion.create(
    model=MODEL,
    messages=[
        {"role": "user", "content": "동대구역에서 서울역으로 11/15 16:24 에 가는 기차 승차권을 2매 예매하는 말을 1줄로 해줘."},
        {"role": "assistant", "content": "동대구역에서 서울역으로 11월 15일 오후 4시 24분에 출발하는 기차 승차권 2매를 예매하고 싶어요."},
        {"role": "user", "content": CONTENT},
    ],
    temperature=0,
)

result = "안녕하세요, 원콜 서비스를 이용하려 합니다. "
result += response['choices'][0]['message']['content']
result += " 제 이름은 " + name + "입니다."

print(result)