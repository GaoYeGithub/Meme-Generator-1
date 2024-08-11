function generateMeme(img, topText, bottomText, topTextSize, bottomTextSize) {
    const canvas = document.getElementById('meme-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.textAlign = 'center';

    let fontSize = canvas.width * topTextSize;
    ctx.font = `${fontSize}px Impact`;
    ctx.lineWidth = fontSize / 20;

    ctx.textBaseline = 'top';
    topText.split('\n').forEach((t, i) => {
        ctx.fillText(t, canvas.width / 2, i * fontSize, canvas.width);
        ctx.strokeText(t, canvas.width / 2, i * fontSize, canvas.width);
    });

    fontSize = canvas.width * bottomTextSize;
    ctx.font = `${fontSize}px Impact`;
    ctx.lineWidth = fontSize / 20;

    ctx.textBaseline = 'bottom';
    bottomText.split('\n').reverse().forEach((t, i) => {
        ctx.fillText(t, canvas.width / 2, canvas.height - i * fontSize, canvas.width);
        ctx.strokeText(t, canvas.width / 2, canvas.height - i * fontSize, canvas.width);
    });
}

window.addEventListener('DOMContentLoaded', (event) => {
    const topTextInput = document.getElementById('top-text');
    const bottomTextInput = document.getElementById('bottom-text');
    const topTextSizeInput = document.getElementById('top-text-size-input');
    const bottomTextSizeInput = document.getElementById('bottom-text-size-input');
    const imageInput = document.getElementById('image-input');
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const saveTemplateBtn = document.getElementById('save-template-btn');
    const loadTemplateBtn = document.getElementById('load-template-btn');

    generateBtn.addEventListener('click', () => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
                generateMeme(img, topTextInput.value, bottomTextInput.value, topTextSizeInput.value, bottomTextSizeInput.value);
            };
        };
        reader.readAsDataURL(imageInput.files[0]);
    });

    downloadBtn.addEventListener('click', () => {
        const canvas = document.getElementById('meme-canvas');
        const link = document.createElement('a');
        link.download = 'meme.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    saveTemplateBtn.addEventListener('click', () => {
        const template = {
            topText: topTextInput.value,
            bottomText: bottomTextInput.value,
            topTextSize: topTextSizeInput.value,
            bottomTextSize: bottomTextSizeInput.value,
            imageSrc: imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : ''
        };
        localStorage.setItem('memeTemplate', JSON.stringify(template));
        alert('Template saved!');
    });

    loadTemplateBtn.addEventListener('click', () => {
        const savedTemplate = JSON.parse(localStorage.getItem('memeTemplate'));
        if (savedTemplate) {
            topTextInput.value = savedTemplate.topText;
            bottomTextInput.value = savedTemplate.bottomText;
            topTextSizeInput.value = savedTemplate.topTextSize;
            bottomTextSizeInput.value = savedTemplate.bottomTextSize;

            if (savedTemplate.imageSrc) {
                const img = new Image();
                img.src = savedTemplate.imageSrc;
                img.onload = () => {
                    generateMeme(img, savedTemplate.topText, savedTemplate.bottomText, savedTemplate.topTextSize, savedTemplate.bottomTextSize);
                };
            }
            alert('Template loaded!');
        } else {
            alert('No template found!');
        }
    });
});
