<template>
    <div class="container">
      <!-- SVG for Circle, Puck, and Options -->
      <h1 class="room-id">{{ this.currentRoom }}</h1>
      <div class="parent">
        <div class="div1">
          <h1>RONDE {{ 5 - options.length }}</h1>
        </div>
        <div class="div2">
          <h2>{{ minutes }}:{{ seconds }}</h2>
        </div>
        <div class="div3">
          <svg
            :width="size"
            :height="size"
            :viewBox="`0 0 ${size} ${size}`"
            xmlns="http://www.w3.org/2000/svg"
            @mousemove="calculateCursorPosition"
            @touchmove="calculateCursorPosition"
          >
            <defs>
              <radialGradient id="myGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style="stop-color: rgb(80, 140, 155); stop-opacity: 1" />
                <stop offset="100%" style="stop-color: rgb(19, 75, 112); stop-opacity: 1" />
              </radialGradient>
              <radialGradient id="optionGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style="stop-color: rgb(255, 255, 255); stop-opacity: 1" />
                <stop offset="100%" style="stop-color: rgb(80, 140, 155); stop-opacity: 1" />
              </radialGradient>
            </defs>
  
            <!-- Main Circle -->
            <circle
              :cx="size / 2"
              :cy="size / 2"
              :r="radius"
              stroke="#201E43"
              stroke-width="2"
              fill="#ECE6C5"
              fill-opacity="0.5"
            />
          
            <!-- Perimeter circle -->
            <circle
              :cx="size / 2"
              :cy="size / 2"
              :r="radius + 95"
              stroke="#201E43"
              stroke-width="4"
              fill="#ECE6C5"
              fill-opacity="0"
            />
  
            <!-- Slider (Magnet Emoji) -->
            <text
              :x="sliderPosition.x"
              :y="sliderPosition.y"
              font-size="24"
              text-anchor="middle"
              alignment-baseline="middle"
              @mousedown="startDrag"
              @touchstart="startDrag"
            >
              🧲
            </text>
  
            <!-- Render POIs -->
            <g v-for="(poi, index) in pois" :key="index">
              <circle :id="'poi-' + poi.name" :cx="poi.x" :cy="poi.y" r="8" fill="url(#optionGradient)" stroke="#201E43" stroke-width="1" />
  
              <text
                :x="poi.x + 12"
                :y="poi.y + 5"
                font-family="Arial"
                font-size="12"
                fill="#EEEEEE"
              >
                <tspan
                  v-for="(line, i) in splitText(poi.name)"
                  :x="poi.x + 12"
                  :dy="i ? 14 : 0"
                  :key="i"
                >
                  {{ line }}
                </tspan>
              </text>
            </g>
  
            <!-- Puck -->
            <circle :cx="puckPosition.x" :cy="puckPosition.y" r="10" fill="url(#myGradient)" />
  
            <!-- Cursor (Alien Emoji) -->
            <text
              v-for="(coord, id) in targetClientCoordinates"
              :key="id"
              :x="coord.x"
              :y="coord.y"
              font-size="24"
              text-anchor="middle"
              alignment-baseline="middle"
            >
              👾
            </text>
          </svg>
        </div>
        <div id="joystick-container"></div>
  
        <div class="div4">
          <ul>
            <li>RESULTATEN</li>
            <li :id="'result-' + index" v-for="(item, index) in rankings" :key="index"> #{{ index + 1 }}: {{ item }} </li>
          </ul>
        </div>
        <div class="div5">
          <!-- <h3>Instructions : Place your mouse along the edges to give your preference. The round will restart if the group does not converge to one decision. </h3> -->
        </div>
      </div>
      <div v-if="showPopup" class="modal-overlay">
        <div class="modal-content">
          <h2>{{ popUpReason }}</h2>
          <h1>{{ countdown }}</h1>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getSocket } from '../utils/socket';
  import gsap from "gsap";
  
  
  export default {
    data() {
      return {
        size: 500,
        radius: 150,
        centre: { x: 250, y: 250},
        options: [],
        popUpReason: "Starting swarm",
        results: [], // This will act as leaderboard (ranking)
        ids: [],
        resultsIds: [],
        puckPosition: { x: 250, y: 250 },
        targetPuckPosition: { x: 250, y: 250 }, 
        cursorPosition: { x: 250, y: 250 },
        targetClientCoordinates: {}, // Store the client coordinates
        rankings: [], // To store the rankings
        minutes: 0,
        seconds: 30,
        intervalId: null,
        socket: null,
        roundInProgress: true, // Track if the round is still active
        mouseEnabled: true,
        showPopup: false,
        countdown: 3,
        firstName: "",
        lastName: "",
        sliderAngle: 45, // Angle in radians
        isDragging: false,
      };
    },
    computed: {
      centerX() {
        return this.centre.x;
      },
      centerY() {
        return this.centre.y;
      },
      pois() {
        return this.getPoiCoords(this.options.length, this.centre, this.radius);
      },
      perimeterRadius() {
        return this.radius + 95; // Outer circle radius
      },
      sliderPosition() {
        return {
            x: this.centerX + this.perimeterRadius * Math.cos(this.sliderAngle),
            y: this.centerY + this.perimeterRadius * Math.sin(this.sliderAngle),
        };
      },
    },
    methods: {
      getPoiCoords(numPoi, centre, radius) {
        const poiCoords = [];
        const angle = 360 / numPoi;
  
        for (let i = 0; i < numPoi; i++) {
          let newAngle = (angle * i) * (Math.PI / 180);  // Convert degrees to radians
          if (numPoi == 3){
            newAngle = ((angle * i) + 45) * (Math.PI / 180);  // Convert degrees to radians
          }
          const newX = centre.x + radius * Math.cos(newAngle);
          const newY = centre.y + radius * Math.sin(newAngle);
  
          poiCoords.push({
            x: newX,
            y: newY,
            name: this.options[i]
          });
        }
  
        return poiCoords;
      },
  
      splitText(text) {
        const maxLength = 15; // Set the max characters per line
        const lines = [];
  
        for (let i = 0; i < text.length; i += maxLength) {
          lines.push(text.slice(i, i + maxLength));
        }
  
        return lines;
      },
  
      startDrag(event) {
        this.isDragging = true;
        this.mouseEnabled = true;
        document.addEventListener("mousemove", this.dragSlider);
        document.addEventListener("mouseup", this.stopDrag);
        document.addEventListener("touchmove", this.dragSlider);
        document.addEventListener("touchend", this.stopDrag);
      },
      dragSlider(event) {
        if (!this.isDragging) return;
  
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;
        const bounds = event.target.closest("svg").getBoundingClientRect();
        const mouseX = clientX - bounds.left;
        const mouseY = clientY - bounds.top;
  
        const dx = mouseX - this.centerX;
        const dy = mouseY - this.centerY;
        this.sliderAngle = Math.atan2(dy, dx);
      },
      stopDrag() {
        this.isDragging = false;
        document.removeEventListener("mousemove", this.dragSlider);
        document.removeEventListener("mouseup", this.stopDrag);
        document.removeEventListener("touchmove", this.dragSlider);
        document.removeEventListener("touchend", this.stopDrag);
      },
  
      calculateCursorPosition(){
        this.cursorPosition = {
            x: this.sliderPosition.x,
            y: this.sliderPosition.y,
        };    
      },
  
      optionSelected(selectedOption) {
        if (!this.rankings.includes(selectedOption)) {
          const id = this.ids[this.options.findIndex(element => element === selectedOption)];
          this.resultsIds.push(id);
          this.rankings.push(selectedOption);
          this.options = this.options.filter(option => option !== selectedOption);
          this.ids = this.ids.filter(hehe => hehe !== id);
  
          this.stopTimer(); // Stop timer when option is selected
  
          if (this.options.length === 1) {
            this.rankings.push(this.options[0]); // This is the ranked list
            this.resultsIds.push(this.ids[0]);
  
            this.options = [];
  
            this.$router.push({
              name: 'swarmresults',
              params: {
                results: JSON.stringify(this.rankings),
                resultsIds: JSON.stringify(this.resultsIds),
                firstName: this.firstName,
                lastName: this.lastName,
                currentRoom: this.currentRoom
              }
            });
          } else {
            this.resetRound();
          }
          this.socket.emit('puck-coordinates-data', {poiCoords: this.pois, room: this.currentRoom});
        }
      },
  
      
  
      animateOptionToList(poiName, startX, startY) {
    // Temporarily add the option to the DOM for the animation
    const tempElement = document.createElement("li");
    tempElement.id = `temp-${poiName}`;
    tempElement.textContent = `#${this.rankings.length + 1}: ${poiName}`;
    document.querySelector(".div4 ul").appendChild(tempElement);
  
    this.$nextTick(() => {
      const resultElement = document.getElementById(`temp-${poiName}`);
  
      if (resultElement) {
        const resultRect = resultElement.getBoundingClientRect();
        
        const floatingOption = document.createElement("div");
        floatingOption.textContent = poiName;
        floatingOption.style.position = "absolute";
        floatingOption.style.left = "50%";
        floatingOption.style.top = "50%";
        floatingOption.style.transform = "translate(-50%, -50%) scale(2)";
        // floatingOption.style.background = "white";
        floatingOption.style.left = `${startX}px`; // Set the starting X position
        floatingOption.style.top = `${startY}px`; // Set the starting Y position
        floatingOption.style.padding = "10px 15px";
        floatingOption.style.borderRadius = "20px";
        floatingOption.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
        floatingOption.style.zIndex = "1000";
        floatingOption.style.fontSize = "36px";
        floatingOption.style.fontWeight = "bold";
        floatingOption.style.fontFamily = "Helvetica";
        floatingOption.style.color = "white";
        floatingOption.style.opacity = "0";
        document.body.appendChild(floatingOption);
  
        gsap.to(floatingOption, {
          x: resultRect.left - startX + resultRect.width / 2,
          y: resultRect.top - startY + resultRect.height / 2,
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: "power2.out",
          onComplete: () => {
            document.body.removeChild(floatingOption);
            resultElement.remove();
  
            gsap.fromTo(
              resultElement,
              { scale: 1.2 },
              { scale: 1, duration: 0.1, ease: "elastic.out(1, 0.5)" }
            );
            this.optionSelected(poiName);
          },
        });
      }
    });
  },
  
      startCountdown(){
        this.countdownId = setInterval(() => {
          if (this.countdown == 0){
            clearInterval(this.countdownId);
            this.countdown = 3;
          } else {
            this.countdown--;
          }
        }, 1000);
      },
  
      startTimer() {
        this.timerId = setInterval(() => {
          if (this.seconds === 0) {
            if (this.minutes > 0) {
              this.minutes--;
              this.seconds = 59;
            } else {
              this.popUpReason = "Restarting round since no decision was made!";
              this.resetRound(); // Reset the round if timer hits 0:00
            }
          } else {
            this.seconds--;
          }
        }, 1000);
      },
  
      resetRound() {
        this.stopTimer();
        this.mouseEnabled = false;
        this.puckPosition = { x: this.centre.x, y: this.centre.y };
        for (let key in this.targetClientCoordinates) {
          if (this.targetClientCoordinates.hasOwnProperty(key)) {
            this.targetClientCoordinates[key] = { x: 250, y: 250 };
          }
        }      
        this.showPopup = true;
        this.startCountdown();
        setTimeout(() => {
          this.resetTimer(); // Reset and start the timer for the next round
          this.roundInProgress = true;
          this.showPopup = false;
          // this.mouseEnabled = true;
          // this.roundReady = true;
        }, 3000);
  
      },
  
      resetTimer() {
        this.minutes = 0; // Reset to 1 minute
        this.seconds = 30;
        this.startTimer(); // Start the timer again
      },
  
      stopTimer() {
        clearInterval(this.timerId); // Stop the current timer
      },
  
      sendCoordsToServer(){
        if (!this.intervalId) {
          this.intervalId = setInterval(() => {
            if (this.socket && this.mouseEnabled) {
              this.socket.emit('mouse-move', { room: this.currentRoom, cursorPosition: this.cursorPosition, puckPosition: this.puckPosition});
            }
          }, 100);
        }
      },
  
      setupSocket() {
        this.socket = getSocket();
  
        console.log('Swarming socket ID :', this.socket.id);
        this.currentRoom = "tutorial" + this.socket.id;
        this.socket.emit('connection-data', {radius: this.radius, centre: this.centre});
        this.socket.emit('puck-coordinates-data', {poiCoords: this.pois, room: this.currentRoom});
  
        this.socket.on('puck-move', (puckCoordinates) => {
          this.puckPosition = puckCoordinates[this.currentRoom];
        });
  
        this.socket.on('client-coordinates', (clientCoordinates) => {
          this.targetClientCoordinates = clientCoordinates[this.currentRoom];
          delete this.targetClientCoordinates[this.socket.id];
        });
  
        this.socket.on("puck-collision", (data) => {
          if (data.room === this.currentRoom) {
            const poiName = data.poiName;
            this.roundInProgress = false;
            this.mouseEnabled = false;
            this.popUpReason = "Swarm selected " + poiName + ". Going to next round!";
            
            const selectedPOI = this.pois.find((poi) => poi.name === poiName);
  
            if (selectedPOI) {
              const startX = selectedPOI.x;
              const startY = selectedPOI.y;
              this.animateOptionToList(poiName, startX, startY);
            }
          }
        });
      },
  
      lerp(start, end, t) {
        return start + (end - start) * t; 
      },
      
      preventTouchMove(event) {
        event.preventDefault();
      },
  
      animatePuck() {
        const lerpFactor = 0.08; // Adjust for smoothness (lower is smoother)
        this.puckPosition.x = this.lerp(this.puckPosition.x, this.targetPuckPosition.x, lerpFactor);
        this.puckPosition.y = this.lerp(this.puckPosition.y, this.targetPuckPosition.y, lerpFactor);
        requestAnimationFrame(this.animatePuck); // Call again for the next frame
      },  
    },
  
    mounted() {
      document.addEventListener("touchmove", this.preventTouchMove, { passive: false }); // Prevent scrolling when touching the screen
  
      // this.options = this.$route.params.titles;
      this.options = ["Option 1", "Option 2", "Option 3", "Option 4"];
      // this.ids = this.$route.params.ids;
      this.ids = [1, 2, 3, 4];
      this.firstName = this.$route.params.firstName;
      this.lastName = this.$route.params.lastName;
      
      this.setupSocket();

    


      if (this.options.length === 4) {
        this.showPopup = true;
        this.mouseEnabled = false;
        this.startCountdown();
  
        setTimeout(() => {
          this.showPopup = false;
        }, 3000);
  
      }
  
      // this.startTimer();
      // this.currentRoom = "tutorial" + this.socket.id;
      this.sendCoordsToServer();
    },
  
    beforeDestroy() {
      document.removeEventListener("touchmove", this.preventTouchMove, { passive: false });
    },
  };
  </script>
  <style scoped>
  
  .container {
    justify-content: center;
    align-items: center;
    background: radial-gradient(50% 50% at 50% 50%, rgb(80, 140, 155) 0%, rgb(19, 75, 112) 100%);
    font-family: 'Helvetica', 'Arial', sans-serif;
  }
  
  .container h1, .container h2, .container h3, .container p, .container li, .container text {
    color: #EEEEEE;
  }
  
  .room-id {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 1.5rem;
    color: #333;
  }
  
  .parent {
    height: 100vh;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 0px;
  }
  
  .div1, .div2, .div3, .div5 {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .div1 {
    grid-area: 1 / 1 / 2 / 5;
  }
  
  .div2 {
    grid-area: 1 / 5 / 2 / 6;
  }
  
  .div3 {
    grid-area: 2 / 1 / 5 / 5;
    flex-grow: 1;
  }
  
  .div4 {
    padding-top: 20%;
    grid-area: 2 / 5 / 5 / 6;
  }
  
  .div5 {
    grid-area: 5 / 1 / 6 / 6;
  }
  
  h1, h2, h3 {
    margin: 0;
  }
  
  li {
    list-style-type: none;
    padding: 5px;
    font-size: large;
  }
  
  div h3 {
    width: 40%;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    width: 80%;
    max-width: 400px;
  }
  
  .modal-content h1 {
    font-size: 6vw;
    color: black;
  }
  
  .modal-content h2 {
    font-size: 2vw;
    color: black;
  }
  
  /* RESPONSIVENESS */
  @media (max-width: 1024px) {
    .parent {
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: auto;
    }
  
    .div1 {
      grid-area: 1 / 1 / 2 / 4;
    }
  
    .div2 {
      grid-area: 2 / 1 / 3 / 4;
    }
  
    .div3 {
      grid-area: 3 / 1 / 4 / 4;
    }
  
    .div4 {
      grid-area: 4 / 1 / 5 / 4;
      padding-top: 10%;
    }
  
    .div5 {
      grid-area: 5 / 1 / 6 / 4;
    }
  
    li {
      font-size: medium;
    }
  }
  
  @media (max-width: 768px) {
    .parent {
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: auto;
    }
  
    .div1 {
      grid-area: 1 / 1 / 2 / 3;
    }
  
    .div2 {
      grid-area: 2 / 1 / 3 / 3;
    }
  
    .div3 {
      grid-area: 3 / 1 / 4 / 3;
    }
  
    .div4 {
      grid-area: 4 / 1 / 5 / 3;
    }
  
    .div5 {
      grid-area: 5 / 1 / 6 / 3;
    }
  
    li {
      font-size: small;
    }
  
    .room-id {
      font-size: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    .parent {
      grid-template-columns: 1fr;
    }
  
    .div1,
    .div2,
    .div3,
    .div4,
    .div5 {
      grid-area: auto;
    }
  
    .modal-content h1 {
      font-size: 12vw;
    }
  
    li {
      font-size: small;
      padding: 3px;
    }
  
    .div3 {
    display: flex;
    justify-content: center;
    align-items: center;
    background: radial-gradient(50% 50% at 50% 50%, rgb(80, 140, 155) 0%, rgb(19, 75, 112) 100%);
    height: 100%;
    width: 100%;
  }
  
  #joystick-container {
    position: absolute;
    bottom: 20px;
    left: 20px;
    width: 100px;
    height: 100px;
    /* background-color: rgba(255, 255, 255, 0.1); Ensure the container is visible */
  }
  
  svg {
    width: 70vw; /* The width of the SVG relative to the viewport */
    height: 70vw; /* Keep it square for the circle */
    max-width: 500px; /* Limit the size for larger screens */
    max-height: 500px;
  }
  
  @media (max-width: 768px) {
    svg {
      width: 80vw; /* Increase size for smaller screens */
      height: 80vw;
    }
  }
  
  @media (max-width: 480px) {
    svg {
      width: 90vw; /* Further adjust for small screens */
      height: 90vw;
    }
  }
  }
  </style>
  