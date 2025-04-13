<template>
  <div class="homepage-container">
    <!-- Welcome Message -->
    <div class="welcome-message">
      <h1 v-if="isAdmin">Admin Panel</h1>
      <h1 v-else>Welkom bij de Swarm, {{ firstName }} {{ lastName }}!</h1>
    </div>

    <!-- Buttons for "Join Swarm" and "How to swarm?" -->
    <div class="buttons-container">
      <!-- <button v-if="isAdmin" class="join-swarm-button" @click="joinSwarm">Join een Swarm</button> -->
      <!-- <button v-if="isAdmin" class="how-to-swarm-button" @click="howToSwarm">Hoe werkt het?</button> -->
      <button v-if="!isAdmin" class="tutorial-button" @click="goToTutorial">Tutorial</button>
      <button v-if="!isAdmin" class="join-swarm" @click="joinRandomSwarm">Join swarm</button>
      
      <button v-if="isAdmin" class="add-new-poi-button" @click="addNewPOI">Voeg nieuwe informatie toe</button>
      <button v-if="isAdmin" class="delete-all-pois" @click="showDeleteWarning">Delete All Information</button>
      <button v-if="isAdmin" class="leaderboard" @click="goToLeaderboard">Leaderbord krijgen</button>
      <button v-if="isAdmin" class="changeSwarmSize" @click="changeSwarmSize">Change Swarm Size</button>
    </div>
    
    <div v-if="deleteWarning" class="modal-overlay">
      <div class="modal-content">
        <h2>Are you sure you want to delete the data?</h2>
        <!-- <p>Verbonden gebruikers in {{ currentRoom }}: {{ connectedUsers }}</p> -->
        <p>Once you do this, this cannot be undone</p>
        <!-- <p>De Swarm zal beginnen als we 5 mensen hebben</p> -->
        <button class="cancel-button" @click="deleteAllPOI">Ja, verwijder alles</button>
        <button @click="cancelDeleteWarning">Annuleren</button>
      </div>
    </div>

    <div v-if="showChangeSwarmSize" class="modal-overlay">
      <div class="modal-content">
        <h2>Put in the new swarm size</h2>
        <input type="number" v-model="adminSwarmSize" placeholder="Enter new swarm size" />
        <button @click="swarmSizeChanged">OK</button>
      </div>
    </div>

    <!-- Popup Modal for Waiting Room -->
    <div v-if="showPopup" class="modal-overlay">
      <div class="modal-content">
        <h2>Wachten tot andere Swarmers zich aansluiten...</h2>
        <!-- <p>Verbonden gebruikers in {{ currentRoom }}: {{ connectedUsers }}</p> -->
        <p>Verbonden gebruikers in de wachtenlijst: {{ connectedUsers }}</p>
        <!-- <p>De Swarm zal beginnen als we 5 mensen hebben</p> -->
        <!-- <button class="cancel-button" @click="leaveRoom">Annuleren</button> -->
      </div>
    </div>
  </div>
</template>

<script>
// import { createConnection } from '../utils/socket';
import { getSocket } from '../utils/socket';

