import { Link } from "react-router-dom";

const Camera2D  = () => {
    return <div className="content-container">
        <div className="font-semibold text-3xl p-5">Godot Engine 4.2 Documentation</div>
        <hr/>
        <h1>Camera 2D</h1>
        <p>Camera node for 2D scenes. It forces the screen (current layer) to scroll following this node. This makes it easier (and faster) to program scrollable scenes than manually changing the position of CanvasItem-based nodes.</p>
        <p>Cameras register themselves in the nearest Viewport node (when ascending the tree). Only one camera can be active per viewport. If no viewport is available ascending the tree, the camera will register in the global viewport.</p>
        <p>Note that the Camera2D node's position doesn't represent the actual position of the screen, which may differ due to applied smoothing or limits. You can use get_screen_center_position to get the real position.</p>
        <p>See the <a href="https://docs.godotengine.org/en/stable/classes/class_camera2d.html">Camera2D</a> on godot's official documentation.</p>
        <hr className="mt-5"/>
        <h1>How to use Node</h1>
        <p>The Camera2D's most common use is as a player tracking camera, (a camera following the player) and within godot, that is very easy to implement. You simply have to add a Camera2D node to your scene as a child of your player node. If you want something like interprolation, so the camera takes time to travel from its old position to its new position, simply enable the position smoothing within its respective dropdown.</p>
        <p>Another easy thing to implement is position limiting, Simply open the Limit dropdown and you can set position limits from global (0,0). This will stop the camera from moving past these points but will have no effect on the moment of the player.</p>
        <hr className="mt-5"/>
        <h1>Tutorials</h1>
        <p>
            <li><a><Link to="/Camera2D/CameraShake">Camera Shake</Link></a></li>
        </p>
    </div>
}

export default Camera2D;