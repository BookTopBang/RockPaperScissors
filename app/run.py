from flask import Flask
from flask import render_template


app = Flask(__name__)

@app.route("/")
def main():
    """
    main함수를 실행시키면,
    로컬호스트 환경의 5000번 포트의 '/'경로에 text 메세지를 출력한다.
    http://127.0.0.1:5000/
    """

    text = "GoodBye, World!"
    return text

# 1. 가상환경 설정 
#  - venv <- 이거만 한 2~3줄??
# 2. Python package install
#  - pip install -r requirements.txt <- 요거 제가 오타냇어여
# 3. 프로그램 실행
#  - py launcher.py
# 4. 접속
#  - (주소)
""" text
Junior Chicken Misson
1. index.html 꾸미기
- 선택지 1 ) index.html의 폰트 바꾸기
- 선택지 2 ) index.html의 favicon.ico 설정하기

2. READEME.md 수정하기
- 1. venv 실행방법 적어두기
- 2. pip install -r requiremeTNs.txt 오타 수정하기
- 3. 실행 주소 적어두기

- 뽀나스 그냥 혼자 공부
- a. 127.0.0.1이 뭘까요?
- b. 5000의 뜻은?
- c. Github에서 Branch를 나누는 이유는 무엇일까요??
- d. http와 https
- by PAPAGO Lee & Rooftop Turtle

- Due
- Untill 2020.11.04 잠들기 전까지

- submission 
- SURVIVE...
"""
@app.route('/hello/')
@app.route('/hello/<name>')
def hello(name=None):
    """
    http://127.0.0.1:5000/hello/<name> 로 접근하면 
    templates를 활용한 index.html을 확인할 수 있다.
    """
    # render_template은 templates/를 기본 경로로 갖는다.
    
    html = 'index.html'
    return render_template(html, name=name)

app.run(debug=True)
