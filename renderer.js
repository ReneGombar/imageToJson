const originalImage = document.getElementById("originalImage");

const img = new Image();
let imageIsCorrectSize = false


img.crossOrigin = "anonymous";
img.src = "";
let imgName = ""

const inputImage = document.getElementById("inputImage")
const uploadMsg = document.getElementById("uploadMsg")
const originalImageCanvas = originalImage.getContext("2d");
const container = document.getElementById("container")
const imageContainer = document.getElementById("imagePreview")
const jsonContainer = document.getElementById("jsonPreview")
const downloadButtonDiv = document.getElementById("downloadButtonDiv")


inputImage.addEventListener('change',  event =>
{   
    
    jsonContainer.innerHTML= ""
    downloadButtonDiv.innerHTML=""
    const selectedFile = event.target.files[0];
    console.log(selectedFile)
    
    if (selectedFile && selectedFile.type.includes('image')) {
        const reader = new FileReader();
        

        img.src = event.target.files[0].path
        imgName = event.target.files[0].path
        img.onload = () => {
            //image sizes
            if (img.width ===32 && img.height === 32) {
                originalImageCanvas.drawImage(img, 0, 0)
                reader.readAsDataURL(selectedFile);
            }
            else {
                imageContainer.innerHTML = "<p>Wrong image format. Image must be 32x by 32px !</p>"
            }
        };

        reader.onload = function(e) {
            const imageElement = document.createElement('img');
            imageElement.src = e.target.result;
            imageElement.style.maxWidth = '100%';
            imageElement.style.height = 'auto';
            imageElement.crossOrigin = "anonymous";
            imageElement.id = "imagePreview"
            imageContainer.innerHTML = 'Image Preview';

            imageContainer.appendChild(document.createElement('br'))
            imageContainer.appendChild(imageElement);
            
            const convertButton = document.createElement('button')
            convertButton.id = "convertButton"
            convertButton.type = "button"
            convertButton.innerText = "Convert Image"
            convertButton.addEventListener("click", e=>{buttonHandler()})
            
            imageContainer.appendChild(document.createElement('br'))
            imageContainer.appendChild(convertButton)
        };
    } 
    else {
        imageContainer.innerHTML = '<p>Please select a valid image file.</p>';
    }
})


function  buttonHandler(e){
    jsonContainer.innerHTML= ""
    downloadButtonDiv.innerHTML=""
    imgName !=="" ? processImage() : uploadMsg.innerHTML = "You did not select an image"
}

function sortArray(cleanArray){
    const colorsObject ={}
    
    cleanArray.forEach((element, index) => {
        if (!colorsObject[element]) {
            colorsObject[element] = [index];
        } else {
            colorsObject[element].push(index);
        }
    });
    return JSON.stringify(colorsObject)
}


function processImage(){
    
    function displayJsonData(jsonArray){
        let pixelCount = 0
        let colorCount = 0
        let colors = ""
        
        for (key in jsonArray) { 
            colorCount++ 
            colors = key + ", "+colors 

            jsonArray[key].forEach(value => {
                pixelCount++
            })
        }
        const jsonInfoP = document.createElement('p')
        const jsonInfoColors = document.createElement('p')
        jsonInfoP.innerHTML = `<strong>Image successfully converted!!!</strong> <br><br>Image information:<br>Image has <strong>${pixelCount} pixels</strong>, and consists of <strong>${colorCount} colors</strong>.<br><br>You can naw save the JSON file.`
        jsonInfoColors.id = "colorOutput"
        //jsonInfoColors.innerHTML = colors
        // append mainUL to body
    
        jsonContainer.appendChild(jsonInfoP);

        //jsonContainer.appendChild(jsonInfoColors);
    }
    

    function rgbToHex(r,g,b){
        r = r.toString(16).length === 1 ? "0"+r.toString(16) : r.toString(16)
        g = g.toString(16).length === 1 ? "0"+g.toString(16) : g.toString(16)
        b = b.toString(16).length === 1 ? "0"+b.toString(16) : b.toString(16)
        return ( r + g + b )
    }
    
    const originalImageData = originalImageCanvas.getImageData(0,0,originalImage.width,originalImage.height)
    let cleanArray = []

    for (let i = 0; i < originalImageData.data.length; i += 4) {
        
        const red = originalImageData.data[i] 
        const green = originalImageData.data[i + 1] 
        const blue = originalImageData.data[i + 2] 
        const colorValue = rgbToHex( red, green , blue)

        cleanArray.push (  colorValue  )
    }
        const jsonArray = sortArray(cleanArray)
    
        //console.log(jsonArray)

        const jsonBlob = new Blob([jsonArray], {type: "application/json"});
        const url = window.URL.createObjectURL(jsonBlob);

        const a = document.createElement('a');
        a.id = 'downloadButton';
        a.href = url;
        // the filename you want
        a.download = 'drawing01.json';
        a.innerText = "Save Json File"
        downloadButtonDiv.appendChild(a);
        
        //a.click();
        //window.URL.revokeObjectURL(url);
        displayJsonData(JSON.parse(jsonArray))
    
}

const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