export default {
  data() {
    return {
      showPopup: false,  // To control the popup visibility
      deleteWarning: false, // To control the delete warning visibility
      showChangeSwarmSize: false, // To control the change swarm size visibility
      adminSwarmSize: 1,
      connectedUsers: 0, // Track the number of connected users
      socket: null,
      firstName: '',
      lastName: '',
      currentRoom: '', // Track the current room
      isAdmin: false
    };
  },
  methods: {
    joinSwarm() {
      this.showPopup = true;  // Show the waiting popup
      this.socket.emit('join-waiting-room');  // Emit an event to join the waiting room
    },
    joinRandomSwarm(){
      this.showPopup = true;  // Show the waiting popup
      this.socket.emit('join-random-swarm');  // Emit an event to join the waiting room
    },
    joinRoom(room) {
      console.log(`Joining ${room}`);
      this.currentRoom = room;
      this.showPopup = true;  // Show the waiting popup
      this.socket.emit('join-room', room);
    },
    goToTutorial() {
      this.$router.push({
        name: 'tutorial_1',
        params: { firstName: this.firstName, lastName: this.lastName }
      });
    },
    leaveRoom() {
      this.showPopup = false;  // Close the popup
      this.socket.emit('leave-room', this.currentRoom);
      this.currentRoom = '';
    },
    addNewPOI() {
      this.$router.push({
        name: 'submitpoi',
        params: { firstName: this.firstName, lastName: this.lastName }
      }); 
    },
    howToSwarm() {
      window.open('https://www.youtube.com/watch?v=_vWc9B-ovzQ', '_blank');
    },
    goToLeaderboard() {
      this.$router.push({
        name: 'leaderboard',
        params: { firstName: this.firstName, lastName: this.lastName }
      });  
    },
    
    showDeleteWarning() {
      this.deleteWarning = true;  // Show the delete warning popup
    },
    cancelDeleteWarning() {
      this.deleteWarning = false;  // Close the delete warning popup
    },
    deleteAllPOI() {
      this.socket.emit('delete-all-pois');
      this.deleteWarning = false;  // Close the delete warning popup
    },

    changeSwarmSize() {
      this.showChangeSwarmSize = true;  // Show the change swarm size popup
    },
    swarmSizeChanged() {
      this.socket.emit('change-swarm-size', this.adminSwarmSize);
      this.showChangeSwarmSize = false;  // Close the change swarm size popup
    },


    setupSocket() {
      this.socket = getSocket();
      // Listen for updates to the user count in the current room
      this.socket.on('update-room-user-count', (data) => {
        this.currentRoom = data.room;
        this.connectedUsers = data.count;  // Update the user count in real-time
      });

      this.socket.on('update-user-ready-client', (data) => {
        this.connectedUsers = data;
      });

      // this.socket.on('pois-deleted', () => {
      //   alert('Deleted all data!');
      // });

      // Once enough users have joined, redirect to the poi page
      this.socket.on('start-swarming', (payload) => {
        this.$router.push({
          name: 'poiinformation',
          params: {
            titles: payload.drawnTitles,
            ids: payload.drawnIds,
            oneliners: payload.drawnOneliners,
            descriptions: payload.drawnDescriptions,
            userCount: payload.userCount,
            firstName: this.firstName,
            lastName: this.lastName,
            room: this.currentRoom
          }
        });  // Redirect to the poi page
      });

      // Listen for disconnect
      this.socket.on('disconnect', (reason) => {
        this.socket.disconnect();
        // console.log('Disconnected from server');
      });
    }
  },
  mounted() {
    // Set up the socket connection when the component is mounted
    // this.socket = createConnection();
    this.setupSocket();
    this.firstName = this.$route.params.firstName;
    this.lastName = this.$route.params.lastName;
    if (this.firstName !== 'admin' && this.lastName !== 'admin'){
      // this.joinRandomSwarm();
    } else {
      this.isAdmin = true;
      // this.socket.emit('admin-joining');
    }
  },
};
</script>

<style scoped>
/* Styling for the homepage container */
.homepage-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* Center items horizontally */
  height: 100vh;
  padding: 20px;
  background: radial-gradient(50% 50% at 50% 50%, rgb(80, 140, 155) 0%, rgb(19, 75, 112) 100%);
  font-family: 'Helvetica', 'Arial', sans-serif;
}

.homepage-container h1 {
  color: #EEEEEE; 
  font-size: 50px;
  text-align: center;
}

/* Styling for the welcome message */
.welcome-message {
  margin-bottom: 20px; /* Add margin below the heading */
  text-align: center;
}

/* Styling for the buttons container */
.buttons-container {
  display: flex; /* Use flexbox for layout */
  flex-direction: column; /* Stack buttons vertically on mobile */
  gap: 10px; /* Add space between buttons */
  width: 100%;
  max-width: 400px;
  align-items: center;
}

/* Styling for buttons */
button {
  background-color: #2a93ad;
  color: #EEEEEE;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  width: 100%; /* Make buttons full-width on mobile */
  max-width: 300px;
}

button:hover {
  background-color: #095466;
}

/* Modal overlay background */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal content box */
.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  width: 90%;
  max-width: 400px;
}

/* Cancel button inside the modal */
.cancel-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  margin-top: 20px;
  margin-bottom: 5px;
  cursor: pointer;
  border-radius: 5px;
}

.cancel-button:hover {
  background-color: #c82333;
}
</style>