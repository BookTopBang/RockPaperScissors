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

app.run(host = "0.0.0.0", port = 80, debug=True)
