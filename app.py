import os
import uuid
from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configurações
UPLOAD_FOLDER = os.path.join(app.static_folder, 'uploads')
FACE_FOLDER = os.path.join(UPLOAD_FOLDER, 'faces')
GLASSES_FOLDER = os.path.join(UPLOAD_FOLDER, 'glasses')
RESULT_FOLDER = os.path.join(app.static_folder, 'images')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Configuração para simulação (sem API Gemini)
# Em um ambiente de produção, você adicionaria sua chave API aqui

# Verificar extensões permitidas
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    # Verificar se os arquivos foram enviados
    if 'face' not in request.files or 'glasses' not in request.files:
        return jsonify({'error': 'Arquivos não encontrados'}), 400
    
    face_file = request.files['face']
    glasses_file = request.files['glasses']
    
    # Verificar se os arquivos são válidos
    if face_file.filename == '' or glasses_file.filename == '':
        return jsonify({'error': 'Nenhum arquivo selecionado'}), 400
    
    if not allowed_file(face_file.filename) or not allowed_file(glasses_file.filename):
        return jsonify({'error': 'Formato de arquivo não permitido'}), 400
    
    # Criar nomes de arquivo únicos
    face_filename = str(uuid.uuid4()) + '.' + face_file.filename.rsplit('.', 1)[1].lower()
    glasses_filename = str(uuid.uuid4()) + '.' + glasses_file.filename.rsplit('.', 1)[1].lower()
    
    # Salvar os arquivos
    face_path = os.path.join(FACE_FOLDER, face_filename)
    glasses_path = os.path.join(GLASSES_FOLDER, glasses_filename)
    
    face_file.save(face_path)
    glasses_file.save(glasses_path)
    
    try:
        # Gerar imagem com a API do Gemini
        result_filename = generate_image_with_gemini(face_path, glasses_path)
        
        # Retornar o caminho da imagem gerada
        result_url = '/static/images/' + result_filename
        return jsonify({'result_image': result_url})
    
    except Exception as e:
        # Em caso de erro, retornar uma mensagem de erro
        return jsonify({'error': str(e)}), 500

def generate_image_with_gemini(face_path, glasses_path):
    """
    Função para simular a geração de imagem combinada.
    
    Em um ambiente de produção, você implementaria a integração real com a API do Gemini aqui.
    Para fins de demonstração, esta função apenas retorna a imagem do rosto.
    """
    try:
        # Simulação para demonstração
        result_filename = str(uuid.uuid4()) + '.jpg'
        result_path = os.path.join(RESULT_FOLDER, result_filename)
        
        # Simulação: copiar a imagem do rosto como resultado
        with open(face_path, 'rb') as src, open(result_path, 'wb') as dst:
            dst.write(src.read())
        
        return result_filename
    
    except Exception as e:
        print(f"Erro ao gerar imagem: {str(e)}")
        raise

# Garantir que as pastas de upload existam
for folder in [FACE_FOLDER, GLASSES_FOLDER, RESULT_FOLDER]:
    os.makedirs(folder, exist_ok=True)

if __name__ == '__main__':
    app.run(debug=True)