# amoy-ext-PixiParticles

### amoy-tool-plist2pixi-json
use this lib you need this tool [amoy-tool-plist2pixi-json](https://github.com/amoyjs/amoy-tool-plist2pixi-json)

Please see the examples for various pre-made particle configurations.

```js

let jsonData = a json data form app loaded

let config = jsondata.config;
let textureImge = "assets/"+jsondata.texture;


var emitter = new PIXI.particles.Emitter(

	// The PIXI.Container to put the emitter in
	// if using blend modes, it's important to put this
	// on top of a bitmap, and not use the root stage Container
	container,

	// The collection of particle images to use
	[IXI.Texture.fromImage(textureImge)],

	// Emitter configuration, edit this to change the look
	// of the emitter
	config
	
);

// Calculate the current time
var elapsed = Date.now();

// Update function every frame
var update = function(){

	// Update the next frame
	requestAnimationFrame(update);

	var now = Date.now();

	// The emitter requires the elapsed
	// number of seconds since the last update
	emitter.update((now - elapsed) * 0.001);
	elapsed = now;

	// Should re-render the PIXI Stage
	// renderer.render(stage);
};

// Start emitting
emitter.emit = true;

// Start the update
update();
```

## License
Released under the MIT License.
