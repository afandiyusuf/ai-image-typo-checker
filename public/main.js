
let image = document.getElementById('previewImg');
let canvas = document.getElementById('previewCanvas');
let ctx = canvas.getContext('2d');
let title = document.getElementById('result-title');
let detail = document.getElementById('result-detail1');
let detail2 = document.getElementById('result-detail2');

const drawTypo = (typos, corrects, rects) => {

  if(typos != null && typos.length > 0){
    title.innerHTML = "Kami menemukan "+typos.length+" typo";
    detail.innerHTML = "Typo yang ditemukan: <b style='color:red'>"+typos+"</b>";
    detail2.innerHTML = "Perkiraan kata yang benar:<b style='color:green'>"+corrects+"</b>";
  }
}
const drawInappropriate = (response) => {
   
}
const parseTheResponse = async (response) => {
    if(response !== undefined){
        let json  = JSON.parse(await response.text());
        json = JSON.parse(json.resp);
        if(json.typos !== null){
            drawTypo(json.typos, json.corrects, json.rects);
        }
    }
}


const drawImageToCanvas = async () => {
    
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
    title.innerHTML = "Memeriksa....";
    const xhttp = new XMLHttpRequest();
    const image = document.getElementById('inputGroupFile02');
    previewImg = document.getElementById('previewImg');
    previewImg.src = window.URL.createObjectURL(image.files[0]);
    drawImageToCanvas();
    let formData = new FormData();
    formData.append('image', image.files[0]);
    let response = await fetch('/ocr-check', {
        method: "POST",
        body: formData
    }).then((resp) => parseTheResponse(resp)).then((obj) => parseTheResponse(obj));
}

