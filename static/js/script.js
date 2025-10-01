document.addEventListener('DOMContentLoaded', function () {
    // Elementos da interface
    const faceInput = document.getElementById('face-input');
    const glassesInput = document.getElementById('glasses-input');
    const facePreview = document.getElementById('face-preview');
    const glassesPreview = document.getElementById('glasses-preview');
    const generateButton = document.getElementById('generate-button');
    const resultSection = document.getElementById('result-section');
    const resultImg = document.getElementById('result-img');
    const loadingOverlay = document.getElementById('loading-overlay');
    const downloadButton = document.getElementById('download-button');
    const shareButton = document.getElementById('share-button');
    const tryAgainButton = document.getElementById('try-again-button');

    // Variáveis para armazenar os arquivos
    let faceFile = null;
    let glassesFile = null;

    // Função para verificar se ambos os arquivos foram carregados
    function checkFiles() {
        if (faceFile && glassesFile) {
            generateButton.disabled = false;
        } else {
            generateButton.disabled = true;
        }
    }

    // Função para exibir a prévia da imagem
    function displayPreview(file, previewElement) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.display = 'block';

            // Limpar prévia anterior
            previewElement.innerHTML = '';
            previewElement.appendChild(img);
        }
        reader.readAsDataURL(file);
    }

    // Event listeners para upload de arquivos
    faceInput.addEventListener('change', function (e) {
        if (e.target.files.length > 0) {
            faceFile = e.target.files[0];
            displayPreview(faceFile, facePreview);
            checkFiles();
        }
    });

    glassesInput.addEventListener('change', function (e) {
        if (e.target.files.length > 0) {
            glassesFile = e.target.files[0];
            displayPreview(glassesFile, glassesPreview);
            checkFiles();
        }
    });

    // Event listener para o botão de gerar
    generateButton.addEventListener('click', function () {
        // Mostrar overlay de carregamento
        loadingOverlay.style.display = 'flex';

        // Criar FormData para enviar os arquivos
        const formData = new FormData();
        formData.append('face', faceFile);
        formData.append('glasses', glassesFile);

        // Enviar para o servidor
        fetch('/generate', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao processar as imagens');
                }
                return response.json();
            })
            .then(data => {
                // Esconder overlay de carregamento
                loadingOverlay.style.display = 'none';

                // Exibir resultado
                resultImg.src = data.result_image;
                resultSection.style.display = 'block';

                // Rolar para a seção de resultado
                resultSection.scrollIntoView({ behavior: 'smooth' });
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao processar as imagens. Por favor, tente novamente.');
                loadingOverlay.style.display = 'none';
            });
    });

    // Event listener para o botão de download
    downloadButton.addEventListener('click', function () {
        const link = document.createElement('a');
        link.href = resultImg.src;
        link.download = 'santo-grau-visualizacao.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Event listener para o botão de compartilhar
    shareButton.addEventListener('click', function () {
        if (navigator.share) {
            fetch(resultImg.src)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], 'santo-grau-visualizacao.jpg', { type: 'image/jpeg' });
                    navigator.share({
                        title: 'Minha visualização Santo Grau',
                        text: 'Veja como fico com estes óculos da Santo Grau!',
                        files: [file]
                    }).catch(error => {
                        console.error('Erro ao compartilhar:', error);
                        alert('Não foi possível compartilhar a imagem.');
                    });
                });
        } else {
            alert('Seu navegador não suporta a funcionalidade de compartilhamento.');
        }
    });

    // Event listener para o botão de tentar novamente
    tryAgainButton.addEventListener('click', function () {
        // Resetar formulário
        faceFile = null;
        glassesFile = null;
        facePreview.innerHTML = '';
        glassesPreview.innerHTML = '';
        faceInput.value = '';
        glassesInput.value = '';
        generateButton.disabled = true;
        resultSection.style.display = 'none';

        // Rolar para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});