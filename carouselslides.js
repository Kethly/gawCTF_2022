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
      if(responses[i].hasOwnProperty("hint1")){
        var hinthtml = newSlide.getElementById("hint1");
        hinthtml.textContent = responses[i]["hint1"];
        hinthtml.id = "hint1"+i;

        var btn = newSlide.getElementById("hint-btn1");
        btn.setAttribute('data-target', "#hint1"+i);
        btn.setAttribute('aria-control', "hint1"+i);
        btn.id = "hint-btn1"+i;
      }
      else{
        newSlide.getElementById("hint1").remove();
        newSlide.getElementById("hint-btn1").remove();
      }
      if(responses[i].hasOwnProperty("hint2")){
        var hinthtml = newSlide.getElementById("hint2");
        hinthtml.textContent = responses[i]["hint2"];
        hinthtml.id = "hint2"+i;

        var btn = newSlide.getElementById("hint-btn2");
        btn.setAttribute('data-target', "#hint2"+i);
        btn.setAttribute('aria-control', "hint2"+i);
        btn.id = "hint-btn2"+i;
      }
      else{
        newSlide.getElementById("hint2").remove();
        newSlide.getElementById("hint-btn2").remove();
      }
      if(responses[i].hasOwnProperty("hint3")){
        var hinthtml = newSlide.getElementById("hint3");
        hinthtml.textContent = responses[i]["hint3"];
        hinthtml.id = "hint3"+i;

        var btn = newSlide.getElementById("hint-btn3");
        btn.setAttribute('data-target', "#hint3"+i);
        btn.setAttribute('aria-control', "hint3"+i);
        btn.id = "hint-btn3"+i;
      }
      else{
        newSlide.getElementById("hint3").remove();
        newSlide.getElementById("hint-btn3").remove();
      }

      $('.owl-carousel')
            .trigger('add.owl.carousel', [newSlide])
            .trigger('refresh.owl.carousel');
    }
  }
 makeCarouselSlides();