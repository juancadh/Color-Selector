const sliderRed = document.getElementById("cR");
const sliderGreen = document.getElementById("cG");
const sliderBlue = document.getElementById("cB");
const sliderOpacity = document.getElementById("cA");
const spanRed = document.getElementById("cRval");
const spanGreen = document.getElementById("cGval");
const spanBlue = document.getElementById("cBval");
const spanOpacity = document.getElementById("cAval");
const body = document.querySelector("body");
const randomzeBtn = document.querySelector("#randomizeMe");
const copyRGBBtn = document.querySelector("#copyMe");
const copyHexBtn = document.querySelector("#copyHex");
const saveBtn = document.querySelector("#saveMe");
const hexValue = document.querySelector("#hexVal");
const savedColors = document.querySelectorAll('.savedColors > div');
const savedColorsDelete = document.querySelectorAll('.savedColors > div > i');
const imgContainer = document.querySelector(".imgContainer");
const imageSrc = document.querySelector("#imagen");
const imgCanvas = document.querySelector("#imgCanvas");
const inputFile = document.querySelector('#imgfile');
const palette = document.querySelectorAll('.paletteImg > div');

const MAX_IMG_W = 300;
const MAX_IMG_H = 300;
//localStorage.removeItem('myColors');

// If there is no variable called myColors in local storage the create it
if (!localStorage.getItem('myColors')){
  localStorage.setItem('myColors', JSON.stringify([]))
}


function setColorHex(hexColor){
  let RGBColor = convertHexToRGBA(hexColor);
  updateSliders(RGBColor['r'],RGBColor['g'],RGBColor['b'],RGBColor['a']);
  updateBodyColor(RGBColor['r'],RGBColor['g'],RGBColor['b'],RGBColor['a']/100);
  hexValue.value = hexColor;
}


function resetAllSavedColors(){

  // Get array from local storage
  let savedColorsList = JSON.parse(localStorage.getItem('myColors'));

  // Default Background
  savedColors.forEach((sc)=>{
    sc.style.background = "rgba(0,0,0,0.04)";
  })

  // Set Saved Colors
  let c = 0;
  savedColorsList.forEach((sc)=>{
    savedColors[c].style.background = sc.toString();
    savedColors[c].title = sc.toString();
    c++;
  })
}

resetAllSavedColors();


// Set the event to change the color to all the saved colors
savedColors.forEach((sc)=>{
  sc.addEventListener('click', function(e){
    e.stopPropagation();
    if (sc.title != ""){
      setColorHex(sc.title);
    }
  })
})

// Set the event to remove the saved color
savedColorsDelete.forEach((sc)=>{
  sc.addEventListener('click', function(e){
    let divParent = this.parentElement;
    if (divParent.title != ""){  
      let idToRemove = divParent.id;  
      // Remove from list of colors
      let savedColorsList = JSON.parse(localStorage.getItem('myColors'));   
      let newColsList = [];
      //savedColorsList = savedColorsList.filter((e)=>e!=divParent.title.toString());
      for (let i=0; i<savedColorsList.length; i++){
        if (i!=idToRemove){
          newColsList.push(savedColorsList[i]);
        }
      }
      localStorage.setItem('myColors', JSON.stringify(newColsList));
    }

    resetAllSavedColors();
    e.stopPropagation();
  })
})

saveBtn.addEventListener('click', function(){
  let maxColors = savedColors.length;
  let hex = hexValue.value;
  let savedColorsList = JSON.parse(localStorage.getItem('myColors'));
  if (savedColorsList.length >= maxColors){
    let newArray = savedColorsList.slice(0,savedColorsList.length-1);
    newArray.unshift(hex.toString());
    savedColorsList = newArray; 
    //savedColorsList[savedColorsList.length-1] = hex.toString();
  } else {
    savedColorsList.push(hex.toString());
  }
  localStorage.setItem('myColors', JSON.stringify(savedColorsList));
  resetAllSavedColors();
})

copyRGBBtn.addEventListener('click', function(){
  const rgbColor = `rgba(${sliderRed.value},${sliderGreen.value},${sliderBlue.value},${sliderOpacity.value/100})`;
  const el = document.createElement('textarea');
  el.value = rgbColor;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  alert("Copied! " + rgbColor);
})

