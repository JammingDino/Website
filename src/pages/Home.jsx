import CodeBox from "../components/CodeBox";

const Home  = () => {
    return <div className="content-container">
        <div className="font-semibold text-3xl p-5">Godot Engine 4.2 Documentation</div>
        <hr/>
        <h1>Indroduction</h1>
        <p>Welcome to the not-so-official documentation of Godot Engine, the free and open source community-driven 2D and 3D game engine! Behind this mouthful, you will find a powerful yet user-friendly tool that you can use to develop any kind of game, for any platform and with no usage restriction whatsoever.</p>
        <p>This page gives a broad overview of the engine and of this documentation, so that you know where to start if you are a beginner or where to look if you need information on a specific feature. Knowing that this is NOT the <a href="https://docs.godotengine.org/en/stable/index.html" target="_blank">Official Documentation</a>, and more so just a handful of more usecase specific information that I would have found useful when learning the engine, enjoy your stay.</p>
        <CodeBox text='func _ready() -> void:
    print("Hello World!")'/>
        <h1>About this documentation</h1>
        <p>This is NOT the official documentation, but instead a collection of useful Godot information. Within this documentation you will be able to find text tutorials, with a focus on smaller parts that can be used within a larger project rather than a start to finish guide on creating a game (though there may be some tutorials on simpler games). The documentation will explore actually using the given nodes in a followable way, and some cool smaller projects and how to re-create them inside of godot.</p>
    </div>
}

export default Home;