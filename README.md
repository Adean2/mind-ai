# MIND AI

## Description

MIND AI is a 3D interactive website designed to provide a unique perspective on the development and potential impacts of artificial intelligence within major economic industries. Central to the experience is a 3D model of an AI brain linked to the functions and vital parts of the human brain. By comparing the two, MIND AI educates users on how the human brain has influenced AI technology development, serving as a tool to understand its complexity.

Through interactive models, animations, and data, MIND AI offers an engaging and informative experience that allows users to explore AI’s societal impacts in fields such as Healthcare and Education. Each AI brain element contains research highlighting potential effects specific to that industry. Users can access this information by interacting with individual parts of the model. The research encourages a balanced view, promoting awareness of both the benefits and challenges of AI technology.

## Intended Purpose

While acknowledging the potential risks associated with AI, MIND AI’s core mission is to educate new users without fostering fear or alarm. Inspired by psychologist Alison Gopnik’s idea that focusing first on the positive or intriguing aspects opens new possibilities, the platform encourages an open-minded and critical approach to AI.

By providing information on ethical and social implications, MIND AI aims to foster critical thinking and informed adoption of AI technologies. Ultimately, it is a platform that highlights AI’s potential while promoting education and awareness for a better, balanced future.

## Technologies Used

- [three.js](https://threejs.org/) — for 3D rendering and interactive WebGL content  
- [Vite](https://vitejs.dev/) — as the build tool and development server  
- Custom 3D models integrated into the scene  
 
## Installation

To run or contribute to this project locally:
git clone https://github.com/yourusername/mind-ai.git
cd mind-ai
npm install
npm run dev
Open your browser at `http://localhost:3000` (or the port Vite specifies) to view the project locally.

## Usage

- Explore interactive 3D AI brain models.
- Click on individual brain parts to learn about industry-specific AI impacts.
- Navigate across multiple pages highlighting different economic sectors.

## Build for Production

To create a production-ready build:

npm run build
You can preview the build locally with:

## Folder Structure Overview

/public - Static assets (3D models, textures, favicon, etc.)
Source code (JavaScript, styling, components)
/dist - Production build output (generated after build)
README.md - Project documentation
package.json - Dependencies and scripts
vite.config.js - Vite configuration


## Deployment

This project is configured for modern hosting platforms like [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/), which support SPA routing and efficient delivery of interactive three.js content.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

Aidan Engler

---

Feel free to customize or expand this README whenever necessary!  
If you want, I can help you generate more detailed sections such as Contribution Guidelines or API details.