document.addEventListener('DOMContentLoaded', function() {
    // Elementos de upload
    const faceInput = document.getElementById('face-input');
    const glassesInput = document.getElementById('glasses-input');
    const faceBtn = document.getElementById('face-btn');
    const glassesBtn = document.getElementById('glasses-btn');
    const facePreview = document.getElementById('face-preview');
    const glassesPreview = document.getElementById('glasses-preview');
    
    // Elementos de ação
    const generateBtn = document.getElementById('generate-btn');
    const resultSection = document.getElementById('result-section');
    const resultImage = document.getElementById('result-image');
    const downloadBtn = document.getElementById('download-btn');
    const shareBtn = document.getElementById('share-btn');
    const tryAgainBtn = document.getElementById('try-again-btn');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // Dados de upload
    let faceFile = null;
    let glassesFile = null;
    
    // Event listeners para botões de upload
    faceBtn.addEventListener('click', () => faceInput.click());
    glassesBtn.addEventListener('click', () => glassesInput.click());
    
    // Event listeners para inputs de arquivo
    faceInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            faceFile = e.target.files[0];
            displayPreview(faceFile, facePreview);
            checkEnableGenerate();
        }
    });
    
    glassesInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            glassesFile = e.target.files[0];
            displayPreview(glassesFile, glassesPreview);
            checkEnableGenerate();
        }
    });
    
    // Event listener para botão de gerar
    generateBtn.addEventListener('click', generateImage);
    
    // Event listeners para botões de resultado
    downloadBtn.addEventListener('click', downloadImage);
    shareBtn.addEventListener('click', shareImage);
    tryAgainBtn.addEventListener('click', resetForm);
    
    // Função para exibir preview da imagem
    function displayPreview(file, previewElement) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewElement.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            previewElement.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
    
    // Função para verificar se o botão de gerar deve ser habilitado
    function checkEnableGenerate() {
        generateBtn.disabled = !(faceFile && glassesFile);
    }
    
    // Função para gerar a imagem
    function generateImage() {
        // Mostrar overlay de carregamento
        loadingOverlay.style.display = 'flex';
        
        // Criar FormData para envio
        const formData = new FormData();
        formData.append('face', faceFile);
        formData.append('glasses', glassesFile);
        
        // Enviar para o servidor
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Exibir resultado
                resultImage.src = data.result_image;
                resultSection.style.display = 'block';
                
                // Rolar para a seção de resultado
                resultSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('Erro ao gerar a imagem: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao processar sua solicitação.');
        })
        .finally(() => {
            // Esconder overlay de carregamento
            loadingOverlay.style.display = 'none';
        });
    }
    
    // Função para baixar a imagem
    function downloadImage() {
        const link = document.createElement('a');
        link.href = resultImage.src;
        link.download = 'santo-grau-visualizacao.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Função para compartilhar a imagem
    function shareImage() {
        if (navigator.share) {
            fetch(resultImage.src)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], 'santo-grau-visualizacao.jpg', { type: 'image/jpeg' });
                    navigator.share({
                        title: 'Minha visualização Santo Grau',
                        text: 'Veja como fico com estes óculos da Santo Grau!',
                        files: [file]
                    }).catch(console.error);
                });
        } else {
            alert('Compartilhamento não suportado neste navegador. Baixe a imagem e compartilhe manualmente.');
        }
    }
    
    // Função para resetar o formulário
    function resetForm() {
        // Limpar previews
        facePreview.innerHTML = '';
        facePreview.style.display = 'none';
        glassesPreview.innerHTML = '';
        glassesPreview.style.display = 'none';
        
        // Resetar inputs
        faceInput.value = '';
        glassesInput.value = '';
        
        // Resetar arquivos
        faceFile = null;
        glassesFile = null;
        
        // Desabilitar botão de gerar
        generateBtn.disabled = true;
        
        // Esconder seção de resultado
        resultSection.style.display = 'none';
    }
});