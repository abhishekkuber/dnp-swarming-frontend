<template>
  <div class="homepage-container">
    <!-- Welcome Message -->
    <div class="welcome-message">
      <h1>Welkom bij de Swarm, {{ firstName }} {{ lastName }}!</h1>
    </div>

    <!-- Buttons for "Join Swarm" and "How to swarm?" -->
    <div class="buttons-container">
      <button class="join-swarm-button" @click="joinSwarm">Join een Swarm</button>
      <button class="how-to-swarm-button" @click="howToSwarm">Hoe werkt het?</button>
      <button class="add-new-poi-button" @click="addNewPOI">Voeg nieuwe informatie toe</button>
      <button class="leaderboard" @click="goToLeaderboard">Top 10</button>
      <button class="joinroom1" @click="joinRoom('room1')">Join Room 1</button>
      <button class="joinroom2" @click="joinRoom('room2')">Join Room 2</button>
      <button class="joinroom3" @click="joinRoom('room3')">Join Room 3</button>
    </div>

    <!-- Popup Modal for Waiting Room -->
    <div v-if="showPopup" class="modal-overlay">
      <div class="modal-content">
        <h2>Wachten tot andere Swarmers zich aansluiten...</h2>
        <p>Verbonden gebruikers in {{ currentRoom }}: {{ connectedUsers }}</p>
        <button class="cancel-button" @click="leaveRoom">Annuleren</button>
      </div>
    </div>
  </div>
</template>

<script>
import { createConnection } from '../utils/socket';

export default {
  data() {
    return {
      showPopup: false,  // To control the popup visibility
      connectedUsers: 0, // Track the number of connected users
      socket: null,
      firstName: '',
      lastName: '',
      currentRoom: '' // Track the current room
    };
  },
  methods: {
    joinSwarm() {
      this.showPopup = true;  // Show the waiting popup
      this.socket.emit('join-waiting-room');  // Emit an event to join the waiting room
    },
    joinRoom(room) {
      console.log(`Joining ${room}`);
      this.currentRoom = room;
      this.showPopup = true;  // Show the waiting popup
      this.socket.emit('join-room', room);
    },
    leaveRoom() {
      this.showPopup = false;  // Close the popup
      this.socket.emit('leave-room', this.currentRoom);
      this.currentRoom = '';
    },
    addNewPOI() {
      this.$router.push({
        name: 'addpoi',
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
    setupSocket() {
      console.log('PRINTING FROM THE SETUP SOCKET FUNCTION');
      console.log('Homepage socket : ', this.socket.id);

      // Listen for updates to the user count in the current room
      this.socket.on('update-room-user-count', (data) => {
        if (data.room === this.currentRoom) {
          this.connectedUsers = data.count;  // Update the user count in real-time
        }
      });

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
      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
    }
  },
  mounted() {
    // Set up the socket connection when the component is mounted
    this.socket = createConnection();
    this.firstName = this.$route.params.firstName;
    this.lastName = this.$route.params.lastName;
    this.setupSocket();
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
}

/* Styling for the welcome message */
.welcome-message {
  margin-bottom: 20px; /* Add margin below the heading */
}

/* Styling for the buttons container */
.buttons-container {
  display: flex; /* Use flexbox for layout */
  gap: 10px; /* Add space between buttons */
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
  width: 300px;
}

/* Cancel button inside the modal */
.cancel-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  margin-top: 20px;
  cursor: pointer;
  border-radius: 5px;
}

.cancel-button:hover {
  background-color: #c82333;
}
</style>