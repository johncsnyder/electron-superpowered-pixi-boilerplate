var PIXI = require('pixi.js')


// Initalize the PIXI webgl renderer
var renderer = new PIXI.WebGLRenderer(
  window.innerWidth,
  window.innerHeight,
  {resolution: window.devicePixelRatio}
)

// Create a stage to add content
var stage = new PIXI.Container()

// Resize the webgl canvas and re-render
function onResize () {
  var width = window.innerWidth
  var height = window.innerHeight
  renderer.resize(width, height)
  requestAnimationFrame(render)
}

// Render the stage
function render () {
  renderer.render(stage)
}


// Add some text
var text = new PIXI.Text('Hello World!', {fill : '#FFFFFF', fontSize: '20px'})
text.x = 50
text.y = 100
text.resolution = 2
stage.addChild(text)


// Load an test image sprite
let loader = PIXI.loader 

loader.add('play', 'resources/play.png')
loader.add('stop', 'resources/stop.png')

loader.once('complete', (loader, resources) => {
  var play = new PIXI.Sprite(resources.play.texture)
  play.x = 100
  play.y = 200
  play.width = 50
  play.height = 50
  play.interactive = true
  play.buttonMode = true
  play.on("click", function (eventData) {
    var source = audioCtx.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioCtx.destination)
    source.start()
    window.source = source
  })
  stage.addChild(play)

  var stop = new PIXI.Sprite(resources.stop.texture)
  stop.x = 200
  stop.y = 150
  stop.width = 100
  stop.height = 100
  stop.interactive = true
  stop.buttonMode = true
  stop.on("click", function (eventData) {
    window.source.stop()
  })
  stage.addChild(stop)

  render()
})


loader.load()


// Add rendered to document body
document.body.appendChild(renderer.view);
window.addEventListener('resize', onResize);