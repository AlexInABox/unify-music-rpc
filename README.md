[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]




<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/alexinabox/unify-music-rpc">
    <img src="assets/logo-png-enhanced.png" alt="Logo" width="200" height="200">
  </a>

<h3 align="center">unify-music-rpc</h3>

  <p align="center">
    unify-music-rpc - built for myself, but you can use it too!
    <br />
    <a href="https://github.com/alexinabox/unify-music-rpc/issues">Report Bug</a>
    ·
    <a href="https://github.com/alexinabox/unify-music-rpc/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#daemonize">Daemonize</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
<div style="grid-template-columns: 1fr 1fr; padding: 10px; margin: 20px auto; display: grid; grid-gap: 10px;" allign="left">

<div style="grid-column: 1 / span 1;
	grid-auto-rows: min-content;">
    <div>
        <a href="https://alexinabox.github.io/unify-music-rpc/">
            <img src="https://raw.githubusercontent.com/AlexInABox/unify-music-rpc/dev/assets/example1.png" alt="Desktop 1">
        </a>
    </div>
    <div>
        <a href="https://alexinabox.github.io/unify-music-rpc/">
            <img src="https://raw.githubusercontent.com/AlexInABox/unify-music-rpc/dev/assets/full_example3.png" alt="Red Desktop">
        </a>
    </div>
    <div>
        <a href="https://alexinabox.github.io/unify-music-rpc/">
            <img src="https://raw.githubusercontent.com/AlexInABox/unify-music-rpc/dev/assets/full_example2.png" alt="iPad full">
        </a>
    </div>
    <div>
        <a href="https://alexinabox.github.io/unify-music-rpc/">
            <img src="https://raw.githubusercontent.com/AlexInABox/unify-music-rpc/dev/assets/example2.png" alt="Desktop 2">
        </a>
    </div>
    </div>
<div style="grid-column: span 1 / -1;
  grid-auto-rows: min-content;">
<div>
        <a href="https://alexinabox.github.io/unify-music-rpc/">
            <img src="https://raw.githubusercontent.com/AlexInABox/unify-music-rpc/dev/assets/example4.png" alt="Desktop zoom">
        </a>
    </div>
    <div>
        <a href="https://alexinabox.github.io/unify-music-rpc/">
            <img src="https://raw.githubusercontent.com/AlexInABox/unify-music-rpc/dev/assets/example3.png" alt="Phone 1">
        </a>
    </div>
    <div>
        <a href="https://alexinabox.github.io/unify-music-rpc/">
            <img src="https://raw.githubusercontent.com/AlexInABox/unify-music-rpc/dev/assets/full_example.png" alt="Desktop whole">
        </a>
    </div>
    </div>
</div>


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

Funny project. Easy to use!

### Prerequisites

This project requires NodeJS (version 8 or later) and NPM. Node and NPM are really easy to install. To make sure you have them available on your machine, try running the following command.

```sh
$ npm -v && node -v
6.4.1
v8.16.0
```

(your output should look something like this if and only if you have those tools installed. if not, consider installing them! duh)

### Installation

1. Clone the repo into the websites root directory
   ```sh
   git clone https://github.com/alexinabox/unify-music-rpc
   ```
2. Navigate to the directory
   ```sh
   cd unify-music-rpc
   ```

3. Install NPM packages
   ```sh
   npm install
   ```

4. start the script and watch the initial output:
   ```sh
   node index.js
   ```
5. the script will ask you to visit a google oauth page and to enter the provided code. (do that)

6. now you are logged in and cached your credentials. this action will must only be performed once every couple of months.

7. keep the script running in the background. (i suggest using a tool like pm2 reffered to in the next section)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Daemonize

The daemonization of this application ensures that it always runs in the background and also starts itself on boot! 


<br>

!!! **WARNING** !!! Before you deamonize this application, make sure to at least run unify-music-rpc once on your machine using the commands above! 

<br>

0. Navigate into the unify-music-rpc directory and install PM2:
    ```sh
    npm install pm2@latest -g
    ```
    or
    ```sh
    yarn global add pm2
    ```

1. Start the application with PM2:
    ```sh
    pm2 start index.js --name "unify-music-rpc"
    ```

2. Save the process list so that PM2 can automatically restart your app on reboot:
    ```sh
    pm2 save
    ```
3. To monitor all of your processes:
    ```sh
    pm2 monit
    ```
<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ROADMAP -->
## Roadmap

- [ ] better dynamic backround (just like apple music)
- [ ] api endpoint for other applications to use
- [ ] turing machine
    - [ ] my teacher would love it!

See the [open issues](https://github.com/alexinabox/unify-music-rpc/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Bla Bla Bla learning bla bla bla open-source bla bla bla **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request (write something neat so i know whats goin on)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the GNU General Public License v3.0 License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

AlexInABox - [@wilder_Alex__](https://twitter.com/wilder_Alex__) - main@alexinabox.de

Project Link: [https://github.com/alexinabox/unify-music-rpc](https://github.com/alexinabox/unify-music-rpc)

Website: [https://alexinabox.de](https://alexinabox.de)

Example Page: [https://alexinabox.de/music/](https://alexinabox.de/music/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []() [DALL-E 2](https://openai.com/product/dall-e-2) for the awesome logo
* []() [GitHub Copilot](https://copilot.github.com/) for always being there for me

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/alexinabox/unify-music-rpc.svg?style=for-the-badge
[contributors-url]: https://github.com/alexinabox/unify-music-rpc/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/alexinabox/unify-music-rpc.svg?style=for-the-badge
[forks-url]: https://github.com/alexinabox/unify-music-rpc/network/members
[stars-shield]: https://img.shields.io/github/stars/alexinabox/unify-music-rpc.svg?style=for-the-badge
[stars-url]: https://github.com/alexinabox/unify-music-rpc/stargazers
[issues-shield]: https://img.shields.io/github/issues/alexinabox/unify-music-rpc.svg?style=for-the-badge
[issues-url]: https://github.com/alexinabox/unify-music-rpc/issues
[license-shield]: https://img.shields.io/github/license/alexinabox/unify-music-rpc.svg?style=for-the-badge
[license-url]: https://github.com/alexinabox/unify-music-rpc/blob/master/LICENSE.txt
[product-screenshot]: assets/showcase1.png
[Express.js]: https://img.shields.io/badge/express.js-000000?style=for-the-badge&logo=expressdotjs&logoColor=white
[Express-url]: https://expressjs.com