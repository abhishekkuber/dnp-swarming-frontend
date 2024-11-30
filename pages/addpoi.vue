<template>
    <div class="container">
      <div class="form-container">
        <h1>Nieuwe informatie toevoegen</h1>
        <form @submit.prevent="submitForm">
            <label for="topic">Onderwerp</label>
            <input v-model.lazy="title" placeholder="Geef de titel van uw onderwerp" required>

            <label for="short-description">Korte beschrijving</label>
            <input v-model.lazy="one_liner" placeholder="Beschrijf uw onderwerp in één regel" required>

            <label for="long-description">Lange beschrijving</label>
            <textarea v-model.lazy="description" rows="5" placeholder="Geef een uitgebreide omschrijving van uw onderwerp. Probeer zo gedetailleerd mogelijk te zijn." required></textarea>

            <button type="submit">Doorgaan</button>
            <button class="cancel-button" @click="goToHomepage">Annuleren</button>
        </form>
    </div>
        
    </div>
  </template>
  
  <script>

  import { getSocket } from '../utils/socket';

  export default {
    data() {
      return {
        title: "",
        one_liner: "",
        description: "",
        firstName: "",
        lastName: ""
      };
    },
    computed: {
      
    },
    methods: {
      // Function to handle form submission
      submitForm() {
        const formData = {
          title: this.title,
          one_liner: this.one_liner,
          description: this.description
        };


        // Emit the form data to the server
        this.socket.emit('add-poi', formData, (response) => {
          console.log('Server response:', response);
          alert('Information added.');
          this.$router.push({
            name: 'homepage',
            params: { firstName: this.firstName, lastName: this.lastName }
          });  
        });

        // Clear the form after submission
        // this.title = '';
        // this.one_liner = '';
        // this.description = '';
        // this.goToHomepage();
      },
      goToHomepage(){
        this.$router.push({
          name: 'homepage',
          params: { firstName: this.firstName, lastName: this.lastName }
        });  
      }
    },
    mounted() {
      this.socket = getSocket();
      this.firstName = this.$route.params.firstName;
      this.lastName = this.$route.params.lastName;
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
    font-family: 'Helvetica', sans-serif;
    /* background-color: aqua; */
  }

  .container h1, .container label {
    color: #EEEEEE;
  }

  .form-container {
    padding: 20px;
    border-radius: 10px;
    width: 40%;
}

  h1 {
    text-align: center;
    margin-bottom: 150px;
  }

  label {
    text-align: left;
    font-weight: bold;
    display: block;
    margin-bottom: 5px;

  }

  form{
    text-align: center;
  }

  input, textarea {
      width: 100%;
      padding: 10px;
      margin-bottom: 35px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 16px;

  }

  textarea {
      resize: vertical;
  }

  textarea::placeholder, input::placeholder {
    font-family: 'Helvetica', sans-serif;
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

  .cancel-button {  
    background-color: #dc3545;
  }

  .cancel-button:hover {
    background-color: #c82333;
  }
  </style>
  