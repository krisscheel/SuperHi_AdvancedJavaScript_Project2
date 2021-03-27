const API_KEY = 'Sht31H5GpyOaivGos5Y4d3yo1uVsUsJU'
//here we grab our search input
const searchEl = document.querySelector('.search-input')
const hintEl = document.querySelector('.search-hint')
//here we grab the videos element and append the newly created video to it
const videosEl = document.querySelector('.videos')
//this is for our clear search button
const clearEl = document.querySelector('.search-clear')

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length)
  return arr[randIndex]
}

function createVideo(src) {
  //createElement lets us create html elements inside of js
  const video = document.createElement('video')

  //here we can set attributes onto our created element using the dot notation
  video.src = src
  video.autoplay = true
  video.loop = true

  //this is how we set class names using javascript (it will overwrite them though)
  video.className = 'video'
  console.log(video)

  //when we use return we tell the function to give us something back
  return video
}

//when we search, show the loading spinner (by adding a class to the body)
//when successful, change the loading hint to say 'see more'
//on fail, let the user know there was an error

const toggleLoading = state => {
  console.log('we are loading', state)
  //in here we toggle the page loading state between loading and not loading
  document.body.classList.add('loading')
  //if our state is true, we add loading class
  if (state) {
    document.body.classList.add('loading')
    //here we disable the input so users can't interfere wit hit
    searchEl.disabled = true
  } else {
    //otherwise we remove loading class
    document.body.classList.remove('loading')
    // here we enable the input again
    searchEl.disabled = false
    searchEl.focus()
  }
}

const searchGiphy = searchTerm => {
  //here we toggle the loading screen so the user knows something is happening
  toggleLoading(true)
    fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=50&offset=0&rating=pg-13&lang=en`
  )
    //we use .then() to handle the response
    .then(response => {
      //here we need to. convert our response to JSON
      return response.json()
    })
    //we use .then() to handle the JSON data
    .then(json => {
      //json is a big piece of json data that we can work with
      //
      ////here we call our randomChoice function to give us back a random result from the array of images
      const gif = randomChoice(json.data)
      //here we look inside of the first result and grab the original mp4 src
      const src = gif.images.original.mp4
      console.log(src)

      const video = createVideo(src)


      videosEl.appendChild(video)

      video.addEventListener('loadeddata', event => {
        video.classList.add('visible')
        //here we toggle the loading state off again
        toggleLoading(false)
        document.body.classList.add('has-results')
        //change the hint text to see more results
        hintEl.innerHTML = `Hit enter to search more ${searchTerm}`
      })
    })
    .catch(error => {
      //lastly, we can use .catch() to do something if our fetch fails
      toggleLoading(false)
      hintEl.innerHTML = `nothing found for ${searchTerm}`
    })
}
// here we separate out our keyup function and we can call to it in various places in our code
const doSearch = event => {
  //here we grab the search input value and save in a variable
  const searchTerm = searchEl.value

  if (searchTerm.length > 2) {
    hintEl.innerHTML = `hit enter to search ${searchTerm}`
    document.body.classList.add('show-hint')
  } else {
    document.body.classList.remove('show-hint')
  }
  //we only want to run our search when we have a search term that is longer than 2 characters
  //and also when the users presses the enter key
  if (event.key === 'Enter' && searchTerm.length > 2) {
    searchGiphy(searchTerm)
  }
}

const clearSearch = event => {
  //this toggles our results state off again
  document.body.classList.remove('has-results')
  // here we reset all the content on our video and hint elements
  videosEl.innerHTML = ''
  hintEl.innerHTML = ''
  searchEl.value = ''
  // here we focus the input cursor back on our input
  searchEl.focus()
}


//here we listen out for keyup events globally across the whole page
document.addEventListener('keyup', event => {
  //if we press the esc key, fire the clear search function
  if (event.key === 'Escape') {
    clearSearch()
  }
})

//we listen for the key up event on our search input
searchEl.addEventListener('keyup', doSearch)
clearEl.addEventListener('click', clearSearch)
