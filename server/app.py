from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/spin', methods=['POST', 'OPTIONS'])  # 👈 Add OPTIONS here
def spin():
    if request.method == 'OPTIONS':
        return '', 204  # 👈 Return empty 204 for preflight

    data = request.get_json()
    options = data.get('options', [])
    if not options:
        return jsonify({'error': 'No options provided'}), 400

    import random
    result = random.choice(options)
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)
