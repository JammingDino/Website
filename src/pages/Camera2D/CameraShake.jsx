import { Link } from "react-router-dom";
import CodeBox from "../../components/CodeBox";

const Camera2D  = () => {
    return <div className="content-container">
        <div className="font-semibold text-3xl p-5">Godot Engine 4.2 Documentation</div>
        <hr/>
        <h1>Camera Shake</h1>
        <p>Camera shake is a visual effect used in video games to create a sense of realism and immersion. It refers to the subtle, rapid movement or vibration of the camera view, often in response to in-game events like: Explosions or collisions, Character movements (e.g., running, jumping, or landing), Weapon firing or impacts, Environmental effects (e.g., earthquakes or strong winds), The camera shake effect aims to simulate the natural movement and instability of a real-world camera, making the game feel more dynamic and engaging.</p>
        <p>How can we implement Camera shake in Godot?</p>
        <hr className="mt-5"/>
        <h1>Solution</h1>
        <p>We'll start by implementing the camera. Add a Camera2D to your scene, and attach a script to it. Define the parameters that control the shake behavior:</p>
        < CodeBox text="extends Camera2D

@export var decay : float = 0.8 #How quickly shaking will stop [0,1].
@export var max_offset : Vector2 = Vector2(100,75) #Maximum displacement in pixels.
@export var max_roll : float = 0.0 #Maximum rotation in radians (use sparingly).
@export var noise : FastNoiseLite #The source of random values.

var noise_y : int = 0 #Value used to move through the noise

var trauma : float = 0.0 #Current shake strength
var trauma_pwr : int = 3 #Trauma exponent. Use [2,3]" />
        <p>Since noise is now an export variable you need to set it up before you can make changes to its parameters in the code. Make sure you create a new FastNoiseLite in the inspector and set it to your liking. In my case, I only changed noise_type to Perlin.</p>
        <p>Create an add_trauma() function and randomize noise in _ready().</p>
        < CodeBox text="func _ready():
	randomize()
	noise.seed = randi()

func add_trauma(amount : float):
	trauma = min(trauma + amount, 1.0)" />
        <p>add_trauma() will be called to start the effect. The value passed should be between 0 and 1.</p>
        <p>Add this code to your _process() function. It will call a function to create the shake effect while slowly decreasing the trauma amount when trauma isn't equal to 0. </p>
        < CodeBox text="func _process(delta):
	if trauma:
		trauma = max(trauma - decay * delta, 0)
		shake()
        #optional
        elif offset.x != 0 or offset.y != 0 or rotation != 0:
		lerp(offset.x,0.0,1)
		lerp(offset.y,0.0,1)
                lerp(rotation,0.0,1)" />
        <p>Finally, create a shake() function. This function will change our camera parameters to create the shake effect.</p>
        < CodeBox text="func shake(): 
	var amt = pow(trauma, trauma_pwr)
	noise_y += 1
	rotation = max_roll * amt * noise.get_noise_2d(0, noise_y)
	offset.x = max_offset.x * amt * noise.get_noise_2d(1000, noise_y)
	offset.y = max_offset.y * amt * noise.get_noise_2d(2000, noise_y)" />
        <p>This should produce a nice effect. Called by the add_trauma() function, passing a value of 0 - 1 to activate, if you want to be able to pass negative numbers a simple change can be made.</p>
        < CodeBox text="func add_trauma(amount : float):
    trauma = min(trauma + abs(amount), 1.0)" />
        <p>By replacing this, it ensures that we are taking the absolute amount (abs() turns negative numbers to positive) and means that you can pass negative numbers and still have it take effect</p>
        <p>The entire script should look like this, and we can call the camera shake with the desired amount of shake though add_trauma(amount(0-1)).</p>
        < CodeBox text="extends Camera2D

@export var decay : float = 0.9 #How quickly shaking will stop [0,1].
@export var max_offset : Vector2 = Vector2(100,75) #Maximum displacement in pixels.
@export var max_roll : float = 0.0 #Maximum rotation in radians (use sparingly).
@export var noise : FastNoiseLite #The source of random values.

var noise_y : int = 0 #Value used to move through the noise

var trauma : float = 0.0 #Current shake strength
var trauma_pwr : int = 3 #Trauma exponent. Use [2,3]

func _ready():
	randomize()
	noise.seed = randi()

func add_trauma(amount : float):
        trauma = min(trauma + abs(amount), 1.0)

func _process(delta):
	if trauma:
		trauma = max(trauma - decay * delta, 0)
		shake()
	elif offset.x != 0 or offset.y != 0 or rotation != 0:
		lerp(offset.x,0.0,1)
		lerp(offset.y,0.0,1)
		lerp(rotation,0.0,1)

func shake(): 
	var amt = pow(trauma, trauma_pwr)
	noise_y += 1
	rotation = max_roll * amt * noise.get_noise_2d(0, noise_y)
	offset.x = max_offset.x * amt * noise.get_noise_2d(1000, noise_y)
	offset.y = max_offset.y * amt * noise.get_noise_2d(2000, noise_y)" />
        <p>A lot of nuance can be set and tweaked by going through the options in FastNoiseLite. Thank you <a href="https://kidscancode.org/godot_recipes/3.x/2d/screen_shake/index.html" target="_blank">KidsCanCode for the original implementation</a>. Thank you for reading reader!</p>
    </div>
}

export default Camera2D;