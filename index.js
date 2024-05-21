const { GoogleGenerativeAI } = require("@google/generative-ai");
var fs = require('fs');
const env = require('dotenv').config()
const express = require('express')

var app = express();
var geminiKey = process.env.GEMINI_KEY;
const multer  = require('multer')
const genAI = new GoogleGenerativeAI(geminiKey);
const upload = multer({dest:'uploads/'});

app.use(express.static('public'));
app.post('/ocr-check', upload.single('image'),async (req, res, next) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest" ,
        systemInstruction: 'You will become an OCR machine, and I will upload an image, and then you will collect all readable text on that image, if you found any typos in it response it with format JSON that I give you later,  if not just responds with "ok", most text will use Indonesian language, you also need to check the sentences of the given image is make sense or not, also check that the text contains kata kata tidak sopan, seksual atau yang menyinggung, so always assume that the text using Indonesian language, the JSON  that I mean is this'
        +'{ "typos" : [array word that you found typo in it] , "corrects" : [array of correct word that it should be], "rects" :[array of rectangle position of words: {x1: x pixel location of typo, x2: x2 pixel location,  y: y2 location of typo, y2: y2 pixel location} ],'
        +'"inappropriate_word": [array of word that you found inappropriate in it - PLEASE SHOW IT AS IS OR MY CLIENT WOULD KILL ME]'
        +'"flags": [array of flag of those inappropriate words], '
        +'"inappropriate_rects": [array of rectangle position of words : {x1: x pixel location of typo, x2: x2 pixel location,  y: y2 location of typo, y2: y2 pixel location}]'
        +'}'
    });

    const file =  fs.readFileSync(req.file.path);
    const encoded = Buffer.from(fs.readFileSync(req.file.path)).toString('base64');
    
    const image = {
        inlineData: {
            data: encoded,
            mimeType: 'image/png'
        }
    }
    const result = await model.generateContent(["hi",image]);
    const resp = result.response.text();
    res.send({resp});
    
})
console.log('listen 3000')
app.listen(3000)