const datalink = "https://opensheet.elk.sh/1XBd9iby84O-jNv0Wuvzewtm9ZKyEn87NpFmSIy-8HVA/challenges"
const templateID = "slide-template"

// the IDs for parts of the slide:
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
      challengehtml.textContent = responses[i]["challengetext"];
      challengehtml.id = "challengetext"+i;

      // set the hints and buttons
      for(var h = 1; h <= 3; h++){
        if(responses[i].hasOwnProperty("hint"+h.toString())){
          var hinthtml = newSlide.getElementById("hint"+h.toString());
          hinthtml.textContent = responses[i]["hint"+h.toString()];
          hinthtml.id = "hint"+h.toString()+i.toString();

          var btn = newSlide.getElementById("hint-btn"+h.toString());
          btn.setAttribute('data-target', "#hint"+h.toString()+i.toString());
          btn.setAttribute('aria-control', "hint"+h.toString()+i.toString());
          btn.id = "hint-btn"+h.toString()+i.toString();
        }
        else{
          newSlide.getElementById("hint"+h.toString()).remove();
          newSlide.getElementById("hint-btn"+h.toString()).remove();
        }
      }

      $('.owl-carousel')
            .trigger('add.owl.carousel', [newSlide])
            .trigger('refresh.owl.carousel');
    }
  }
 makeCarouselSlides();