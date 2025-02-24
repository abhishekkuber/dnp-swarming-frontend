<!-- Skeleton for creating a stand alone vue page -->

<template>
    <div class="container">
        <div class="parent">
            <div class="div1"> 
                <h1>Informatie Leaderbord</h1>
                <!-- <h1>Top 10 information</h1> -->
            </div>
            <div class="div2"> 
                <p>De volgende lijst toont de top onderwerpen op basis van eerdere swarms binnen de politie. Deze resultaten zijn voortgekomen uit collectieve besluitvormingsprocessen.</p>
                <!-- <p>The following list shows the top-ranked pieces of information based on previous swarms. These results emerged from collective decision-making processes and provide a good overview of the most important themes from different subjects.</p> -->
            </div>
            <div class="div3"> 
                <table>
          <thead>
            <tr>
              <th>Onderwerp</th>
              <th>Mu</th>
              <th>Sigma</th>
              <th>Swarm Score</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in leaderboard" :key="index">
              <td>{{ item.title }}</td>
              <td>{{ item.mu }}</td>
              <td>{{ item.sigma }}</td>
              <td>{{ item.swarmScore }}</td>
            </tr>
          </tbody>
        </table>
            </div>
        </div>
        <div class="div4"> 
                <!-- <button @click="goToHomepage">Go back to home page</button> -->
                <button @click="goToHomepage">Ga terug naar de hoofdpagina</button>
        </div>
    </div>
  </template>
  
  <script>

import { getSocket } from '../utils/socket';


export default {
    data() {
        return {
            leaderboard: [],
            firstName: '',
            lastName: ''
        };
    },
    computed: {
        
    },
    methods: {
        goToHomepage(){
            this.$router.push({
                name: 'homepage',
                params: { firstName: this.firstName, lastName: this.lastName }
            });
        }
    },
    mounted() {
        this.socket = getSocket();
        // Emit the get-leaderboard event when the component is mounted
        this.firstName = this.$route.params.firstName;
        this.lastName = this.$route.params.lastName;
        this.socket.emit('get-leaderboard');

        // Listen for the leaderboard event from the backend
        this.socket.on('leaderboard', (data) => {
            this.leaderboard = data;
            console.log(this.leaderboard);
        });
    },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: radial-gradient(50% 50% at 50% 50%, rgb(80, 140, 155) 0%, rgb(19, 75, 112) 100%);
  font-family: 'Helvetica', 'Arial', sans-serif;
  min-height: 100vh;
  height: auto;
  width: 100%;
  background-size: cover;
  padding: 20px;
}


.container h1, .container h2, .container h3, .container p, .container li, .container text {
  color: #EEEEEE; 
}
/* .parent {
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    height: 80vh;
    width: 60%;
    padding: 20px;
} */

.parent {
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto; /* Allow rows to expand dynamically */
    grid-row-gap: 20px;
    width: 60%;
    padding: 20px;
    height: auto; /* Remove fixed height */
    min-height: 80vh; /* Ensures minimum height but allows expansion */
}

.div1 h1{
    font-size: 50px;
}

.div1 { 
    text-align: center;
    grid-area: 1 / 1 / 2 / 2; 
}
.div2 { 
    grid-area: 2 / 1 / 3 / 2; 
}

.div2 p{
    font-size: 20px;
    
}
.div3 { 
    grid-area: 3 / 1 / 4 / 2; /* Adjust grid area if needed */
    background-color: rgba(244, 244, 244, 0.5);
    border-radius: 8px;
    padding: 20px;
    /* height: auto; Adjust height to fit content */
    color: #333;
}

.div3 ul {
    list-style-type: none; /* Remove bullets if needed */
    font-size: 3vh;
}

.div3 li {
    color: #333; 
}
.div3 table {
  width: 100%;
  border-collapse: collapse;
}

.div3 th, .div3 td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.div3 th {
  background-color: #2a93ad;
  color: white;
  font-weight: bold;
}

.div3 tr:nth-child(even) {
  background-color: #f2f2f2;
}

.div3 tr:hover {
  background-color: #ddd;
}
.div4 { 
    grid-area: 4 / 1 / 5 / 2; /* Ensure div4 is on its own row */
    text-align: center; /* Center the button horizontally */
}

.div4 button {
    background-color: #dc3545;
    color: #FFFFFF;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
}

.div4 button:hover {
    background-color: #c82333;
}


  </style>
  