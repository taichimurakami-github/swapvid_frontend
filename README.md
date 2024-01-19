<div style="display:grid; place-items:center;"> 
  <img src="https://github.com/taichimurakami-github/swapvid_frontend/assets/64308722/e56ab988-60c0-4cf8-ae1e-430f036c0483" />
</div>

# SwapVid Frontend


A frontend component of SwapVid application, built on Vite + TypeScript + React.  
Please visit **[SwapVid demonstration app website](https://swapvid-demo.web.app)** to use built version of this app.

This app contains below component of SwapVid:
- SwapVid user interface
- SwapVid Desktop application

## Getting started

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Install WSL2 (for windows)
3. Install [GNU Make](https://www.gnu.org/software/make/) (optional)

## Usage

The command `make run` activates the container and dev server. After the container runs, you can access dev mode of SwapVid from http://localhost:3070

And if you want to build the app, please use  `make build` command.

You can use `make deploy` command to build and deploy the development build.


## Components

```mermaid
classDiagram

  class Store{
    <<Provider/jotai>>
    Provides app global states.
  }

  class App{
    <<Container>>

    Application's root.
  }

  class AppConfig{
    <<Container>>

    Renders application's settings.
  }

  class AssetPicker {
    <<Container>>

    Renders a form for users to select the assets
    used in this application.
  }

  class SwapVidPlayerRoot {
    <<Container>>
    Player's root.
  }

  class PlayerCombinedView {
    <<Presentation>>

    Renders combined view mode.
  }

  class PlayerParallelView {
    <<Presentation>>

    Renders parallel view mode.
  }

  class DocumentOverview {
    <<Container>>
  }

  class DocumentPlayer {
    <<Container>>
    1. Renders document.
    2. Binds user viewport on document.
    3. Binds current viewport in the video to rendered document.
  }


  class VideoPlayer{
    <<Container>>
    1. Renders video component.
    2. Binds video-related data to app states.
  }

  class VideoToolbar{
    <<Container>>
    1. Renders video toolbar.
    2. Binds user's mainpulation to video component.
  }


  class VideoSeekbar{
    <<Container>>
    1. Renders video seekbar.
    2. Binds user's mainpulation to video component.
  }

  class VideoSubtitles{
    <<Container>>
    1. Renders subtitles of the video.
    2. Loads current subtitles data syncronized to video current time.
  }


  App --> SwapVidPlayerRoot
  App --> AppConfig
  App --> AssetPicker

  SwapVidPlayerRoot --> PlayerCombinedView
  SwapVidPlayerRoot --> PlayerParallelView


  PlayerCombinedView --> DocumentOverview
  PlayerCombinedView --> DocumentPlayer
  PlayerCombinedView --> VideoPlayer
  PlayerCombinedView --> VideoSeekbar
  PlayerCombinedView --> VideoToolbar
  PlayerCombinedView --> VideoSubtitles


  PlayerParallelView --> DocumentOverview
  PlayerParallelView --> DocumentPlayer
  PlayerParallelView --> VideoPlayer
  PlayerParallelView --> VideoSeekbar
  PlayerParallelView --> VideoToolbar
  PlayerParallelView --> VideoSubtitles
```
