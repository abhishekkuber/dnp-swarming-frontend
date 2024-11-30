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
        <!-- <h3>Anything more to add?</h3> -->
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

      // this.socket.emit('send-swarm-results', {
      //   firstName: this.firstName,
      //   lastName: this.lastName,
      //   swarmRating: this.rating,
      //   swarmComment: this.swarmComment
      // });

      this.$router.push({
        name: 'homepage',
        params: { firstName: this.firstName, lastName: this.lastName }
      });
    },
    setRating(star) {
      this.rating = star; // Set the rating based on the clicked star
    },
    setHoverRating(star) {
      this.hoverRating = star; // Update the hover rating based on the hovered star
    },
    setupSocket() {
      this.socket = getSocket();

      // Listen for connection to the server
      this.socket.on('connect', () => {
        console.log('Connected to server:', this.socket.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
    }
  },
  mounted() {
    // Sample data for testing
    // this.swarmResults = ["a", "b", "c", "d"];
    // this.swarmIds = ["1", "2", "3", "4"];
    // this.firstName = "abhishek";
    // this.lastName = "kuber";
    this.firstName = this.$route.params.firstName;
    this.lastName = this.$route.params.lastName;
    this.setupSocket();
    if (this.$route.params.results) {
      this.swarmResults = JSON.parse(this.$route.params.results); // Convert back to array
    }
    if (this.$route.params.resultsIds) {
      this.swarmIds = JSON.parse(this.$route.params.resultsIds); // Convert back to array
    }
    this.socket.emit('swarming-result-ids', this.swarmIds);
  },
  beforeDestroy() {
    this.socket.disconnect(); // Disconnect the socket when the component is destroyed
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
}

.container h1, .container h2, .container li, .container h3 {
  color: #EEEEEE; 
}

.container li {
  font-size: x-large;
}

button {
  margin: 20px;
  background-color: #2a93ad;
  color: #EEEEEE;
  border: 2px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #095466;
}

/* Star Rating Section */
.rating-container {
  text-align: center;
  margin: 20px 0;
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stars {
  display: inline-block;
}

.star {
  font-size: 40px;
  color: #ccc; /* Empty star color */
  cursor: pointer;
  transition: color 0.3s ease;
}

.star.filled {
  color: gold; /* Filled star color */
}

.star:hover {
  color: gold; /* Highlight on hover */
}

textarea{
  width: 50vh;
  margin-top: 20px;
}
</style>
