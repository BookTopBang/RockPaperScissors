from flask import Flask


app = Flask(__name__)


@app.route("/")
def main():
    """
    main함수를 실행시키면,
    로컬호스트 환경의 5000번 포트의 '/'경로에 text 메세지를 출력한다.
    https://127.0.0.1:5000/
    """

    text = "Hello, World!"
    return text


app.run(debug=True)
