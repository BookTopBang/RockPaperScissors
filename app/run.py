from flask import Flask
from flask import render_template


app = Flask(__name__)

@app.route("/")
def main():
    """
    main함수를 실행시키면,
    로컬호스트 환경의 80번 포트의 '/'경로(http://127.0.0.1:80/)에서
    templates를 활용한 index.html을 확인할 수 있다.
    """
    # render_template은 templates/를 기본 경로로 갖는다.
    
    html = 'index.html'
    return render_template(html)

@app.route('/<mode>')
def hello(mode=None):
    """
    http://127.0.0.1:80/<mode> 로 접근하면 
    로컬호스트 환경의 80 포트의 '/'경로(http://127.0.0.1:80/)에서
    templates를 활용한 index.html을 확인할 수 있다.
    params :: debug
    """
    # render_template은 templates/를 기본 경로로 갖는다.

    html = 'index.html'
    return render_template(html, mode=mode)

app.run(host = "0.0.0.0", port = 80, debug=True)