copyHexBtn.addEventListener('click', function(){
  var copyText = hexValue;
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Copied! " + copyText.value);
})

function convertHexToRGBA (hexCode) {
  let hex = hexCode.replace('#', '');
  
  if (hex.length === 3) {
      hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  let a = 100;

  if (hex.length === 8) {
    a = Math.round((parseInt(hex.substring(6, 8), 16)/255)*100);
  }

  return {
    'text' : `rgba(${r},${g},${b},${a})`,
    'r' : r, 'g' : g, 'b' : b, 'a' : a,
  };
}


function rgba2hex(r,g,b,alpha=-1) {
  let hex =  (r | 1 << 8).toString(16).slice(1) +
    (g | 1 << 8).toString(16).slice(1) +
    (b | 1 << 8).toString(16).slice(1) ;
  
  if (alpha){
    let a = (alpha) ? alpha :  01;  
    a = ((a * 255) | 1 << 8).toString(16).slice(1)
    hex = hex + a;
  }

  return hex;
}

function updateSliders(r,g,b,a){
  sliderRed.value = r;
  sliderGreen.value = g;
  sliderBlue.value = b;
  sliderOpacity.value = a;

  spanRed.value = sliderRed.value;
  spanGreen.value = sliderGreen.value;
  spanBlue.value = sliderBlue.value;
  spanOpacity.value = sliderOpacity.value;
}

function updateBodyColor(r,g,b,a){
  body.style.background = `rgba(${r},${g},${b},${a})`;
  let hexColor = rgba2hex(r,g,b,a);
  hexValue.value = this.value = "#" + hexColor.replace('#', '');;
}

function randomize(){
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);
  let a = Math.floor(Math.random() * 100);

  updateSliders(r,g,b,a);
  updateBodyColor(r,g,b,a/100);
}

randomize();

// Randomize Button
randomzeBtn.addEventListener('click', () => randomize());

// Update when the hexis entered
hexValue.addEventListener('focusout', function(){
  let hexCol = convertHexToRGBA(this.value.toString());
  updateSliders(hexCol['r'],hexCol['g'],hexCol['b'],hexCol['a']);
  updateBodyColor(hexCol['r'],hexCol['g'],hexCol['b'],hexCol['a']/100);
  this.value = "#" + this.value.replace('#', '');
})

hexValue.addEventListener('keydown', function(e){
  if (e.keyCode === 13){
    let hexCol = convertHexToRGBA(this.value.toString());
    updateSliders(hexCol['r'],hexCol['g'],hexCol['b'],hexCol['a']);
    updateBodyColor(hexCol['r'],hexCol['g'],hexCol['b'],hexCol['a']/100);
  }
})

// Update the current slider value (each time you drag the slider handle)
sliderRed.oninput = function() {
  updateBodyColor(sliderRed.value, sliderGreen.value, sliderBlue.value, sliderOpacity.value/100);
  spanRed.value = sliderRed.value;
}

sliderGreen.oninput = function() {
  updateBodyColor(sliderRed.value, sliderGreen.value, sliderBlue.value, sliderOpacity.value/100);
  spanGreen.value = sliderGreen.value;
}

sliderBlue.oninput = function() {
  updateBodyColor(sliderRed.value, sliderGreen.value, sliderBlue.value, sliderOpacity.value/100);
  spanBlue.value = sliderBlue.value;
}

sliderOpacity.oninput = function() {
  updateBodyColor(sliderRed.value, sliderGreen.value, sliderBlue.value, sliderOpacity.value/100);
  spanOpacity.value = sliderOpacity.value;
}



function updateRGBInput(){
  let r = spanRed.value.toString().replace(/[^0-9]/g,"");
  let g = spanGreen.value.toString().replace(/[^0-9]/g,"");
  let b = spanBlue.value.toString().replace(/[^0-9]/g,"");
  let a = spanOpacity.value.toString().replace(/[^0-9]/g,"");

  updateSliders(r,g,b,a);
  updateBodyColor(r,g,b,a/100);
}

// Change manually the rgb
spanRed.addEventListener('focusout', () => updateRGBInput());
spanRed.addEventListener('keydown', (e) => {if (e.keyCode==13) updateRGBInput()});

