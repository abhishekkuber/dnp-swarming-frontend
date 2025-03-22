<template>
    <div class="container">
      <h1>Bedankt voor uw deelname!</h1>
      <h2>Hier zijn de resultaten:</h2>
      <ul>
        <li v-for="(item, index) in swarmResults" :key="index">#{{ index + 1 }}: {{ item }}</li>
      </ul>
      
      <!-- Star Rating Section -->
      <div class="rating-container">
        <h3>Beoordeel uw ervaring</h3>
        <div class="stars">
          <span 
            v-for="star in 5" 
            :key="star" 
            class="star" 
            :class="{ filled: star <= (hoverRating || rating) }" 
            @click="setRating(star)" 
            @mouseover="setHoverRating(star)" 
            @mouseleave="setHoverRating(0)">
            ★
          </span>
          <textarea v-model.lazy="swarmComment" rows="5" placeholder="Voer hier eventuele opmerkingen over het Swarm proces in"></textarea>
        </div>
      </div>
      
      <button @click="redirect">Ga terug naar de hoofdpagina</button>
    </div>
  </template>
  
  <script>
  import { getSocket } from '../utils/socket';
  
  export default {
    data() {
      return {
        swarmResults: [],
        swarmIds: [],
        socket: null,
        firstName: "",
        lastName: "",
        rating: 0,        
        hoverRating: 0,
        swarmComment: ""    
      };
    },
    methods: {
      redirect() {
        this.$router.push({
          name: 'homepage',
          params: { firstName: this.firstName, lastName: this.lastName }
        });
      },
      setRating(star) {
        this.rating = star;
      },
      setHoverRating(star) {
        this.hoverRating = star;
      },
      setupSocket() {
        this.socket = getSocket();
        this.socket.on('connect', () => {
          console.log('Connected to server:', this.socket.id);
        });
  
        this.socket.on('disconnect', () => {
          console.log('Disconnected from server');
        });
      }
    },
    mounted() {
      this.firstName = this.$route.params.firstName;
      this.lastName = this.$route.params.lastName;
      this.currentRoom = this.$route.params.currentRoom;
      this.setupSocket();
      if (this.$route.params.results) {
        this.swarmResults = JSON.parse(this.$route.params.results);
      }
    //   if (this.$route.params.resultsIds) {
    //     this.swarmIds = JSON.parse(this.$route.params.resultsIds);
    //   }
      
      this.socket.emit('tutorial-swarming-result-ids', {
        currentRoom: this.currentRoom
      });
    },
    beforeDestroy() {
      this.socket.disconnect();
    }
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: radial-gradient(50% 50% at 50% 50%, rgb(80, 140, 155) 0%, rgb(19, 75, 112) 100%);
    font-family: 'Helvetica', 'Arial', sans-serif;
    padding: 0 15px;
    box-sizing: border-box;
  }
  
  .container h1, .container h2, .container li, .container h3 {
    color: #EEEEEE;
    text-align: center;
  }
  
  .container li {
    font-size: 1.5rem;
    margin: 5px 0;
  }
  
  button {
    margin: 20px 0;
    background-color: #2a93ad;
    color: #EEEEEE;
    border: 2px solid #2a93ad;
    padding: 12px 24px;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #095466;
  }
  
  .rating-container {
    text-align: center;
    margin: 20px 0;
    width: 100%;
    max-width: 600px;
  }
  
  .stars {
    display: inline-block;
    margin-bottom: 10px;
  }
  
  .star {
    font-size: 2rem;
    color: #ccc;
    cursor: pointer;
    transition: color 0.3s ease;
  }
  
  .star.filled {
    color: gold;
  }
  
  .star:hover {
    color: gold;
  }
  
  textarea {
    width: 100%;
    max-width: 500px;
    margin-top: 10px;
    padding: 10px;
    font-size: 1rem;
    resize: vertical;
    box-sizing: border-box;
  }
  
  /* Responsive styling */
  @media (max-width: 768px) {
    .container {
      padding: 0 10px;
    }
    
    button {
      width: 100%;
      padding: 12px;
    }
  
    .rating-container {
      width: 90%;
    }
  
    .stars {
      font-size: 1.5rem;
    }
  
    .star {
      font-size: 1.8rem;
    }
  
    textarea {
      width: 100%;
    }
  }
  </style>
  