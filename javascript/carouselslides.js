const datalink = "https://opensheet.elk.sh/1XBd9iby84O-jNv0Wuvzewtm9ZKyEn87NpFmSIy-8HVA/challenges"
const templateID = "slide-template"

// the IDs for parts of the slide:
// slide: slide
// challengetitle: challangetitle
// challengetext: challengetext
// hints: hint1, hint2, hint3
// buttons: hint-btn1, hint-btn2, hint-btn3
// need to change IDs each time template is used
// need to change references of the buttons as well

// the div in index.html that the slides need to be appended into
// are called slide1, slide2, so on

async function makeCarouselSlides(){
  
    var challengedata = await fetch(datalink);
    var responses = await challengedata.json();
    
    setTimeout(() => {
      //$(".owl-carousel").trigger('remove.owl.carousel', [1]).trigger('refresh.owl.carousel');
      var template = document.getElementById(templateID);

      for(var i = 0; i < Object.keys(responses).length; i++){
        // responses[i] should have all data for one challenge
        console.log(JSON.stringify(responses[i]) + "\n");
        // make a copy of the template
        var newSlide = document.importNode(template.content, true);
        // set the title text and set the id
        var titlehtml = newSlide.getElementById("challengetitle");
        titlehtml.textContent = responses[i]["challengetitle"];
        titlehtml.id = "challengetitle"+i;
        
        // set the challenge text and set the id
        var challengehtml = newSlide.getElementById("challengetext");
        challengehtml.id = "challengetext"+i;
  
        challengehtml.textContent = "";
        var newlineformatted = responses[i]["challengetext"].replace( new RegExp("\\\\n", 'g'), "\r\n");
        $(challengehtml).append(newlineformatted);
  
        challengehtml.classList.add("challtext");
        
        // set the id of the input box, will be used to check the flags
        var inputBox = newSlide.getElementById("inputBox");
        inputBox.id = 'inputBox'+i;
  
        // x is the number hint
        for(var x = 1; x <= 3; x++){
          var hintnum = "hint" + x;
          if(responses[i].hasOwnProperty(hintnum) && !(responses[i][hintnum] === "")){
            var hinthtml = newSlide.getElementById(hintnum);
            hinthtml.textContent = "[" + x.toString() + "]. " + responses[i][hintnum];
            hinthtml.id = hintnum+i;
            var hintcoll = "hintcollapse" + x;
            var hintcollapse = newSlide.getElementById(hintcoll);
            hintcollapse.id = hintcoll+i;
            var btn = newSlide.getElementById("hint-btn" + x);
            btn.setAttribute('data-target', "#" + hintcoll +i);
            btn.setAttribute('aria-control', hintcoll+i);
            btn.id = "hint-btn" + x + i;
          }
          else{
            newSlide.getElementById("hint" + x).remove();
            newSlide.getElementById("hint-btn" + x).remove();
          }
        }
  
        // set the id of the new slide
        newSlide.getElementById("slide").id = "slide"+i;
  
        $('.owl-carousel')
              .trigger('add.owl.carousel', [newSlide])
              .trigger('refresh.owl.carousel');
      }
      document.getElementsByClassName("holder")[0].style["z-index"] = 0;
    }, 250)
    
  }
window.onload = () => {
  makeCarouselSlides();
}
 