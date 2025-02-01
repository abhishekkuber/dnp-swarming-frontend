<template>
    <div class="container">
        <div class="parent">
            <div class="div1">
                <h1>Wat gaan we doen na deze presentatie? U heeft 2 minuten om de onderwerpen te lezen.</h1>
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
            selectedTopic: 'Selecteer een onderwerp',
            topicDescription: 'Om informatie te krijgen over de 4 onderwerpen waar u over zult Swarmen, klikt u op een van de onderwerpen', // Default description
            timer: 120, 
            timerEnded: false,
            options: [], // To store topic titles
            ids: [], // To store topic IDs
            oneliners: [], // To store one-liners for each topic
            descriptions: [], // To store detailed descriptions for each topic
            showPopup: false,
            readyUsers: 0,
            userCount: 0,
            socket: null,
            firstName: "",
            lastName: "",
            currentRoom: ""
        };
    },
    methods: {
        setupSocket() {
            this.socket = getSocket();
            this.socket.on('update-user-ready-client', (data) => {
                this.readyUsers = data;
            });
            
            this.socket.on('go-to-swarm', () => {
                this.socket.emit('reset-counts', this.currentRoom);
                this.$router.push({
                    name: 'swarming',
                    params: {
                        titles: this.options,
                        ids: this.ids,
                        firstName: this.firstName,
                        lastName: this.lastName,
                        currentRoom: this.currentRoom
                    }
                });
            });
        },
        updateContent(topic, description) {
            this.selectedTopic = topic;
            this.topicDescription = description;
        },
        goToNextStep() {
            this.showPopup = true;
            this.socket.emit('user-ready', this.currentRoom);
        },
        closePopup() {
            this.showPopup = false;
            this.socket.emit('user-not-ready', this.currentRoom);
        },
        startTimer() {
            const interval = setInterval(() => {
                if (this.timer > 0) {
                    this.timer--;
                } else {
                    this.timerEnded = true; // Enable the button when timer ends
                    clearInterval(interval); // Stop the timer
                    console.log(`In room ${room}`);
                    this.socket.emit('reset-counts', this.currentRoom);
                    this.$router.push({
                        name: 'swarming',
                        params: {
                            titles: this.options,
                            ids: this.ids,
                            firstName: this.firstName,
                            lastName: this.lastName
                        }
                    });
                }
            }, 1000); // Countdown every 1 second
        }
    },
    mounted() {
        this.options = this.$route.params.titles; 
        this.ids = this.$route.params.ids; 
        this.oneliners = this.$route.params.oneliners; 
        this.descriptions = this.$route.params.descriptions; 
        this.userCount = this.$route.params.userCount; 
        this.firstName = this.$route.params.firstName;
        this.lastName = this.$route.params.lastName;
        this.currentRoom = this.$route.params.room;
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
    min-height: 100vh;
    background: radial-gradient(50% 50% at 50% 50%, rgb(80, 140, 155) 0%, rgb(19, 75, 112) 100%);
    font-family: 'Helvetica', 'Arial', sans-serif;
    padding: 1rem;
    margin: 0;
    box-sizing: border-box;
}

.container h1, .container h2, .container h3, .container p, .container li, .container text {
    color: #EEEEEE;
}

.parent {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: 1rem;
    width: 100%;
    max-width: 500px;
}

@media (min-width: 768px) {
    .parent {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: auto;
        gap: 1rem;
        width: 100%;
    }
}

.div1 {
    grid-column: span 2;
    text-align: center;
}
.div6 {
    grid-column: span 2;
}
.div7 {
    grid-column: span 2;
    text-align: center;
}

.div2, .div3, .div4, .div5 {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
    cursor: pointer;
}

.div2:hover, .div3:hover, .div4:hover, .div5:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

button {
    background-color: #2a93ad;
    color: #EEEEEE;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 5px;
}

button:hover {
    background-color: #095466;
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

.modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    width: 90%;
    max-width: 300px;
}

.cancel-button {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    margin-top: 1rem;
    cursor: pointer;
    border-radius: 5px;
}

.cancel-button:hover {
    background-color: #c82333;
}

.modal-overlay h2, .modal-overlay p {
    color: black;
}
</style>