spanGreen.addEventListener('focusout', () => updateRGBInput());
spanGreen.addEventListener('keydown', (e) => {if (e.keyCode==13) updateRGBInput()});

spanBlue.addEventListener('focusout', () => updateRGBInput());
spanBlue.addEventListener('keydown', (e) => {if (e.keyCode==13) updateRGBInput()});

spanOpacity.addEventListener('focusout', () => updateRGBInput());
spanOpacity.addEventListener('keydown', (e) => {if (e.keyCode==13) updateRGBInput()});



//-----------------------------------------------

function colorStats(colors){

  let stats = { 
      'max' : {
          'r' : Math.max(...colors.map((p)=>{return p[0]})),
          'g' : Math.max(...colors.map((p)=>{return p[1]})),
          'b' : Math.max(...colors.map((p)=>{return p[2]}))
      },
      'min' : {
          'r' : Math.min(...colors.map((p)=>{return p[0]})),
          'g' : Math.min(...colors.map((p)=>{return p[1]})),
          'b' : Math.min(...colors.map((p)=>{return p[2]}))
      },
      'avg' : {
          'r' : ~~(colors.map((p)=>{return p[0]}).reduce((a,b) => a+b)/colors.length),
          'g' : ~~(colors.map((p)=>{return p[1]}).reduce((a,b) => a+b)/colors.length),
          'b' : ~~(colors.map((p)=>{return p[2]}).reduce((a,b) => a+b)/colors.length)
      },
      'highestR' : {
          'r' : colors.sort((a,b)=>b[0]-a[0])[0][0],
          'g' : colors.sort((a,b)=>b[0]-a[0])[0][1],
          'b' : colors.sort((a,b)=>b[0]-a[0])[0][2]
      },
      'highestG' : {
          'r' : colors.sort((a,b)=>b[1]-a[1])[0][0],
          'g' : colors.sort((a,b)=>b[1]-a[1])[0][1],
          'b' : colors.sort((a,b)=>b[1]-a[1])[0][2]
      },
      'highestB' : {
          'r' : colors.sort((a,b)=>b[2]-a[2])[0][0],
          'g' : colors.sort((a,b)=>b[2]-a[2])[0][1],
          'b' : colors.sort((a,b)=>b[2]-a[2])[0][2]
      },
      'lowestR' : {
          'r' : colors.sort((a,b)=>a[0]-b[0])[0][0],
          'g' : colors.sort((a,b)=>a[0]-b[0])[0][1],
          'b' : colors.sort((a,b)=>a[0]-b[0])[0][2]
      },
      'lowestG' : {
          'r' : colors.sort((a,b)=>a[1]-b[1])[0][0],
          'g' : colors.sort((a,b)=>a[1]-b[1])[0][1],
          'b' : colors.sort((a,b)=>a[1]-b[1])[0][2]
      },
      'lowestB' : {
          'r' : colors.sort((a,b)=>a[2]-b[2])[0][0],
          'g' : colors.sort((a,b)=>a[2]-b[2])[0][1],
          'b' : colors.sort((a,b)=>a[2]-b[2])[0][2]
      }
  }

  return stats

}

let colors2;
function getAverageRGB(imgEl) {
  
  var blockSize = 150, // only visit every 5 pixels
      defaultRGB = null, // for non-supporting envs
      canvas = imgCanvas, //document.createElement('canvas'),
      context = canvas.getContext && canvas.getContext('2d'),
      data, width, height,
      i = -4,
      length
      
  if (!context) {
      return defaultRGB;
  }
  
  width  = Math.min(imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width, MAX_IMG_W);
  height = Math.min(imageSrc.naturalHeight || imageSrc.offsetHeight || imageSrc.height, MAX_IMG_H);
  
  canvas.width = width;
  canvas.height = height;
  
  context.drawImage(imgEl, 0, 0, width, height);
  
  try {
      data = context.getImageData(0, 0, width, height);
  } catch(e) {
      /* security error, img on diff domain */alert('x');
      return defaultRGB;
  }
  
  length = data.data.length;
  let colors = []
  
  while ( (i += blockSize * 4) < length ) {
      // ++count;
      // rgb.r += data.data[i];
      // rgb.g += data.data[i+1];
      // rgb.b += data.data[i+2];
      colors.push([data.data[i], data.data[i+1], data.data[i+2]])
  }

  cStats = colorStats(colors);
  colors2 = colors;
  
  console.log(cStats);

  // // ~~ used to floor values
  // rgb.r = cStats['avg']['r'];
  // rgb.g = cStats['avg']['g'];
  // rgb.b = cStats['avg']['b'];
  
  return cStats;
  
}

