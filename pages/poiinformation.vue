<!-- Skeleton for creating a stand alone vue page -->

<template>
    <div class="container">
        <div class="parent">
            <div class="div1">
                <!-- <h1>Welk van de volgende trends zal de grootste invloed hebben op politiewerk in 2030? U heeft 2 minuten om de onderwerpen te lezen.</h1> -->
                <h1>Wat gaan we doen na deze presentatie? U heeft 2 minuten om de onderwerpen te lezen.</h1>
                <!-- <h1>Here are the topics you'll be swarming about. You have 2 minutes to read them before swarming starts.</h1> -->
            </div>
            <div class="div2" @click="updateContent(options[0], descriptions[0])">
                <h2>{{ options[0] }}</h2>
                <h3> {{ oneliners[0] }} </h3>
            </div>
            <div class="div3" @click="updateContent(options[1], descriptions[1])">
                <h2>{{ options[1] }}</h2>
                <h3> {{ oneliners[1] }} </h3>
            </div>
            <div class="div4" @click="updateContent(options[2], descriptions[2])"> 
                <h2>{{ options[2] }}</h2>
                <h3> {{ oneliners[2] }} </h3>
            </div>
            <div class="div5" @click="updateContent(options[3], descriptions[3])">
                <h2>{{ options[3] }}</h2>
                <h3> {{ oneliners[3] }} </h3>
            </div>
            <div class="div6">
                <h2>{{ selectedTopic }}</h2>
                <p>{{ topicDescription }}</p>
            </div>
            <div class="div7">
                <p>Als u alles heeft gelezen, klik dan op ‘Doorgaan’. </p>
                <!-- <p>Once you have read everything, click on 'Ready' </p> -->
                <!-- Welk van de volgende trends zal de grootste invloed op politiewerk in 2030 hebben?
                    - refugees
                    - climate change
                    - mental health
                    - self driving cars
                    - legalization of drugs -->
                <button @click="goToNextStep">Doorgaan</button>
            </div>
            <div class="div8">
                <p>Timer: {{ timer }} seconden</p>
            </div>
        </div>
        <div v-if="showPopup" class="modal-overlay">
            <div class="modal-content">
                <h2>Wachten tot andere Swarmers zich klaar maken...</h2>
                <p>Aantal Swarmers gereed: {{ readyUsers }} / {{ userCount }}</p>
                <button class="cancel-button" @click="closePopup">Annuleren</button>
            </div>
        </div>
    </div>
  </template>
  
  <script>

import { getSocket } from '../utils/socket';

export default {
    data() {
        return {
            // selectedTopic: 'Select a topic',
            // topicDescription: 'To get information about the 4 topics you will be swarming over, please click on one of the topics', // Default description
            selectedTopic: 'Selecteer een onderwerp',
            topicDescription: 'Om informatie te krijgen over de 4 onderwerpen waar u over zult Swarmen, klikt u op een van de onderwerpen', // Default description
            timer: 120, 
            timerEnded: false,
            options: [], // To store topic titles
            ids: [], // To store topic IDs
            oneliners: [], // To store one-liners for each topic
            descriptions: [], // To store detailed descriptions for each topic
            showPopup: false ,
            readyUsers: 0,
            userCount: 0,
            socket: null,
            firstName: "",
            lastName: ""
        };
    },
    computed: {
      
    },
    methods: {
        setupSocket() {
            this.socket = getSocket();
            // Listen for connection to the server
            
            this.socket.on('update-user-ready-client', (data) =>{
                this.readyUsers = data;
            });
            
            this.socket.on('go-to-swarm', () => {
                this.$router.push({
                    name: 'swarming',
                    params: {
                        titles: this.options,
                        ids: this.ids,
                        firstName: this.firstName,
                        lastName: this.lastName
                    }
                })
            });

        },
        updateContent(topic, description) {
            this.selectedTopic = topic;
            this.topicDescription = description;
        },
        goToNextStep() {
            this.showPopup = true;
            this.socket.emit('user-ready');
            
            // You can implement the actual logic for moving to the next page or section here
        },
        closePopup(){
            this.showPopup = false;
            this.socket.emit('user-not-ready');
        },

        startTimer() {
            const interval = setInterval(() => {
                if (this.timer > 0) {
                this.timer--;
                } else {
                this.timerEnded = true; // Enable the button when timer ends
                clearInterval(interval); // Stop the timer
                this.socket.emit('reset-counts');
                this.$router.push({
                    name: 'swarming',
                    params: {
                        titles: this.options,
                        ids: this.ids,
                        firstName: this.firstName,
                        lastName: this.lastName
                    }
                })
                }
            }, 1000); // Countdown every 1 second
        }

    },
    mounted(){
        this.options = this.$route.params.titles; 
        this.ids = this.$route.params.ids; 
        this.oneliners = this.$route.params.oneliners; 
        this.descriptions = this.$route.params.descriptions; 
        this.userCount = this.$route.params.userCount; 
        this.firstName = this.$route.params.firstName;
        this.lastName = this.$route.params.lastName;
        this.startTimer();
        this.setupSocket();
    },
  };
  </script>
  
  <style scoped>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: radial-gradient(50% 50% at 50% 50%, rgb(80, 140, 155) 0%, rgb(19, 75, 112) 100%);
        font-family: 'Helvetica', 'Arial', sans-serif;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }

    .container h1, .container h2, .container h3, .container p, .container li, .container text {
        color: #EEEEEE;
    }

    .parent {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(6, 1fr);
        grid-column-gap: 0px;
        grid-row-gap: 0px;
        width: 100%;
        height: 100%;
        padding: 0 150px;
    }

    .div1 {
        grid-area: 1 / 1 / 2 / 5;
        text-align: center;
    }
    .div2 {
        grid-area: 2 / 1 / 3 / 4;
    }
    .div3 {
        grid-area: 3 / 1 / 4 / 4;
    }
    .div4 {
        grid-area: 4 / 1 / 5 / 4;
    }
    .div5 {
        grid-area: 5 / 1 / 6 / 4;
    }
    .div6 {
        grid-area: 2 / 4 / 6 / 6;
    }
    .div7 {
        grid-area: 6 / 1 / 7 / 6;
        text-align: center;
    }
    .div8 {
        grid-area: 1 / 5 / 2 / 6;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .div2, .div3, .div4, .div5{
        background-color: rgba(255, 255, 255, 0.1);
        margin: 5px 50px;
        border-radius: 8px;
        padding: 0 20px;
    }

    .div2:hover, .div3:hover, .div4:hover, .div5:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }

    button {
        /* background-color: rgb(75, 145, 170); */
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
        /* background-color: rgb(46, 143, 178); */
    }

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

    .modal-overlay h2, .modal-overlay p{
        color: black;
    }


  </style>
  