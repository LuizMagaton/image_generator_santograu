from flask import Flask, render_template, request, jsonify, send_from_directory
import os
import uuid
from werkzeug.utils import secure_filename
import shutil

app = Flask(__name__)

# Configuração de pastas de upload
UPLOAD_FOLDER = os.path.join('static', 'uploads')
FACES_FOLDER = os.path.join(UPLOAD_FOLDER, 'faces')
GLASSES_FOLDER = os.path.join(UPLOAD_FOLDER, 'glasses')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Simulação sem a API do Gemini
# Nota: Esta é uma versão simplificada sem a integração real com a API do Gemini

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_files():
    if 'face' not in request.files or 'glasses' not in request.files:
        return jsonify({'error': 'Arquivos não enviados corretamente'}), 400
    
    face_file = request.files['face']
    glasses_file = request.files['glasses']
    
    if face_file.filename == '' or glasses_file.filename == '':
        return jsonify({'error': 'Nenhum arquivo selecionado'}), 400
    
    if not (allowed_file(face_file.filename) and allowed_file(glasses_file.filename)):
        return jsonify({'error': 'Tipo de arquivo não permitido'}), 400
    
    # Gerar nomes de arquivo únicos
    face_filename = str(uuid.uuid4()) + '.' + face_file.filename.rsplit('.', 1)[1].lower()
    glasses_filename = str(uuid.uuid4()) + '.' + glasses_file.filename.rsplit('.', 1)[1].lower()
    
    # Salvar arquivos
    face_path = os.path.join(FACES_FOLDER, face_filename)
    glasses_path = os.path.join(GLASSES_FOLDER, glasses_filename)
    
    face_file.save(face_path)
    glasses_file.save(glasses_path)
    
    # Gerar imagem com o Gemini (simulado)
    result_image = generate_image_with_gemini(face_path, glasses_path)
    
    return jsonify({
        'success': True,
        'result_image': result_image
    })

def generate_image_with_gemini(face_path, glasses_path):
    """
    Função que simula a geração de imagem sem a API do Gemini.
    Para demonstração, apenas retorna a imagem do rosto.
    """
    # Simplificando para demonstração - apenas retorna o caminho da imagem do rosto
    relative_path = face_path.replace('\\', '/')
    return '/' + relative_path

if __name__ == '__main__':
    # Garantir que as pastas de upload existam
    os.makedirs(FACES_FOLDER, exist_ok=True)
    os.makedirs(GLASSES_FOLDER, exist_ok=True)
    
    app.run(debug=True)