if (imageSrc.getAttribute("src") != ""){
  imgContainer.classList.idToRemove("hidden");
} else {
  imgContainer.classList.add("hidden");
}

function findPos(obj) {
  var curleft = 0, curtop = 0;
  if (obj.offsetParent) {
      do {
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
      return { x: curleft, y: curtop };
  }
  return undefined;
}

imgCanvas.addEventListener('mousemove', function(e){
  if (imageSrc.getAttribute("src") != ""){
    var pos = findPos(this);
    var x = e.pageX - pos.x;
    var y = e.pageY - pos.y;
    var c = this.getContext('2d');
    var p = c.getImageData(x, y, 1, 1).data;
    var r=p[0], g=p[1], b=p[2], a=p[3];
    var hex = rgba2hex(r,g,b,a/255);
    updateSliders(r,g,b,a);
    updateBodyColor(r,g,b,a/100);
    //var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
  }
})



// Load Image 
function loadImage() {
  let file, fr;

  if (typeof window.FileReader !== 'function') {
      write("The FileReader API isn't supported on this browser yet.");
      return;
  }

  if (!inputFile) {
      write("Um, couldn't find the image element.");
  }
  else if (!inputFile.files) {
      write("This browser doesn't seem to support the `files` property of file inputs.");
  }
  else if (!inputFile.files[0]) {
      write("Please select a file before clicking 'Load'");
  }
  else {      
      file = inputFile.files[0];
      fr = new FileReader();
      fr.onload = createImage;
      fr.readAsDataURL(file);
  }

  function createImage() {
      imageSrc.onload = imageLoaded;
      imageSrc.src = fr.result;
  }

  function imageLoaded() {
      let rgbAvg = getAverageRGB(imageSrc);
      if(rgbAvg){
        let rAvg=rgbAvg['avg']['r'], gAvg=rgbAvg['avg']['g'], bAvg=rgbAvg['avg']['b'], aAvg=100;
        updateSliders(rAvg,gAvg,bAvg,aAvg);
        updateBodyColor(rAvg,gAvg,bAvg,aAvg/100);

        palette[0].style.background = `rgb(${rAvg},${gAvg},${bAvg})`

        palette[1].style.background = `rgb(${rgbAvg['highestR']['r']},${rgbAvg['highestR']['g']},${rgbAvg['highestR']['b']})`
        palette[2].style.background = `rgb(${rgbAvg['highestG']['r']},${rgbAvg['highestG']['g']},${rgbAvg['highestG']['b']})`
        palette[3].style.background = `rgb(${rgbAvg['highestB']['r']},${rgbAvg['highestB']['g']},${rgbAvg['highestB']['b']})`

        palette[4].style.background = `rgb(${rgbAvg['lowestR']['r']},${rgbAvg['lowestR']['g']},${rgbAvg['lowestR']['b']})`
        palette[5].style.background = `rgb(${rgbAvg['lowestG']['r']},${rgbAvg['lowestG']['g']},${rgbAvg['lowestG']['b']})`
        palette[6].style.background = `rgb(${rgbAvg['lowestB']['r']},${rgbAvg['lowestB']['g']},${rgbAvg['lowestB']['b']})`

        setColorEvents();
      }
  }

  function write(msg) {
      alert(msg);
  }

  function setColorEvents() {
    // Set the event to change the color to all the saved colors
    palette.forEach((sc)=>{
      sc.addEventListener('click', function(e){
        e.stopPropagation();
        alert("Todo");
        // if (sc.title != ""){
        //   setColorHex(sc.title);
        // }
      })
    })
  }
}

// imgContainer.classList.remove("hidden");
inputFile.onchange = function(){
  loadImage();
  imgContainer.classList.remove("hidden");
}