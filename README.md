# lorenz-webgl

[Lorenz attractor](https://en.wikipedia.org/wiki/Lorenz_system) new tab extension for Google Chrome implemented in WebGL.  

**[Live Demo](https://oliverkovacs.github.io/demo/lorenz/index.html)**

## Installation
Clone the repo  
```
git clone https://github.com/OliverKovacs/lorenz-webgl
```

Open Chrome and navigate to `chrome://extensions`.

Turn on `Developer mode`.

Click on `Load unpacked` and select the cloned repo.

## Settings

You can toggle the settings with `s`. If you open a new tab, the searchbar will be in focus, you can open the settings with `Tab s`.

Available Settings
- Speed: the speed of the lines
- Amount: the amount of lines
- Length: the amount of vertices per line
- Size: the size of the object
- Rotate: the speed at which the object is rotated

Shader Options:
- Time: the amount the color of a single vertex changes over time
- Offset: the amount the color changes between the same vertex of different lines
- Frequency: the amount the color changes from vertex to vertex in the same line
- Phase: the color of the first vertex of the first line at time 0

Note: Setting Amount and Length to a high value could result in poor performance.
