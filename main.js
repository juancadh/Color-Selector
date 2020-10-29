const sliderRed = document.getElementById("cR");
const sliderGreen = document.getElementById("cG");
const sliderBlue = document.getElementById("cB");
const sliderOpacity = document.getElementById("cA");
const spanRed = document.getElementById("cRval");
const spanGreen = document.getElementById("cGval");
const spanBlue = document.getElementById("cBval");
const spanOpacity = document.getElementById("cAval");
const body = document.querySelector("body");

function updateBodyColor(r,g,b,a){
  body.style.background = `rgba(${r},${g},${b},${a})`;
}

function randomize(){
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);
  let a = Math.floor(Math.random() * 100);

  updateBodyColor(r,g,b,a/100);

  sliderRed.value = r;
  sliderGreen.value = g;
  sliderBlue.value = b;
  sliderOpacity.value = a;

  spanRed.innerHTML = sliderRed.value;
  spanGreen.innerHTML = sliderGreen.value;
  spanBlue.innerHTML = sliderBlue.value;
  spanOpacity.innerHTML = sliderOpacity.value;
}

randomize();


// Update the current slider value (each time you drag the slider handle)
sliderRed.oninput = function() {
  updateBodyColor(sliderRed.value, sliderGreen.value, sliderBlue.value, sliderOpacity.value/100);
  spanRed.innerHTML = sliderRed.value;
}

sliderGreen.oninput = function() {
  updateBodyColor(sliderRed.value, sliderGreen.value, sliderBlue.value, sliderOpacity.value/100);
  spanGreen.innerHTML = sliderGreen.value;
}

sliderBlue.oninput = function() {
  updateBodyColor(sliderRed.value, sliderGreen.value, sliderBlue.value, sliderOpacity.value/100);
  spanBlue.innerHTML = sliderBlue.value;
}

sliderOpacity.oninput = function() {
  updateBodyColor(sliderRed.value, sliderGreen.value, sliderBlue.value, sliderOpacity.value/100);
  spanOpacity.innerHTML = sliderOpacity.value;
}


document.addEventListener("keydown", function(e){
  if (e.key = 'r'){
    randomize();
  }
})