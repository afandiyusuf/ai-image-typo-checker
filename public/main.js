const parseTheResponse = async (response) => {
    if(response !== undefined){
        console.log(await response.text());
    }
}
const drawImageToCanvas = async () => {
    let image = document.getElementById('previewImg');
    console.log(image)
    var canvas = document.getElementById('previewCanvas');
    var ctx = canvas.getContext('2d');
    var img = new Image()
    img.src = image.src;
    img.onload = () => {
        console.log('here 2')
        console.log(img.width, img.height)
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(image, 0,0, img.width, img.height);
    };
   
}
const triggerRequest = async () => {
    const xhttp = new XMLHttpRequest();
    const image = document.getElementById('inputGroupFile02');
    previewImg = document.getElementById('previewImg');
    previewImg.src = window.URL.createObjectURL(image.files[0]);
    
    drawImageToCanvas();
   
    return;
    
    let formData = new FormData();
    formData.append('image', image.files[0]);
    let response = await fetch('/ocr-check', {
        method: "POST",
        body: formData
    }).then((resp) => parseTheResponse(resp)).then((obj) => parseTheResponse(obj));
}

